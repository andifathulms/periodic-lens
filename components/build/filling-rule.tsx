'use client'

import { AZIMUTHAL, FILLING_ORDER } from '@/lib/elements/aufbau'
import { STEPS } from '@/lib/elements/build'
import { SOURCES } from '@/lib/elements/sources'
import { type Locale, t } from '@/lib/i18n'

/**
 * The rule, stated and then worked out in front of the reader.
 *
 * The page used to say electrons fill "in energy order". That is the result,
 * not a rule — it is unfalsifiable, and a reader cannot predict anything from
 * it. The actual rule is two lines of arithmetic that lived only in the sort
 * comparator in aufbau.ts: order by n + ℓ, and break ties by lower n.
 *
 * Writing it out is what turns the animation's most confusing moment into its
 * most convincing one. 4s fills before 3d because 4+0 = 4 and 3+2 = 5, and a
 * reader who can see those two sums can check the claim rather than accept it.
 *
 * The numbers come from the same constants the ordering uses, so this can
 * never show one rule while the table is built from another.
 */

/** Only the subshells the first 118 electrons actually reach. */
const USED = FILLING_ORDER.slice(
  0,
  new Set(STEPS.map((step) => `${step.n}${step.l}`)).size,
)

export function FillingRule({ current, locale }: { current?: string; locale: Locale }) {
  return (
    <section className="flex flex-col gap-12 rounded border border-rule p-12">
      <h2 className="font-display text-title font-semibold">{t(locale, 'rule.heading')}</h2>
      <p className="max-w-[70ch] text-body">{t(locale, 'rule.statement')}</p>

      <div className="overflow-x-auto">
        <ol className="flex items-end gap-4" style={{ minWidth: 'max-content' }}>
          {USED.map((shell, index) => {
            const label = `${shell.n}${shell.l}`
            const sum = shell.n + AZIMUTHAL[shell.l]
            const previous = USED[index - 1]
            /* The backtrack: this subshell's shell number is lower than the
               one before it. 4s → 3d is the famous one, and it is the single
               moment the rule stops being obvious. */
            const backtrack = previous !== undefined && shell.n < previous.n
            const active = label === current
            return (
              <li key={label} className="flex flex-col items-center gap-4">
                <span
                  className={[
                    'rounded hairline px-8 py-4 font-mono tabular',
                    active ? 'bg-ink text-paper font-semibold' : '',
                    backtrack ? 'border-ink' : '',
                  ].join(' ')}
                >
                  {label}
                </span>
                <span className="font-mono tabular text-micro text-muted">
                  {shell.n}+{AZIMUTHAL[shell.l]}={sum}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <p className="max-w-[70ch] text-micro text-muted">{t(locale, 'rule.backtrack')}</p>
      {/* The citation sits with the rule, not in a footnote block. */}
      <p className="font-mono text-micro text-muted">{SOURCES.madelung.cite}</p>
    </section>
  )
}
