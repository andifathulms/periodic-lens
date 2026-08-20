'use client'

import { LENS_IDS, type LensId, kindOf } from '@/lib/elements/lens'
import { VIEW_IDS, type ViewId, supports } from '@/lib/elements/view'
import { LAYOUT_IDS, type LayoutId } from '@/lib/elements/layout'
import { type Locale, t } from '@/lib/i18n'

/**
 * DESIGN.md §6 — labelled controls, not icons. A reader should never have to
 * guess what a lens is called.
 *
 * Invariant 1 lives in the type here: one LensId in, one LensId out. There is
 * no multi-select and no way to express two active lenses.
 */
function Group<T extends string>({
  label,
  options,
  groupBy,
  value,
  onChange,
  labelFor,
  disabledFor,
  reasonFor,
  primary = false,
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (next: T) => void
  labelFor: (option: T) => string
  disabledFor?: (option: T) => boolean
  reasonFor?: (option: T) => string | undefined
  /** The lens is the idea of the product; layout and view are adjustments. */
  primary?: boolean
  /**
   * Optional kind for each option. Options sharing a kind are shown together
   * with a hairline between groups — it is a visual grouping only, derived
   * here from the domain's own classifier. The order of the options is NOT
   * changed: LENS_IDS is URL-visible and test-iterated, and belongs to
   * lib/elements, not to a styling pass.
   */
  groupBy?: (option: T) => string
}) {
  /* Shown, not hovered: the explanation is text on the page when it applies. */
  const unavailable = options.find((option) => disabledFor?.(option))
  const reason = unavailable ? reasonFor?.(unavailable) : undefined
  const reasonId = `${label.replace(/\s+/g, '-').toLowerCase()}-unavailable`

  return (
    <fieldset className="flex flex-wrap items-baseline gap-8">
      <legend className="sr-only">{label}</legend>
      <span aria-hidden className="label-eyebrow mr-4 self-center">
        {label}
      </span>
      {options.map((option, index) => {
        /*
         * aria-disabled, not disabled. A native disabled button leaves the tab
         * order, so the users most in need of knowing WHY an option is
         * unavailable were the ones guaranteed not to reach it — and the
         * reason lived in a title attribute, which never surfaces for a
         * keyboard user at all (WCAG 1.3.1, 3.3.2). This is the rare case ARIA
         * is the right tool: there is no native way to keep a control
         * focusable while marking it unavailable.
         */
        const disabled = disabledFor?.(option) ?? false
        const newGroup =
          groupBy && index > 0 && groupBy(option) !== groupBy(options[index - 1]!)
        return (
          <div key={option} className="flex items-baseline gap-8">
            {newGroup ? (
              <span aria-hidden className="mx-4 h-16 w-px shrink-0 self-center bg-rule" />
            ) : null}
            <button
              type="button"
              aria-pressed={option === value}
              aria-disabled={disabled || undefined}
              aria-describedby={disabled ? reasonId : undefined}
              onClick={() => {
                if (disabled) return
                onChange(option)
              }}
              className={[
                'rounded hairline transition-colors duration-fast ease-house',
                /* Tighter below sm: eleven lens options wrapped to four rows
                   on a phone and pushed the grid off the first screen. */
                primary
                  ? 'px-8 py-4 text-micro sm:px-12 sm:py-8 sm:text-body'
                  : 'px-8 py-4 text-micro',
                option === value ? 'bg-ink text-paper font-semibold' : 'hover:border-ink',
                disabled ? 'text-muted cursor-not-allowed hover:border-rule' : '',
              ].join(' ')}
            >
              {labelFor(option)}
            </button>
          </div>
        )
      })}
      {reason ? (
        <p id={reasonId} className="basis-full text-micro text-muted">
          {reason}
        </p>
      ) : null}
    </fieldset>
  )
}

export function LensSwitcher({
  lens,
  onChange,
  locale,
}: {
  lens: LensId
  onChange: (next: LensId) => void
  locale: Locale
}) {
  return (
    <Group
      label={t(locale, 'lens.label')}
      options={LENS_IDS}
      value={lens}
      onChange={onChange}
      labelFor={(id) => t(locale, `lens.${id}`)}
      /*
       * Three categorical, one production, seven continuous. The kinds behave
       * differently — topography accepts only continuous ones — and a reader
       * previously discovered that by finding a disabled button. kindOf is the
       * domain's own classifier; nothing is reordered or reclassified here.
       */
      groupBy={kindOf}
      primary
    />
  )
}

export function LayoutSwitcher({
  layout,
  onChange,
  locale,
}: {
  layout: LayoutId
  onChange: (next: LayoutId) => void
  locale: Locale
}) {
  return (
    <Group
      label={t(locale, 'layout.label')}
      options={LAYOUT_IDS}
      value={layout}
      onChange={onChange}
      labelFor={(id) => t(locale, `layout.${id}`)}
    />
  )
}

/**
 * DESIGN.md §8 — a view that cannot honestly render the active lens is
 * disabled with its reason attached, rather than silently absent. Height is a
 * continuous channel, so topography refuses categorical lenses: nothing makes
 * "noble gas" taller than "metalloid".
 */
export function ViewSwitcher({
  view,
  lens,
  onChange,
  locale,
}: {
  view: ViewId
  lens: LensId
  onChange: (next: ViewId) => void
  locale: Locale
}) {
  return (
    <Group
      label={t(locale, 'view.label')}
      options={VIEW_IDS}
      value={view}
      onChange={onChange}
      labelFor={(id) => t(locale, `view.${id}`)}
      disabledFor={(id) => !supports(id, lens)}
      reasonFor={() => t(locale, 'view.topographyUnavailable')}
    />
  )
}
