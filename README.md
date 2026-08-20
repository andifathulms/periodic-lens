# Periodic Lens

**Every periodic table app shows you the table. This one shows you why it has that shape — and who digs the elements out of the ground.**

An interactive periodic table built around two things that are hard to find elsewhere: an animation explaining where the shape comes from, and a lens showing Indonesia's share of world production per element. Static site, no backend, no runtime network.

English primary, Indonesian secondary. Element names, symbols and chemical terms stay in their standard international form in both locales.

## The two reasons it exists

**The shape.** The table's outline is the electron configuration: s two wide, p six, d ten, f fourteen. The build page animates the filling and then shows the twenty elements where the rule's prediction disagrees with the published configuration.

**The Indonesian layer.** Nickel, tin, cobalt, bauxite, copper, gold, silver — share of world mine production, every figure carrying its USGS edition year and reporting stage. The lens shows production share and stops there.

## Running it

```bash
pnpm install
pnpm dev
```

## Commands

| | |
|---|---|
| `pnpm build` | static export; runs `data:validate` first and writes `.nojekyll` |
| `pnpm preview` | serve `./out` under the production `basePath` |
| `pnpm test:run` | all four suites once |
| `pnpm test:config` | all 118 configurations against published values |
| `pnpm test:aufbau` | rule predictions against the documented exception list |
| `pnpm test:structure` | period lengths, block widths, layout completeness |
| `pnpm test:lens` | unknown handling, ramp monotonicity, contrast |
| `pnpm data:build` | merge datasets, mark unknowns, emit the table and scales |
| `pnpm data:validate` | licences, citations, USGS edition, completeness |

All four suites and `data:validate` gate the build and CI.

## How it is put together

`lib/elements` is pure and runs in Node. `aufbau.ts` implements the filling rule and drives the animation; it never supplies a configuration for display. `unknown.ts` is the single definition of a missing value. `lens.ts` turns a value into a scale position, and `layout.ts` turns an atomic number into a position — the standard table, Janet's left-step, and a Benfey-style spiral are three position maps over the same 118 records.

A property value is `{ type: 'known', value, unit, source } | { type: 'unknown' }`. There is no bare number and no nullable field, which is what makes "unknown rendered as zero" unrepresentable rather than merely forbidden.

## Data

- **Atomic weights** — IUPAC, *Atomic weights of the elements 2021*.
- **Configurations and ionisation energies** — NIST Atomic Spectra Database (US Government work, public domain) and the CRC Handbook, 104th ed.
- **Physical properties** — CRC Handbook, 104th ed.; Slater (1964) for radii.
- **Nucleosynthetic origin** — Johnson, *Science* 363, 474 (2019).
- **Production** — USGS Mineral Commodity Summaries 2024 (US Government work, public domain).

Full licence and citation detail is on the method page.

## What it does not do

No molecule builder, reaction predictor or equation balancer. No safety, handling, exposure or first-aid guidance — hazard classification may appear as a cited fact, but guidance is a regulated domain and this is not that tool. No commentary on Indonesian mining policy, downstream processing or environmental impact, in either direction.

For a more comprehensive general reference — isotopes, compounds, spectra — [ptable.com](https://ptable.com) is excellent, free and mature. This project is not trying to replace it.

## Deployment

`main` builds and deploys to GitHub Pages via Actions. `basePath` must match the repository name; `.nojekyll` is written into `out/` by the build. Verify with `pnpm preview` before pushing.
