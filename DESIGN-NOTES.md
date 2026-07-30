# Tjønnås & Norvald — editorial redesign plan

Scope: `ansatts-portal.html` only (inline `<style>` block + this page's markup + this page's JS). Nothing in `styles.css` or any other page changes. All Norwegian copy stays byte-identical — every change below is layout, tokens, or markup structure (wrapping a span, removing an inline `style="background:#fafafa"`), never a rewrite.

---

## 0. Inventory — what's actually here

Read the full file (1354 lines). Confirmed structure:

**Global/shared (do not touch, only override locally as the page already does):**
`.proj-header` (fixed, shared nav shell — this page reskins it via `.tn-nav`), `.proj-team-grid/__card/__avatar`, `.proj-meta-footer`, `.proj-adjacent*`, `.site-footer`, `.process-drawer`, `.lb-overlay`, `.skip-link`. `*{box-sizing:border-box}` is global. `--rule`/`--ink`/`--paper` etc. from the shared `:root` also exist but this page currently defines its own `--tn-*` set on `.proj-main` — I'll keep that scoping pattern, just replace the token *values and names*.

**Direct answer to the shared-CSS scoping question, checked, not asserted:** the tokens are, and will stay, scoped to `.proj-main` inside *this file's own* `<style>` block — never `:root`, never `styles.css`. That block only ever loads when `ansatts-portal.html` loads, so nothing here reaches any other page, full stop; there's no equivalent of a page-level class needed because the whole stylesheet is already page-local. I also checked the specific risk of a *name collision* inside this page's own subtree: `.proj-team-card`, `.proj-adjacent-card__*`, and `.proj-meta-footer` all live inside `<main class="proj-main">`, so if I reused generic names like `--ink`/`--paper` (which already exist in the shared `:root`) at `.proj-main` scope, those shared components *would* inherit my redefined values via normal CSS custom-property cascade — `lb-overlay` and `process-drawer` sit outside `<main>` so they're safe either way. I grepped: none of `.proj-team-card`, `.proj-adjacent-card__*`, or `.proj-meta-footer` actually reference `var(--ink)`/`var(--paper)` — they use their own tokens (`--mandel`, `--vinrod`, `--oliven`) or hardcoded hex. So there's no live collision today. But I'm keeping the distinct `--tn-` prefix anyway (not adopting the brief's generic `--paper`/`--ink` names literally) as a deliberate second layer of safety — if one of those shared components is ever refactored to use the generic token names, a prefixed page-local system can't silently reskin it. Nothing to audit on other pages; there's nothing that reaches them.

**This page's own sections, in document order:**

| # | Eyebrow | Thesis (h2) | Body | Media | Current bg |
|---|---|---|---|---|---|
| — | *(none — `.tn-note`)* | "Dette prosjektet har en egen visuell stil…" | — | — | cream-deep box, top of page |
| — | *(hero)* | "Tjønnås & Norvald ansattportal" | meta row | phone mockup (intimate, ~280px) | gradient mesh |
| — | *(summary)* | Prosjekt / Problem / Løsning / Resultat | 2 separate boxed cards | — | white |
| — | *(stats)* | "Prosjektet i tall" | 3 stats, each with a claim + a foot line that **already is** a method line | — | white, no box |
| KONTEKST | "Tjønnås & Norvald er en kafé…uten en felles digital struktur." | 2 paragraphs | `herotjonn.webp` (laptop, photo, full inner-width) | white |
| PROBLEM | "Fem systemer, ingen oversikt." | intro + 5-item list + closer | `marimette.webp` + frosted quote card | `#fafafa` |
| PROSESS | "Fra innsikt til løsning." | 1 paragraph + link | *(none)* | white |
| INFORMASJONSARKITEKTUR | "Seks kjerneområder, én bunnnavigasjon." | 1 paragraph | custom sitemap graphic (small, low-contrast) | `#fafafa` |
| DESIGN 1/3 | "Onboarding — en dør inn" | 1 paragraph | `onboarding-login.webp` (2 iPhones, device chrome baked in) | `#fafafa` |
| DESIGN 2/3 | "Mobil — Vaktplan (Kari)" | flow line, mål, scenario, list, løste behov | portrait screen-recording (raw, no device chrome) + 3 placeholder swatches | `#fafafa` |
| DESIGN 3/3 | "iPad — Opplæring (Eirik)" | flow line, mål, scenario, list, løste behov | tablet screen-recording (raw) + `ipad-min-trening.webp` (chrome baked in) + 2 placeholders | `#fafafa` |
| HVORFOR DISSE TO SCENARIOENE? | *(no thesis — prose-only aside)* | 1 paragraph | *(none)* | `#fafafa` |
| *(none)* | *(none)* | *(none)* | `tjonni-mockup.webp`, standalone, full inner-width | white |
| TESTING — HVA SOM MANGLER | "Prototypen ble ikke brukertestet." | 2 paragraphs | *(none)* | white |
| MITT BIDRAG | "Hva jeg eide i dette prosjektet." | 1 paragraph | Figma iframe embed (interactive) | `#fafafa` |
| GRUPPE 01 | "Teamet bak prosjektet." | — | 4-card team grid (shared component) | white |

7 of 11 `.tn-stmt` sections carry an inline `style="background:#fafafa"` — that's the "grey stacked on grey" the brief is pointing at. None of it is load-bearing; it's removable.

**Placeholder filmstrips** (`mobil-02-hjem-preview.png` etc., dashed boxes with filenames): these are pre-existing markers for assets that were never finished. Out of scope to "fix" — I'll just retint their borders/text to the new tokens so they don't clash, not build new content for them.

---

## 1. Tokens — derived from the actual photography, not guessed

I sampled dominant colors from `marimette.webp`, `herotjonn.webp`, `tjonni-mockup.webp`, `poster-kalender.jpg`, `poster-kasse.jpg` with a quantize pass. Real output: warm cream (`#faf9e5`, `#f8f6e7`), roast-dark near-blacks (`#26242c`, `#2f1c17`), caramel/tan (`#c9924e`, `#ad876d`, `#b69780`). That's the actual palette of this brand's photography — not invented.

```css
--paper:        #FAF6E8;   /* warm cream, from the poster/hero backgrounds — NOT #F4F1EA */
--paper-raised: #F1E9D2;   /* one step darker, used on exactly one section */
--ink:          #241C16;   /* near-black roast, from marimette/herotjonn shadow tones */
--ink-muted:    #6B5F53;   /* 5.73:1 on paper — body copy */
--ink-faint:    #746E66;   /* 4.66:1 on paper — eyebrows/meta/captions (still passes AA; brief's naive "40% opacity" would fail contrast on small uppercase type, so this is tuned to the floor instead) */
--hairline:     rgba(36,28,22,.14);
--accent-text:  #A85A1E;   /* TEXT ONLY — italic emphasis, links. 4.68:1 on paper (AA). */
--accent-gold:  #D4AF37;   /* NON-TEXT ONLY — stat arrows, hairline highlights, hero gradient. 1.94:1 on paper — fails AA, never used for text. */
```

I checked contrast math for all of these (Python, WCAG relative-luminance formula) — numbers above are real, not eyeballed. `--ink-faint` is deliberately closer to AA floor than a literal "40% opacity" would give you, because at 11px uppercase (the eyebrow size), true 40%-opacity grey fails contrast outright.

**Grey count:** collapses the current `--tn-cream / --tn-cream-deep / --tn-card-bg / --tn-sage / --tn-sage-deep / --tn-body / --tn-caption / --tn-label / --tn-rule` (9 tokens) down to the 7 above.

**Accent, revised — pushback confirmed by an actual render, not just math.** Original single `--accent: #8A5A22` was 5.44:1 against paper (passes AA) but only **2.85:1 against `--ink` itself** — i.e. two text colors sitting next to each other with too little separation. I rendered both side by side at 16px (screenshot, not just arithmetic) and the original *did* read as slightly-lighter-body-text rather than a deliberate accent. Fix, per the pushback: split into two tokens with disjoint jobs.
- `--accent-text` (`#A85A1E`) is for anything that is text — italic emphasis words, links — retuned for better separation from ink (3.31:1 ink-to-accent, up from 2.85) while still clearing 4.68:1 against paper.
- `--accent-gold` (`#D4AF37`, the existing hero-gradient gold, not a new color) is for non-text moments only — stat arrows, hairline highlights, the hero mesh — where contrast rules don't bind. It only reaches 1.94:1 against paper, which is why it's barred from ever being text.
Three uses total across the two: (1) `--accent-text` for the italic emphasis word in a thesis line, (2) `--accent-text` for link/focus color, (3) `--accent-gold` for the stat arrows.

### Type — flagging a conflict with prior direction before I act

Memory from the last pass on this page says explicitly: *serif (Playfair Display, italic) is validated and works, don't change it now; if anything, reconsider the sans, not the serif.* This brief independently asks for a deliberate warmth-appropriate serif — which Playfair Display italic already satisfies. **I'm keeping the serif family as settled.** I'm not treating this brief as license to re-open a decision that was already settled unless told otherwise.

**Refined, per pushback:** rather than the static "Playfair Display," self-host **"Playfair"** — the newer variable release with a true optical-size (`opsz`) axis, by the same designer, same letterform skeleton. I confirmed it's real and fetchable (queried Google Fonts' own CSS API directly: `family=Playfair:ital,opsz,wght@0,5..1200,400;...` returns valid `@font-face` blocks with `opsz` and italic support). This isn't reopening the serif decision — it's the same design at a size that was actually drawn for 88px display use instead of stretched from a static file. Cheap, in-scope win.

