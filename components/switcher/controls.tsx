'use client'

import { LENS_IDS, type LensId } from '@/lib/elements/lens'
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
  value,
  onChange,
  labelFor,
  disabledFor,
  reasonFor,
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (next: T) => void
  labelFor: (option: T) => string
  disabledFor?: (option: T) => boolean
  reasonFor?: (option: T) => string | undefined
}) {
  return (
    <fieldset className="flex flex-wrap items-baseline gap-8">
      <legend className="sr-only">{label}</legend>
      <span aria-hidden className="text-14 text-muted mr-4">
        {label}
      </span>
      {options.map((option) => {
        const disabled = disabledFor?.(option) ?? false
        return (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            disabled={disabled}
            title={disabled ? reasonFor?.(option) : undefined}
            onClick={() => onChange(option)}
            className={[
              'rounded hairline px-12 py-4 text-16 transition-colors duration-fast ease-house',
              option === value ? 'bg-ink text-paper' : 'hover:border-ink',
              disabled ? 'text-muted cursor-not-allowed hover:border-rule' : '',
            ].join(' ')}
          >
            {labelFor(option)}
          </button>
        )
      })}
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
