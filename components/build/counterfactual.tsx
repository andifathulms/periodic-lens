'use client'

import { useState } from 'react'
import { AZIMUTHAL } from '@/lib/elements/aufbau'
import { ORDER_IDS, type OrderId, ordering, periodLengths } from '@/lib/elements/counterfactual'
import { type Locale, t } from '@/lib/i18n'

/**
 * The claim, made testable.
 *
 * Every control in the app changes how existing data is displayed; none let a
 * reader interrogate the rule itself. But the whole thesis is that the shape
 * follows from the order — and the way to be convinced of that is to change
 * the order and watch the row lengths change, not to be told.
 *
 * `strict-n` is the ordering most readers assume before they meet the rule:
 * finish shell 1, then shell 2, then shell 3. It is wrong about the world, and
 * seeing what it would produce is what makes n + ℓ feel necessary rather than
 * arbitrary.
 *
 * The hypothetical never touches the real table. It drives only this block,
 * and the actual ordering is the one it shows when set back to Madelung.
 */
export function Counterfactual({ locale }: { locale: Locale }) {
  const [order, setOrder] = useState<OrderId>('madelung')
  const rows = periodLengths(order)
  const sequence = ordering(order).slice(0, 12)

  return (
    <section className="flex flex-col gap-12 rounded border border-rule p-12">
      <h2 className="font-display text-title font-semibold">{t(locale, 'what.heading')}</h2>
      <p className="max-w-[70ch] text-body">{t(locale, 'what.intro')}</p>

      <fieldset className="flex flex-wrap items-baseline gap-8">
        <legend className="sr-only">{t(locale, 'what.heading')}</legend>
        <span aria-hidden className="label-eyebrow mr-4 self-center">
          {t(locale, 'what.label')}
        </span>
        {ORDER_IDS.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={id === order}
            onClick={() => setOrder(id)}
            className={[
              'rounded hairline px-12 py-4 text-body transition-colors duration-fast ease-house',
              id === order ? 'bg-ink text-paper font-semibold' : 'hover:border-ink',
            ].join(' ')}
          >
            {t(locale, `what.${id}`)}
          </button>
        ))}
      </fieldset>

      <div className="overflow-x-auto">
        <ol className="flex items-end gap-4" style={{ minWidth: 'max-content' }}>
          {sequence.map((shell) => (
            <li key={`${shell.n}${shell.l}`} className="flex flex-col items-center gap-4">
              <span className="rounded hairline px-8 py-4 font-mono tabular">
                {`${shell.n}${shell.l}`}
              </span>
              <span className="font-mono tabular text-micro text-muted">
                {shell.n}+{AZIMUTHAL[shell.l]}={shell.n + AZIMUTHAL[shell.l]}
              </span>
            </li>
          ))}
          <li className="self-center pl-8 text-muted">…</li>
        </ol>
      </div>

      <p className="flex flex-wrap items-baseline gap-8">
        <span className="label-eyebrow">{t(locale, 'what.rows')}</span>
        <span className="font-mono tabular text-lead font-semibold">{rows.join(', ')}</span>
      </p>

      <p className="max-w-[70ch] text-body">
        {t(locale, order === 'madelung' ? 'what.realNote' : 'what.hypotheticalNote')}
      </p>
    </section>
  )
}
