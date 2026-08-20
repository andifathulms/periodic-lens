# DESIGN — Periodic Lens

Authoritative for every visual decision in this repository. `PRD.md` says what the product is; this says what it looks like and why. When code and this document disagree, this document is right.

---

## 1. The house layer

These projects should read as siblings — recognisably from the same hand — without looking like one template recoloured. **What is shared is rhythm and rigour; what is per-app is identity.**

**Shared across every project:**

```
space    4 8 12 16 24 32 48 64 96 128     4px base
motion   fast 120ms · state 240ms · orchestrated 500–600ms · ease cubic-bezier(0.2,0,0,1)
edge     hairline 0.5px · radius 2px only
```

- **One orchestrated moment per app.** Everything else is state change.
- **The legend contract.** Every view states what it is showing and what it cannot show.
- **The citation line.** Small, monospace, always present where a claim is made.
- **Type floor 16px.** Tabular figures on anything that updates.
- **Zero runtime network. Offline after first load. Self-hosted fonts.**
- **Reduced motion gets a complete alternative**, never a degraded one.
- **No component library.**

**Per-app:** colour, typeface, layout, and the instrument.

**Language note:** this app is **English primary, Indonesian secondary** — reversed from its siblings. `PRD.md` §2. Element names, symbols and chemical terms stay international in both locales.

## 2. The tension, and how it resolves

The brief asks for highly colourful, visualised and animated. The subject is a **dense grid of 118 cells**, each carrying a symbol, a number and a mass.

Those pull against each other. Colour everything at once and the table becomes unreadable noise — which is the failure mode of most flashy periodic table apps.

**The resolution: colour is a channel you swap, not decoration you pile on.**

- **One lens active at a time.** Never two encodings competing on the same cells.
- **The animation is the transition between lenses**, not ambient motion.
- **Nothing pulses, glows, or moves idly.**

That discipline is what makes it feel alive rather than busy. The table is vivid at any moment and calm in aggregate.

## 3. The cell

The atom of the design, and everything else is arranged around it.

```
atomic number     top left, small, mono
symbol            centre, large, the dominant element
name              beneath symbol, small, may truncate
mass              bottom, smallest, mono, tabular
```

Square, hairline `--rule` border, radius 2px. **The lens colours the cell fill; the type stays constant.** Text contrast is maintained by choosing lens palettes that keep sufficient contrast against `--ink` at every value — a lens whose dark end fails contrast is a broken lens, not a styling problem.

Minimum cell 44px on desktop, and the grid scrolls horizontally on mobile rather than shrinking below legibility. **Never shrink the cell to fit the viewport.**

## 4. Colour — one palette per lens, and one rule above all of them

This app has no single palette. It has a **palette per lens**, plus ground tokens and one universal state.

### Ground

```
--paper   #F7F6F2    warm off-white
--ink     #1B1D1C    cell type, headings
--rule    #D5D3CB    cell borders, grid lines
--muted   #6E706B    secondary text, units
```

Light ground, because a dense grid of coloured cells needs a calm field behind it. A dark ground would make every lens glow and the whole thing shout.

### Lens palette rules

**Categorical lenses** — category, block, origin. Qualitative sets, muted enough to sit together at 118-cell density, distinct enough to separate at a glance. No more than eight values per lens; if a taxonomy needs more, it is two lenses.

**Continuous lenses** — electronegativity, radius, ionisation energy, density, discovery year. **Single-hue, luminance-monotonic ramps.** Never rainbow: hue is categorical, these properties are continuous, and a rainbow ramp would invent boundaries that periodicity does not have.

**The Indonesian production lens** — sequential ramp by share of world output, plus a **distinct not-produced state** that is visibly not the bottom of the ramp. Producing 0.1% and producing nothing are different facts.

### The rule above all lenses

```
--unknown   hatch pattern over --paper, never a fill colour
```

**Unknown has one appearance, identical across every lens.** Diagonal hatch, `--muted` label, never a ramp position, never an empty cell, never a colour.

