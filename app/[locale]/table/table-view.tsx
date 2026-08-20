'use client'

import { useCallback, useEffect, useState } from 'react'
import { LensLegend } from '@/components/legend/lens-legend'
import { ElementPanel } from '@/components/panel/element-panel'
import { TableGrid } from '@/components/grid/table-grid'
import { LayoutSwitcher, LensSwitcher } from '@/components/switcher/controls'
import { ElementTextTable } from '@/components/table-text/element-table'
import { LENS_IDS, type LensId } from '@/lib/elements/lens'
import { LAYOUT_IDS, type LayoutId } from '@/lib/elements/layout'
import type { Locale } from '@/lib/i18n'

/**
 * The table is the page (DESIGN.md §6).
 *
 * Exactly one lens and exactly one layout are held in state, which is how
 * invariant 1 is enforced at runtime as well as in the type. Both appear in
 * the URL because their ids are stable and readable (CLAUDE.md conventions).
 */
export function TableView({
  locale,
  initialLens = 'category',
  initialLayout = 'standard',
}: {
  locale: Locale
  initialLens?: LensId
  initialLayout?: LayoutId
}) {
  const [lens, setLens] = useState<LensId>(initialLens)
  const [layout, setLayout] = useState<LayoutId>(initialLayout)
  const [selected, setSelected] = useState<number | undefined>(undefined)

  /* Read the ids back out of the URL on mount; static export, so no router. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlLens = params.get('lens')
    const urlLayout = params.get('layout')
    if (urlLens && (LENS_IDS as readonly string[]).includes(urlLens)) setLens(urlLens as LensId)
    if (urlLayout && (LAYOUT_IDS as readonly string[]).includes(urlLayout)) {
      setLayout(urlLayout as LayoutId)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set('lens', lens)
    params.set('layout', layout)
    window.history.replaceState(null, '', `?${params.toString()}`)
  }, [lens, layout])

  const select = useCallback((z: number) => {
    setSelected((current) => (current === z ? undefined : z))
  }, [])

  return (
    <div className="mx-auto max-w-[1440px] px-16 py-24">
      <div className="flex flex-col gap-12">
        <LensSwitcher lens={lens} onChange={setLens} locale={locale} />
        <LayoutSwitcher layout={layout} onChange={setLayout} locale={locale} />
      </div>

      <div className="mt-24 flex flex-col gap-24 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <TableGrid
            lens={lens}
            layout={layout}
            locale={locale}
            selected={selected}
            onSelect={select}
          />
          <LensLegend lens={lens} locale={locale} />
        </div>
        {selected !== undefined ? (
          <ElementPanel
            z={selected}
            lens={lens}
            locale={locale}
            onClose={() => setSelected(undefined)}
          />
        ) : null}
      </div>

      <ElementTextTable lens={lens} locale={locale} />
    </div>
  )
}
