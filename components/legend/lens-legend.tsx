'use client'

import {
  BLOCK_COLOURS,
  CATEGORY_COLOURS,
  NOT_PRODUCED_GLYPH,
  ORIGIN_COLOURS,
  RAMPS,
} from '@/lib/design/palette'
import { ELEMENTS, USGS_EDITION } from '@/lib/elements/data'
import { type LensId, domain, kindOf, tokenFor } from '@/lib/elements/lens'
import { type Locale, t, term } from '@/lib/i18n'

/**
 * DESIGN.md §8 — the honesty contract. Never optional, never collapsed, and it
 * always states the active lens by name, its scale, the unknown hatch, and for
 * production the USGS edition and reporting stage.
 */
const CATEGORICAL_KEYS: Partial<Record<LensId, readonly string[]>> = {
  category: Object.keys(CATEGORY_COLOURS),
  block: Object.keys(BLOCK_COLOURS),
  origin: Object.keys(ORIGIN_COLOURS),
}

function Swatch({ token, hatch }: { token?: string; hatch?: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-16 w-16 shrink-0 rounded hairline ${hatch ? 'fill-unknown' : ''}`}
      style={token ? { backgroundColor: `var(${token})` } : undefined}
    />
  )
}

function format(value: number): string {
  if (Math.abs(value) >= 1000 || (Math.abs(value) < 0.01 && value !== 0)) {
    return value.toPrecision(3)
  }
  return String(Number(value.toFixed(2)))
}

export function LensLegend({ lens, locale }: { lens: LensId; locale: Locale }) {
  const kind = kindOf(lens)
  const scale = domain(lens, ELEMENTS)
  const categorical = CATEGORICAL_KEYS[lens]
  const stage = ELEMENTS.find((e) => e.production.type === 'produced')

  return (
    <section
      aria-label={t(locale, 'legend.region')}
      className="flex flex-col gap-12 rounded border border-rule p-12"
    >
      <p className="flex flex-wrap items-baseline gap-8">
        <span className="label-eyebrow">{t(locale, 'legend.showing')}</span>
        <span className="font-display text-title font-semibold">
          {t(locale, `lens.${lens}`)}
        </span>
      </p>

      {categorical ? (
        <ul className="flex flex-wrap gap-x-24 gap-y-8 text-micro">
          {categorical.map((key) => (
            <li key={key} className="flex items-center gap-8">
              <Swatch token={tokenFor(lens, key)} />
              <span>{term(locale, key)}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {kind !== 'categorical' && scale ? (
        <div className="flex flex-wrap items-center gap-12 text-micro">
          <span className="text-muted">{t(locale, 'legend.scale')}</span>
          <span className="font-mono tabular">{format(scale.min)}</span>
          <span className="flex" aria-hidden>
            {(RAMPS[lens as keyof typeof RAMPS] ?? []).map((_, index) => (
              <span
                key={index}
                className="h-16 w-24 hairline"
                style={{ backgroundColor: `var(${tokenFor(lens, String(index))})` }}
              />
            ))}
          </span>
          <span className="font-mono tabular">{format(scale.max)}</span>
          <span className="text-muted">{scale.unit}</span>
        </div>
      ) : null}

      {lens === 'production-id' ? (
        <div className="flex flex-col gap-8 text-micro">
          <span className="flex items-center gap-8">
            <Swatch token={tokenFor('production-id', 'none')} />
            <span>
              <span className="font-mono" aria-hidden>
                {NOT_PRODUCED_GLYPH}
              </span>{' '}
              {t(locale, 'legend.notProduced')}
            </span>
          </span>
          {/* Invariant 10 — never an undated production number. */}
          <p className="font-mono text-micro text-muted">
            USGS Mineral Commodity Summaries {USGS_EDITION} ·{' '}
            {stage?.production.type === 'produced'
              ? `${term(locale, stage.production.production.stage)}, ${stage.production.production.dataYear}`
              : null}
          </p>
        </div>
      ) : null}

      {/*
       * The unmeasured lens is the one lens where nothing is ever hatched,
       * because the count of missing properties is itself always known. Saying
       * that plainly is cheaper than letting a reader wonder whether the hatch
       * has quietly changed meaning. DESIGN.md §8 — a view states what it
       * cannot show, and here what it cannot show is an unknown.
       */}
      {lens === 'unmeasured' ? (
        <p className="text-micro text-muted">{t(locale, 'legend.nothingHatched')}</p>
      ) : (
        <div className="flex flex-wrap items-center gap-8 text-micro">
          <Swatch hatch />
          <span>{t(locale, 'legend.unknown')}</span>
          <span className="text-muted">
            —{' '}
            {lens === 'discovery'
              ? t(locale, 'ancient.note')
              : t(locale, 'legend.unknownNote')}
          </span>
          {/*
           * Same appearance, honestly, but not the same reason: on production
           * the hatch means USGS publishes no commodity covering the element,
           * not that nobody has measured it. The look is fixed; the words are
           * allowed to be precise.
           */}
          <span className="basis-full text-muted">
            {lens === 'production-id'
              ? t(locale, 'legend.unknownReasonProduction')
              : t(locale, 'legend.unknownReasonProperty')}
          </span>
        </div>
      )}
    </section>
  )
}
