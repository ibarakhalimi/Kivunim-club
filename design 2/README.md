# מועדון כיוונים — מערכת עיצוב

A design system for **מועדון כיוונים** (Kivunim Club), a modern members-only platform. **Modern editorial, Hebrew-first, RTL, light theme** with a magenta/pink/purple palette.

> RTL throughout. All product copy in Hebrew. CSS sets `direction: rtl` at the root.

---

## At a glance

| | |
|---|---|
| **Vibe** | Modern editorial. A touch of soft glamour. Magenta is the hero. |
| **Theme** | Light, faintly pink-tinted neutrals. Vivid magenta→pink→purple gradients reserved for hero moments. |
| **Direction** | **RTL** (`<html dir="rtl">`). Hebrew copy, Latin/numeric runs (IDs, dates, CSS vars) explicitly `dir="ltr"`. |
| **Typography** | `Frank Ruhl Libre` (display, Hebrew serif) + `Heebo` (body, sans) + `JetBrains Mono` (numerals, codes). |
| **Density** | Comfortable, spacious. 4px grid. |
| **Corner radii** | Rounded but architectural — 12–20px on cards, pill on buttons. |
| **Iconography** | Lucide-style 1.5px stroke SVGs inlined in `components.jsx`. |

---

## CONTENT FUNDAMENTALS

Warm, confident, a little playful. Like a doorman who knows your name. Hebrew sentence rhythm — short, no fluff.

**Voice principles**
- **את-first / atem-first.** Address the member directly: "הכרטיס שלך", "את בפנים".
- **Quietly elevated.** Sentence case in UI. Don't shout.
- **Specific over generic.** "47 הטבות פתוחות" beats "המון הטבות".
- **No emoji** in product copy.
- **Numerals as identity.** Member numbers, dates, prices — mono face, LTR. They're part of the texture.

**Examples**
- Empty state: *"אין אירועים השבוע. נשלח SMS כשמשהו ייפתח."*
- Tier nudge: *"את 3 אירועים משלב המייסדים."*
- CTA: *"אישור הגעה"*, *"פתחו את הכרטיס"*, *"הצטרפו כחברים"*.
- Error: *"זה לא נראה כמו אימייל. ננסה שוב?"*

---

## VISUAL FOUNDATIONS

**Color.** Magenta (`--magenta-500`, hue 340) is the brand. Pink (hue 10) and purple (hue 305) flank it for gradients. All accents share chroma ≈ 0.21 so the palette feels cohesive. Neutrals are warm, tinted with the same magenta hue at very low chroma (`0.008–0.025`) — never cool gray, never pure black.

**Type.** **Frank Ruhl Libre** is the Hebrew display face — modern editorial serif, used at weights 300–700 for hero headlines and titles. **Heebo** is the UI body face — Roboto-like, weights 400/500/600/700. **JetBrains Mono** for member numbers, dates, CSS vars (and these run LTR).

**Emphasis in Hebrew display.** Hebrew has no italic. We substitute with a **magenta-600 color shift** on `<em>` inside display headings — same visual emphasis, native to the writing system.

**Spacing.** 4px grid. Pages breathe with 48–96px between sections.

**Backgrounds.** Mostly flat tinted whites. Hero moments use the brand gradient (`--grad-primary` or `--grad-glow`) — full-bleed on the membership card and onboarding hero only.

**Animation.** Soft and confident. `--ease-out` for entrance, `--ease-spring` for celebratory pops. 120/200/320/520ms.

**Hover & press.** Solid buttons darken one shade. Press shrinks by `scale(0.98)`. Focus ring is a 4px soft magenta halo (`--shadow-glow`).

**Borders.** Hairline (1px) almost everywhere, tinted neutral (`--border-subtle`).

**Shadows.** Warm, pink-tinted (mixed from `oklch(0.40 0.10 340 / α)`). Five elevations from `--shadow-xs` to `--shadow-xl`. A dedicated `--shadow-card` for the membership card.

**Transparency & blur.** Reserved. The bottom tab bar and modals use 12–20px backdrop blur over `--bg-overlay`.

**Corner radii.** Buttons → pill. Inputs/chips → 12px. Cards → 16–20px. The membership card → 28px. Modals → 28px.

**Layout.** Mobile-first inside an iPhone bezel. Bottom tab bar with 5 destinations.

---

## ICONOGRAPHY

Lucide-style inline SVGs (1.5px stroke, rounded joins) built into `components.jsx`. No icon font, no CDN.

Used liberally: `sparkles`, `ticket`, `calendar`, `pin`, `users`, `qr`, `bell`, `heart`, `star`, `chev`, `plus`, `search`, `user`, `home`, `settings`, `coffee`, `wine`, `key`, `share`, `map`, `moon`.

**Sizes:** 16 (inline), 18–20 (tab bar / list rows), 24 (buttons), 28+ (sheet headers).

**Directional icons** (`chev`, `back`) flip in RTL with `transform: scaleX(-1)`.

---

## File index

| Path | What it is |
|---|---|
| `colors_and_type.css` | All tokens. Sets `dir="rtl"` and Frank Ruhl Libre + Heebo at the root. |
| `preview/*.html` | 28 design-system cards across Brand · Colors · Type · Spacing · Components. |
| `ui_kits/membership_app/` | Full mobile UI kit — 5 Hebrew RTL screens, interactive. |
| `SKILL.md` | Agent-compatible skill manifest. |

---

## CAVEATS & THINGS TO REVIEW

- **No source codebase, Figma, or brand assets were provided.** Whole system is invented.
- **Brand name** is "מועדון כיוונים" — confirm this is the actual name.
- **Pricing** (₪89 / ₪179) is illustrative.
- **Font substitution:** Frank Ruhl Libre + Heebo loaded from Google Fonts. Swap if licensed faces are available.
- **Icons** are inline SVGs, not a vendored production set.
- **No real logo** — the wordmark + "כ." mark is typographic only.

---

> ⚠️ **For org sharing**: set the file type to **Design System** in the Share menu so this surfaces in your org's catalog.
