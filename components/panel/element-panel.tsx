'use client'

import { blockOf } from '@/lib/elements/aufbau'
import { elementAt } from '@/lib/elements/data'
import { type LensId, textValue } from '@/lib/elements/lens'
import { isKnown } from '@/lib/elements/unknown'
import type { PropertyValue, Source } from '@/lib/elements/types'
import { type Locale, t, term } from '@/lib/i18n'

/**
 * DESIGN.md §6 / invariant 15 — a side panel, never a modal. An element's
 * neighbours are half of what its properties mean, so the table stays visible.
 *
 * Every row states its value with a unit and its source, and a missing value
 * says "not known" rather than showing a blank (PRD.md §9).
 */
function Row({
  label,
  value,
  locale,
}: {
  label: string
  value: PropertyValue<number | string>
  locale: Locale
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-8 border-b border-rule py-8">
      <dt className="text-14 text-muted">{label}</dt>
      <dd className="text-16 font-mono tabular text-right">
        {isKnown(value) ? (
          <>
            {typeof value.value === 'number' ? value.value : term(locale, value.value)}
            {value.unit ? <span className="text-muted"> {value.unit}</span> : null}
          </>
        ) : (
          <span className="text-muted">{t(locale, 'legend.unknown')}</span>
        )}
      </dd>
    </div>
  )
}

function Citation({ source }: { source: Source }) {
  /* The citation line, small and monospace, wherever a claim is made. */
  return <p className="font-mono text-14 text-muted leading-snug">{source.cite}</p>
}

export function ElementPanel({
  z,
  lens,
  locale,
  onClose,
}: {
  z: number
  lens: LensId
  locale: Locale
  onClose: () => void
}) {
  const element = elementAt(z)
  const name = locale === 'id' ? element.nameId : element.name
  const onLens = textValue(lens, element)

  return (
    <aside
      aria-label={`${element.symbol} — ${name}`}
      className="border border-rule rounded bg-paper p-16 flex flex-col gap-16 lg:sticky lg:top-16 lg:w-[360px] lg:shrink-0"
    >
      <div className="flex items-start justify-between gap-16">
        <div>
          <p className="font-mono text-14 tabular text-muted">{element.z}</p>
          <p className="font-display text-46 font-semibold leading-none">{element.symbol}</p>
          <p className="text-18">{name}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded hairline px-8 py-4 text-14 hover:border-ink"
        >
          {t(locale, 'panel.close')}
        </button>
      </div>

      <section>
        <h3 className="text-16 font-semibold mb-8">{t(locale, 'panel.activeLens')}</h3>
        <Row label={t(locale, `lens.${lens}`)} value={onLens} locale={locale} />
      </section>

      <section>
        <h3 className="text-16 font-semibold mb-8">{t(locale, 'panel.configuration')}</h3>
        <p className="font-mono text-18 tabular">{element.configuration.notation}</p>
        {element.configuration.anomalous ? (
          <p className="mt-8 text-14">{t(locale, 'panel.anomalous')}</p>
        ) : null}
        <div className="mt-8">
          <Citation source={element.configuration.source} />
        </div>
      </section>

      <section>
        <h3 className="text-16 font-semibold mb-8">{t(locale, 'panel.properties')}</h3>
        <dl>
          <Row label={t(locale, 'prop.mass')} value={element.mass} locale={locale} />
          <Row
            label={t(locale, 'prop.category')}
            value={{
              type: 'known',
              value: element.category,
              unit: '',
              source: element.configuration.source,
            }}
            locale={locale}
          />
          <Row
            label={t(locale, 'prop.block')}
            value={{
              type: 'known',
              value: blockOf(element.z),
              unit: '',
              source: element.configuration.source,
            }}
            locale={locale}
          />
          <Row
            label={t(locale, 'prop.group')}
            value={
              element.group === 0
                ? { type: 'unknown' }
                : {
                    type: 'known',
                    value: element.group,
                    unit: '',
                    source: element.configuration.source,
                  }
            }
            locale={locale}
          />
          <Row
            label={t(locale, 'prop.period')}
            value={{
              type: 'known',
              value: element.period,
              unit: '',
              source: element.configuration.source,
            }}
            locale={locale}
          />
          <Row
            label={t(locale, 'prop.electronegativity')}
            value={element.electronegativity}
            locale={locale}
          />
          <Row
            label={t(locale, 'prop.atomicRadius')}
            value={element.atomicRadius}
            locale={locale}
          />
          <Row
            label={t(locale, 'prop.ionisationEnergy')}
            value={element.ionisationEnergy}
            locale={locale}
          />
          <Row
            label={t(locale, 'prop.meltingPoint')}
            value={element.meltingPoint}
            locale={locale}
          />
          <Row label={t(locale, 'prop.density')} value={element.density} locale={locale} />
          <Row
            label={t(locale, 'prop.origin')}
            value={{
              type: 'known',
              value: element.origin,
              unit: '',
              source: element.configuration.source,
            }}
            locale={locale}
          />
          <Row label={t(locale, 'prop.discovery')} value={element.discovery} locale={locale} />
        </dl>
      </section>

      {element.production.type !== 'unknown' ? (
        <section>
          <h3 className="text-16 font-semibold mb-8">{t(locale, 'panel.production')}</h3>
          {element.production.type === 'produced' ? (
            <>
              <p className="font-mono text-22 tabular">
                {(element.production.production.share * 100).toFixed(1)}%
              </p>
              <p className="text-14 text-muted">
                {element.production.production.commodity} ·{' '}
                {term(locale, element.production.production.stage)} ·{' '}
                {element.production.production.dataYear}
              </p>
              <div className="mt-8">
                <Citation source={element.production.production.source} />
              </div>
            </>
          ) : (
            <>
              <p className="text-16">{t(locale, 'legend.notProduced')}</p>
              <div className="mt-8">
                <Citation source={element.production.source} />
              </div>
            </>
          )}
        </section>
      ) : null}
    </aside>
  )
}
