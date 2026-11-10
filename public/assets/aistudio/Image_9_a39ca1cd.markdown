---
name: Karachu
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3d4947'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#4648d4'
  on-tertiary: '#ffffff'
  tertiary-container: '#6063ee'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: 3rem
    letterSpacing: -0.025em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.875rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.625rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.01em
  numeric-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.03em
  numeric-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.875rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.025em
  numeric-table:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '600'
    lineHeight: 1.375rem
    letterSpacing: -0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '600'
    lineHeight: 1.125rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an accessible, reassuring neo-banking aesthetic crafted specifically for modern personal finance management. The brand identity fuses structured financial discipline with an approachable, contemporary visual language.

### Personality & Emotional Response
- **Assurance & Control:** Interfaces eliminate visual noise to instill absolute confidence when reviewing balances, investments, and daily transactions.
- **Friendly Precision:** Rounded geometric forms soften high-density financial data without diluting institutional credibility or mathematical accuracy.
- **Dynamic Clarity:** Balances and analytical charts remain distinct and glanceable, transforming potentially overwhelming monetary tracking into an intuitive, encouraging daily ritual.

### Design Movement: Modern Neo-Banking & Soft Corporate
The aesthetic pairs crisp, daylight-driven neutral canvases with soft, pill-shaped UI components, subtle surface elevation, and purposeful semantic color coding. It eschews gratuitous skeuomorphism in favor of structural clarity, generous breathing room, and immaculate numeric alignment.

## Colors

The color system delivers high-contrast legibility for complex numbers, paired with a distinct emerald teal core and balanced category accents.

### Core Roles
- **Primary (`#0D9488`):** Deep emerald teal. Signifies positive cash flow, confirmed actions, verified accounts, and key interactive touchpoints.
- **Secondary (`#0F172A`):** Deep slate navy. The bedrock text and structural icon color, replacing pure black to eliminate harsh glare while exceeding WCAG AAA contrast ratios against light surfaces.
- **Tertiary (`#6366F1`):** Soft violet. Drives predictive insights, recurring subscriptions, and secondary callouts.
- **Neutral (`#F8FAFC`):** Crisp daylight canvas. Offsets pure white cards (`#FFFFFF`) to establish soft, structural card hierarchies without heavy container lines.

### Functional & Categorical Accents
- **Income / Surplus:** Emerald Teal (`#0D9488` / Tint `#F0FDFA`)
- **Expense / Alert:** Rose (`#E11D48` / Tint `#FFF1F2`)
- **Savings & Goals:** Sky Blue (`#0284C7` / Tint `#F0F9FF`)
- **Budget Warnings & Discretionary:** Amber (`#D97706` / Tint `#FFFBEB`)
- **Dividers & Structural Borders:** Slate Gray (`#E2E8F0`)

## Typography

The typographic hierarchy relies on a dual-engine structure: **Plus Jakarta Sans** provides welcoming geometric contours for headings and total portfolio valuations, while **Inter** delivers neutral, highly legible glyph rendering for financial ledgers, dense transactions, and meta descriptions.

### Financial Numeral Treatment
- All monetary metrics displayed with Inter must utilize tabular numbers (`font-variant-numeric: tabular-nums`) to guarantee strict vertical column alignment across changing balance digits.
- Negative amounts rely on standard minus glyphs prefixed with category-tinted rose tones, while positive flows utilize prefixed plus signs rendered in primary teal.
- Headings above 24px adjust letter spacing downward to lock headline tracking tight and eliminate visual stutter.

## Layout & Spacing

The layout model adopts a content-first fluid mobile grid that steps gracefully into structured card arrangements on larger screens.

### Grid & Form Factors
- **Mobile (<640px):** Single-column stack with `1rem` margins and fluid edge-to-edge content containment. High-priority cards sit inside safe view bounds, preserving clear thumbs-reach targets.
- **Tablet (640px–1023px):** 6-column fluid grid, `1.5rem` margins, enabling side-by-side financial metric modules and split-pane transaction views.
- **Desktop (≥1024px):** 12-column fixed grid with a max width of `1200px` and `2.5rem` outer canvas padding.

