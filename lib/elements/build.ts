/**
 * The build timeline. PRD.md §5 — the hero.
 *
 * Electrons are placed in the rule's energy order, and an element appears when
 * its own electron is placed. So step k is "k electrons placed", the element
 * revealed at step k is Z = k, and the subshell being filled at step k is the
 * one the rule is in. The shape assembles because the rule says so — that is
 * the whole argument the animation is making.
 *
 * Pure, and computed here rather than in the component (invariant 18).
 */
import { FILLING_ORDER, CAPACITY } from './aufbau'
import { ELEMENT_COUNT } from './layout'
import type { Block } from './types'

export type Step = {
  /** Electrons placed so far, 0…118. Also the highest revealed atomic number. */
  readonly placed: number
  readonly n: number
  readonly l: Block
  /** Electrons in this subshell after this step. */
  readonly within: number
  readonly capacity: number
}

export const STEPS: readonly Step[] = (() => {
  const steps: Step[] = []
  let placed = 0
  for (const shell of FILLING_ORDER) {
    const capacity = CAPACITY[shell.l]
    for (let within = 1; within <= capacity; within += 1) {
      placed += 1
      if (placed > ELEMENT_COUNT) return steps
      steps.push({ placed, n: shell.n, l: shell.l, within, capacity })
    }
  }
  return steps
})()

/** Subshell boundaries, for the stepped reduced-motion alternative. */
export const SUBSHELL_STEPS: readonly Step[] = STEPS.filter(
  (step) => step.within === step.capacity || step.placed === ELEMENT_COUNT,
)

export const TOTAL_STEPS = STEPS.length

/** Roughly fifteen seconds end to end, as DESIGN.md §5 specifies. */
export const BUILD_DURATION_MS = 15_000

export function stepAt(placed: number): Step | undefined {
  return STEPS[placed - 1]
}