Many properties are simply not known for the superheavy elements. Rendering oganesson's electronegativity at the bottom of a ramp would state something false. `PRD.md` §9.

**A reader must learn the hatch once and recognise it everywhere.** That consistency is worth more than any individual lens's aesthetics.

### Not in the palette

**No red as a semantic.** Red may appear inside a qualitative palette, but nothing in this product is an error or a warning.
**No rainbow on continuous lenses.**
**No second encoding layered over an active lens.**

## 5. Motion — one system, three applications

The house layer allows one orchestrated moment. Here it is **the transition**, and it appears three ways because it is the same mechanic each time.

**Lens morph.** Switching lens re-colours all 118 cells simultaneously, 500ms, eased. The grid does not move; only the fills change. The reader watches the same objects re-sorted by a different question.

**Layout morph.** Switching layout moves cells to new positions along eased paths, 600ms. Colours hold; only positions change. **Never morph colour and position at once** — one variable at a time, or nothing is legible.

**The build.** The hero animation: orbitals filling in energy order, blocks appearing in sequence, the outline assembling. Roughly fifteen seconds, replayable, scrubbable. Cells appear as their electrons are placed.

```
--dur-fast     120ms
--dur-state    240ms
--dur-lens     500ms
--dur-layout   600ms
```

**Nothing else animates.** No hover glow, no idle pulse, no ambient shimmer, no entrance stagger on page load.

**Reduced motion:** lens and layout changes apply instantly. The build becomes a **stepped sequence** — a control advancing one subshell at a time, with the same annotations. Complete, not degraded.

## 6. Layout

**The table is the page.** Full width, centred, breathing room around it, no chrome competing.

**Detail opens as a side panel, never a modal.** Losing sight of the table loses the context that makes the detail meaningful — an element's neighbours are half of what its properties mean.

**The legend is permanent**, naming the active lens, its scale, and the unknown hatch. Not collapsible.

**Lens and layout switchers** sit above the table as labelled controls, not icons. A reader should never have to guess what a lens is called.

**Mobile:** the grid scrolls horizontally at full cell size; the detail panel becomes a bottom sheet. **The table is never reflowed into a list** — the shape is the subject.

## 7. Type

```
Space Grotesk     symbols, atomic numbers — distinctive, strong numerals, holds at large size
Inter             body, controls, panel prose
IBM Plex Mono     masses, numeric properties, citations
```

Self-hosted via `next/font`.

```
14  16  18  22  28  36  46          1.25 ratio
```

**Symbols are the largest type in the product** and carry the grid's rhythm. Tabular figures on every mass and property — they align down columns in the detail panel and must not jitter.

Light ground, so no dark-mode weight correction. Body 400, headings 600.

## 8. Legend — the honesty contract

Never optional, never collapsed. Always states:

1. **The active lens by name.**
2. Its scale — categories listed, or a ramp with endpoints and units.
3. **The unknown hatch**, with its swatch.
4. For the production lens: the USGS edition year and whether figures are mined or refined.

## 9. Accessibility

Colour-only encoding is the central risk with 118 cells across multiple lenses.

- **Every lens has a text channel.** The detail panel always states the element's value for the active lens in words and units. The full element table is available as a sortable text table — always present, not a fallback.
- **Unknown carries a pattern as well as an absence of colour**, so it survives greyscale and colour-vision deficiency.
- **The production lens marks not-produced with a glyph**, not only a colour.
- Cells are keyboard-navigable in grid order with arrow keys; focus visible at 3px.
- AA contrast between `--ink` and every lens value at cell type sizes — **a lens value failing this is a bug in the lens.**
- Full function at 200% zoom; horizontal scroll is acceptable, illegible shrinking is not.

## 10. What not to do

- No two lenses active at once.
- No rainbow ramp on a continuous lens.
- No unknown value rendered as a colour or a ramp position.
- No morphing colour and position simultaneously.
- No hover glow, idle pulse, entrance stagger, or ambient motion.
- No modal for element detail.
- No shrinking cells below the legible minimum.
- No reflowing the table into a list on mobile.
- No safety or handling guidance.
- No dark mode.
- No component library.
