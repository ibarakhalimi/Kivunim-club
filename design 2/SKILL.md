---
name: kivunim-club-design
description: Use this skill to generate well-branded interfaces and assets for מועדון כיוונים (Kivunim Club), a Hebrew-first members-only platform. Modern editorial style, RTL, light theme, magenta primary, Frank Ruhl Libre + Heebo typography. Contains design tokens, components, and an interactive UI kit.
user-invocable: true
---

Read the `README.md` file in this skill first.

**Key files:**
- `colors_and_type.css` — all design tokens. Sets `direction: rtl` and Frank Ruhl Libre + Heebo at `:root`. Import in any HTML you build.
- `preview/` — 28 design-system cards (HTML, RTL Hebrew) as visual reference.
- `ui_kits/membership_app/` — interactive 5-screen mobile prototype, fully Hebrew + RTL. `components.jsx` has Button/Avatar/Badge/TierChip + a Lucide-style Icon set.

**When building:**
- Wrap your root in `<html dir="rtl" lang="he">` (or set `dir="rtl"` on body).
- Use `<em>` inside display headings — CSS automatically color-shifts to magenta-600 (Hebrew has no italic, so we use color instead).
- Buttons: `<Button variant="primary">` defaults to magenta pill. Variants: `primary`, `secondary` (ink), `ghost`, `tint`, `grad`.
- Keep Latin/numeric runs (member numbers, dates, CSS var names) in `direction: ltr` containers — wrap them in `<span dir="ltr">`.
- For directional icons (`chev`, `back`), apply `transform: scaleX(-1)`.

**Style guardrails:**
- Light theme only. Faintly pink-tinted canvas, never gray, never pure white.
- Hebrew copy. Latin only for brand fragments + numeric IDs.
- Pill buttons. Hairline 1px borders. Rounded 12–28px corners.
- Warm pink-tinted shadows (no hard offsets).
- Frank Ruhl Libre 500 for display headlines. Heebo 400/500/600 for body and UI.
- No emoji in product copy.

If invoked without further guidance, ask: what surface (app screen, marketing page, slide, email)? Then design as a Kivunim Club expert would.
