# Umrah Plus — Fan Pillar Timeline (Design Specification)

> Adapted from the reference infographic (`design_pattren_for-UmrahPlusSection.jpg`) and the
> refined layout reference `umrahplus-radial-grapic-layout.html` (the user's standalone
> "Luxury Business Infographic" — vertical split, hub on the split line, nodes in a
> rightward fan, side hover panels). All sample copy/palette is replaced with the Umrah
> Plus brand: dark theme (`#0a0b0e / #0e1016 / #F9C344`), the three signature Pillar
> icons, the full hub copy, and the unchanged PILLARS hover cards. The reference's left
> text block ("Premium Agency Overview") is **deliberately removed**; the composition is
> translated 8 points left into the freed space so the right-side hover cards fit at
> every desktop width while keeping the reference's exact relative geometry
> (hub → node offsets preserved: +24 / +29 / +24 points).

**Production component:** `src/components/home/UmrahPlusSection.tsx` (`section-5`)
**Layout reference:** `umrahplus-radial-grapic-layout.html`

---

## 1. Visual Anatomy & Layout Structure

* **Vertical Split Canvas:** the split is now a full-height **vertical divide** (not a
  horizon line):
  * **left 30%** — flat lifted panel `#0e1016` with a `1px` right border
    `rgba(249,195,68,.15)` (the divide line)
  * **right 70%** — `#0a0b0e/60` translucent over the section photo, subtly darker than
    the left panel so the split reads clearly (reference: `#222222` / `#121212` at 38%)

* **Central Anchor Hub:** sits **on the split line, vertically centered** —
  center at `30% / 50%`, diameter **`28%` of the stage width** (aspect-square; ≈323px at
  max width, ≈255px at `lg`, shrinking proportionally with the stage scale).
  Anatomy, outside → inside:
  * blurred gold halo (`inset -44px`, `bg-[#F9C344]/10`, `blur-3xl`)
  * slowly rotating dashed ring (`inset -30px`, `border-dashed border-white/10`, 90s spin)
  * thin gold ring (`inset -14px`, `border-[#F9C344]/25`)
  * body: `linear-gradient(145deg, #1c1d24, #121318)`, `1.5px` gold border,
    `overflow-hidden` so text can never spill
  * a gold junction dot with dark ring on the **right** edge, facing the node fan
  * an invisible `pointer-events-auto` hover layer covering the circle (the wrapper is
    `pointer-events-none`) drives the **hub-hover state**: the body border goes solid
    gold with an extra `0 0 45px rgba(249,195,68,.35)` glow, all three spokes light up
    as if active, and all three **mini cards** open (see §5)
  * **Hub content: title only** — `What is Umrah Plus?` (`font-serif` bold, white, gold
    on "Umrah Plus"), 74% width, center-aligned. Per decision, the dots/tagline/
    description are deliberately **not** rendered in the hub (the reference's dots +
    subtitle are omitted to keep it minimal).

