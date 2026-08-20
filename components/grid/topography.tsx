'use client'

import { ELEMENTS } from '@/lib/elements/data'
import { type LensId, domain, fill } from '@/lib/elements/lens'
import { extent, position } from '@/lib/elements/layout'
import { MAX_LIFT, elevation } from '@/lib/elements/topography'
import { type Locale, t } from '@/lib/i18n'

/**
 * PRD.md §10.6 — periodicity as visible waves across the grid rather than as
 * a word.
 *
 * This is a VIEW, not an overlay: it replaces the grid rather than sitting on
 * top of it (DESIGN.md §2, "if a feature needs two encodings, it needs two
 * views"). Colour and height carry the same single lens value, so nothing here
 * competes with anything — there is still exactly one question being asked.
 *
 * An unknown is drawn as a dashed void spanning the whole range. A cell
 * resting flat on the baseline would read as "smallest", which is the false
 * statement the hatch exists to prevent, so the unknown case is given the one
 * appearance that cannot be mistaken for a position on the scale.
 */
const ROW_PITCH = `calc(var(--cell) + ${MAX_LIFT}px)`

export function Topography({
  lens,
  locale,
  selected,
  onSelect,
}: {
  lens: LensId
  locale: Locale
  selected: number | undefined
  onSelect: (z: number) => void
}) {
  const scale = domain(lens, ELEMENTS)
  const box = extent('standard')

  return (
    <div className="overflow-x-auto">
      <div
        role="group"
        aria-label={`${t(locale, `lens.${lens}`)} — topography`}
        className="relative"
        style={{
          width: `calc(${box.width} * var(--cell))`,
          height: `calc(${box.height} * ${ROW_PITCH} + ${MAX_LIFT}px)`,
        }}
      >
        {ELEMENTS.map((element) => {
          const point = position('standard', element.z)
          const height = elevation(lens, element, scale)
          const paint = fill(lens, element, scale)
          const lift = height.type === 'known' ? height.lift : 0
          return (
            <button
              key={element.z}
              type="button"
              data-z={element.z}
              aria-selected={selected === element.z}
              onClick={() => onSelect(element.z)}
              aria-label={`${element.z} ${element.symbol} ${
                locale === 'id' ? element.nameId : element.name
              }`}
              className="absolute left-0 top-0 block text-left"
              style={{
                transform: `translate(calc(${point.x} * var(--cell)), calc(${point.y} * ${ROW_PITCH} + ${MAX_LIFT}px))`,
                width: 'var(--cell)',
                height: `calc(var(--cell) + ${MAX_LIFT}px)`,
              }}
            >
              {height.type === 'unknown' ? (
                /* The void: full range, dashed, unmistakably not a height. */
                <span
                  aria-hidden
                  className="fill-unknown absolute inset-x-[3px] rounded"
                  style={{
                    bottom: 0,
                    height: `calc(var(--cell) + ${MAX_LIFT}px)`,
                    border: '1px dashed var(--rule)',
                    opacity: 0.7,
                  }}
                />
              ) : (
                /* The wall, so the lift reads as elevation rather than as a gap. */
                <span
                  aria-hidden
                  className="cell-morph absolute inset-x-[6px] rounded-none"
                  style={{
                    bottom: 0,
                    height: `${lift}px`,
                    backgroundColor: paint.type === 'unknown' ? undefined : `var(${paint.token})`,
                    opacity: 0.45,
                  }}
                />
              )}
              <span
                className={[
                  'cell-morph cell-travel absolute inset-x-0 rounded hairline block',
                  height.type === 'unknown' ? 'fill-unknown' : '',
                  selected === element.z ? 'ring-2 ring-ink z-10' : '',
                ].join(' ')}
                style={{
                  bottom: `${lift}px`,
                  height: 'var(--cell)',
                  backgroundColor:
                    paint.type === 'unknown' ? undefined : `var(${paint.token})`,
                }}
              >
                <span className="absolute left-[3px] top-[2px] font-mono text-[10px] tabular text-ink/80">
                  {element.z}
                </span>
                <span className="absolute inset-x-0 top-[16px] text-center font-display text-18 font-semibold leading-none">
                  {element.symbol}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