For the sans, current setup is `"Poppins", "Inter"` — Poppins is a geometric sans that's arguably in the same over-used-AI-adjacent bucket as the terracotta+cream combo the brief warns about. Proposal: **drop Poppins from this page, use Inter alone** for body + meta/eyebrow + the nav pill. Two families total (Playfair, Inter), three roles (display serif / body sans / meta sans, same family as body but tracked+uppercase). Noted pushback: Playfair (Display) + Inter is itself a very template-associated pairing, and that's fair — but the serif is settled, so the only lever left is the sans, and that's a decision for *later*, once the static pass is screenshotted and we can see if it still reads as generic. Not swapping the sans blind, in the same pass, on a hunch.

**Self-hosting — confirmed, and for a second reason beyond performance.** A 2022 Munich regional court (LG München I) ruling found that dynamically embedding Google Fonts — which sends the visitor's IP to Google at request time without consent — is a GDPR exposure in the EU/EEA, which includes Norway (EEA, not EU, but GDPR-equivalent rules apply via the EEA agreement). For a portfolio piece about a real Norwegian business, self-hosting removes the question entirely, not just the render-blocking request. Confirmed outbound network access works from this environment. Pulling both **latin and latin-ext** subsets (`.woff2` only) for Playfair (400/700 roman, 400 italic) and Inter (400/500/600) from Google Fonts' own CDN response, storing them in `assets/fonts/`, dropping the `<link>`/`preconnect` tags entirely. Correction to my own earlier claim: æ/ø/å (U+00E6, U+00F8, U+00E5) are in the base Latin-1 Supplement block and already covered by the plain "latin" subset for both families — I verified this against the actual API response rather than assuming — so latin-ext isn't strictly required for Norwegian. Self-hosting it anyway per the explicit instruction; it's cheap insurance and not worth re-litigating. Preloading only the italic 400 weight (used above the fold, in the hero) — not the full family.