* **Fan Satellite Nodes:** three circular nodes in a **rightward fan/triangle** (reference
  geometry, unit space see §8):

  | Node | Position (%) | Pillar | Icon |
  |---|---|---|---|
  | 01 (top) | `54% / 22.4%` | Pillar 1: Sacred Comfort — Haram-Front Stays | **Kaaba** (custom inline SVG) |
  | 02 (mid, protruding right) | `59% / 50%` | Pillar 2: Spiritual Depth — Sacred Ziyarat Heritage | **Mountain** (lucide-react) |
  | 03 (bottom) | `54% / 77.6%` | Pillar 3: Pure Peace of Mind — VIP Chauffeur Fleet | **CarFront** (lucide-react) |

  Node sizes: `80px → 96px (lg) → 104px (xl)` — larger than the old strip nodes, echoing
  the reference's 12% circles. Anatomy: the node circle is filled with the **extracted
  3D sphere render** from `design-image.png` — the cream sphere + gold object (Kaaba /
  mountains / bus+car) cropped at native resolution to
  `public/assets/images/homepage/umrahplus-section/node{1,2,3}-*.png` (152×152,
  cream flush to the crop edge so `rounded-full` + `object-cover` shows no dark ring)
  inside an `overflow-hidden` layer, over the dark gradient as loading fallback; on top:
  the `2px` gold border at **45%** (raised from 25% for contrast) plus a
  **thin orbit ring** (`-inset-9px`, `1px #F9C344/25`, brighter + glowing when active —
  the reference's outer ring, gives the center node an always-visible silhouette),
  **step badge** (`01/02/03`) at the top-right, staggered `float` bob (3.8s, 0.45s
  stagger). The old flat icon-well (dark circle + line icon) is gone from nodes — the
  sphere *is* the icon (cards keep the line icons, see §4). Connector furniture on the
  right edge of every node:
  * a **stub line** (24px, `1.5px`, gold gradient, origin-left) runs from the circle
    edge to the card — hidden at rest (`scale-x-0`), scales in when the node is active
    **or** the hub is hovered, so the card always reads as physically attached;
  * a **node-end dot** (7px gold, centered on the circle edge) appears with the stub;
  * the **terminal dot** (8px gold, `+18px` right of the edge, just inside the card's
    left edge) marks the card anchor — it glows and scales 1.25 when active, sits dim
    (70%) at rest.

* **Connector Vector Geometry:**
  * three straight **gradient lines** from the hub center to each node center
    (`M300 350 L540 156.8 / L590 350 / L540 543.2` in unit space)
  * idle stroke: horizontal gold gradient `#aa7c11 → #F9C344 → #c5a059`
    (`url(#lineGrad)`) at **60% opacity / 1.5px** — the reference's `lineGrad` treatment
  * drawn in an SVG `viewBox="0 0 1000 700" preserveAspectRatio="none"` +
    `vector-effect="non-scaling-stroke"` so geometry maps 1:1 onto the
    percentage-positioned HTML while stroke width stays true; hub/node circles cover the
    line ends (opaque-cover trick)

* **Hover Card (desktop):** the unchanged PILLARS card opens **to the right of the
  node** — `left: calc(100% + 1.5rem)`, vertically centered on the node — sliding in
  from the left (`x: -32 → 0`, opacity, **500ms ease-out**, reference timing). A
  transparent 1.5rem bridge covers the gap so the pointer never leaves the node, and the
  visible **stub line + dots** (above) span the same gap.

* **Mini Cards (hub hover):** hovering the hub opens a compact **mini card** next to
  every node at once — same slot as the full card, `z-30`, only ~70px tall (icon +
  badge + title + tagline), 400ms slide. The full card always takes precedence on node
  hover (`isActive ? full : hubHover ? mini : null`); the two slots are separate
  `AnimatePresence` containers so hub→node transitions crossfade with no wait.

* **Depth & Elevation:** soft diffuse drop-shadows beneath circles and cards, blurred
  gold glow behind the hub and inside every card (unchanged).

---

## 2. Color Palette (Umrah Plus theme)

| Role | Value | Usage |
|---|---|---|
| Section base | `#0a0b0e` | page base, right-panel tint base, badge fills |
| Split left panel | `#0e1016` | flat left 30% panel |
| Divide line | `#F9C344/15` | 1px vertical border at 30% |
| Primary gold | `#F9C344` | title highlight, hub rings/dots, active spokes, node borders, icons, badges, card border + glow, terminal dots |
| Gradient stops | `#aa7c11 → #F9C344 → #c5a059` | idle connector line gradient (`lineGrad`) |
| Secondary gold | `#c5a059` | step badges (idle text), hint label, gradient end stop |
| Dash highlight gold | `#f9e8a2` | animated flowing dashes on active connectors |
| Hub gradient | `#1c1d24 → #121318` | hub body |
| Node gradient | `#1f2027 → #14151b` | fan circles |
| Card gradient | `rgba(24,25,32,.96) → rgba(18,19,24,.96)` | pillar hover cards |
| Card border / glow | `#F9C344/60`, `shadow 0 10px 35px -10px rgba(249,195,68,.25)` | pillar hover cards |
| Tagline amber | `amber-200/80` | pillar taglines inside cards |
| Body text | `#d1d5db` (gray-300) | descriptions |
| Micro-label | `text-[10px] uppercase tracking-[0.2em] #c5a059` | SearchWidget field labels (unchanged) |

The reference's `#d4af37 / #fcf6ba / cream` sphere nodes and white surfaces are **not
used** — dark theme confirmed by direction.

---

## 3. Typography (unchanged from the current component)

* **Headings / titles:** `font-serif` bold (Playfair Display) — hub title, pillar card titles.
* **Body:** `font-sans` (Inter) `font-light`, `leading-relaxed`.
* **Taglines & micro-labels:** uppercase with wide tracking (`tracking-[.18em]–[.3em]`),
  `9–11px`, semibold.
* Card badge: uppercase bold `9.5–10px` in a gold pill.

---

## 4. Icons

| Step | Icon | Source | Meaning |
|---|---|---|---|
| 01 | **Kaaba** | custom inline SVG (lucide-react 0.562 has no Kaaba icon) | Haram-Front Stays (Pillar 1) |
| 02 | **Mountain** | `lucide-react` `<Mountain />` | Sacred Ziyarat Heritage (Pillar 2) |
| 03 | **CarFront** | `lucide-react` `<CarFront />` | VIP Chauffeur Fleet (Pillar 3) |

Icons render gold at rest and **flip to solid black on a gold fill when active**.

> **Nodes use different art:** the fan/timeline **node circles** show the extracted 3D
> sphere renders (`node1-haram-stays.png` = Kaaba, `node2-ziyarat.png` = mountains,
> `node3-fleet.png` = bus + car) cut from `design-image.png`; the line icons above remain
> in the pillar **cards** (full + mini) where a small gold well still fits.

---

## 5. Hover Timeline Feature & Interactivity

### Default State (Idle)

* Hub fully visible on the split line with title, gold dots, tagline and description.
* Nodes rest in the fan with the staggered float animation; step badges `01/02/03`
  visible; connector lines at 60% gradient opacity; terminal dots at 70%.
* Sparkle twinkle dots (3px, `animate-pulse`) drift in the field.
* Hint line under the stage: `— HOVER A PILLAR TO EXPLORE —`.

### Active State (`hover`, `focus`, or `click/tap` toggle on a node)

1. **Node reaction:** circle scales `1.12`, border turns solid gold with a halo, the
   orbit ring brightens and glows, the icon well fills gold with a black icon, the
   terminal dot glows and scales 1.25, and the step badge inverts to gold/black. The
   node's root also jumps to `z-40`, so its card floats above the neighboring
   mid-node circle (verified by `elementFromPoint`: at the card/N2 overlap point the
   hit element is the card).
2. **Stub reveal:** the 24px stub line scales in from the circle edge together with
   the node-end dot, physically joining circle → card.
3. **Connector highlight:** that node's line — running all the way from the hub — turns
   to solid `#F9C344` at 95% / 2.5px with a gold drop-shadow, and an animated flowing
   dash (`stroke-dasharray 9 16`, `dashoffset` looping 0 → -25 at 0.9s) runs along it,
   reading as a progress line filling out from the hub.
4. **Card reveal:** the existing **PILLARS hover card** (markup, colors, fonts, badge,
   tagline, description and `CheckCircle2` feature list are 100% unchanged) slides in to
   the **right of the node** — `opacity 0→1`, `x -32→0`, 0.5s ease-out — anchored on the
   terminal dot with a transparent pointer bridge across the 1.5rem gap.
5. Only one pillar is active at a time; leaving the node (or clicking again) collapses it.

### Hub Hover State

* The hub body border goes **solid gold + outer glow** (`0 0 45px rgba(249,195,68,.35)`).
* All three spokes light up (same treatment as an active connector) and stubs + **mini
  cards** open next to all three nodes simultaneously — an overview/"all pillars at a
  glance" moment.
* Moving from the hub onto a node swaps that node's mini card for the full card
  (separate `AnimatePresence` slots, no exit-wait); leaving everything restores idle.

The hub keeps its permanent brand copy (no hub-copy swapping on hover).

---

## 6. Responsive Adaptation

* **Desktop (`lg+`, ≥1024px):** full fan layout as specified above. The stage scales on
  short viewports — `scale-95` normally, `.90` (941–1080px), `.80` (841–940px),
  `.70` (≤840px) — plus `pt-20` at ≤840px. Section padding was **lifted** (`pt-20
  md:pt-24 lg:pt-28`, footer `mt-2 gap-2`) so the whole composition sits higher and
  clears the SearchWidget. Verified at 1600×1080/1000/900, 1440×840, 1366×768,
  1024×768: card tops `162–603px`, right margin to viewport edge **208–431px**, and
  the active card's bottom clears the SearchWidget by **42–99px** (worst case:
  1024×768).
