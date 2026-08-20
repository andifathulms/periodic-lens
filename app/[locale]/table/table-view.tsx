'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { DiscoveryTimeline } from '@/components/grid/discovery-timeline'
import { Topography } from '@/components/grid/topography'
import { LensLegend } from '@/components/legend/lens-legend'
import { ElementPanel } from '@/components/panel/element-panel'
import { TableGrid } from '@/components/grid/table-grid'
import { LayoutSwitcher, LensSwitcher, ViewSwitcher } from '@/components/switcher/controls'
import { ElementTextTable } from '@/components/table-text/element-table'
import { LENS_IDS, type LensId } from '@/lib/elements/lens'
import { LAYOUT_IDS, type LayoutId } from '@/lib/elements/layout'
import { VIEW_IDS, type ViewId, resolve } from '@/lib/elements/view'
import { type Locale, t } from '@/lib/i18n'

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
  const [view, setView] = useState<ViewId>('grid')
  const [selected, setSelected] = useState<number | undefined>(undefined)

  /*
   * The view is resolved, never trusted. If the lens changes to a categorical
   * one while topography is showing, the view falls back to the grid rather
   * than rendering height over an ordering that does not exist.
   */
  const active = resolve(view, lens)

  /* Read the ids back out of the URL on mount; static export, so no router. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlLens = params.get('lens')
    const urlLayout = params.get('layout')
    const urlView = params.get('view')
    /* An element is part of the state a reader wants to send someone. */
    const urlZ = Number(params.get('z'))
    if (Number.isInteger(urlZ) && urlZ >= 1 && urlZ <= 118) setSelected(urlZ)
    if (urlView && (VIEW_IDS as readonly string[]).includes(urlView)) setView(urlView as ViewId)
    if (urlLens && (LENS_IDS as readonly string[]).includes(urlLens)) setLens(urlLens as LensId)
    if (urlLayout && (LAYOUT_IDS as readonly string[]).includes(urlLayout)) {
      setLayout(urlLayout as LayoutId)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set('lens', lens)
    params.set('layout', layout)
    params.set('view', active)
    if (selected === undefined) params.delete('z')
    else params.set('z', String(selected))
    window.history.replaceState(null, '', `?${params.toString()}`)
  }, [lens, layout, active, selected])

  const select = useCallback((z: number) => {
    setSelected((current) => (current === z ? undefined : z))
  }, [])

  return (
    <div className="mx-auto max-w-[1440px] px-16 py-24">
      {/*
       * The table is still the page (DESIGN.md §6), but a reader arriving cold
       * met a grid and sixteen buttons with nothing naming the product or its
       * two reasons for existing. Four lines and two links, then the
       * instrument — the tagline already existed and shipped nowhere a first
       * visitor would see it.
       */}
      <header className="flex max-w-[70ch] flex-col gap-4 sm:gap-8">
        {/*
         * Every step is one size smaller below sm. On a 375px screen the full
         * desktop stack — heading, tagline, lead, links, seventeen controls,
         * legend — put the first cell about 560px down, and "the table is the
         * page" (DESIGN.md §6) stopped being true exactly where it matters
         * most. Nothing is hidden; it is set tighter.
         */}
        <h1 className="font-display text-title sm:text-page font-semibold leading-tight">
          {t(locale, 'site.name')}
        </h1>
        <p className="text-lead sm:text-title">{t(locale, 'site.tagline')}</p>
        <p className="text-micro sm:text-body text-muted">{t(locale, 'site.lead')}</p>
        <p className="mt-4 flex flex-wrap gap-x-24 gap-y-8 text-body">
          <Link
            href={`/${locale}/build`}
            className="underline underline-offset-4 hover:decoration-2"
          >
            {t(locale, 'site.toBuild')} →
          </Link>
          <Link
            href={`/${locale}/indonesia`}
            className="underline underline-offset-4 hover:decoration-2"
          >
            {t(locale, 'site.toIndonesia')} →
          </Link>
        </p>
      </header>

      {/* Lens leads; layout and view are adjustments and share a row. */}
      <div className="mt-16 sm:mt-24 flex flex-col gap-8 sm:gap-12 border-t border-rule pt-12 sm:pt-16">
        <LensSwitcher lens={lens} onChange={setLens} locale={locale} />
        <div className="flex flex-wrap items-baseline gap-x-32 gap-y-12">
          <LayoutSwitcher layout={layout} onChange={setLayout} locale={locale} />
          <ViewSwitcher view={active} lens={lens} onChange={setView} locale={locale} />
        </div>
        <p className="max-w-[70ch] text-micro text-muted">{t(locale, 'table.hint')}</p>
      </div>

      <div className="mt-16 flex flex-col gap-24 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-12">
          {/*
           * The legend reads before the thing it keys, not after it. Below 118
           * cells it sat under the fold, so the colours arrived with no key.
           */}
          <LensLegend lens={lens} locale={locale} />
          {active === 'grid' ? (
            <TableGrid
              lens={lens}
              layout={layout}
              locale={locale}
              selected={selected}
              onSelect={select}
            />
          ) : null}
          {active === 'topography' ? (
            <Topography lens={lens} locale={locale} selected={selected} onSelect={select} />
          ) : null}
          {active === 'timeline' ? (
            <DiscoveryTimeline
              lens={lens}
              locale={locale}
              selected={selected}
              onSelect={select}
            />
          ) : null}
          {active !== 'grid' ? (
            <p className="max-w-[70ch] text-micro text-muted">
              {t(locale, `view.${active}Note`)}
            </p>
          ) : null}
        </div>
        {selected !== undefined ? (
          <ElementPanel
            z={selected}
            lens={lens}
            locale={locale}
            onClose={() => setSelected(undefined)}
          />
        ) : (
          /*
           * The panel's own slot, saying what it is for. Nothing previously
           * hinted that a cell was clickable. Desktop only — on mobile the
           * panel is a bottom sheet over the table, so a reserved column there
           * would be a block of empty space above the grid.
           */
          <p className="hidden text-micro text-muted lg:block lg:w-[360px] lg:shrink-0 lg:rounded lg:border lg:border-rule lg:p-16">
            {t(locale, 'panel.empty')}
          </p>
        )}
      </div>

      <ElementTextTable lens={lens} locale={locale} />
    </div>
  )
}
