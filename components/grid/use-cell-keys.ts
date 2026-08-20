'use client'

import { useCallback, useRef, useState } from 'react'
import { ELEMENTS } from '@/lib/elements/data'
import { type LayoutId, position } from '@/lib/elements/layout'

/**
 * Arrow-key movement over absolutely positioned cells, plus the roving tab
 * stop it requires.
 *
 * Both cell views place 118 buttons by coordinate rather than in document
 * order, so Tab order and visual order diverge — the grid had arrow keys to
 * reconcile them and topography had none, which left it with 118 tab stops
 * running in atomic-number order across a relief map. One implementation,
 * because it is one behaviour.
 *
 * Nothing here decides what a cell looks like or where it goes; positions come
 * from lib/elements/layout, which stays the only source of them.
 */
export function useCellKeys(layout: LayoutId, selected: number | undefined) {
  const container = useRef<HTMLUListElement>(null)
  const [rover, setRover] = useState(1)

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
      container.current?.querySelector<HTMLElement>(`[data-z="${best.z}"]`)?.focus()
    },
    [layout],
  )

  return { container, onKeyDown, tabStop: selected ?? rover }
}
