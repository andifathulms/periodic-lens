import { BACKTRACKS, fillingPath } from '@/lib/elements/path'
import { extent } from '@/lib/elements/layout'
import { type Locale, t } from '@/lib/i18n'

/**
 * The app's thesis as one piece of geometry.
 *
 * A single line through all 118 cells in the order electrons fill. It sweeps
 * back across the table at every row wrap, and four times — scandium, yttrium,
 * lanthanum, actinium — it opens a lower shell than the one it just left. That
 * is the rule doing the thing that gives the table its shape, and it is much
 * harder to miss as a drawn line than as a sentence.
 *
 * Drawn as a growing polyline rather than a dashed path, so the revealed
 * length is `placed` points and needs no getTotalLength — which means it
 * renders identically on the server. The full path is in the prerendered HTML
 * and is legible with JavaScript off.
 *
 * Two strokes: a --paper casing wide enough to clear the fill beneath, then
 * --trace on top. One colour cannot survive crossing 118 different tints;
 * two always can, which is the same reasoning as the focus ring.
 */
export function FillingPath({
  placed,
  locale,
}: {
  /** How many cells of the path to draw, 0…118. */
  placed: number
  locale: Locale
}) {
  const points = fillingPath('standard')
  const box = extent('standard')
  const drawn = points.slice(0, Math.max(0, Math.min(placed, points.length)))
  if (drawn.length < 2) return null

  const d = drawn.map((p) => `${p.x},${p.y}`).join(' ')
  const head = drawn[drawn.length - 1]!
  const marks = BACKTRACKS.filter((z) => z <= drawn.length).map((z) => ({
    z,
    point: points[z - 1]!,
  }))

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-10"
      style={{
        width: `calc(${box.width} * var(--cell))`,
        height: `calc(${box.height} * var(--cell))`,
      }}
      viewBox={`0 0 ${box.width} ${box.height}`}
      preserveAspectRatio="none"
    >
      {/*
       * The casing is deliberately tight — 0.10 against a 0.055 core leaves
       * about a pixel of paper each side at the default cell size. Wider, and
       * it stops reading as a line with an edge and starts reading as a pale
       * channel cut through every cell it crosses.
       */}
      <polyline
        points={d}
        fill="none"
        stroke="var(--paper)"
        strokeWidth={0.1}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polyline
        points={d}
        fill="none"
        stroke="var(--trace)"
        strokeWidth={0.055}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* The four backtracks: an open ring where a lower shell opens. */}
      {marks.map(({ z, point }) => (
        <circle
          key={z}
          cx={point.x}
          cy={point.y}
          r={0.22}
          fill="none"
          stroke="var(--trace)"
          strokeWidth={0.06}
        />
      ))}
      {/* Where the rule has got to. */}
      {drawn.length < points.length ? (
        <circle cx={head.x} cy={head.y} r={0.13} fill="var(--trace)" />
      ) : null}
      <title>{t(locale, 'path.title')}</title>
    </svg>
  )
}
