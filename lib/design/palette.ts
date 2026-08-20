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
  /*
   * Six stops, not seven — one per possible count, so the colour IS the number
   * of properties nobody has published rather than a position in a range. A
   * reader can count the legend swatches and land on an integer.
   *
   * Deliberately the coolest, least saturated ramp in the set: this lens is
   * about absence, and it should not compete with the ramps that carry
   * measurements. It is not grey, because grey at the light end would read as
   * the unknown hatch.
   */
  unmeasured: ['#E4E9F3', '#CFD7E6', '#BAC5D9', '#A5B3CC', '#90A1BF', '#7B8FB2'],
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
 * The build page's exception toggle. Its own two colours, because it asks its
 * own question.
 *
 * It previously borrowed --lens-category-alkali-metal and
 * --lens-category-transition-metal, which made the view state something false:
 * pink means "alkali metal" everywhere else in the product, and chromium — a
 * transition metal — was painted with it. A token means one thing.
 *
 * Not red. DESIGN.md §4: nothing in this product is an error or a warning, and
 * an element whose measured configuration disagrees with a rule of thumb is
 * neither. Amber marks it as worth looking at; the quiet neutral is the
 * majority that the rule gets right.
 */
export const AUFBAU_EXCEPTION_COLOUR = '#DFA92E'
export const AUFBAU_FOLLOWS_COLOUR = '#EFF0EB'

/**
 * Unknown. DESIGN.md §4 — a hatch over --paper, never a fill colour, so it can
 * never be mistaken for a position on any scale.
 */
export const UNKNOWN_HATCH =
  'repeating-linear-gradient(45deg, #F7F6F2 0 4px, #D5D3CB 4px 5px)'
