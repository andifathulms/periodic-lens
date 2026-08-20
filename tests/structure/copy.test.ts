/**
 * The copy scan. Invariants 11 and 12, in both locales.
 *
 * This project shows production share and cites hazard classification. It does
 * not advise, and it does not editorialise about mining — in either direction.
 * Those are boundaries a stray sentence can cross without anyone noticing, so
 * they are asserted rather than remembered.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) return walk(path)
    return /\.(tsx?|tsv|md)$/.test(entry) ? [path] : []
  })
}

const SOURCES = ['app', 'components', 'lib', 'data'].flatMap(walk)

/** Guidance language. Hazard as a cited fact is fine; telling a reader what to do is not. */
const SAFETY = [
  'first aid',
  'first-aid',
  'wear gloves',
  'protective equipment',
  'safe handling',
  'do not inhale',
  'pertolongan pertama',
  'gunakan sarung tangan',
]

/** Policy and advocacy language, in either direction. */
const POLICY = [
  'downstreaming',
  'hilirisasi',
  'export ban',
  'larangan ekspor',
  'environmental damage',
  'kerusakan lingkungan',
  'should invest',
  'seharusnya',
]

describe('copy boundaries', () => {
  it.each(SAFETY)('carries no safety guidance: %s', (phrase) => {
    const offenders = SOURCES.filter(
      (path) =>
        !path.includes('copy.test') &&
        !path.endsWith('data-validate.ts') &&
        readFileSync(path, 'utf8').toLowerCase().includes(phrase),
    )
    expect(offenders).toEqual([])
  })

  it.each(POLICY)('carries no mining-policy commentary: %s', (phrase) => {
    const offenders = SOURCES.filter(
      (path) =>
        !path.includes('copy.test') &&
        !path.endsWith('data-validate.ts') &&
        readFileSync(path, 'utf8').toLowerCase().includes(phrase),
    )
    expect(offenders).toEqual([])
  })

  it('scans a real set of files, so a passing run means something', () => {
    expect(SOURCES.length).toBeGreaterThan(20)
  })
})
