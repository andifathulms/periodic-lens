/**
 * The aufbau (Madelung n+l) rule.
 *
 * Invariant 3: this module drives the build animation and the exception test.
 * It NEVER supplies a configuration for display. Displayed configurations come
 * from data/configurations/published.tsv, anomalies included.
 */
import type { Block, Subshell } from './types'

/** Subshell capacity: s 2, p 6, d 10, f 14. DESIGN.md §2 — this is the shape. */
export const CAPACITY: Readonly<Record<Block, number>> = {
  s: 2,
  p: 6,
  d: 10,
  f: 14,
}

const L_INDEX: Readonly<Record<Block, number>> = { s: 0, p: 1, d: 2, f: 3 }

/**
 * Filling order by increasing n+l, then increasing n (Madelung's rule).
 * Generated once here rather than typed out, because the ORDER is the rule —
 * the thing the animation is teaching. The configurations it predicts are
 * never stored.
 */
export const FILLING_ORDER: readonly Omit<Subshell, 'electrons'>[] = (() => {
  const shells: { n: number; l: Block }[] = []
  for (let n = 1; n <= 8; n += 1) {
    for (const l of ['s', 'p', 'd', 'f'] as const) {
      if (L_INDEX[l] < n) shells.push({ n, l })
    }
  }
  return shells.sort((a, b) => {
    const sumA = a.n + L_INDEX[a.l]
    const sumB = b.n + L_INDEX[b.l]
    return sumA === sumB ? a.n - b.n : sumA - sumB
  })
})()

/** The rule's prediction for Z electrons. Animation and test only. */
export function predict(z: number): Subshell[] {
  if (!Number.isInteger(z) || z < 1) throw new Error(`invalid atomic number: ${z}`)
  let remaining = z
  const out: Subshell[] = []
  for (const shell of FILLING_ORDER) {
    if (remaining <= 0) break
    const electrons = Math.min(CAPACITY[shell.l], remaining)
    out.push({ ...shell, electrons })
    remaining -= electrons
  }
  if (remaining > 0) throw new Error(`filling order exhausted at Z=${z}`)
  return out
}

/**
 * The subshell the rule fills at Z, and how far into it Z sits.
 *
 * This is the differentiating electron, and it is where the table's SHAPE
 * comes from: s two wide, p six, d ten, f fourteen. layout.ts builds every
 * position from it, so the grid is not a picture of the table — it is the
 * filling order drawn out. PRD.md §5.
 *
 * Note this uses the RULE, not the published configuration. Chromium's
 * published 3d5 4s1 does not move chromium out of the d-block.
 */
export function differentiating(z: number): { n: number; l: Block; index: number } {
  const filled = predict(z)
  const last = filled[filled.length - 1]
  if (!last) throw new Error(`no subshell for Z=${z}`)
  return { n: last.n, l: last.l, index: last.electrons }
}

/** s, p, d or f, from the rule. */
export function blockOf(z: number): Block {
  return differentiating(z).l
}

/**
 * Why the element sits where it sits, as structured facts rather than prose.
 *
 * Every field here comes from the RULE, not from the stored record: the
 * differentiating electron is what puts an element in its block, and the block
 * is as wide as the subshell is deep. That is the whole shape argument (PRD.md
 * §5) narrowed to one cell.
 *
 * `conventional` marks the single element whose POSITION contradicts this
 * derivation: helium is s-block by configuration and sits with the noble gases
 * by chemical convention. It is not an error in the data and it is asserted in
 * tests/structure — see the method page.
 */
export function positionRationale(z: number): {
  block: Block
  n: number
  l: Block
  index: number
  capacity: number
  conventional: boolean
} {
  const { n, l, index } = differentiating(z)
  return { block: l, n, l, index, capacity: CAPACITY[l], conventional: z === 2 }
}

/** Sort into shell order for notation: by n, then by l. */
export function inShellOrder(subshells: readonly Subshell[]): Subshell[] {
  return [...subshells].sort((a, b) =>
    a.n === b.n ? L_INDEX[a.l] - L_INDEX[b.l] : a.n - b.n,
  )
}

const NOBLE_CORES: readonly { z: number; symbol: string }[] = [
  { z: 86, symbol: 'Rn' },
  { z: 54, symbol: 'Xe' },
  { z: 36, symbol: 'Kr' },
  { z: 18, symbol: 'Ar' },
  { z: 10, symbol: 'Ne' },
  { z: 2, symbol: 'He' },
]

/**
 * Render subshells in the published notation style, e.g. "[Ar] 3d5 4s1".
 *
 * The core is subtracted by subshell, not by prefix: cerium's 4f1 sits before
 * 5s in shell order, so a running-total approach would never land exactly on
 * xenon and would print all fourteen subshells.
 */
