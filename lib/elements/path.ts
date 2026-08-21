/**
 * The filling path: one continuous line through all 118 cells, in the order
 * the rule places electrons.
 *
 * Element Z appears when the Zth electron is placed, so the filling order over
 * elements is atomic-number order — the line is z = 1…118 through whatever
 * positions the active layout gives them. What makes it worth drawing is that
 * those positions are NOT in reading order: the line sweeps back across the
 * table at every row wrap, and four times it opens a lower shell than the one
 * before, which is the rule doing the thing that gives the table its shape.
 *
 * Pure, and computed here rather than in a component (invariant 18). This
 * places nothing and decides nothing — it reads positions from layout.ts and
 * shell numbers from aufbau.ts, and returns geometry.
 */
import { differentiating } from './aufbau'
import { ALL_Z, type LayoutId, type Point, position } from './layout'

/**
 * Where in the cell the line runs, as a fraction of cell height.
 *
 * Not the centre. The symbol occupies roughly the top half of a cell —
 * --cell-symbol-top is 0.75rem and the symbol is 1.125rem tall — so a line
 * through the middle would cross 118 symbols, which is the one way this
 * feature could make the table harder to read. It runs through the clear band
 * below them instead, and still reads as passing "through" each cell.
 */
export const PATH_Y = 0.74

/** One point per cell, in cell units, in filling order. */
export function fillingPath(layout: LayoutId): readonly Point[] {
  return ALL_Z.map((z) => {
    const point = position(layout, z)
    return { x: point.x + 0.5, y: point.y + PATH_Y }
  })
}

/**
 * The atomic numbers where the rule opens a LOWER shell than the one it just
 * left — scandium, yttrium, lanthanum, actinium.
 *
 * These are the backtracks: 4s fills before 3d because 4+0 is less than 3+2,
 * so the fourth shell opens while the third is unfinished. Marking them is the
 * whole argument for drawing the path; there are four, which is few enough to
 * mark without turning the line into noise.
 */
export const BACKTRACKS: readonly number[] = ALL_Z.filter(
  (z) => z > 1 && differentiating(z).n < differentiating(z - 1).n,
)
