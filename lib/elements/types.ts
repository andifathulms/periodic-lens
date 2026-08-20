/**
 * The element record and its value types.
 *
 * Invariant 2 / DESIGN.md §4: there is no bare number and no nullable property
 * field anywhere in this module. A property is either a known value with a unit
 * and a source, or it is unknown. That makes "unknown rendered as zero"
 * unrepresentable rather than merely forbidden.
 */

export type Source = {
  /** Short citation key resolved on the method page. */
  readonly ref: string
  /** Human-readable publication, including edition or year. */
  readonly cite: string
}

export type KnownValue<T> = {
  readonly type: 'known'
  readonly value: T
  readonly unit: string
  readonly source: Source
}

export type UnknownValue = { readonly type: 'unknown' }

export type PropertyValue<T = number> = KnownValue<T> | UnknownValue

/** DESIGN.md §4 — the category lens caps at eight values (invariant 7). */
export type Category =
  | 'alkali-metal'
  | 'alkaline-earth-metal'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'noble-gas'
  | 'inner-transition-metal'

export type Block = 's' | 'p' | 'd' | 'f'

/**
 * Nucleosynthetic origin, dominant source. Seven values, within the cap.
 * Johnson, J. A. (2019), "Populating the periodic table: Nucleosynthesis of
 * the elements", Science 363(6426).
 */
export type Origin =
  | 'big-bang'
  | 'cosmic-ray-fission'
  | 'dying-low-mass-stars'
  | 'exploding-massive-stars'
  | 'exploding-white-dwarfs'
  | 'merging-neutron-stars'
  | 'human-made'

/** A published electron configuration, stored — never derived. Invariant 3. */
export type Configuration = {
  /** e.g. "[Ar] 3d5 4s1" — the published notation. */
  readonly notation: string
  /** Subshell occupancies expanded from the noble-gas core, in shell order. */
  readonly subshells: readonly Subshell[]
  /** True where the published value disagrees with the aufbau prediction. */
  readonly anomalous: boolean
  readonly source: Source
}

export type Subshell = {
  readonly n: number
  readonly l: Block
  readonly electrons: number
}

/** USGS production. Invariant 10 — never an undated figure. */
export type Production = {
  /** Share of world output, 0–1. */
  readonly share: number
  /** USGS Mineral Commodity Summaries edition year. */
  readonly edition: number
  /** The year the figures describe (usually edition − 1, estimated). */
  readonly dataYear: number
  /** Which point in the chain the figure is reported at. Invariant 10. */
  readonly stage: 'mined' | 'refined'
  /** The commodity as USGS names it, which is not always the element. */
  readonly commodity: string
  readonly source: Source
}

/**
 * Invariant 9 — producing nothing and producing 0.1% are different facts and
 * must not share an appearance, so they are different shapes in the type.
 */
export type ProductionState =
  | { readonly type: 'produced'; readonly production: Production }
  | {
      /**
       * A reported absence, not a missing value. It carries the edition it was
       * read from for the same reason a figure does — "USGS 2024 reports no
       * Indonesian output" is a dated claim.
       */
      readonly type: 'not-produced'
      readonly edition: number
      readonly source: Source
    }
  | { readonly type: 'unknown' }

export type Element = {
  /** Identity is the atomic number, always. Never symbol, never name. */
  readonly z: number
  readonly symbol: string
  readonly name: string
  readonly nameId: string
  readonly mass: PropertyValue<number>
  readonly category: Category
  readonly block: Block
  readonly group: number
  readonly period: number
  readonly configuration: Configuration
  readonly origin: Origin
  readonly discovery: PropertyValue<number>
  readonly electronegativity: PropertyValue<number>
  readonly atomicRadius: PropertyValue<number>
  readonly ionisationEnergy: PropertyValue<number>
  readonly meltingPoint: PropertyValue<number>
  readonly density: PropertyValue<number>
  readonly production: ProductionState
}
