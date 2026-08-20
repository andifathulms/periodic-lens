/**
 * Element → position, per layout.
 *
 * Invariant 5: one element set, many position maps. A layout is a function
 * from atomic number to a point; it can never add or drop an element, because
 * it never decides which elements exist.
 *
 * Positions are in CELL UNITS — 1.0 is one cell pitch — with x to the right
 * and y down. Integers in the two grid layouts, floats in the spiral. The grid
 * renders every layout by absolute placement, which is what lets cells travel
 * between positions on a layout change (DESIGN.md §5).
 */
import { blockOf, differentiating } from './aufbau'
import type { Block } from './types'

export type LayoutId = 'standard' | 'left-step' | 'spiral'

export type Point = { readonly x: number; readonly y: number }

export const LAYOUT_IDS: readonly LayoutId[] = ['standard', 'left-step', 'spiral']

export const ELEMENT_COUNT = 118

export const ALL_Z: readonly number[] = Array.from(
  { length: ELEMENT_COUNT },
  (_, i) => i + 1,
)

/**
 * Helium is the one element whose position contradicts its block: it is
 * s-block, and it sits at the head of the noble gases because its chemistry,
 * not its configuration, puts it there. Every structural test names this
 * exception explicitly rather than loosening the assertion.
 */
export const HELIUM_POSITION_EXCEPTION = 2

/** Group in the IUPAC sense; 0 for the f-block, which has no group number. */
export function groupOf(z: number): number {
  if (z === HELIUM_POSITION_EXCEPTION) return 18
  const { l, index } = differentiating(z)
  switch (l) {
    case 's':
      return index
    case 'p':
      return 12 + index
    case 'd':
      return 2 + index
    case 'f':
      return 0
    default: {
      const never: never = l
      return never
    }
  }
}

/** Period, counted the ordinary way: the row of the standard table. */
export function periodOf(z: number): number {
  const { n, l } = differentiating(z)
  switch (l) {
    case 's':
    case 'p':
      return n
    case 'd':
      return n + 1
    case 'f':
      return n + 2
    default: {
      const never: never = l
      return never
    }
  }
}

/** Period lengths 2, 8, 8, 18, 18, 32, 32 — asserted, never assumed. */
export const PERIOD_LENGTHS: readonly number[] = [2, 8, 8, 18, 18, 32, 32]

/** Subshell widths, which are the block widths. */
export const BLOCK_WIDTHS: Readonly<Record<Block, number>> = {
  s: 2,
  p: 6,
  d: 10,
  f: 14,
}

const F_BLOCK_ROWS: Readonly<Record<number, number>> = { 4: 8, 5: 9 }

function standard(z: number): Point {
  if (z === HELIUM_POSITION_EXCEPTION) return { x: 17, y: 0 }
  const { n, l, index } = differentiating(z)
  if (l === 'f') {
    const row = F_BLOCK_ROWS[n]
    if (row === undefined) throw new Error(`no footnote row for ${n}f`)
    return { x: 2 + index - 1, y: row }
  }
  return { x: groupOf(z) - 1, y: periodOf(z) - 1 }
}

/**
 * Janet's left-step table. Rows are the Madelung filling rows — each one runs
 * f, d, p, s and ends on an s subshell — and they are right-aligned, so the
 * s-block forms the last two columns. PRD.md §6: it makes the orbital-filling
 * logic more obvious than the standard layout does.
 */
const LEFT_STEP_WIDTH = 32

type LeftStepRow = { readonly cells: readonly number[]; readonly fullWidth: number }

/**
 * A left-step row ENDS on a completed s subshell — that is what steps the
 * table. Rows are then right-aligned to the width they would have if complete,
 * which keeps the trailing row (5f 6d 7p, two short of an 8s) lined up with
 * the row above instead of shunted two columns right.
 */
const LEFT_STEP_ROWS: readonly LeftStepRow[] = (() => {
  const rows: number[][] = []
  let current: number[] = []
  for (let z = 1; z <= ELEMENT_COUNT; z += 1) {
    current.push(z)
    const { l, index } = differentiating(z)
    if (l === 's' && index === BLOCK_WIDTHS.s) {
      rows.push(current)
      current = []
    }
  }
  const open = current.length > 0 ? current : undefined
  const closed = rows.map((cells) => ({ cells, fullWidth: cells.length }))
  if (!open) return closed
  const previous = closed[closed.length - 1]
  return [...closed, { cells: open, fullWidth: previous ? previous.fullWidth : open.length }]
})()

function leftStep(z: number): Point {
  for (let row = 0; row < LEFT_STEP_ROWS.length; row += 1) {
    const entry = LEFT_STEP_ROWS[row]
    if (!entry) continue
    const index = entry.cells.indexOf(z)
    if (index >= 0) {
      return { x: LEFT_STEP_WIDTH - entry.fullWidth + index, y: row }
    }
  }
  throw new Error(`Z=${z} is in no left-step row`)
}

/**
 * A Benfey-style spiral: one continuous run of 118, each period a full turn,
 * radius growing with the period. Benfey's own drawing has lobes for the d and
 * f blocks; this keeps the continuity — the point PRD.md §6 is making, that
 * the breaks in the standard table are a convention — without pretending to
 * reproduce his figure.
 */
const PERIOD_STARTS: readonly number[] = (() => {
  const starts: number[] = []
  let z = 1
  for (const length of PERIOD_LENGTHS) {
    starts.push(z)
    z += length
  }
  return starts
})()

function spiral(z: number): Point {
  const period = periodOf(z)
  const start = PERIOD_STARTS[period - 1]
  const length = PERIOD_LENGTHS[period - 1]
  if (start === undefined || length === undefined) {
    throw new Error(`no period bounds for Z=${z}`)
  }
  const through = (z - start) / length
  const radius = 2.2 + (period - 1 + through) * 2.1
  const angle = 2 * Math.PI * (period - 1 + through) - Math.PI / 2
  return {
    x: 16 + radius * Math.cos(angle),
    y: 10 + radius * Math.sin(angle),
  }
}

export function position(layout: LayoutId, z: number): Point {
  switch (layout) {
    case 'standard':
      return standard(z)
    case 'left-step':
      return leftStep(z)
    case 'spiral':
      return spiral(z)
    default: {
      const never: never = layout
      return never
    }
  }
}

/** Every layout, over the same 118 records. Invariant 5. */
export function positions(layout: LayoutId): ReadonlyMap<number, Point> {
  return new Map(ALL_Z.map((z) => [z, position(layout, z)]))
}

/** Extent in cell units, for sizing the grid without measuring the DOM. */
export function extent(layout: LayoutId): { width: number; height: number } {
  let width = 0
  let height = 0
  for (const z of ALL_Z) {
    const p = position(layout, z)
    width = Math.max(width, p.x + 1)
    height = Math.max(height, p.y + 1)
  }
  return { width, height }
}

export { blockOf }
