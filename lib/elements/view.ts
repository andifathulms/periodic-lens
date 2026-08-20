/**
 * Views over the same 118 records.
 *
 * DESIGN.md §2 gives the escape hatch that makes this legal: "If a feature
 * needs two encodings, it needs two views." Topography encodes a lens value as
 * height as well as colour, so it does not layer on top of the grid — it
 * REPLACES it. Exactly one view is rendered at a time, exactly as exactly one
 * lens is active at a time.
 *
 * The element set never changes between views, for the same reason it never
 * changes between layouts (invariant 5).
 */
import { kindOf, type LensId } from './lens'

export type ViewId = 'grid' | 'topography' | 'timeline'

export const VIEW_IDS: readonly ViewId[] = ['grid', 'topography', 'timeline']

/**
 * Whether a view can honestly render a lens.
 *
 * Height is a continuous channel. Rendering a categorical lens as elevation
 * would invent an ordering between categories that does not exist — nothing
 * makes "noble gas" taller than "metalloid" — so topography refuses
 * categorical lenses rather than picking an arbitrary order. The legend states
 * the refusal; DESIGN.md §8 requires every view to say what it cannot show.
 */
export function supports(view: ViewId, lens: LensId): boolean {
  switch (view) {
    case 'grid':
    case 'timeline':
      return true
    case 'topography':
      return kindOf(lens) === 'continuous'
    default: {
      const never: never = view
      return never
    }
  }
}

/** Fall back to the grid rather than rendering a view that cannot be honest. */
export function resolve(view: ViewId, lens: LensId): ViewId {
  return supports(view, lens) ? view : 'grid'
}
