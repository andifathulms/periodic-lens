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

  const chip = (z: number) => {
    const element = ELEMENTS.find((e) => e.z === z)!
    const paint = fill(lens, element, scale)
    return (
      <button
        key={z}
        type="button"
        data-z={z}
        aria-selected={selected === z}
        onClick={() => onSelect(z)}
        aria-label={`${element.z} ${element.symbol} ${
          locale === 'id' ? element.nameId : element.name
        }`}
        className={[
          'cell-morph block rounded hairline text-center font-display text-16 font-semibold',
          paint.type === 'unknown' ? 'fill-unknown' : '',
          selected === z ? 'ring-2 ring-ink' : '',
        ].join(' ')}
        style={{
          width: '32px',
          height: '32px',
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
        <div className="flex items-end gap-[2px] pb-8" style={{ minWidth: 'max-content' }}>
          {line.decades.map((decade) => (
            <div key={decade.decade} className="flex flex-col items-center gap-[2px]">
              <div className="flex flex-col-reverse gap-[2px]">
                {decade.elements.map((element) => chip(element.z))}
              </div>
              <div
                aria-hidden
                className="w-full border-t border-rule"
                style={{ minWidth: '34px' }}
              />
              {decade.decade % 50 === 0 ? (
                <span className="font-mono text-[10px] tabular text-muted">{decade.decade}</span>
              ) : (
                <span className="font-mono text-[10px] text-muted">&nbsp;</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <section className="border-t border-rule pt-12">
        <h3 className="text-16 font-semibold">
          {locale === 'id' ? 'Tanpa tahun tercatat' : 'No recorded year'}
        </h3>
        <p className="text-14 text-muted mt-4 max-w-[70ch]">{t(locale, 'ancient.note')}</p>
        <div className="mt-12 flex flex-wrap gap-[2px]">
          {line.unrecorded.map((element) => chip(element.z))}
        </div>
      </section>
    </div>
  )
}
