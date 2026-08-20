/**
 * The rule, asserted in BOTH directions (PRD.md §12): the Madelung prediction
 * must disagree with the published values exactly on the documented exception
 * list — no more, no fewer.
 *
 * A change that makes this pass by editing AUFBAU_EXCEPTIONS is a change that
 * defeats the test. Edit the data or the rule, never the list.
 */
import { describe, expect, it } from 'vitest'
import {
  AUFBAU_EXCEPTIONS,
  CAPACITY,
  FILLING_ORDER,
  blockOf,
  format,
  positionRationale,
  predict,
  reachesHalfOrFullSubshell,
  predictedNotation,
  sameConfiguration,
} from '@/lib/elements/aufbau'
import { ELEMENTS, elementAt } from '@/lib/elements/data'

describe('the aufbau rule', () => {
  it('orders subshells by n+l, then by n', () => {
    const index = { s: 0, p: 1, d: 2, f: 3 } as const
    const opening = FILLING_ORDER.slice(0, 8).map((s) => `${s.n}${s.l}`)
    expect(opening).toEqual(['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p'])
    for (let i = 1; i < FILLING_ORDER.length; i += 1) {
      const a = FILLING_ORDER[i - 1]!
      const b = FILLING_ORDER[i]!
      const sumA = a.n + index[a.l]
      const sumB = b.n + index[b.l]
      expect(sumA === sumB ? b.n > a.n : sumB > sumA).toBe(true)
    }
  })

  it('has subshell capacities 2, 6, 10, 14 — the block widths', () => {
    expect(CAPACITY).toEqual({ s: 2, p: 6, d: 10, f: 14 })
  })

  it('predicts a configuration summing to Z for every element', () => {
    for (let z = 1; z <= 118; z += 1) {
      expect(predict(z).reduce((n, s) => n + s.electrons, 0)).toBe(z)
    }
  })

  it('disagrees with the published values on exactly the documented list', () => {
    const disagreements = ELEMENTS.filter(
      (element) => !sameConfiguration(element.configuration.subshells, predict(element.z)),
    ).map((element) => element.z)
    expect(disagreements).toEqual([...AUFBAU_EXCEPTIONS])
  })

  it('agrees with the published values everywhere else', () => {
    for (const element of ELEMENTS) {
      if (AUFBAU_EXCEPTIONS.includes(element.z)) continue
      expect(
        format(predict(element.z)),
        `${element.symbol} (Z=${element.z}) should follow the rule`,
      ).toBe(element.configuration.notation)
    }
  })

  it('marks the anomaly flag in the data from the same comparison', () => {
    for (const element of ELEMENTS) {
      expect(element.configuration.anomalous, element.symbol).toBe(
        AUFBAU_EXCEPTIONS.includes(element.z),
      )
    }
  })

  it('leaves chromium in the d-block despite its 4s1 configuration', () => {
    expect(elementAt(24).configuration.notation).toBe('[Ar] 3d5 4s1')
    expect(blockOf(24)).toBe('d')
  })

  it('lists exactly twenty exceptions, in ascending order', () => {
    expect(AUFBAU_EXCEPTIONS).toHaveLength(20)
    expect([...AUFBAU_EXCEPTIONS]).toEqual([...AUFBAU_EXCEPTIONS].sort((a, b) => a - b))
  })
})

/**
 * Invariant 3 at the display boundary. The prediction is allowed on screen
 * only as the rule's failed answer; these assertions are what stop it drifting
 * into being used as a configuration.
 */
describe('the prediction, where it is shown', () => {
  it('differs from the published notation for every element it is shown for', () => {
    for (const z of AUFBAU_EXCEPTIONS) {
      expect(predictedNotation(z), `Z=${z}`).not.toBe(elementAt(z).configuration.notation)
    }
  })

  it('agrees with the published notation everywhere it is NOT shown', () => {
    for (const element of ELEMENTS) {
      if (AUFBAU_EXCEPTIONS.includes(element.z)) continue
      expect(
        sameConfiguration(
          predict(element.z),
          element.configuration.subshells,
        ),
        `Z=${element.z} ${element.symbol}`,
      ).toBe(true)
    }
  })

  it('is only ever offered for elements flagged anomalous in the data', () => {
    for (const element of ELEMENTS) {
      expect(element.configuration.anomalous, `Z=${element.z}`).toBe(
        AUFBAU_EXCEPTIONS.includes(element.z),
      )
    }
  })
})

describe('position rationale — the shape argument, per cell', () => {
  it('derives a block matching the stored record for all 118', () => {
    for (const element of ELEMENTS) {
      expect(positionRationale(element.z).block, element.symbol).toBe(element.block)
    }
  })

  it('reports a capacity equal to the block width, for all 118', () => {
    for (const element of ELEMENTS) {
      const rationale = positionRationale(element.z)
      expect(rationale.capacity, element.symbol).toBe(CAPACITY[rationale.block])
      expect(rationale.index, element.symbol).toBeGreaterThan(0)
      expect(rationale.index, element.symbol).toBeLessThanOrEqual(rationale.capacity)
    }
  })

  it('flags helium, and only helium, as positioned by convention', () => {
    const flagged = ELEMENTS.filter((e) => positionRationale(e.z).conventional)
    expect(flagged.map((e) => e.z)).toEqual([2])
  })
})

/**
 * The half-filled/filled pattern, and its limits. The build page states a hit
 * rate; this is what stops that number drifting away from the data.
 */
describe('the half-filled and filled pattern', () => {
  const fits = AUFBAU_EXCEPTIONS.filter((z) =>
    reachesHalfOrFullSubshell(z, elementAt(z).configuration.subshells),
  )

  it('accounts for exactly eight of the twenty exceptions', () => {
    expect(fits.map((z) => elementAt(z).symbol)).toEqual([
      'Cr', 'Cu', 'Mo', 'Pd', 'Ag', 'Gd', 'Au', 'Cm',
    ])
  })

  it('leaves twelve it does not explain, and does not pretend otherwise', () => {
    expect(AUFBAU_EXCEPTIONS.length - fits.length).toBe(12)
  })

  it('never fires for an element that follows the rule', () => {
    for (const element of ELEMENTS) {
      if (AUFBAU_EXCEPTIONS.includes(element.z)) continue
      expect(
        reachesHalfOrFullSubshell(element.z, element.configuration.subshells),
        element.symbol,
      ).toBe(false)
    }
  })
})
