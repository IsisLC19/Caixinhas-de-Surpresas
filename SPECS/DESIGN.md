---
name: Caixinhas de Surpresas
colors:
  surface: '#fff8f7'
  surface-dim: '#e4d7d8'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fef0f1'
  surface-container: '#f8ebec'
  surface-container-high: '#f2e5e6'
  surface-container-highest: '#eddfe0'
  on-surface: '#201a1b'
  on-surface-variant: '#534343'
  inverse-surface: '#362f30'
  inverse-on-surface: '#fbeeee'
  outline: '#857373'
  outline-variant: '#d8c1c2'
  surface-tint: '#8e4a50'
  primary: '#713339'
  on-primary: '#ffffff'
  primary-container: '#8e4a50'
  on-primary-container: '#ffccce'
  inverse-primary: '#ffb2b7'
  secondary: '#894d52'
  on-secondary: '#ffffff'
  secondary-container: '#ffb2b7'
  on-secondary-container: '#7b4247'
  tertiary: '#5f410c'
  on-tertiary: '#ffffff'
  tertiary-container: '#7a5823'
  on-tertiary-container: '#ffd192'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdadb'
  primary-fixed-dim: '#ffb2b7'
  on-primary-fixed: '#3a0811'
  on-primary-fixed-variant: '#72333a'
  secondary-fixed: '#ffdadb'
  secondary-fixed-dim: '#ffb2b7'
  on-secondary-fixed: '#370c12'
  on-secondary-fixed-variant: '#6d363b'
  tertiary-fixed: '#ffddb2'
  tertiary-fixed-dim: '#ecbf7f'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#60410c'
  background: '#fff8f7'
  on-background: '#201a1b'
  surface-variant: '#eddfe0'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 34px
    fontWeight: '600'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  headline-sm:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 22px
  body-lg:
    fontFamily: Open Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Open Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 21px
  body-sm:
    fontFamily: Open Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 17px
  label-lg:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Outfit
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  spacing-3xs: 0.125rem
  spacing-2xs: 0.25rem
  spacing-xs: 0.5rem
  spacing-sm: 0.75rem
  spacing-md: 1rem
  spacing-lg: 1.25rem
  spacing-xl: 1.5rem
  spacing-2xl: 2rem
  spacing-3xl: 2.5rem
  gutter: 1rem
  margin-screen: 1.25rem
---

## Brand & Style

The brand personality is intimate, celebratory, thoughtful, and artisanally refined. It bridges the emotional warmth of handcrafted celebration gifts ("Festas na Caixa") with the polished convenience of a boutique mobile shopping experience. The visual language rejects juvenile party clutter, loud primary colors, and informal emojis, adopting instead a gentle, tactile editorial aesthetic.

### Aesthetic Direction
- **Minimalist Festive Luxury**: Clean spatial breathing room anchored by dusty rose neutrals and brushed champagne gold accents.
- **Tone & Mood**: Tender, celebratory, warm, and distinctly curated.
- **Iconography**: Clean, monoline strokes (Lucide or Google Material Symbols Rounded) rendered with a 1.5px stroke weight; no emojis anywhere in the interface.
- **Touchpoints**: Sensorial imagery, subtle warm gradients, tactile micro-surfaces, and clear, welcoming microcopy.

## Colors

The palette revolves around sophisticated dusty rose hues paired with soft champagne-gold accents, creamy tinted backgrounds, and deep, warm slate text neutrals.

### Palette Architecture
- **Primary Deep Rose (`#8E4A50`)**: Anchors primary buttons, key transactional headers, active navigation pills, and focal accents.
- **Secondary Dusty Rose (`#B57277`)**: Interactive hover/selected states, secondary tags, subheadings, and subtle highlights.
- **Tertiary Soft Gold (`#C59B5F`)**: Reserved for celebratory highlights, deluxe badges (e.g. "Edição Especial", "Personalizável"), rating stars, and gift-ribbon motifs.
- **Neutral Charcoal Slate (`#2D2627`)**: Rich high-contrast text color replacing stark harsh black, preserving typographic warmth.
- **Neutral Muted Gray (`#7B6F70`)**: Secondary metadata, item quantities, and placeholder text.
- **Surface Canvas / Base Tint (`#F7EEEE`)**: Screen backdrop delivering warm paper tactile elegance.
- **Surface Card / Container (`#FFFFFF`)**: Pure white containers over tinted canvases for natural, crisp layering.
- **Surface Alt / Field Fill (`#EEDCD9`)**: Input backgrounds, badge fills, and subtle division separators.

## Typography

The typographic pairing balances modern geometric structure and warm humanistic legibility.

- **Headings & Badges (`Outfit`)**: Delivers structured, modern, slightly geometric letterforms reminiscent of tailored packaging typography. Headlines maintain balanced kerning and soft rounded curves.
- **Body & Longform (`Open Sans`)**: Provides high-clarity optical readability at small sizes, optimal for gift bundle ingredient lists, customizable order forms, and shipping specifications.
- **Hierarchy Rules**: Display headings should maintain restrained letter-spacing (`-0.01em` to `-0.02em`) to enhance cohesion. Category tags and size badges utilize uppercase styling with deliberate tracking (`0.04em`).

