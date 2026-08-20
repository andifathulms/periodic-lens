# PRD — Periodic Lens

**Every periodic table app shows you the table. This one shows you why it has that shape — and who digs the elements out of the ground.**

| | |
|---|---|
| **Status** | Draft — pre-implementation |
| **Owner** | Andi Fathul Mukminin Salahuddin |
| **Type** | Personal portfolio project, open source, educational |
| **Deployment** | GitHub Pages (static export, no server, no runtime network) |
| **Language** | **English primary, Indonesian secondary** — a deliberate reversal from the sibling projects. See §2. |
| **Design** | See `DESIGN.md`. Authoritative for every visual decision. |

*Name: explanatory, and it names the mechanic. Alternatives: **Element Lens**, **Periodic Atlas**.*

---

## 1. The honest starting position

**Ptable exists, it is mature, free, and very good.** "Clickable table with element details" has been built a thousand times. A clone would be pointless.

So this project must justify itself, and it does so on two things:

**The shape explanation.** Almost no periodic table app explains why the table looks like that — why period 1 has two elements, why there is a gap in period 2, why the lanthanides sit in a footnote. The answer is orbital filling: the shape *is* the electron configuration, s-block two wide, p six, d ten, f fourteen. **The hero feature is the table assembling itself from that rule.**

**The Indonesian minerals layer.** Which elements Indonesia produces, and at what share of world output. This exists on no periodic table anywhere, and Indonesia's position in nickel, tin, copper and gold is a genuine national story that connects chemistry to something students already hear about. §4.

## 2. Language — reversed on purpose

Every sibling project is Indonesian-first. **This one is English-first with Indonesian secondary**, because chemistry vocabulary is international, the subject is not nationally bounded, and this is the project most likely to be found by a non-Indonesian audience.

The Indonesian minerals layer does not change that. It is a lens on a universal subject, not a localisation of it — and it is arguably more interesting to a foreign reader than to a domestic one.

Element names, symbols and chemical terms stay in their standard international form throughout, in both locales.

## 3. The lenses — the core mechanic

The table is one grid of 118 cells. **A lens is a way of colouring it, and only one lens is active at a time.**

| Lens | What it encodes |
|---|---|
| **Category** | Metal, metalloid, nonmetal, noble gas, and the rest — the familiar default |
| **Block** | s, p, d, f — the shape explanation made a colour |
| **Origin** | Big Bang, cosmic ray fission, dying low-mass stars, exploding massive stars, merging neutron stars, human-made |
| **Indonesian production** | Share of world output. §4 |
| **Property** | Electronegativity, atomic radius, ionisation energy, melting point, density — continuous ramps |
| **Discovery** | Year first isolated or identified |

**Switching lens re-colours the whole table in one morph.** That transition is the animation system, and it carries meaning: the same 118 objects, re-sorted by a different question. `DESIGN.md` §5.

## 4. The Indonesian layer

Indonesia is a major producer of several elements — nickel above all, plus tin from Bangka, copper and gold from Grasberg, bauxite, and cobalt as a nickel by-product. The nickel story in particular sits at the centre of the global EV battery supply chain.

**Source: USGS Mineral Commodity Summaries** — a US Government work, therefore public domain, published annually with country-level production figures per commodity. No licensing question.

**Honesty constraints:**

- **Production is not reserves is not consumption.** The lens shows mine production share, named as such.
- **Figures are dated.** Year stated on the lens, and every figure carries its edition.
- **Refined versus mined matters.** Some commodities are reported at different stages; the lens states which.
- **No commentary on policy, downstreaming, or environmental impact.** The lens shows production share. It does not editorialise about it, in either direction.

## 5. The shape explanation — the hero

An animation, not a paragraph. Electrons filling orbitals in energy order, blocks appearing in sequence, the familiar outline assembling from a rule.

**And then the rule's failures.** The aufbau ordering predicts the wrong configuration for around twenty elements — chromium, copper, niobium, molybdenum, palladium, silver, platinum, gold and others. **A toggle lights them up.**

That is the feature that makes a chemist trust the app: it teaches the rule, then shows exactly where the rule breaks. Configurations for those elements come from published values, never from the rule.

## 6. Alternative layouts

Benfey's spiral, Janet's left-step, and the standard form, with cells travelling between positions on switch.

The point is not novelty: **it shows that the standard table is a convention rather than a law**, which is itself a lesson about how science organises knowledge. Janet's left-step in particular makes the orbital-filling logic more obvious than the standard layout does — which pairs directly with §5.

## 7. Non-goals

- **No molecule builder, reaction predictor, or equation balancer.** Different products.
- **No safety, handling, or exposure guidance.** Hazard classification may appear as a cited fact; **guidance is a regulated domain and this is not that tool.**
- **No quiz or assessment in v1.**
- **No accounts, no server, no runtime network.**
- **No ML.**
- **No policy commentary on Indonesian mining.** §4.

## 8. Data

**Element properties** — several open datasets exist. **Verify the licence of whichever is chosen** rather than assuming; this has caught sibling projects repeatedly.

**Electron configurations** — published values, including the anomalies. Not derived.

