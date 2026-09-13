# Petal & Crumb Bakery — Design System

## Color Strategy: Restrained with Committed moments
Foundation is warm porcelain (oklch 0.982 0.008 75) rather than stark white, echoing fondant and linen. Pale rose wash (oklch 0.93 0.04 13) provides softness. Rosewood Glaze #A8515A / oklch 0.49 0.09 18 carries interactive emphasis for CTAs, active fields, and price states. Ink is softened brown-black oklch 0.25 0.018 35 so display type stays elegant. Tinted neutrals, no pure #000/#fff.

## Typography
Display: Cormorant Garamond 400/500/600/700 (incl. italic) — high-contrast, romantic, tight tracking -0.055em, line-height 0.92 for headlines. Body/UI: DM Sans 400/500/600/700 — humanist, optical sizing 9..40 for labels/forms. Hierarchy via scale >=1.25 ratio. Tiny labels use 9–10px uppercase with 0.12–0.18em tracking. Body line length capped at 65ch, line-height 1.6–1.7.

## Elevation & Borders
Flat editorial with fine hairlines. Borders 1px #ddcfc8/#e7dad3, rarely. Soft shadows only for studio tools: 0 22px 60px rgba(79,54,45,.08), 0 18px 50px rgba(84,56,48,.08). Radius 0.2rem (3.2px) — modest, control-focused.

## Spacing & Layout
Vertical pastry counter rhythm: generous header/hero, offset editorial block, mosaic tiles, gallery strip. Order studio grid: 1fr + 360px sticky quote at lg. Asymmetric, not card grids. Padding varies for rhythm.

## Components
- .eyebrow — rosewood uppercase 10px / 0.18em
- .display-title — Cormorant 500, -0.055em
- .button-rose — solid rosewood, -1px lift on hover, 160ms expo, 10px uppercase
- .button-ink — ink outline, fills on hover
- .field-base — porcelain field, rosewood focus ring
- .visual-tile — cover image with 500ms scale 1.035 on hover
- .logo-bloom — four-petal flower + crumb center, 45deg square
- calendar-seven — 7-column availability grid with open/lead-time/full states

## Motion
Opacity + translate only: 180–240ms for controls, 240ms section entrances with 60ms stagger, fadeUp 520ms cubic-bezier(.23,1,.32,1). Single bloom pulse on confirmation. Respects prefers-reduced-motion.

## Theme
Light, high-key. Scene: Someone browsing cakes at a sunlit kitchen table on a Saturday morning, choosing flavors before a celebration — warm, airy, paper-like, not dim or dramatic.
