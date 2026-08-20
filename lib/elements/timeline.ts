/**
 * The discovery timeline. PRD.md §13, M6.
 *
 * The same 118 elements along one axis instead of two. Elements are binned by
 * decade because plotting 118 exact years produces a wall of overlaps in the
 * nineteenth century and says less, not more.
 *
 * Elements in use since antiquity have no recorded year of discovery. They are
 * NOT placed at the left end of the axis — that would date them to whatever
 * the earliest recorded year happens to be, which is a fabrication. They go in
 * their own group, named as unrecorded, exactly as the hatch does on the grid.
 */
import { ELEMENTS } from './data'
import { isKnown } from './unknown'
import type { Element } from './types'

export type Decade = {
  readonly decade: number
  readonly elements: readonly Element[]
}

export type Timeline = {
  readonly decades: readonly Decade[]
  /** No recorded year. Never a position on the axis. */
  readonly unrecorded: readonly Element[]
  readonly first: number
  readonly last: number
  /** The tallest stack, so the view can size itself without measuring the DOM. */
  readonly peak: number
}

export function timeline(): Timeline {
  const unrecorded: Element[] = []
  const buckets = new Map<number, Element[]>()

  for (const element of ELEMENTS) {
    if (!isKnown(element.discovery)) {
      unrecorded.push(element)
      continue
    }
    const decade = Math.floor(element.discovery.value / 10) * 10
    const bucket = buckets.get(decade)
    if (bucket) bucket.push(element)
    else buckets.set(decade, [element])
  }

  const years = [...buckets.keys()].sort((a, b) => a - b)
  const first = years[0] ?? 0
  const last = years[years.length - 1] ?? 0

  // Empty decades are kept so the axis stays linear — the six-century gap
  // between arsenic and phosphorus is part of what the view is showing.
  const decades: Decade[] = []
  for (let decade = first; decade <= last; decade += 10) {
    decades.push({ decade, elements: buckets.get(decade) ?? [] })
  }

  return {
    decades,
    unrecorded,
    first,
    last,
    peak: decades.reduce((max, d) => Math.max(max, d.elements.length), 0),
  }
}
