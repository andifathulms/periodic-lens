/**
 * GitHub Pages serves through Jekyll unless told not to, and Jekyll drops
 * directories beginning with an underscore — which is where Next puts every
 * chunk. PRD.md §15: .nojekyll must exist in the output root.
 *
 * This also replaces the three redirect stubs. `redirect()` in a statically
 * exported page does not produce a redirect: it emits an error shell —
 * <html id="__next_error__"> — with no visible text and no meta refresh, which
 * only reaches the real page if JavaScript runs. So the root of the site, the
 * URL anyone actually shares, was blank to a crawler, a link-preview bot and
 * a reader without JS. Measured on the live site, not inferred.
 *
 * A static page with a meta refresh and a real link is crawlable, needs no
 * JavaScript, and lands the reader in the same place just as fast.
 */
import { writeFileSync, existsSync, renameSync } from 'node:fs'
import { join } from 'node:path'
import { LOCALES, DEFAULT_LOCALE, t } from '../lib/i18n/index.ts'

const out = join(process.cwd(), 'out')
if (!existsSync(out)) {
  console.error('postbuild: ./out does not exist — did next build run?')
  process.exit(1)
}
writeFileSync(join(out, '.nojekyll'), '')

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '/periodic-lens'
const SITE = 'https://andifathulms.github.io'

/** The copy comes from the dictionary the pages render, never a second copy. */
function stub(locale, target) {
  const href = `${base}/${target}/`
  const title = t(locale, 'site.name')
  const tagline = t(locale, 'site.tagline')
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="refresh" content="0; url=${href}">
<title>${title}</title>
<meta name="description" content="${tagline}">
<link rel="canonical" href="${SITE}${href}">
${LOCALES.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}${base}/${l}/table/">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${SITE}${base}/${DEFAULT_LOCALE}/table/">
</head>
<body>
<h1>${title}</h1>
<p>${tagline}</p>
<p><a href="${href}">${title}</a></p>
</body>
</html>
`
}

/*
 * The generated Open Graph images land without a file extension because the
 * route sits inside the [locale] segment. GitHub Pages then serves them with a
 * MIME type no scraper treats as an image, so they get a name that says what
 * they are. Page metadata points at the renamed path.
 */
for (const locale of LOCALES) {
  const from = join(out, locale, 'opengraph-image')
  if (existsSync(from)) renameSync(from, join(out, locale, 'opengraph-image.png'))
}

const stubs = [
  ['index.html', DEFAULT_LOCALE, `${DEFAULT_LOCALE}/table`],
  ...LOCALES.map((l) => [`${l}/index.html`, l, `${l}/table`]),
]
for (const [file, locale, target] of stubs) {
  writeFileSync(join(out, file), stub(locale, target))
}

console.log(
  `postbuild — .nojekyll, ${stubs.length} crawlable redirect stubs, ${LOCALES.length} og images named`,
)