## Layout & Spacing

This mobile-first design utilizes a 4-column fluid layout with strict 8pt grid intervals.

- **Screen Safe Margins**: Standard horizontal padding is 20px (`1.25rem`) on mobile, guaranteeing comfortable thumb reach and preventing visual tension against display edges.
- **Card Grids**: Two-column product grids use 12px or 16px gutters (`spacing-sm` / `spacing-md`), maximizing image real estate while preserving breathing room.
- **Vertical Flow Rhythm**: Section titles utilize 24px top separation and 12px bottom separation. Related items inside a card stay grouped within 8px–12px padding.
- **Sheet & Flow Density**: Modal checkout flows and box customization builders pin persistent sticky action bars at the bottom with 16px horizontal and vertical padding above mobile home indicator areas.

## Elevation & Depth

Visual depth combines warm atmospheric tinting with delicate, diffused multi-stop shadows rather than standard dark drop shadows.

- **Surface Levels**:
  - `Base`: `#F7EEEE` (overall screen background).
  - `Card Surface`: Pure white `#FFFFFF` layered over the base canvas.
  - `Elevated Sheets & Floating Action Bars`: Layered white surfaces with warm diffused drop shadows.
- **Shadow Specifications**:
  - `Subtle Float (Cards & Badges)`: `0px 2px 8px rgba(142, 74, 80, 0.05), 0px 1px 2px rgba(45, 38, 39, 0.03)`
  - `Active / Elevated (Bottom Sheets & Modals)`: `0px 12px 24px -4px rgba(142, 74, 80, 0.12), 0px 4px 8px -2px rgba(45, 38, 39, 0.04)`
- **Borders & Separation**: Hairline borders (`1px solid #EEDCD9`) define structural boundaries without adding visual weight.

## Shapes

The design uses balanced, soft radii (`roundedness: 2`) that evoke handcrafted gift boxes, wrapped ribbon corners, and delicate confections.

- **Containers & Product Cards**: 16px (`1rem`) border-radius for an approachable, tactile card feel.
- **Buttons & Action Triggers**: 12px to 14px border-radius, preserving finger tap clarity without turning overly pill-shaped.
- **Size & Category Badges (P / M / G)**: Compact rounded-full pills or 8px rounded squares with proportional aspect ratios.
- **Sheet Trays & Modals**: 24px top radii for bottom sheets, creating a soft transition over screen contents.

## Components

### Buttons
- **Primary CTA**: Deep rose (`#8E4A50`) solid background, white text (`Outfit`, 600 weight), 48px height, 12px radius. Soft warm shadow on resting state, slightly depressed scale (`scale: 0.98`) on tap.
- **Secondary CTA**: Pale background (`#EEDCD9`), deep rose text (`#8E4A50`), no shadow.
- **Tertiary / Gold Accent**: Bordered in `#C59B5F` with gold-tinted text for celebratory add-ons (e.g. "Adicionar Cartão com Mensagem").

### Product Cards (Festas na Caixa)
- Crisp `#FFFFFF` card body with 16px corner radius and hairline `#EEDCD9` border.
- Full-bleed or inset image header displaying the surprise box arrangement.
- Heart/favorite toggle pinned to the top-right corner with a translucent white circular backing (`rgba(255, 255, 255, 0.9)`).
- Clear typography hierarchy: Category in uppercase (`label-sm`, `#B57277`), Title in `headline-sm`, and prominent price formatted in bold deep rose.

### Size Selector Badges (P / M / G)
- Dedicated pill or square badge components designed specifically for box size variants:
  - **Unselected**: White background, `#EEDCD9` border, neutral dark text (`#7B6F70`).
  - **Selected**: Solid deep rose fill (`#8E4A50`), white bold text, accompanied by subtle sizing dimensions below (e.g., "Serve até 4 pessoas").
  - **Special Variant / Dourado**: Soft gold border (`#C59B5F`) with gold highlight indicator for premium tiers.

### Input Fields & Selectors
- Background `#FFFFFF` or soft tint `#F7EEEE`, surrounded by 1px `#EEDCD9` border.
- Focused state transitions border to `#B57277` with an ambient glow (`box-shadow: 0 0 0 3px rgba(181, 114, 119, 0.15)`).
- Input labels rendered in `Outfit` 500 weight (`#2D2627`), placeholder text in `#7B6F70`.

### Customization Checklist & Add-ons
- Clean circular checkboxes tinted `#8E4A50` with an ivory check mark when selected.
- Inline counter controls (+ / -) for custom items inside the box, framed in rounded containers with dusty rose glyphs.
- Clean vector icons indicating themes (cake, balloons, ribbon, photo card) keeping stroke weights uniform at 1.5px.