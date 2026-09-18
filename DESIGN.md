# Petal & Crumb Bakery — Design System

## Color Strategy: Restrained with Committed moments
Foundation is warm biscuit cream (oklch 0.971 0.017 78) rather than stark white, echoing fondant and linen. Chocolate ink oklch 0.305 0.033 42 keeps display type warm. Terra-cotta oklch 0.615 0.115 27 carries interactive emphasis for CTAs, active fields, price states, and the brand mark. Three supporting pastels — blush oklch 0.925 0.045 15, sage oklch 0.855 0.055 128, butter oklch 0.92 0.062 95 — round out icon chips and accent surfaces. Tinted neutrals, no pure #000/#fff.

Legacy aliases resolve to the new palette: `--rosewood` → terra, `--rosewood-hover` → terra-deep, `--porcelain` → cream, `--shell` → paper.

## Typography
Display: Vollkorn 400/500/560/600/700 (incl. italic) — warm old-style serif, generous forms, italic accent words rendered in terra. Body/UI: Nunito Sans 400/500/600/700/800 — humanist, friendly, optical sizing 6..12. Script: Caveat 500/600/700 for handwritten annotations ("Seasonal ingredients", "Life is sweeter with cake"). Hierarchy via scale >=1.25 ratio. Tiny labels use 10–11px uppercase with 0.12–0.18em tracking. Body line length capped at 65ch, line-height 1.6–1.7.

## Elevation & Borders
Flat editorial with fine hairlines. Borders 1px warm hairline oklch 0.89 0.025 62, rarely. Soft shadows only for cards and the order studio: 0 24px 70px oklch(0.305 0.033 42 / 0.08), 0 10px 30px oklch(0.305 0.033 42 / 0.12). Pill shapes radius 999px; tiles and panels radius 1–2rem.

## Spacing & Layout
Pastry counter rhythm: generous hero, offset editorial block, staggered mosaic, gallery strip, journal carousel, order studio preview, drenched closing. Order studio grid: 1fr + 370px sticky quote at lg. Asymmetric, not card grids. Padding varies for rhythm.

## Components
- .eyebrow — terra uppercase 11px / 0.17em tracking
- .display-title — Vollkorn 560, -0.022em tracking, italic terra accent words
- .font-script — Caveat handwritten annotation
- .button-rose — solid terra pill, -2px lift on hover, 160ms expo
- .button-ink — ink-outline pill, fills on hover
- .button-cream — paper pill for dark/blush sections
- .field-base — paper field, terra focus ring, 0.9rem radius
- .visual-tile — cover image with scale 1.045 on hover, 1.1rem radius
- .chip-icon — pastel rounded-2xl icon chip, 1rem radius
- .bloom-mark — six-petal bloom SVG with sage leaves + butter center
- calendar-seven — 7-column availability grid with open/lead-time/full states
- SprigDivider / ButterBlob / LeafSprig / HeartDoodle / SquiggleArrow — botanical decor SVGs

## Motion
Opacity + translate only: 180–240ms for controls, 240ms section entrances with 60ms stagger, fadeUp 520ms cubic-bezier(.23,1,.32,1), heroLineRise 850ms, bloom pulse on confirmation, drift on botanical decor. Single bloom pulse on confirmation. Respects prefers-reduced-motion (instant reveals, static, no parallax/drift).

## Theme
Light, high-key. Scene: Someone browsing cakes at a sunlit kitchen table on a Saturday morning, choosing flavors before a celebration — warm, airy, paper-like, not dim or dramatic.