**Open question 1 — resolved:** yes, self-host, confirmed.

### Type scale

Adopting the brief's scale close to verbatim — I checked the ratio math and it holds at 1440px:

```css
--t-display-xl: clamp(2.5rem, 6.5vw, 5.5rem);    line-height: 1.02; letter-spacing: -0.02em;   /* hero h1 only */
--t-display-l:  clamp(1.75rem, 3.4vw, 2.875rem); line-height: 1.12; letter-spacing: -0.015em;  /* section thesis */
--t-display-m:  clamp(1.375rem, 2.2vw, 1.875rem);line-height: 1.2;                              /* subsection titles, e.g. summary-card headings */
--t-data:       clamp(2.75rem, 5.5vw, 4.75rem);  line-height: .95; font-variant-numeric: tabular-nums;
--t-lead:       1.1875rem;                        line-height: 1.55;  /* one per section, max */
--t-body:       1rem;                             line-height: 1.65;
--t-meta:       0.6875rem; text-transform: uppercase; letter-spacing: .14em; font-weight: 500;
```

At 1440px: thesis maxes at 46px, body is fixed 16px → 2.875× (clears the 2.4× floor). Hero h1 maxes at 88px → 5.5× body (clears the 2.5× floor).

**Enforced:** thesis `max-width: 22ch`, body `max-width: 62ch`, both columns `align-items: start`.

