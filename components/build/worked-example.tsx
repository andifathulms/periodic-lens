import { format, positionRationale, predict } from '@/lib/elements/aufbau'
import { elementAt } from '@/lib/elements/data'
import { groupOf, periodOf } from '@/lib/elements/layout'
import { type Locale, t } from '@/lib/i18n'

/**
 * Three elements, traced end to end, before the reader touches anything.
 *
 * The page asserted its conclusion twice in prose and never demonstrated it
 * once — there was no worked example anywhere in the product, and the closest
 * thing was four clicks deep on another page. A newcomer needs to watch the
 * rule produce a real position from a real electron count, with the
 * intermediate values showing, before an animation of 118 of them means
 * anything.
 *
 * Hydrogen, helium and lithium are enough: the first two fill a subshell and
 * end a row, the third starts the next one. Every number below is computed by
 * the same functions that place the actual cells — nothing here is narrated
 * separately from what the app does.
 */
const WALKTHROUGH = [1, 2, 3] as const

export function WorkedExample({ locale }: { locale: Locale }) {
  return (
    <section className="flex flex-col gap-12">
      <h2 className="font-display text-title font-semibold">{t(locale, 'worked.heading')}</h2>
      <p className="max-w-[70ch] text-body">{t(locale, 'worked.intro')}</p>

      <ol className="flex flex-col gap-8">
        {WALKTHROUGH.map((z) => {
          const element = elementAt(z)
          const rationale = positionRationale(z)
          const filled = predict(z)
          const last = filled[filled.length - 1]!
          const full = last.electrons === rationale.capacity
          return (
            <li key={z} className="border-b border-rule pb-8">
              <p className="flex flex-wrap items-baseline gap-x-8 gap-y-4">
                <span className="font-mono tabular font-semibold">
                  {z} {element.symbol}
                </span>
                <span className="text-muted">·</span>
                <span>
                  {z} {t(locale, z === 1 ? 'worked.electron' : 'worked.electrons')}
                </span>
                <span className="text-muted">→</span>
                <span className="font-mono tabular">
                  {t(locale, 'worked.lastEnters')} {`${last.n}${last.l}`}
                </span>
                <span className="text-muted">→</span>
                <span className="font-mono tabular">{format(filled)}</span>
                <span className="text-muted">→</span>
                <span className="font-mono tabular">
                  {t(locale, 'prop.group')} {groupOf(z)}, {t(locale, 'prop.period')} {periodOf(z)}
                </span>
              </p>
              {/*
               * Helium is the one element whose GROUP is not derived — it is
               * s-block and sits at 18 by chemical convention. In a
               * walkthrough about derivation that number reads as the rule's
               * output unless it is contradicted on the spot, which would
               * teach the opposite of the lesson.
               */}
              {rationale.conventional ? (
                <p className="mt-4 text-micro">{t(locale, 'worked.conventional')}</p>
              ) : null}
              <p className="mt-4 text-micro text-muted">
                {full
                  ? `${last.n}${last.l} ${t(locale, 'worked.nowFull')} (${last.electrons}/${rationale.capacity}). ${t(locale, `worked.note${z}`)}`
                  : `${last.n}${last.l} ${t(locale, 'worked.holds')} ${rationale.capacity} — ${last.electrons}/${rationale.capacity}. ${t(locale, `worked.note${z}`)}`}
              </p>
            </li>
          )
        })}
      </ol>

      <p className="max-w-[70ch] text-body">{t(locale, 'worked.closing')}</p>
    </section>
  )
}
