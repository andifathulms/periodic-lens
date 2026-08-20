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
 *
 * Every size and offset below is a token from globals.css, and every glyph is
 * full --ink. Invariant 8 is a property of the lens palettes — they clear AA
 * against ink — and it only holds if the cell paints in ink and not in a
 * fraction of it.
 */
export type CellProps = {
  element: Element
  fill: Fill
  locale: Locale
  selected: boolean
  /**
   * Whether this cell is the grid's single tab stop. One cell is reachable by
   * Tab and the arrow keys move within — the grid pattern the container's key
   * handler already assumes. Without it all 118 were tab stops and reaching
   * anything below the grid took over a hundred presses.
   */
  tabStop?: boolean
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
  { element, fill, locale, selected, tabStop, onSelect },
  ref,
) {
  const name = locale === 'id' ? element.nameId : element.name
  const mass = isKnown(element.mass) ? element.mass.value.toFixed(3) : t(locale, 'legend.unknown')
  return (
    <button
      ref={ref}
      type="button"
      data-z={element.z}
      /*
       * A plain button. It carried role="gridcell", which overrode the native
       * button role — 118 controls announced as cells, with no hint that they
       * do anything — inside a role="grid" that owned no rows at all, so the
       * structure was invalid and no position was ever conveyed. Selection is
       * a toggle (clicking the open element closes it), so aria-pressed is the
       * accurate state; aria-selected belongs to grid and listbox children.
       */
      aria-pressed={selected}
      tabIndex={tabStop === undefined ? undefined : tabStop ? 0 : -1}
      aria-label={`${element.z} ${element.symbol} ${name}`}
      onClick={() => onSelect(element.z)}
      style={{ ...background(fill), width: 'var(--cell)', height: 'var(--cell)' }}
      className={[
        'cell-morph relative block text-left overflow-hidden rounded hairline',
        fill.type === 'unknown' ? 'fill-unknown' : '',
        selected ? 'ring-2 ring-ink z-10' : '',
      ].join(' ')}
    >
      <span
        className="absolute font-mono tabular text-ink"
        style={{
          left: 'var(--cell-pad)',
          top: 'calc(var(--cell-pad) / 2)',
          fontSize: 'var(--cell-type-z)',
        }}
      >
        {element.z}
      </span>
      {fill.type === 'absent' ? (
        <span
          aria-hidden
          className="absolute font-mono text-ink"
          style={{
            right: 'var(--cell-pad)',
            top: 'calc(var(--cell-pad) / 2)',
            fontSize: 'var(--cell-type-glyph)',
          }}
        >
          {fill.glyph}
        </span>
      ) : null}
      <span
        className="absolute inset-x-0 text-center font-display font-semibold leading-none"
        style={{ top: 'var(--cell-symbol-top)', fontSize: 'var(--cell-type-symbol)' }}
      >
        {element.symbol}
      </span>
      <span
        className="absolute text-center leading-tight text-ink truncate"
        style={{
          left: 'calc(var(--cell-pad) / 2)',
          right: 'calc(var(--cell-pad) / 2)',
          top: 'var(--cell-name-top)',
          fontSize: 'var(--cell-type-name)',
        }}
      >
        {name}
      </span>
      <span
        className="absolute inset-x-0 text-center font-mono tabular text-ink"
        style={{ bottom: 'calc(var(--cell-pad) / 2)', fontSize: 'var(--cell-type-mass)' }}
      >
        {mass}
      </span>
    </button>
  )
})
