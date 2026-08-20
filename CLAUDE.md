# CLAUDE.md — Periodic Lens

Interactive periodic table built around two things nobody else does: an animation explaining why the table has its shape, and a lens showing Indonesia's share of world production per element. Static site, GitHub Pages, no backend, no runtime network.

Read `PRD.md` before starting any task, and **`DESIGN.md` before writing any UI** — it opens with the shared house layer used across these projects.

**Five things shape everything:**

1. **Ptable exists and is very good.** A clone is pointless. The shape explanation and the Indonesian layer are the reasons this project exists, and both are milestones rather than stretch goals.
2. **One lens at a time.** 118 cells with multiple encodings competing is unreadable noise — the failure mode of most flashy periodic table apps. Colour is a swappable channel, never accumulated decoration.
3. **Unknown is not zero.** Many properties are not known for the superheavy elements. Unknown has one appearance across every lens, and it is never a ramp position.
4. **Configurations are published data, not derived.** The aufbau rule drives the animation; the stored values come from published sources, anomalies included.
5. **English primary, Indonesian secondary** — reversed from the sibling projects. Chemical terms stay international in both locales.

---

## Stack

- Next.js 14, App Router, `output: 'export'` — static only
- TypeScript, `strict: true`
- Tailwind CSS, tokens from `DESIGN.md`
- Zod for element data and lens scale validation
- Vitest
- pnpm
- **No charting library, no chemistry library, no component library.**
- Fonts via `next/font`, self-hosted.

## Commands

```bash
pnpm dev
pnpm build                  # static export; runs data:validate first
pnpm preview                # serve ./out under the production basePath
pnpm test                   # vitest watch
pnpm test:run               # vitest once — before every commit
pnpm test:config            # all 118 configurations vs published values
pnpm test:aufbau            # rule predictions vs the documented exception list
pnpm test:structure         # period lengths, block widths, layout completeness
pnpm test:lens              # unknown handling, ramp monotonicity, contrast
pnpm data:build             # merge datasets, mark unknowns, emit table + scales
pnpm data:validate          # licences, citations, USGS edition, completeness
pnpm typecheck
pnpm lint
```

All four test suites and `data:validate` gate the build and CI.

## Layout

```
app/
  [locale]/                 # en (default), id
    table/                  # the grid + lens + detail panel
    build/                  # the orbital-filling animation
    layouts/                # standard, Janet left-step, Benfey spiral
    indonesia/              # production lens context
    method/                 # datasets, licences, citations, unknown policy
components/
  grid/                     # 118 cells, lens fill, layout positions
  cell/                     # number, symbol, name, mass
  legend/                   # active lens, scale, unknown swatch
  panel/                    # element detail — side panel, never modal
  build/                    # filling animation + aufbau exception toggle
  switcher/                 # lens and layout controls, labelled
  table-text/               # sortable text equivalent of the grid
lib/
  elements/                 # THE CORE. Pure. Runs in Node.
    data.ts                 # merged element records
    unknown.ts              # unknown classification — ONE definition
    lens.ts                 # value → scale position per lens
    layout.ts               # element → position per layout
    aufbau.ts               # the RULE — used for animation and for the exception test
data/
  elements/                 # merged dataset + per-field sources
  configurations/           # published, with anomalies flagged
  production/               # USGS figures + edition year + stage
tests/
  config/  aufbau/  structure/  lens/
```

## Invariants

1. **Exactly one lens is active at any time.** No compositing, no overlay, no secondary encoding on the same cells. If a feature needs two encodings, it needs two views.

2. **Unknown is defined once in `lib/elements/unknown.ts` and rendered identically across every lens** — the hatch, never a fill colour, never a ramp position, never an empty cell. **Never substitute zero, never omit the element, never let a missing value fall to the bottom of a scale.** `DESIGN.md` §4.

3. **Electron configurations are stored published values.** `aufbau.ts` implements the rule for the animation and for the exception test — **it never supplies a configuration for display.** The roughly twenty anomalies are flagged in the data.

4. **Every element record carries per-field sources.** A property without a source does not ship. Validator-enforced.

5. **One element set, many position maps.** Layouts are positions over the same 118 records. **An element cannot exist in one layout and not another** — asserted.

6. **Continuous lenses use single-hue, luminance-monotonic ramps.** Never rainbow. Asserted.

7. **Categorical lenses cap at eight values.** A taxonomy needing more is two lenses, not a bigger palette.

8. **Every lens value maintains AA contrast against `--ink` at cell type size.** A failing value is a bug in the lens, not a styling detail. Asserted.

9. **The production lens distinguishes not-produced from low-produced.** Producing nothing and producing 0.1% are different facts and must not share an appearance.