**Emission spectra** — NIST Atomic Spectra Database is a US Government work, and real spectra would make a beautiful additional lens. Stretch.

**Indonesian production** — USGS Mineral Commodity Summaries, public domain.

**Unknown values are common** and are a first-class case. Many properties are simply not known for the superheavy elements. §9.

## 9. Unknown is not zero

**The failure mode this project shares with its siblings.** Oganesson's electronegativity is not known. Rendering it at the bottom of a colour ramp would state something false.

**Unknown has one consistent appearance across every lens** — a hatch, never a colour, never a ramp position, never an empty cell that reads as a low value. Asserted by test, and the same rule in the detail panel: *"not known"*, never a blank.

## 10. Features

### 10.1 The table
118 cells, one active lens, a legend naming it. The page.

### 10.2 The detail panel
Selecting an element opens a side panel — **not a modal**, because losing sight of the table loses the context that makes the detail meaningful. Configuration, properties with units and sources, origin, discovery, production share where applicable.

### 10.3 The build
§5. The assembly animation, replayable, with the aufbau-exception toggle.

### 10.4 Lens switcher
§3. One at a time, always labelled.

### 10.5 Layout switcher
§6. Cells travel; the element set never changes.

### 10.6 Property topography
For continuous lenses, an optional height rendering — periodicity as visible waves across the grid rather than as a word.

### 10.7 Method page
Every dataset, version, and licence. The USGS edition year. The aufbau exception list with its source. The unknown-value policy.

## 11. Architecture

Static Next.js 14 App Router export. No backend, no runtime network.

```
element dataset + configurations + USGS production (build time)
  → validate, merge, mark unknowns
  → emit one element table + per-lens scales
  → table | detail | build animation | layouts
```

**`lib/elements` is pure** — lens scaling, layout position resolution, unknown classification. Runs in Node, testable.

**One element set, many positions.** Layouts are position maps over the same 118 records. **An element cannot exist in one layout and not another** — asserted.

**Configurations are data, not computed.** The aufbau rule drives the *animation*; the stored configurations come from published values, and the exceptions are marked.

## 12. Testing

**Configurations match published values for all 118**, including every anomaly. This is the strongest available check and the anomalies are exactly where a naive implementation fails.

**The aufbau rule's predictions are computed separately** and the disagreement set must match the documented exception list. **Both directions** — the rule must fail where it is known to fail, and succeed everywhere else.

**Structural invariants:** period lengths are 2, 8, 8, 18, 18, 32, 32. Block widths are 2, 6, 10, 14. Every element's block matches its position. Group and period assignments are consistent.

**Layout completeness:** every layout contains all 118 elements exactly once. No duplicates, no losses.

**Unknown handling:** an unknown value never renders as a ramp position or a numeric zero. Asserted per lens.

**Scale integrity:** continuous lenses assert monotonic luminance ramps; categorical lenses assert distinct assigned values with no collisions.

**Determinism:** same datasets produce a byte-identical bundle.

## 13. Milestones

| | | |
|---|---|---|
| **M0** | Data | Scaffold; dataset selection with licences verified; merge and validate; configurations including anomalies; unknown marking. Structural tests green. |
| **M1** | The table | Grid, category lens, detail panel, legend. |
| **M2** | Lenses | Block, origin, property lenses with the morph. **Ship publicly here.** |
| **M3** | The build | Orbital filling animation and the aufbau-exception toggle. **The hero.** |
| **M4** | Indonesia | USGS production lens, per-commodity figures and citations. **The differentiator.** |
| **M5** | Layouts | Benfey spiral, Janet left-step, travelling cells. |
| **M6** | Depth | Property topography, discovery timeline, method page, spectra if licence permits. |

## 14. Success criteria

- All 118 configurations match published values, anomalies included.
- The computed aufbau disagreement set matches the documented exception list exactly.
- Every layout contains all 118 elements exactly once.
- No unknown value renders as a colour ramp position anywhere.
- Only one lens is active at any time, always named in the legend.
- Every USGS figure carries its edition year and stage (mined or refined).
- No safety or handling guidance anywhere.
- Zero network requests after first load.
- Readable and usable on a phone at 200% zoom.

## 15. Deployment

`output: 'export'`, `basePath` matching the repository name, `.nojekyll` in the output root. Data validation gates the deploy. Fonts self-hosted. Verify under the production `basePath` with `pnpm preview` before pushing.

## 16. Risks

| Risk | Mitigation |
|---|---|
| **Indistinguishable from ptable.** | The shape explanation and the Indonesian layer are the reasons to exist; both are milestones, not stretch goals. |
| **Colour noise.** 118 cells with everything encoded at once is unreadable. | One lens at a time, enforced. Colour is a swappable channel, not decoration. `DESIGN.md` §4. |
| **Unknown values rendered as low values.** | §9, asserted per lens. |
| **Configurations derived from the rule.** | Stored from published values; the rule drives animation only. |
| **Mining lens read as advocacy or criticism.** | Production share, dated and sourced, no commentary either way. §4. |
| **Element dataset licence assumed.** | Verified at M0 before anything is built on it. |
| **Scope creep into a chemistry suite.** | §7 is binding. |
