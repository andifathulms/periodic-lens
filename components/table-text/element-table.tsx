'use client'

import { useMemo, useState } from 'react'
import { ELEMENTS } from '@/lib/elements/data'
import { type LensId, textValue } from '@/lib/elements/lens'
import { isKnown } from '@/lib/elements/unknown'
import { type Locale, t, term } from '@/lib/i18n'

/**
 * DESIGN.md §9 — the full element table as text, always present and never a
 * fallback. Colour is the risk with 118 cells across ten lenses, so every lens
 * has this text channel beside it.
 *
 * Unknown reads "not known" here for the same reason it hatches in the grid:
 * an empty cell would look like a small value.
 */
type Column = 'z' | 'symbol' | 'name' | 'mass' | 'lens'

export function ElementTextTable({ lens, locale }: { lens: LensId; locale: Locale }) {
  const [sort, setSort] = useState<Column>('z')

  const rows = useMemo(() => {
    const decorated = ELEMENTS.map((element) => {
      const value = textValue(lens, element)
      return {
        element,
        name: locale === 'id' ? element.nameId : element.name,
        lensText: isKnown(value)
          ? `${typeof value.value === 'number' ? value.value : term(locale, value.value)} ${value.unit}`.trim()
          : t(locale, 'legend.unknown'),
        lensSort: isKnown(value) && typeof value.value === 'number' ? value.value : undefined,
      }
    })
    return decorated.sort((a, b) => {
      switch (sort) {
        case 'symbol':
          return a.element.symbol.localeCompare(b.element.symbol)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'mass': {
          const am = isKnown(a.element.mass) ? a.element.mass.value : 0
          const bm = isKnown(b.element.mass) ? b.element.mass.value : 0
          return am - bm
        }
        case 'lens':
          // Unknowns sort to the end rather than to the bottom of the range,
          // so the ordering never implies a value.
          if (a.lensSort === undefined && b.lensSort === undefined) return a.element.z - b.element.z
          if (a.lensSort === undefined) return 1
          if (b.lensSort === undefined) return -1
          return a.lensSort - b.lensSort
        case 'z':
        default:
          return a.element.z - b.element.z
      }
    })
  }, [lens, locale, sort])

  const headers: { key: Column; label: string }[] = [
    { key: 'z', label: 'Z' },
    { key: 'symbol', label: 'Symbol' },
    { key: 'name', label: locale === 'id' ? 'Nama' : 'Name' },
    { key: 'mass', label: locale === 'id' ? 'Massa' : 'Mass' },
    { key: 'lens', label: t(locale, `lens.${lens}`) },
  ]

  return (
    <section className="mt-48">
      <h2 className="font-display text-22 font-semibold">{t(locale, 'text.heading')}</h2>
      <p className="text-14 text-muted mt-4">{t(locale, 'text.note')}</p>
      <div className="mt-12 overflow-x-auto">
        <table className="w-full text-16 border-collapse">
          <thead>
            <tr className="border-b border-rule text-left">
              {headers.map((header) => (
                <th
                  key={header.key}
                  scope="col"
                  /* aria-sort belongs to the column header, not to the control inside it. */
                  aria-sort={sort === header.key ? 'ascending' : 'none'}
                  className="py-8 pr-16 font-semibold"
                >
                  <button
                    type="button"
                    onClick={() => setSort(header.key)}
                    className={sort === header.key ? 'underline' : 'hover:underline'}
                  >
                    {header.label}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ element, name, lensText }) => (
              <tr key={element.z} className="border-b border-rule">
                <td className="py-4 pr-16 font-mono tabular">{element.z}</td>
                <td className="py-4 pr-16 font-display">{element.symbol}</td>
                <td className="py-4 pr-16">{name}</td>
                <td className="py-4 pr-16 font-mono tabular">
                  {isKnown(element.mass) ? element.mass.value : t(locale, 'legend.unknown')}
                </td>
                <td className="py-4 pr-16 font-mono tabular">{lensText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
