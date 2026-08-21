/**
 * Where the filling sequence leaves reading order.
 *
 * The first version of this drew all 118 cells as one continuous line, and it
 * was a mistake worth recording. Most of that line was the six row wraps — go
 * from the end of a row to the start of the next — which is how everybody
 * already reads a table. It encoded nothing, and the sweeps crossed the full
 * width of the grid while descending one row, so they struck through every
 * symbol they passed. The least informative part of the sequence was doing all
 * the visual damage.
 *
 * What is worth drawing is the seven places the sequence does NOT do the
 * obvious thing while staying inside one period: the three gaps in periods 1-3,
 * and the four f-block detours that the standard layout's footnote creates.
 *
 * Pure, and computed here rather than in a component (invariant 18).
 */
import { differentiating } from './aufbau'
import { ALL_Z, type LayoutId, type Point, periodOf, position } from './layout'

/**
 * Where in a cell a line may run. The symbol occupies roughly the top half —
 * --cell-symbol-top is 0.75rem with a 1.125rem face — so anything drawn
 * between these fractions clears it. Every routed point below is inside this
 * band or outside the cells entirely, which is what keeps the line off the
 * type.
 */
export const CLEAR_BAND = { top: 0.7, bottom: 0.98 } as const

/** The horizontal line through a cell, and the cell's clear right edge. */
const at = (layout: LayoutId, z: number): Point => {
  const p = position(layout, z)
  return { x: p.x + 0.5, y: p.y + CLEAR_BAND.top }
}
const rightEdge = (layout: LayoutId, z: number): number => position(layout, z).x + 0.96

/**
 * The empty row the standard layout leaves between the main table and the
 * footnote. It is the only horizontal corridor in the grid that crosses no
 * cell at all, which is why the two long returns are routed along it rather
 * than drawn straight across the d-block.
 */
const GUTTER = 7.45

/** The column just inside the f-block's first cell, left of its centred symbol. */
const TRUNK = 2.06

export type Segment = {
  /** The element the jump leaves from. */
  readonly from: number
  readonly to: number
  readonly points: readonly Point[]
}

/**
 * A jump is worth drawing when the next element is not the cell immediately to
 * the right AND the period does not change — a period change is a row wrap,
 * which is reading order.
 */
function isDeviation(layout: LayoutId, z: number): boolean {
  const a = position(layout, z)
  const b = position(layout, z + 1)
  const adjacent = b.y === a.y && b.x === a.x + 1
  return !adjacent && periodOf(z + 1) === periodOf(z)
}

export function deviations(layout: LayoutId): readonly Segment[] {
  const out: Segment[] = []
  for (const z of ALL_Z) {
    if (z === 118 || !isDeviation(layout, z)) continue
    const from = at(layout, z)
    const to = at(layout, z + 1)
    const descending = to.y > from.y

    if (from.y === to.y) {
      /* The period 1-3 gaps: straight, and they cross only empty cells. */
      out.push({ from: z, to: z + 1, points: [from, to] })
    } else if (descending) {
      /* Into the footnote: right to the trunk column, down, then in. */
      out.push({
        from: z,
        to: z + 1,
        points: [from, { x: TRUNK, y: from.y }, { x: TRUNK, y: to.y }, to],
      })
    } else {
      /* Back out of the footnote: out to the cell edge, up into the gutter,
         along it, then up the trunk. Straight across would cut the d-block. */
      const edge = rightEdge(layout, z)
      out.push({
        from: z,
        to: z + 1,
        points: [
          from,
          { x: edge, y: from.y },
          { x: edge, y: GUTTER },
          { x: TRUNK, y: GUTTER },
          { x: TRUNK, y: to.y },
          to,
        ],
      })
    }
  }
  return out
}

/**
 * The atomic numbers where the rule opens a LOWER shell than the one it just
 * left — scandium, yttrium, lanthanum, actinium. 4s fills before 3d because
 * 4+0 is less than 3+2, so the fourth shell opens while the third is
 * unfinished. Four is few enough to mark without becoming noise.
 */
export const BACKTRACKS: readonly number[] = ALL_Z.filter(
  (z) => z > 1 && differentiating(z).n < differentiating(z - 1).n,
)

/** Where to draw a backtrack ring: in the clear band of that element's cell. */
export function backtrackPoints(layout: LayoutId): readonly Point[] {
  return BACKTRACKS.map((z) => at(layout, z))
}
