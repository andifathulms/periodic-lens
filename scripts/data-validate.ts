/**
 * Gate the build. CLAUDE.md: this runs before every `pnpm build` and in CI.
 *
 * It checks what the type system cannot: that the emitted table is in step
 * with the TSVs it came from, that every licence and citation is present, that
 * every USGS figure is dated and staged, and that no unknown has been quietly
 * turned into a number somewhere along the way.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { tableSchema } from '../lib/elements/schema'
import { LICENCES } from '../lib/elements/sources'

const root = join(__dirname, '..')
const failures: string[] = []

function check(condition: boolean, message: string) {
  if (!condition) failures.push(message)
}

// Determinism: rebuilding from the same TSVs must reproduce the emitted file
// byte for byte (PRD.md §12).
const before = readFileSync(join(root, 'data/generated/elements.json'), 'utf8')
execFileSync('node', ['--import', 'tsx', join(root, 'scripts/data-build.ts')], {
  cwd: root,
  stdio: 'ignore',
})
const after = readFileSync(join(root, 'data/generated/elements.json'), 'utf8')
check(before === after, 'data/generated/elements.json is stale — run pnpm data:build')

const table = tableSchema.parse(JSON.parse(after))

check(table.elements.length === 118, 'the table must contain exactly 118 elements')

const seen = new Set<number>()
for (const element of table.elements) {
  check(!seen.has(element.z), `duplicate atomic number ${element.z}`)
  seen.add(element.z)
}
for (let z = 1; z <= 118; z += 1) {
  check(seen.has(z), `missing atomic number ${z}`)
}

// Invariant 4 — a property without a source does not ship.
for (const element of table.elements) {
  const properties = [
    ['mass', element.mass],
    ['discovery', element.discovery],
    ['electronegativity', element.electronegativity],
    ['atomicRadius', element.atomicRadius],
    ['ionisationEnergy', element.ionisationEnergy],
    ['meltingPoint', element.meltingPoint],
    ['density', element.density],
  ] as const
  for (const [name, property] of properties) {
    if (property.type === 'known') {
      check(
        property.source.cite.length > 8,
        `${element.symbol}: ${name} has no usable citation`,
      )
    }
  }
  check(
    element.configuration.source.cite.length > 8,
    `${element.symbol}: configuration has no citation`,
  )
}

// Invariant 10 — never an undated production number, and never one without a stage.
for (const element of table.elements) {
  if (element.production.type === 'not-produced') {
    check(
      element.production.edition === table.usgsEdition,
      `${element.symbol}: a reported absence must name its edition`,
    )
  }
  if (element.production.type !== 'produced') continue
  const p = element.production.production
  check(p.edition === table.usgsEdition, `${element.symbol}: production edition mismatch`)
  check(p.dataYear < p.edition, `${element.symbol}: data year must precede the edition`)
  check(
    p.stage === 'mined' || p.stage === 'refined',
    `${element.symbol}: production stage must be stated`,
  )
  check(p.share > 0, `${element.symbol}: a produced element must have a share above zero`)
}

check(LICENCES.length >= 3, 'every dataset must carry a licence line')
for (const licence of LICENCES) {
  check(licence.url.startsWith('https://'), `${licence.dataset}: licence needs a URL`)
  check(licence.licence.length > 10, `${licence.dataset}: licence text is too thin`)
}

// PRD.md §7 / invariants 11 and 12 — no policy commentary, no safety
// guidance, in either locale. Scanned over SHIPPED copy only: tests/ names the
// banned phrases on purpose, and scanning them would make the check
// self-defeating. tests/structure/copy.test.ts is the fuller scan.
const copy = execFileSync(
  'bash',
  [
    '-lc',
    "grep -ril --include='*.tsx' --include='*.ts' --include='*.tsv' -e 'first aid' -e 'wear gloves' -e 'downstreaming' -e 'hilirisasi' -e 'export ban' app components lib data || true",
  ],
  { cwd: root },
)
  .toString()
  .trim()
check(copy === '', `policy or safety language found in: ${copy}`)

if (failures.length > 0) {
  console.error('data:validate FAILED')
  for (const failure of failures) console.error(`  · ${failure}`)
  process.exit(1)
}
console.log(`data:validate — 118 elements, ${LICENCES.length} licences, USGS ${table.usgsEdition}`)