**Confirming criteria 1–2 are covered, with a real baseline instead of a promise.** Rather than assert the current page fails these rules, I wrote a throwaway audit (`type-audit.js`, not part of the repo — described in full at the bottom of this doc) and ran it against the *current, unmodified* live page at 1440px via CDP. Real measured output:

- Hero h1 vs. body: **3.73×** — already passes the 2.5× floor, no change needed there.
- **All 10** thesis/body pairs on the page: **2.08× uniformly** (every `.tn-stmt__heading` clamps to the same 34.4px ceiling at this viewport, every `.tn-stmt__prose` to 16.56px) — every single one fails the 2.4× floor today. This is exactly the flatness the brief is describing, now with a number attached instead of a vibe.
- 40 adjacent-pair violations under 1.4×, though most are trivial (label/value pairs in the meta rows sitting 1.02–1.22× apart, which is expected and probably *should* stay close — a term and its own value are supposed to look related). The meaningful ones are in the stats band: claim text (18px) next to foot/method line (14px) at only **1.29×**, which the `--t-data` treatment above directly fixes by making the numeral the dominant element instead.

I'll re-run this same script after each commit stage and paste the numbers rather than eyeball it.

---

## 2. Grid

12 columns, `max-width: 1240px`, gutter 24px, page margin `clamp(1.25rem, 5vw, 5rem)`.

Concretely replacing `.tn-stmt__row`'s current `minmax(0,5fr) minmax(0,6fr)` two-track grid with an explicit **three-track** grid so column 6 is a real empty gap, not just a `gap` value:

```css
.tn-stmt__row {
  grid-template-columns: minmax(0,5fr) minmax(0,1fr) minmax(0,6fr);
  align-items: start;
}
.tn-stmt__heading { grid-column: 1; max-width: 22ch; }
.tn-stmt__prose   { grid-column: 3; max-width: 62ch; }
```
Below 900px: single column, thesis `max-width: 28ch`, body `100%`.

This is now the **one** layout pattern for every prose section (Kontekst, Problem, Prosess, IA, Design 1–3, Testing, Mitt bidrag). The "Hvorfor disse to scenarioene?" section has no thesis in the source copy — I'm not inventing one; it keeps the single-column prose-only treatment it already has, just re-aligned to the same grid's body column/measure so it doesn't look like a fourth pattern.

---

## 3. Section-by-section decisions

**Honesty note (`.tn-note`):** moving it under the hero's meta row, styled as: `--t-meta` label ("Om denne siden" or similar — wait, no, the text itself stays identical, I mean the *treatment*: no label added, just) a single left hairline, `--t-body` at `--ink-muted`, no background, no border-box, no italic-in-a-box. It stops looking like a browser alert.

**Hero:** h1 → `--t-display-xl`. Meta row → `--t-meta` at `--ink-faint`, dot separators at reduced opacity (already exist as `.tn-hero__dot`, just recolor). `min-height: 88vh` (currently 92vh, close enough, will match brief). Gradient mesh: currently a live `filter: blur(22px)` on a `position:absolute; inset:-10%` element behind the whole hero — exactly the expensive pattern the brief flags. **I'll pre-bake this as a static blurred PNG/WebP asset** (render once at build time via a one-off script, not runtime) and keep only the CSS `tn-drift` transform-animation (cheap) on the baked image, dropping the runtime `filter`.

**Summary card:** currently 2 boxed `.tn-summary__card` elements. Merging to **one** container (`.tn-summary__panel`), internal padding 56px, 4 cells (Prosjekt+meta-list / Problem / Løsning / Resultat) separated by hairlines only. The "Min rolle / Team / Omfang / Type" rows become a real `<dl>`: `--t-meta` term in `--ink-faint`, `--t-body` value in `--ink`, 16px between pairs — markup change, zero copy change.

