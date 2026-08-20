/**
 * The merged element table, as data.
 *
 * Invariant 18 — nothing is computed in a component, and nothing is computed
 * here either. This module reads what `pnpm data:build` emitted and hands it
 * out already shaped; the build validated it against the Zod schema before it
 * was written.
 */
import table from '../../data/generated/elements.json'
import type { Element } from './types'

const parsed = table as unknown as {
  usgsEdition: number
  licences: { dataset: string; licence: string; url: string }[]
  generatedFrom: string[]
  elements: Element[]
}

/** All 118, in atomic-number order. Identity is z, always. */
export const ELEMENTS: readonly Element[] = parsed.elements

export const BY_Z: ReadonlyMap<number, Element> = new Map(
  parsed.elements.map((element) => [element.z, element]),
)

export const USGS_EDITION = parsed.usgsEdition
export const LICENCE_LINES = parsed.licences
export const GENERATED_FROM = parsed.generatedFrom

export function elementAt(z: number): Element {
  const element = BY_Z.get(z)
  if (!element) throw new Error(`no element with atomic number ${z}`)
  return element
}
