'use client'

import { blockOf, positionRationale, predictedNotation } from '@/lib/elements/aufbau'
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
      <dt className="text-micro text-muted">{label}</dt>
      <dd className="text-body font-mono tabular text-right">
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
  return <p className="font-mono text-micro text-muted leading-snug">{source.cite}</p>
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
  const rationale = positionRationale(element.z)

  return (
    <aside
      aria-label={`${element.symbol} — ${name}`}
      /*
       * DESIGN.md §6 — a bottom sheet on mobile, a side panel from lg up. Both
       * keep the table visible; neither is a modal.
       */
      className={[
        'bg-paper p-16 flex flex-col gap-16 overflow-y-auto',
        'fixed inset-x-0 bottom-0 z-20 max-h-[70vh] border-t border-rule',
        'lg:static lg:z-auto lg:max-h-none lg:w-[360px] lg:shrink-0 lg:sticky lg:top-16',
        'lg:rounded lg:border lg:border-rule',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-16">
        <div>
          {/*
           * The panel's sections are h3s, so the panel needs an h2 for them to
           * hang off — the visible identity is the symbol, set in display type
           * rather than heading type, so the heading itself is for the outline.
           */}
          <h2 className="sr-only">{`${element.symbol} — ${name}`}</h2>
          <p className="font-mono text-micro tabular text-muted">{element.z}</p>
          <p aria-hidden className="font-display text-display font-semibold leading-none">
            {element.symbol}
          </p>
          <p aria-hidden className="text-lead">
            {name}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded hairline px-8 py-4 text-micro hover:border-ink"
        >
          {t(locale, 'panel.close')}
        </button>
      </div>

      <section>
        <h3 className="text-body font-semibold mb-8">{t(locale, 'panel.activeLens')}</h3>
        <Row label={t(locale, `lens.${lens}`)} value={onLens} locale={locale} />
      </section>

      <section>
        <h3 className="text-body font-semibold mb-8">{t(locale, 'panel.configuration')}</h3>
        <p className="font-mono text-lead tabular">{element.configuration.notation}</p>
        {/*
         * Invariant 3, at its one display site. The published value above is
         * the configuration; the line below is the rule's output, shown only
         * where the rule is known to be wrong, labelled as a prediction, and
         * set smaller and muted so it can never be read as the answer.
         */}
        {element.configuration.anomalous ? (
          <div className="mt-8 flex flex-col gap-4">
            <p className="text-micro">{t(locale, 'panel.anomalous')}</p>
            <p className="text-micro text-muted">
              {t(locale, 'panel.rulePredicts')}{' '}
              <span className="font-mono tabular line-through">
                {predictedNotation(element.z)}
              </span>{' '}
              — {t(locale, 'panel.ruleWrong')}
            </p>
          </div>
        ) : null}
        <div className="mt-8">
          <Citation source={element.configuration.source} />
        </div>
      </section>

      {/*
       * PRD.md §5 narrowed to one cell: the shape argument is made in general
       * on the build page and was never bound to the element in front of the
       * reader. Structured facts rather than a generated sentence — 118
       * generated sentences would be subtly wrong somewhere.
       */}
      <section>
        <h3 className="text-body font-semibold mb-8">{t(locale, 'panel.whyHere')}</h3>
        <dl>
          <Row
            label={t(locale, 'panel.differentiating')}
            value={{
              type: 'known',
              value: `${rationale.n}${rationale.l}${rationale.index}`,
              unit: '',
              source: element.configuration.source,
            }}
            locale={locale}
          />
          <Row
            label={t(locale, 'panel.blockWidth')}
            value={{
              type: 'known',
              value: `${term(locale, rationale.block)} · ${rationale.capacity}`,
              unit: '',
              source: element.configuration.source,
            }}
            locale={locale}
          />
        </dl>
        {/*
         * For the twenty exceptions the differentiating electron above will not
         * match the published notation, because block membership comes from the
         * rule's filling order — chromium is d-block whatever its published
         * configuration says. Left unsaid, that reads as a contradiction.
         */}
        {element.configuration.anomalous ? (
          <p className="mt-8 text-micro text-muted">{t(locale, 'panel.positionFromRule')}</p>
        ) : null}
        {rationale.conventional ? (
          <p className="mt-8 text-micro text-muted">{t(locale, 'panel.byConvention')}</p>
        ) : null}
      </section>

      <section>
        <h3 className="text-body font-semibold mb-8">{t(locale, 'panel.properties')}</h3>
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
          <h3 className="text-body font-semibold mb-8">{t(locale, 'panel.production')}</h3>
          {element.production.type === 'produced' ? (
            <>
              <p className="font-mono text-title tabular">
                {(element.production.production.share * 100).toFixed(1)}%
              </p>
              <p className="text-micro text-muted">
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
              <p className="text-body">{t(locale, 'legend.notProduced')}</p>
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
