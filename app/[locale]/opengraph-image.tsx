import { ImageResponse } from 'next/og'
import { LOCALES, type Locale, isLocale, t, DEFAULT_LOCALE } from '@/lib/i18n'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic = 'force-static'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default function Image({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : DEFAULT_LOCALE
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: '#F7F6F2',
          color: '#1B1D1C',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 600 }}>{t(locale, 'site.name')}</div>
        <div style={{ fontSize: 36, marginTop: 24, color: '#6E706B' }}>
          {t(locale, 'site.tagline')}
        </div>
      </div>
    ),
    size,
  )
}
