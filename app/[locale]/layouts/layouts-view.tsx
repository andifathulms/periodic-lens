'use client'

import { useState } from 'react'
import { TableGrid } from '@/components/grid/table-grid'
import { LensLegend } from '@/components/legend/lens-legend'
import { LayoutSwitcher } from '@/components/switcher/controls'
import type { LayoutId } from '@/lib/elements/layout'
import type { Locale } from '@/lib/i18n'

/**
 * PRD.md §6 — the point is not novelty. The standard table is a convention
 * rather than a law, and the left-step form makes the filling logic more
 * obvious than the standard one does.
 *
 * The lens is fixed to block here on purpose: colour holds while position
 * moves (invariant 13), so there is only ever one variable travelling.
 */
export function LayoutsView({ locale }: { locale: Locale }) {
  const [layout, setLayout] = useState<LayoutId>('left-step')
  const [selected, setSelected] = useState<number | undefined>(undefined)
  return (
    <div className="flex flex-col gap-24">
      <LayoutSwitcher layout={layout} onChange={setLayout} locale={locale} />
      {/* DESIGN.md §8 — the legend is not optional, and this page colours 118
          cells. The lens is fixed to block here, so the legend names block. */}
      <LensLegend lens="block" locale={locale} />
      <TableGrid
        lens="block"
        layout={layout}
        locale={locale}
        selected={selected}
        onSelect={(z) => setSelected((current) => (current === z ? undefined : z))}
      />
    </div>
  )
}
