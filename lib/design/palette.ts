/**
 * One palette per lens. DESIGN.md §4.
 *
 * Every value here was generated in OKLCH and checked twice before being
 * frozen: continuous ramps are single-hue and strictly luminance-monotonic
 * (never rainbow — hue is categorical and these properties are not), and every
 * value in every palette clears AA against --ink at cell type size. Both are
 * asserted in tests/lens; a value that fails is a bug in the lens, not a
 * styling detail.
 *
 * Components never see these strings. data:build emits them as CSS custom
 * properties and lib/elements/lens.ts hands out token names.
 */

/** Seven stops, light → mid. The dark end stops where AA does. */
export const RAMPS = {
  electronegativity: [
    '#E8F3FF', '#D1E3F8', '#B9D4F0', '#A2C4E8', '#8BB4DF', '#74A5D7', '#5C95CE',
  ],
  'atomic-radius': [
    '#FEEEE7', '#F6DBCF', '#EDC7B7', '#E4B49F', '#DAA188', '#D08E70', '#C67B59',
  ],
  'ionisation-energy': [
    '#FAEDF8', '#EFD9EC', '#E3C6E0', '#D8B2D4', '#CC9FC7', '#C18CBB', '#B579AF',
  ],
  'melting-point': [
    '#E9F6EB', '#D2E8D5', '#BBDAC0', '#A4CCAB', '#8DBE97', '#76B082', '#5EA36E',
  ],
  density: [
    '#E3F6F9', '#C8E8EE', '#ADDAE2', '#90CCD6', '#73BECB', '#52B0BF', '#26A2B4',
  ],
  discovery: [
    '#F2F3E4', '#E2E3CA', '#D2D4B0', '#C2C496', '#B3B57C', '#A3A561', '#959645',
  ],
  'production-id': [
    '#FFEDEA', '#F7D9D4', '#EFC5BE', '#E6B2A8', '#DC9E93', '#D38B7E', '#C9776A',
  ],
} as const

/** Invariant 7 — eight values, and not one more. */
export const CATEGORY_COLOURS = {
  'alkali-metal': '#FABEBC',
  'alkaline-earth-metal': '#F0C7A0',
  'transition-metal': '#D2D49F',
  'post-transition-metal': '#ACDEBC',
  metalloid: '#98DEE1',
  'reactive-nonmetal': '#A9D5FB',
  'noble-gas': '#CEC8FB',
  'inner-transition-metal': '#EDBFE2',
} as const

export const BLOCK_COLOURS = {
  s: '#B1D2FD',
  p: '#F2BEDA',
  d: '#EBCA9C',
  f: '#A4DFC4',
} as const

export const ORIGIN_COLOURS = {
  'big-bang': '#DDD09B',
  'cosmic-ray-fission': '#B2DCB5',
  'dying-low-mass-stars': '#98DEE0',
  'exploding-massive-stars': '#ADD4FC',
  'exploding-white-dwarfs': '#D7C5F7',
  'merging-neutron-stars': '#F5BDD4',
  'human-made': '#F8C1AB',
} as const

/**
 * Invariant 9 — not produced is a fact, not the bottom of the ramp. It is a
 * neutral that sits outside the production hue entirely, and DESIGN.md §9 puts
 * a glyph on it too so it survives greyscale.
 */
export const NOT_PRODUCED_COLOUR = '#E4E3DC'
export const NOT_PRODUCED_GLYPH = '·'

/**
 * Unknown. DESIGN.md §4 — a hatch over --paper, never a fill colour, so it can
 * never be mistaken for a position on any scale.
 */
export const UNKNOWN_HATCH =
  'repeating-linear-gradient(45deg, #F7F6F2 0 4px, #D5D3CB 4px 5px)'
