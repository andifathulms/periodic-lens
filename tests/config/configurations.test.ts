/**
 * All 118 configurations against published values, anomalies included.
 *
 * PRD.md §12 calls this the strongest available check, and the anomalies are
 * exactly where a naive implementation fails. Never weaken this file to make
 * something pass (CLAUDE.md, working style).
 */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { format, parseNotation } from '@/lib/elements/aufbau'
import { ELEMENTS, elementAt } from '@/lib/elements/data'

const published = new Map(
  readFileSync('data/configurations/published.tsv', 'utf8')
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'))
    .map((line) => line.split('\t'))
    .map((row) => [Number(row[0]), { symbol: String(row[1]), notation: String(row[2]) }]),
)

describe('published electron configurations', () => {
  it('covers every atomic number from 1 to 118', () => {
    expect(published.size).toBe(118)
    for (let z = 1; z <= 118; z += 1) expect(published.has(z)).toBe(true)
  })

  it('matches the shipped table element for element, symbol included', () => {
    for (const element of ELEMENTS) {
      const row = published.get(element.z)
      expect(row, `Z=${element.z}`).toBeDefined()
      expect(element.symbol).toBe(row?.symbol)
      expect(element.configuration.notation).toBe(row?.notation)
    }
  })

  it('sums to Z electrons for every element', () => {
    for (const element of ELEMENTS) {
      const total = element.configuration.subshells.reduce((n, s) => n + s.electrons, 0)
      expect(total, `${element.symbol} (Z=${element.z})`).toBe(element.z)
    }
  })

  it('never exceeds a subshell capacity', () => {
    const capacity = { s: 2, p: 6, d: 10, f: 14 } as const
    for (const element of ELEMENTS) {
      for (const shell of element.configuration.subshells) {
        expect(shell.electrons, `${element.symbol} ${shell.n}${shell.l}`).toBeLessThanOrEqual(
          capacity[shell.l],
        )
      }
    }
  })

  it('round-trips notation through the parser without drift', () => {
    for (const element of ELEMENTS) {
      const reparsed = parseNotation(element.configuration.notation)
      expect(format(reparsed), `${element.symbol}`).toBe(element.configuration.notation)
    }
  })

  /**
   * The eight the working agreement names, spelled out. A generated dataset
   * gets these wrong; a real one does not.
   */
  it.each([
    [24, 'Cr', '[Ar] 3d5 4s1'],
    [29, 'Cu', '[Ar] 3d10 4s1'],
    [41, 'Nb', '[Kr] 4d4 5s1'],
    [42, 'Mo', '[Kr] 4d5 5s1'],
    [46, 'Pd', '[Kr] 4d10'],
    [47, 'Ag', '[Kr] 4d10 5s1'],
    [78, 'Pt', '[Xe] 4f14 5d9 6s1'],
    [79, 'Au', '[Xe] 4f14 5d10 6s1'],
  ])('Z=%i %s is the published anomaly, not the tidy prediction', (z, symbol, notation) => {
    const element = elementAt(z as number)
    expect(element.symbol).toBe(symbol)
    expect(element.configuration.notation).toBe(notation)
    expect(element.configuration.anomalous).toBe(true)
  })
})
