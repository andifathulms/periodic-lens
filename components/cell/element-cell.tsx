'use client'

import { forwardRef } from 'react'
import type { Fill } from '@/lib/elements/lens'
import type { Element } from '@/lib/elements/types'
import { isKnown } from '@/lib/elements/unknown'
import { type Locale, t } from '@/lib/i18n'

/**
 * The atom of the design (DESIGN.md §3). The lens colours the fill; the type
 * never changes. Nothing here decides anything — the fill arrives already
 * resolved by lib/elements/lens.ts.
 */
export type CellProps = {
  element: Element
  fill: Fill
  locale: Locale
  selected: boolean
  onSelect: (z: number) => void
}

function background(fill: Fill): React.CSSProperties {
  switch (fill.type) {
    case 'value':
    case 'absent':
      return { backgroundColor: `var(${fill.token})` }
    case 'unknown':
      // One declaration, one appearance, every lens.
      return {}
    default: {
      const never: never = fill
      return never
    }
  }
}

export const ElementCell = forwardRef<HTMLButtonElement, CellProps>(function ElementCell(
  { element, fill, locale, selected, onSelect },
  ref,
) {
  const name = locale === 'id' ? element.nameId : element.name
  const mass = isKnown(element.mass) ? element.mass.value.toFixed(3) : t(locale, 'legend.unknown')
  return (
    <button
      ref={ref}
      type="button"
      role="gridcell"
      data-z={element.z}
      aria-selected={selected}
      aria-label={`${element.z} ${element.symbol} ${name}`}
      onClick={() => onSelect(element.z)}
      style={{ ...background(fill), width: 'var(--cell)', height: 'var(--cell)' }}
      className={[
        'cell-morph relative block text-left overflow-hidden rounded hairline',
        fill.type === 'unknown' ? 'fill-unknown' : '',
        selected ? 'ring-2 ring-ink z-10' : '',
      ].join(' ')}
    >
      <span className="absolute left-[3px] top-[2px] font-mono text-[10px] tabular text-ink/80">
        {element.z}
      </span>
      {fill.type === 'absent' ? (
        <span
          aria-hidden
          className="absolute right-[4px] top-[1px] font-mono text-[12px] text-muted"
        >
          {fill.glyph}
        </span>
      ) : null}
      <span className="absolute inset-x-0 top-[13px] text-center font-display text-18 font-semibold leading-none">
        {element.symbol}
      </span>
      <span className="absolute inset-x-[2px] top-[32px] text-center text-[8px] leading-tight text-ink/75 truncate">
        {name}
      </span>
      <span className="absolute inset-x-0 bottom-[2px] text-center font-mono text-[8px] tabular text-ink/70">
        {mass}
      </span>
    </button>
  )
})
