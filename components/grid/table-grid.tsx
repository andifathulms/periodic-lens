'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ElementCell } from '@/components/cell/element-cell'
import { ELEMENTS } from '@/lib/elements/data'
import { type Fill, type LensId, domain, fill } from '@/lib/elements/lens'
import { type LayoutId, extent, position } from '@/lib/elements/layout'
import { type Locale, t } from '@/lib/i18n'

/**
 * 118 cells, one active lens, absolutely placed.
 *
 * Absolute placement is what lets a layout change move cells along eased paths
 * while their colours hold — invariant 13, one variable at a time. It is also
 * why the grid never reflows into a list on mobile (invariant 16): the shape
 * is the subject, so the container scrolls instead.
 */
export function TableGrid({
  lens,
  layout,
  locale,
  selected,
  onSelect,
}: {
  lens: LensId
  layout: LayoutId
  locale: Locale
  selected: number | undefined
  onSelect: (z: number) => void
}) {
  const scale = domain(lens, ELEMENTS)
  const box = extent(layout)
  const container = useRef<HTMLUListElement>(null)

  /*
   * The roving tab stop. Hydrogen holds it until the reader moves, and the
   * selected element takes it whenever there is one, so returning to the grid
   * by Tab lands where they left off rather than at the beginning.
   */
  const [rover, setRover] = useState(1)
  const tabStop = selected ?? rover

  /** Arrow keys walk the grid in grid order (DESIGN.md §9). */
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLUListElement>) => {
      const active = document.activeElement as HTMLElement | null
      const z = Number(active?.dataset?.z)
      if (!z) return
      const here = position(layout, z)
      const deltas: Record<string, [number, number]> = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      }
      const delta = deltas[event.key]
      if (!delta) return
      event.preventDefault()
      let best: { z: number; distance: number } | undefined
      for (const element of ELEMENTS) {
        if (element.z === z) continue
        const there = position(layout, element.z)
        const dx = there.x - here.x
        const dy = there.y - here.y
        if (dx * delta[0] + dy * delta[1] <= 0) continue
        const distance = Math.hypot(dx, dy) + Math.abs(dx * delta[1] + dy * delta[0]) * 4
        if (!best || distance < best.distance) best = { z: element.z, distance }
      }
      if (!best) return
      setRover(best.z)
      container.current
        ?.querySelector<HTMLElement>(`[data-z="${best.z}"]`)
        ?.focus()
    },
    [layout],
  )

  useEffect(() => {
    if (selected === undefined) return
    container.current?.querySelector<HTMLElement>(`[data-z="${selected}"]`)?.focus()
  }, [selected])

  return (
    <div className="overflow-x-auto">
      <ul
        ref={container}
        /*
         * A labelled list of buttons, which is what this is. It was a
         * role="grid" whose gridcells were not inside any role="row", so the
         * required owned structure was missing and readers got no row or
         * column position from it. role="list" is here only because Tailwind's
         * preflight sets list-style: none, which makes Safari drop list
         * semantics — it restores a native role rather than inventing one.
         */
        role="list"
        aria-label={t(locale, 'view.gridRegion')}
        onKeyDown={onKeyDown}
        className="relative"
        style={{
          width: `calc(${box.width} * var(--cell))`,
          height: `calc(${box.height} * var(--cell))`,
        }}
      >
        {ELEMENTS.map((element) => {
          const point = position(layout, element.z)
          const paint: Fill = fill(lens, element, scale)
          return (
            <li
              key={element.z}
              className="cell-travel absolute left-0 top-0"
              style={{
                transform: `translate(calc(${point.x} * var(--cell)), calc(${point.y} * var(--cell)))`,
              }}
            >
              <ElementCell
                element={element}
                fill={paint}
                locale={locale}
                selected={selected === element.z}
                tabStop={element.z === tabStop}
                onSelect={onSelect}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