export function format(subshells: readonly Subshell[]): string {
  const ordered = inShellOrder(subshells).filter((s) => s.electrons > 0)
  const total = ordered.reduce((sum, s) => sum + s.electrons, 0)
  for (const core of NOBLE_CORES) {
    if (core.z >= total) continue
    const coreShells = predict(core.z)
    const complete = coreShells.every((c) =>
      ordered.some((s) => s.n === c.n && s.l === c.l && s.electrons === c.electrons),
    )
    if (!complete) continue
    const tail = ordered.filter(
      (s) => !coreShells.some((c) => c.n === s.n && c.l === s.l),
    )
    return `[${core.symbol}] ${tail.map((s) => `${s.n}${s.l}${s.electrons}`).join(' ')}`
  }
  return ordered.map((s) => `${s.n}${s.l}${s.electrons}`).join(' ')
}

/**
 * The documented exception list — the elements whose published ground-state
 * configuration disagrees with the Madelung prediction.
 *
 * Source: CRC Handbook of Chemistry and Physics, 104th ed. (2023), "Electron
 * Configuration of Neutral Atoms in the Ground State"; NIST Atomic Spectra
 * Database ground levels. Lawrencium's 7s2 7p1 assignment follows Sato et al.,
 * Nature 520, 209 (2015).
 *
 * The test asserts this set both ways: the rule must fail HERE and nowhere
 * else. Do not edit this list to make a test pass.
 */
export const AUFBAU_EXCEPTIONS: readonly number[] = [
  24, // Cr  [Ar] 3d5 4s1
  29, // Cu  [Ar] 3d10 4s1
  41, // Nb  [Kr] 4d4 5s1
  42, // Mo  [Kr] 4d5 5s1
  44, // Ru  [Kr] 4d7 5s1
  45, // Rh  [Kr] 4d8 5s1
  46, // Pd  [Kr] 4d10
  47, // Ag  [Kr] 4d10 5s1
  57, // La  [Xe] 5d1 6s2
  58, // Ce  [Xe] 4f1 5d1 6s2
  64, // Gd  [Xe] 4f7 5d1 6s2
  78, // Pt  [Xe] 4f14 5d9 6s1
  79, // Au  [Xe] 4f14 5d10 6s1
  89, // Ac  [Rn] 6d1 7s2
  90, // Th  [Rn] 6d2 7s2
  91, // Pa  [Rn] 5f2 6d1 7s2
  92, // U   [Rn] 5f3 6d1 7s2
  93, // Np  [Rn] 5f4 6d1 7s2
  96, // Cm  [Rn] 5f7 6d1 7s2
  103, // Lr [Rn] 5f14 7s2 7p1
]

/**
 * The notation the RULE predicts for Z. Invariant 3, read carefully.
 *
 * This is not a configuration and must never be displayed as one. It exists so
 * the twenty documented exceptions can be shown as what they are — a rule and
 * a measurement disagreeing — instead of as an unsupported claim that they
 * disagree. Every display site is required to render it beside the published
 * value, labelled as the prediction, and only for elements in
 * AUFBAU_EXCEPTIONS, where it is by definition the wrong answer.
 *
 * There is deliberately no path from here to element.configuration: displayed
 * configurations come from data/configurations/published.tsv, always.
 */
export function predictedNotation(z: number): string {
  return format(predict(z))
}

/** Parse a published notation string into subshells, expanding the core. */
export function parseNotation(notation: string): Subshell[] {
  const coreMatch = notation.match(/^\[([A-Z][a-z]?)\]\s*/)
  const out: Subshell[] = []
  let rest = notation
  if (coreMatch) {
    const symbol = coreMatch[1]
    const core = NOBLE_CORES.find((c) => c.symbol === symbol)
    if (!core) throw new Error(`unknown noble-gas core: ${symbol}`)
    out.push(...predict(core.z))
    rest = notation.slice(coreMatch[0].length)
  }
  for (const token of rest.split(/\s+/).filter(Boolean)) {
    const m = token.match(/^(\d)([spdf])(\d{1,2})$/)
    if (!m) throw new Error(`unparseable subshell: ${token}`)
    out.push({ n: Number(m[1]), l: m[2] as Block, electrons: Number(m[3]) })
  }
  return inShellOrder(out)
}

/** Compare two configurations by subshell occupancy, ignoring notation style. */
export function sameConfiguration(
  a: readonly Subshell[],
  b: readonly Subshell[],
): boolean {
  const key = (s: readonly Subshell[]) =>
    inShellOrder(s)
      .filter((x) => x.electrons > 0)
      .map((x) => `${x.n}${x.l}${x.electrons}`)
      .join(' ')
  return key(a) === key(b)
}