* **Mobile / tablet (`< lg`):** converts to a **vertical timeline** — a compact hub card
  (title + dots + tagline + description) on top, then the three step nodes stacked
  vertically linked by a vertical gold line; tapping a row expands the same PILLARS card
  inline (accordion, `aria-expanded` verified). The row list scrolls within the section
  so the SearchWidget stays anchored below.
* Section shell, snap-scroll, `section-5` id, header clearance and the
  `<SearchWidget activeService="Umrah Plus" />` footer (with the hint line above it) are
  preserved from the original component.

---

## 7. Motion Toolkit

* `motion/react` (framer-motion): card `AnimatePresence` side-slide, connector
  opacity/stroke transitions and dash-flow animation, node float, mobile row height
  expansion.
* Tailwind: all state transitions (`transition-all duration-300/450`), the 90s hub ring
  spin, `animate-pulse` twinkles.
* No CSS `@keyframes` were added to `globals.css`.

---

## 8. Technical Implementation Notes

* **Coordinate system:** all connector geometry lives in an SVG
  `viewBox="0 0 1000 700"` with `preserveAspectRatio="none"`. Node/hub positions are
  the same numbers as percentages (`x/1000`, `y/700`), so HTML and SVG align 1:1 at any
  stage size — no measurement or ResizeObserver required.
  Geometry: hub `(300, 350)`; nodes `(540, 156.8)`, `(590, 350)`, `(540, 543.2)` — i.e.
  hub `30%/50%`, nodes `54%/22.4%`, `59%/50%`, `54%/77.6%`.
* **Opaque-cover trick:** lines are drawn from/to the exact circle centers; the hub and
  node circles have opaque backgrounds and higher z-index, hiding the line ends — no
  trimming or intersection math.
* **Terminal dots are HTML spans**, not SVG circles — under
  `preserveAspectRatio="none"` an SVG circle would distort into an ellipse.
* **Non-uniform stretch:** `vector-effect="non-scaling-stroke"` keeps stroke widths true;
  the gold gradient (`lineGrad`, object bounding box) maps across the whole line span.
* **z-order:** split panels `0` → twinkles → SVG connectors `10` → hub `20` → nodes
  `30` (**active node `40`**) → full card slot `40` → mini card slot `30`; SearchWidget
  footer `30`.
* **A11y:** each node is a `role="button" tabIndex={0}` element with `aria-expanded`,
  Enter/Space toggle, `focus-visible` gold ring, and the same keyboard behaviour as the
  original strip.
