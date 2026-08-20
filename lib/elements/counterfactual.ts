/**
 * What the table would look like if the filling rule were different.
 *
 * The app's thesis is that the shape follows from the order and the
 * capacities. A reader cannot test that by being told it — the convincing
 * move is to change the rule and watch the consequence, which is what this
 * module makes possible.
 *
 * NOTHING HERE TOUCHES THE REAL TABLE. These functions are never used to place
 * a cell, name a block or supply a configuration; they exist so the build page
 * can show a hypothetical beside the actual one and label it as such. The real
 * ordering stays FILLING_ORDER in aufbau.ts, which is the only thing layout.ts
 * and the animation read.
 *
 * Pure, and computed here rather than in a component (invariant 18).
 */
import { AZIMUTHAL, CAPACITY } from './aufbau'
import { ELEMENT_COUNT } from './layout'
import type { Block } from './types'

export type OrderId = 'madelung' | 'strict-n'

export const ORDER_IDS: readonly OrderId[] = ['madelung', 'strict-n']

type Shell = { readonly n: number; readonly l: Block }

const CANDIDATES: readonly Shell[] = (() => {
  const shells: Shell[] = []
  for (let n = 1; n <= 8; n += 1) {
    for (const l of ['s', 'p', 'd', 'f'] as const) {
      if (AZIMUTHAL[l] < n) shells.push({ n, l })
    }
  }
  return shells
})()

/**
 * The two orderings, from the same candidate set.
 *
 * `madelung` reproduces the real rule: by n + ℓ, ties by lower n. `strict-n`
 * is the intuitive alternative a reader is likely to assume before they meet
 * the rule — finish shell 1, then shell 2, then shell 3 — which puts 3d before
 * 4s and is the counterfactual worth seeing.
 */
export function ordering(order: OrderId): readonly Shell[] {
  const shells = [...CANDIDATES]
  if (order === 'strict-n') {
    return shells.sort((a, b) =>
      a.n === b.n ? AZIMUTHAL[a.l] - AZIMUTHAL[b.l] : a.n - b.n,
    )
  }
  return shells.sort((a, b) => {
    const sumA = a.n + AZIMUTHAL[a.l]
    const sumB = b.n + AZIMUTHAL[b.l]
    return sumA === sumB ? a.n - b.n : sumA - sumB
  })
}

/**
 * Row lengths that fall out of an ordering.
 *
 * A row ends where the next subshell starts a higher shell than any seen so
 * far — which is what "a new row" means in the standard table: the point the
 * outermost s subshell of a new shell begins filling.
 */
export function periodLengths(order: OrderId): readonly number[] {
  const lengths: number[] = []
  let count = 0
  let placed = 0
  for (const shell of ordering(order)) {
    if (shell.l === 's' && count > 0) {
      lengths.push(count)
      count = 0
    }
    const take = Math.min(CAPACITY[shell.l], ELEMENT_COUNT - placed)
    if (take <= 0) break
    count += take
    placed += take
  }
  if (count > 0) lengths.push(count)
  return lengths
}