### Spacing Philosophy
Internal component padding adheres strictly to an 8pt increment model with a 4pt micro-step (`space-xs`). Transaction items consistently maintain `space-sm` vertical spacing with `space-md` horizontal breathing room, preserving compact touch targets that avoid crowding.

## Elevation & Depth

Visual hierarchy leverages crisp ambient shadows layered over clean background shifts instead of opaque borders.

### Surface Tiers
- **Canvas Base (`#F8FAFC`):** The foundational substrate behind modular card groups.
- **Card Surface (`#FFFFFF`):** High-level elevation tier containing actionable clusters, charts, and metric groups.
- **Modal & Drawer Overlays (`#FFFFFF`):** Floating sheets anchored with backdrop filters (`backdrop-blur-md` with `rgba(15, 23, 42, 0.3)` veil).

### Ambient Drop Shadows
- **Card Rest:** `0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.03)`
- **Card Elevated / Floating:** `0 8px 24px rgba(15, 23, 42, 0.07), 0 2px 6px rgba(15, 23, 42, 0.04)`
- **Sticky Bottom Action Container:** `0 -4px 16px rgba(15, 23, 42, 0.03)`

Shadows utilize a subtle cool tint derived from the secondary slate navy hue, preventing the muddy appearance typical of neutral black drop shadows.

## Shapes

The interface embraces a pill-forward geometric structure (roundedness level `3`). Curvature communicates safety and tactile approachability throughout the financial experience.

### Radius Scale Implementation
- **Small Controls & Chips (`rounded-full`):** Filter pills, transaction category badges, tag selectors, and primary buttons use fully continuous pill contours (`9999px` / `1rem+`).
- **Cards & Data Panels (`rounded-2xl` / `2rem`):** Main metric summaries, spending insights, and transaction groups feature large, rounded corners that cradle the underlying data.
- **Sheets & Modal Containers (`rounded-3xl` / `3rem`):** Top sheet edges and slide-up dialogs feature expansive radii, reinforcing visual continuity with native mobile sheet metaphors.

## Components

### Buttons
- **Primary Button:** Pill-shaped (`rounded-full`), solid emerald teal background (`#0D9488`), crisp white text (`#FFFFFF`), `0.75rem` vertical by `1.5rem` horizontal padding. On press, scale transitions to `0.98` with a darkened state (`#0F766E`).
- **Secondary Button:** Surface white card pill with subtle border (`1px solid #E2E8F0`), navy text (`#0F172A`), maintaining identical padding and hover lightening to `#F8FAFC`.

### Chips & Filter Pills
- Encapsulated pills (`rounded-full`) used for period selection (1D, 1W, 1M, 1Y) and transaction filtering.
- **Active State:** Deep slate navy background (`#0F172A`) with high-contrast white text (`#FFFFFF`).
- **Inactive State:** Transparent or soft slate tint (`#F1F5F9`) with muted slate typography (`#64748B`).

### Transaction Cards & Lists
- Transaction items live inside unified cards rather than bare floating dividers.
- **Icon Container:** `2.5rem` circle or soft squircle housing high-contrast SVGs tinted with corresponding category hues (e.g., violet for software, amber for dining, emerald for salary).
- **Text Lockup:** Title rendered in Inter SemiBold (`body-md`), timestamp and category subtitle in Inter Regular (`body-sm`, `#64748B`).
- **Amount Right-Align:** Rendered in tabular Inter SemiBold; negative spending appears in secondary slate (`#0F172A`), positive inbound transfers in primary emerald teal (`#0D9488`).

### Input Fields
- Enclosed input boxes utilizing `rounded-full` for search rows and `rounded-2xl` for form cards.
- Background defaults to `#F8FAFC` bordered with `1px solid #E2E8F0`. Focus state triggers a clean `1.5px` border in `#0D9488` with a subtle focus glow (`0 0 0 3px rgba(13, 148, 136, 0.12)`).

### Metric Cards & Budget Trackers
- Hero metrics showcase account balances using Plus Jakarta Sans Bold (`numeric-hero`), paired with a pill badge displaying percentage change over prior periods.
- Progress bars inside cards utilize soft slate tracks (`#F1F5F9`) with `rounded-full` emerald teal or amber fills reflecting current spending versus monthly threshold allocations.