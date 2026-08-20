/**
 * THE single definition of unknown. PRD.md §9, DESIGN.md §4, invariant 2.
 *
 * Every lens routes missing values through here. Unknown is never a colour,
 * never a ramp position, never zero, and never an omitted cell — it is a hatch
 * over --paper with a --muted label, identical in every lens, so a reader
 * learns it once and recognises it everywhere.
 *
 * Do not add a second way to express "no value". If a new lens has a missing
 * case, it is this one.
 */
import type { PropertyValue, UnknownValue } from './types'

export const UNKNOWN: UnknownValue = { type: 'unknown' }

/** The one CSS token that paints unknown, in every lens. */
export const UNKNOWN_FILL_TOKEN = '--lens-unknown'

/** The one label, per locale. Never a blank, never a dash. */
export const UNKNOWN_LABEL = { en: 'not known', id: 'tidak diketahui' } as const

export function isUnknown(value: PropertyValue<unknown>): value is UnknownValue {
  return value.type === 'unknown'
}

export function isKnown<T>(
  value: PropertyValue<T>,
): value is Extract<PropertyValue<T>, { type: 'known' }> {
  return value.type === 'known'
}

/**
 * Read a known number, or nothing. There is deliberately no
 * `valueOrZero`/`valueOrDefault` here: a caller that wants a number for a
 * missing value has a bug, and this module refuses to help it have one.
 */
export function knownNumber(value: PropertyValue<number>): number | undefined {
  return value.type === 'known' ? value.value : undefined
}

/** How unknown reads in words, for the detail panel and the text table. */
export function describe(locale: 'en' | 'id'): string {
  return UNKNOWN_LABEL[locale]
}
