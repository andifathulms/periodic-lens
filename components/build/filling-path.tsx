import { extent } from '@/lib/elements/layout'
import { backtrackPoints, deviations } from '@/lib/elements/path'
import { type Locale, t } from '@/lib/i18n'

/**
 * The seven places the filling sequence leaves reading order, plus the four
 * shell backtracks.
 *
 * Everything is drawn in the band below the symbols or along the empty gutter
 * row, so no line crosses a letter. Two strokes — a --paper casing under a
 * --trace core — because one colour cannot survive crossing several different
 * tints; the same reasoning as the focus ring.
 *
 * Fully server-rendered: it is geometry over data already in the bundle, with
 * no measurement and no effect, so it is in the prerendered HTML and legible
 * with JavaScript off.
 */
export function FillingPath({ locale }: { locale: Locale }) {
  const box = extent('standard')
  const segments = deviations('standard')
  const rings = backtrackPoints('standard')
  const line = (points: readonly { x: number; y: number }[]) =>
    points.map((p) => `${p.x},${p.y}`).join(' ')

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
      {segments.map((segment) => (
        <polyline
          key={segment.from}
          points={line(segment.points)}
          fill="none"
          stroke="var(--paper)"
          strokeWidth={0.1}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
      {segments.map((segment) => (
        <polyline
          key={segment.from}
          points={line(segment.points)}
          fill="none"
          stroke="var(--trace)"
          strokeWidth={0.05}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
      {rings.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={0.17}
          fill="var(--paper)"
          stroke="var(--trace)"
          strokeWidth={0.05}
        />
      ))}
      <title>{t(locale, 'path.title')}</title>
    </svg>
  )
}