**Stats band:** currently no box at all. Brief wants it boxed with vertical hairlines between the 3 cells — adding that border (this + the summary panel = the two allowed boxed modules, matching acceptance criterion #4 exactly). Numbers → `--t-data` + tabular-nums (currently `clamp(2.4rem,5.4vw,4rem)`, bumping to the shared `--t-data` scale). Arrow (`→` inside "5 → 1" and "4 → 2") gets wrapped in a `<span class="tn-stat__arrow">` (markup-only change) set at a visibly lighter weight/opacity than the numerals. The foot lines (*"Vaktplan, lønn, Messenger…"* etc.) already function exactly as the "method line" the brief asks for — no new copy needed, just restyle to `--t-meta`.

**Alternating grey bands:** removing the inline `style="background:#fafafa"` from all 7 sections that currently have it. **Revised per pushback:** `--paper-raised` is no longer spent on a section band at all — it goes on the **summary card's fill only**. That solves two problems at once: the one boxed module gets real separation from the page without needing a border, and the page keeps a single uninterrupted paper tone from hero to footer, which is the stronger, less-decorated result. (If it turns out the card fill alone isn't enough separation once screenshotted, the one defensible section-level fallback is the testing/honesty section — a tonal shift there would encode an actual change in register, unlike an arbitrary "every third section" pattern. Card-fill is the default; falling back to testing/honesty only if the static screenshot proves it's needed.)

**"Seks kjerneområder" sitemap graphic:** rebuilding, not cutting — **confirming this covers the brief's own callout of it as the weakest block on the page.** It's real structural information (the actual IA of the shipped prototype) and deserves to be legible, not thrown away. Rebuild as a 2×3 (or 3×2 on mobile: keeps existing breakpoint logic) grid of the same six areas, each cell: `--t-meta` number+name, one hairline-separated cell, no card fill, no dashed borders. This replaces `.tn-sitemap__node`'s current bordered-box-per-node treatment with hairline-divided cells consistent with the rest of the page's de-boxing.

**Design 1/3, 2/3, 3/3:** unify to the same internal structure across all three (already close — eyebrow with fraction → title → spec list → media). **Sticky device column, revised per pushback:** landing on **Design 2/3** (Mobil — Vaktplan), for the reason given — a portrait phone is tall/narrow and pins naturally in a column; the Design 3/3 iPad video is landscape and would eat half the viewport height while pinned, which reads as a bug, not a moment. Adding the conditional the pushback specified rather than assuming it always applies cleanly: measure the actual rendered heights of the text column and the media column on load (and on resize, debounced) and only apply `position: sticky` if the text column is **≥ 1.6×** the media column's height — otherwise the sticky class is withheld and it scrolls normally. This is a load/resize-time measurement, not scroll-driven, so it doesn't touch the single scroll-listener budget in §4.

**Image rhythm — revised after actually opening the two full-bleed candidates, not assuming from filenames.** Pushback was right to distrust a mechanical A-B-C rotation, and checking the two images changed the plan, not just the wording:

- `herotjonn.webp`: I opened it. It's a laptop-on-a-real-table lifestyle shot, **but the screen (a "Min trening" module UI, red accent buttons, numbered steps) fills roughly 40% of the frame and is clearly the subject** — the plant/table/chair are staging, not the point. That's a UI screenshot wearing a lifestyle photo as a frame. Per the rule "full-bleed is for atmospheric photography only — a UI screenshot at 100vw is illegible and looks like an error," this **does not qualify**. Reclassifying to **Contained**.
- `tjonni-mockup.webp`: also opened it. It's a genuine triptych — three separate lifestyle photos (hands on a wood table, someone on a couch in denim, a café tabletop with coffee) where a phone appears small in each frame, UI barely legible at any size. This is real atmospheric/context photography where the product is secondary. Full-bleed is the right call here, unchanged.

Net effect: rather than force a symmetric two-full-bleed rotation, the page gets **exactly one** full-bleed image (`tjonni-mockup.webp`) and **one** intimate image (the hero phone, already there) — which is all acceptance criterion #5 actually asks for ("at least one," not "exactly two, alternating"). Manufacturing a second full-bleed moment just to hit a pattern would have been the same mechanical slop the pushback flagged, just in the other direction.

| Image | New scale | Why |
|---|---|---|
| Hero phone mockup | **Intimate** (already ~280px, keep) | Already isolated on paper, already works. The only intimate use on the page — brief caps it at two, this uses one. |
| `herotjonn.webp` (Kontekst) | **Contained** (max 1240px, radius-content, device shadow) | Reclassified — it's UI-forward, not atmospheric (see above) |
| `marimette.webp` + quote (Problem) | **Contained** (max 1240px, radius-content) | Photo + frosted card needs a defined edge, not an edge-to-edge bleed |
| Sitemap rebuild (IA) | **Contained**, typographic (no photo) | n/a |
| `onboarding-login.webp` (Design 1/3) | **Contained**, device shadow | finished mockup, chrome baked in |
| Design 2/3 video | **Contained**, radius-device + shadow | raw screen capture, needs a drawn device bezel |
| Design 3/3 video + `ipad-min-trening.webp` | **Contained**, radius-device (video) / device shadow (finished mockup) | two different image *kinds* back to back but both Contained — neither is Full Bleed or Intimate, and they're visually distinct content (raw capture vs. finished screen), not a repeat |
| `tjonni-mockup.webp` (standalone section) | **Full bleed** (100vw) — the page's only one | Verified atmospheric triptych, UI secondary in-frame — the one image on the page that actually earns edge-to-edge |

Every image gets an explicit `width`/`height` attribute (from the actual file dimensions, checked via Pillow) to kill layout shift, and a `--t-meta` caption in `--ink-faint` under it, left-aligned to the image's own edge (currently `.tn-stmt__caption` is `text-align:center` — switching to left).

**Video attributes, revised per pushback:** `muted playsinline loop`, kept. `preload="metadata"` → **`preload="none"`** (currently loads metadata for two autoplaying videos on page load; not needed until the section is near-viewport). Poster frames stay (already real, not blank — confirmed working in an earlier pass on this page). **`autoplay` gets conditional:** under `prefers-reduced-motion: reduce`, no autoplay — show the poster frame plus a small play/pause control instead (new minimal markup: one `<button>` per video, not new copy; brief's own checklist exempts real UI controls from the "no decorative icon" rule). Under normal motion preference, autoplay behavior is unchanged.

**Radius/border, page-wide:** exactly two values. `--radius-content: 20px` (summary panel, stats band, contained UI screenshots, quote panel). `--radius-device: 32px` for any wrapper *I* draw around a raw screen-recording to imply a bezel (Design 2/3 and 3/3 videos) — matches the existing `.tn-design__frame:has(video)` 32px choice already in the file, so it's not a new number, just applied consistently. Finished mockup PNGs that already contain their own device chrome (hero phone, onboarding two-iPhones, ipad-min-trening) get **no** added radius — the frame is already baked into the photo, and box-shadow only, per the brief's own device-mockup allowance.

**Sticky nav:** this page's "pill nav" is actually N individual pills (one per link), not one bar — so "add backdrop-filter to the container" doesn't quite apply literally; I'm adding `backdrop-filter: blur(20px) saturate(180%)` + translucent `background` to each pill (`.tn-nav .proj-header__logo`, `.tn-nav .proj-header__link`), which is the actual visual unit here. Shrink padding ~25% after 80px scroll via one class toggle (`.tn-nav--scrolled`) driven by the single shared scroll listener, transition 300ms.

**Active-section indicator — flagging a mismatch:** the brief assumes this nav is an in-page table of contents (Kontekst/Problem/Prosess/…). It isn't — it's the shared site nav (Arbeider/Mer arbeid/Om meg/Kontakt), identical across every project page. There's no "active section" to indicate without inventing new in-page nav UI that doesn't exist anywhere else on the site.

**Open question 2:** skip the active-section indicator entirely (my default), or add a small scroll-progress hairline under the nav as a low-risk substitute? I won't invent an in-page jump-nav without asking — it'd be new UI, not a restyle.

**Footer:** brief's "one bold gesture" is already spent on the sticky device column in Design 2/3 — keeping the footer plain, per the brief's own fallback instruction.

---

## 4. Motion — four effects, exactly

1. **Blur-in reveal** at section level + one child stagger, `[data-reveal]`, fires once via `IntersectionObserver({threshold:.15, rootMargin:'0px 0px -12% 0px'})`, then `unobserve`. **Finding:** the existing reveal JS (`.bg-section, .proj-section, .project-layout__intro, …`) doesn't match any class on this page at all (`tn-stmt`, `tn-summary`, `tn-quote` aren't in that selector) — so right now this page has *zero* scroll-reveal, dead inherited code. I'll add page-scoped `data-reveal` hooks instead of trying to widen the shared selector (which would affect other pages).
2. **Progressive blur under the nav** — four stacked masked layers, static CSS, `pointer-events:none`, tested in the Safari the user is actually running (screenshot showed Chrome on Mac — I'll sanity-check in Safari too since that's where layered `backdrop-filter` most commonly breaks).
3. **Hero dissolve + parallax** — `@supports (animation-timeline: view())` primary path, single rAF-throttled scroll listener as fallback writing `--scroll-y`, clamped 0–1 over first 80vh. This is the **one** scroll listener acceptance criterion #7 asks for — nav shrink and hero parallax both read from it, nothing else adds a second listener.
4. **Image scale-in** — Contained and Full-bleed images only (per spec), never on device mockups.

`prefers-reduced-motion: reduce` strips all blur/transform site-wide on this page; JS-disabled fallback via `html:not(.js) [data-reveal])` keeps everything visible unconditionally.

---

## 5. Commit plan

1. **Tokens** — new `:root`-ish custom properties on `.proj-main`, font self-hosting + Poppins removal, old `--tn-*` names retired (search/replace, not append).
2. **Grid & spacing** — three-track `.tn-stmt__row`, `--section-y` verified identical across all prose sections (already true today, will re-verify after cell merges).
3. **Type hierarchy** — apply the scale, enforce the two contrast rules, wrap the stat arrows.
4. **De-boxing** — merge summary cards to one panel, box the stats band, strip the 7 `background:#fafafa` inline styles, rebuild the sitemap graphic.
5. **Image rhythm** — assign the three scales per the table above, add width/height + left-aligned captions, bake the hero gradient to a static image.
6. **Motion** — all four effects, only after 1–5 are screenshotted and correct.

Screenshots at 1440 / 1024 / 390 after each stage, checked against the brief's acceptance-criteria list before moving to the next.

---

## Open questions — all four resolved

1. ~~Drop Poppins, self-host~~ → **Resolved: yes.** Self-hosting Playfair (variable, not static Display) + Inter, latin + latin-ext, into `assets/fonts/`. GDPR rationale accepted as a second reason beyond performance.
2. ~~Active-section indicator~~ → **Resolved: skip.** Not inventing in-page TOC UI to satisfy a brief line item. Revisit only if the static pass genuinely feels disorienting.
3. ~~`--paper-raised` placement~~ → **Resolved: summary card fill, not any section.** Page stays one paper tone hero-to-footer. Testing/honesty section is the noted fallback only if the card fill proves insufficient once screenshotted.
4. ~~Sticky device column~~ → **Resolved: Design 2/3 (mobile), with a measured 1.6× height gate**, not applied unconditionally.

Nothing left open. Three additional corrections made from your pushback, not just acknowledged: the accent split into text/non-text tokens (verified with an actual rendered squint-test, not just contrast math), the full-bleed assignment changed after actually opening both candidate images (`herotjonn.webp` reclassified to Contained, only `tjonni-mockup.webp` stays full-bleed), and the video attributes tightened (`preload="none"`, conditional autoplay under reduced motion with a real play control).

---

## Verification tooling — dev-only, throwaway, not part of the repo

Wrote `type-audit.js` (lives in the scratchpad, not committed) — walks the DOM, logs computed `font-size` for every thesis/body pair scoped per section, flags any pair under the 2.4× floor, and separately flags any two DOM-adjacent visible text nodes under 1.4× of each other. Ran it via CDP against the *current, unmodified* page at 1440px to get a real baseline rather than relying on the clamp-math estimate:

```
Hero h1 vs body:        3.73×  (passes 2.5× floor already)
Thesis vs body, all 10 sections:  2.08× uniformly  (FAIL — floor is 2.4×)
Adjacent-pair violations under 1.4×: 40 found, most trivial (label/value pairs
  at 1.02–1.22×, expected), the real one is the stats band's claim-vs-foot-line
  at 1.29× — directly fixed by the --t-data treatment in §1.
```

I'll re-run this same script after each commit stage below and report the numbers, rather than eyeball whether the type hierarchy actually improved.

---

## Commit plan, unchanged in order, ready to start

1. **Tokens** — including the revised accent split, self-hosted fonts, `--paper-raised` on the summary card only.
2. **Grid & spacing** — three-track `.tn-stmt__row`.
3. **Type hierarchy** — apply the scale, re-run `type-audit.js`, confirm 0 thesis failures before moving on.
4. **De-boxing** — merge summary cards to one panel (with the raised fill), box the stats band, strip the 7 `background:#fafafa` inline styles, rebuild the sitemap graphic.
5. **Image rhythm** — assign scales per the corrected table, video attribute changes, add play controls, bake the hero gradient to a static image, sticky-device measurement script for Design 2/3.
6. **Motion** — all four effects, only after 1–5 are screenshotted and correct.

Starting commit 1 now unless you want to change anything above.
