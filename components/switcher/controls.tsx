'use client'

import { LENS_IDS, type LensId } from '@/lib/elements/lens'
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
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (next: T) => void
  labelFor: (option: T) => string
}) {
  return (
    <fieldset className="flex flex-wrap items-baseline gap-8">
      <legend className="sr-only">{label}</legend>
      <span aria-hidden className="text-14 text-muted mr-4">
        {label}
      </span>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={option === value}
          onClick={() => onChange(option)}
          className={[
            'rounded hairline px-12 py-4 text-16 transition-colors duration-fast ease-house',
            option === value ? 'bg-ink text-paper' : 'hover:border-ink',
          ].join(' ')}
        >
          {labelFor(option)}
        </button>
      ))}
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