10. **Every USGS figure carries its edition year and its stage** — mined or refined. Never an undated production number.

11. **No commentary on Indonesian mining policy, downstreaming, or environmental impact** — in either direction, in any locale. The lens shows production share and stops.

12. **No safety, handling, exposure, or first-aid guidance.** Hazard classification may appear as a cited fact. Guidance is a regulated domain and this is not that tool.

13. **Colour and position never morph simultaneously.** Lens change re-colours in place; layout change moves in place. One variable at a time.

14. **No ambient motion.** No hover glow, no idle pulse, no entrance stagger, no shimmer. The transitions are the only animation.

15. **Detail is a side panel, never a modal.** An element's neighbours are half of what its properties mean.

16. **The grid is never reflowed into a list.** On mobile it scrolls horizontally at full cell size. The shape is the subject.

17. **Zero network requests at runtime.**

18. **Nothing is computed in a component.**

## Working style

- **Verify the element dataset licence at M0.** Several open datasets exist and their terms differ. This has caught sibling projects repeatedly — check before building on it.
- **Write `unknown.ts` before the first lens.** Unknown handling is not an edge case here; a meaningful share of superheavy properties are missing and retrofitting the hatch means revisiting every lens.
- **Test the anomalies first.** Chromium, copper, niobium, molybdenum, palladium, silver, platinum, gold. A naive aufbau implementation fails exactly there, and passing them is the signal that the configuration data is real rather than generated.
- **When adding a lens, write its legend entry in the same commit.** A lens without a named scale is not shippable.
- **When a cell looks wrong, check unknown classification before the scale.** A missing value quietly treated as zero is the likeliest defect.
- **Resist adding a second encoding.** "Just a small border colour for X" is how the noise starts.
- **Don't touch `next.config.js`, the Actions workflow, `unknown.ts`, or `data:validate` without saying so explicitly.**
- **Never weaken a test to make something pass**, especially `test:config`.

## Conventions

- Named exports; defaults only where Next requires them.
- Discriminated unions for lenses, layouts and value states (`known` / `unknown`), keyed on `type`. Exhaustive `switch` with a `never` default — this is how adding a lens surfaces every site that must handle it.
- No `any`. No non-null `!` in `lib/elements`.
- **A property value is `{ type: 'known', value, unit, source } | { type: 'unknown' }`.** There is no bare number and no nullable field — the type makes invariant 2 unrepresentable to violate.
- Element identity is atomic number, always. Never symbol, never name — both vary by locale and convention.
- Lens ids stable and readable: `category`, `block`, `origin`, `production-id`, `electronegativity`, `discovery`. They appear in URLs.
- Comments cite the source for any constant, and the publication for the aufbau exception list.
- Element names, symbols and chemical terms in their standard international form in both locales.
- Tabular figures on every mass and property.
- Tailwind tokens exactly as in `DESIGN.md` — `paper`, `ink`, `rule`, `muted`, plus per-lens scales. Never raw hex in components.

## Testing rules

- `pnpm test:run` before every commit; all four suites before any commit touching `lib/elements` or the data.
- **All 118 configurations asserted against published values, anomalies included.**
- **Aufbau asserted in both directions:** the rule's predictions disagree with published values exactly on the documented exception list — no more, no fewer.
- Structural: period lengths 2, 8, 8, 18, 18, 32, 32; block widths 2, 6, 10, 14; every element's block matches its position.
- Layout completeness: every layout contains all 118 elements exactly once, no duplicates, no losses.
- Unknown: asserted per lens that an unknown value never produces a ramp position or a numeric zero.
- Lens scales: continuous ramps asserted luminance-monotonic; categorical values asserted distinct with no collisions; every value asserted AA against `--ink`.
- Production entries asserted to carry edition year and stage.
- A copy scan asserts no policy, advocacy, or safety-guidance language in either locale.
- Determinism: same datasets produce a byte-identical bundle.
- Bug fix → failing test first.

## Deployment

`main` builds and deploys via Actions; data validation and all four suites gate it. `basePath` must match the repository name; `.nojekyll` must exist in `out/`. Verify with `pnpm preview` before pushing.

## Framing

The site cites every dataset with its licence, names the USGS edition year and reporting stage for production figures, and states that unknown values are unknown rather than zero. It links ptable as the more comprehensive general reference — accurate and generous. It carries no policy commentary on mining, and no safety guidance. No OIKN or government branding anywhere.

## Current state

M0 — not yet scaffolded. Next: select and licence-verify the element dataset, merge with published configurations, mark unknowns, and get the configuration and structural suites green. **No lens or UI work until `test:config` and `test:aufbau` pass.**
