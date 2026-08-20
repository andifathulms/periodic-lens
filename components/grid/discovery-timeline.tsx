'use client'

import { ELEMENTS } from '@/lib/elements/data'
import { type LensId, domain, fill } from '@/lib/elements/lens'
import { timeline } from '@/lib/elements/timeline'
import { type Locale, t } from '@/lib/i18n'

/**
 * The same 118 elements along one axis. PRD.md §13, M6.
 *
 * Colour stays on the active lens, so the timeline answers "when" while the
 * lens answers whatever it was already answering — one encoding each, on
 * different axes, which is not two encodings competing for the same channel.
 *
 * The elements in use since antiquity are held OFF the axis in their own
 * labelled group. Putting them at the left end would date them to whichever
 * recorded year happens to be earliest, and that is a fabrication rather than
 * an approximation.
 */
export function DiscoveryTimeline({
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
  const line = timeline()
  const scale = domain(lens, ELEMENTS)

  /*
   * `when` is the decade the chip sits in, or undefined for the elements held
   * off the axis. It goes into the accessible name because the grouping was
   * otherwise purely visual: the year lived in a sibling span, and only every
   * fiftieth was labelled at all, so a screen reader user got 118 symbols in
   * an order they had no way to interpret (WCAG 1.3.1). The axis is the whole
   * content of this view; it has to be in the names.
   */
  const chip = (z: number, when?: number) => {
    const element = ELEMENTS.find((e) => e.z === z)!
    const paint = fill(lens, element, scale)
    const period =
      when === undefined ? t(locale, 'view.timelineUnrecorded') : `${when}s`
    return (
      <button
        key={z}
        type="button"
        data-z={z}
        /* Not a grid, so selection is expressed as a pressed toggle. */
        aria-pressed={selected === z}
        onClick={() => onSelect(z)}
        aria-label={`${element.z} ${element.symbol} ${
          locale === 'id' ? element.nameId : element.name
        } — ${period}`}
        className={[
          'cell-morph block rounded hairline text-center font-display text-body font-semibold',
          paint.type === 'unknown' ? 'fill-unknown' : '',
          selected === z ? 'ring-2 ring-ink' : '',
        ].join(' ')}
        style={{
          width: 'var(--chip)',
          height: 'var(--chip)',
          backgroundColor: paint.type === 'unknown' ? undefined : `var(${paint.token})`,
        }}
      >
        {element.symbol}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-24">
      <div className="overflow-x-auto">
        <div
          className="flex items-end pb-8"
          style={{ minWidth: 'max-content', gap: 'var(--chip-gap)' }}
        >
          {line.decades.map((decade) => (
            <div
              key={decade.decade}
              className="flex flex-col items-center"
              style={{ gap: 'var(--chip-gap)' }}
            >
              <div className="flex flex-col-reverse" style={{ gap: 'var(--chip-gap)' }}>
                {decade.elements.map((element) => chip(element.z, decade.decade))}
              </div>
              <div
                aria-hidden
                className="w-full border-t border-rule"
                style={{ minWidth: 'var(--chip-axis-min)' }}
              />
              {decade.decade % 50 === 0 ? (
                <span
                  className="font-mono tabular text-muted"
                  style={{ fontSize: 'var(--cell-type-z)' }}
                >
                  {decade.decade}
                </span>
              ) : (
                <span className="font-mono text-muted" style={{ fontSize: 'var(--cell-type-z)' }}>
                  &nbsp;
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <section className="border-t border-rule pt-12">
        {/* h2: the table page opens at h1 and this was the only h3 hanging
            off nothing. The string moved to the dictionary with every other
            piece of user-facing copy. */}
        <h2 className="text-body font-semibold">{t(locale, 'view.timelineUnrecorded')}</h2>
        <p className="text-micro text-muted mt-4 max-w-[70ch]">{t(locale, 'ancient.note')}</p>
        <div className="mt-12 flex flex-wrap" style={{ gap: 'var(--chip-gap)' }}>
          {line.unrecorded.map((element) => chip(element.z))}
        </div>
      </section>
    </div>
  )
}
