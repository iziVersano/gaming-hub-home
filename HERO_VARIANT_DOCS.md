# Hero Section Feature Flag Documentation

## Overview
The hero section supports two visual variants controlled by a feature flag. Both variants use the **same HTML markup** — only the visual styling changes via CSS.

## Feature Flag Location
**File:** [src/components/HeroSection.tsx](src/components/HeroSection.tsx)
**Line:** 10

```typescript
const HERO_VARIANT: "gaming" | "photo" | "photo-carousel" = "gaming";
```

## Variants

### Variant A: "gaming" (Default)
**Style:** Bright, vibrant gaming aesthetic
**Features:**
- Light white overlay (85-90% opacity)
- Cyan → Blue → Purple → Magenta colored gradient overlay
- Animated glow elements (pulsing neon orbs)
- Grid pattern overlay
- Vibrant accent colors
- Neon glow effects on buttons

**Best for:** Gaming products, tech gear, high-energy e-commerce

---

### Variant B: "photo"
**Style:** Editorial, photographic, premium (ISFAR-inspired)
**Features:**
- Dark gradient overlay (40% black → transparent) for text readability
- No colored gradients
- No animated glow elements
- No grid pattern
- White text with subtle shadow
- Clean, minimal aesthetic

**Best for:** Lifestyle photography, premium products, editorial content

---

### Variant C: "photo-carousel"
**Style:** Auto-rotating carousel with 3 lifestyle images
**Features:**
- Full-width carousel using 3 images from `assets/hero/`
  - asus1.jpg
  - meta1.jpg
  - sps.jpg
- Dark gradient overlay (45% → 15% black) for text readability
- Auto-rotates every 5 seconds
- Dot indicators at bottom center
- Smooth transitions between slides
- Same text/content across all slides
- White text with shadow for visibility

**Best for:** Product showcases, multi-category stores, dynamic homepage

**Technical Details:**
- Minimal vanilla JS with React hooks
- No external carousel libraries
- Lightweight implementation (~50 lines of code)
- Smooth background-image transitions

---

## How to Switch Variants

1. Open [src/components/HeroSection.tsx](src/components/HeroSection.tsx)
2. Find line 10:
   ```typescript
   const HERO_VARIANT: "gaming" | "photo" | "photo-carousel" = "gaming";
   ```
3. Change the value to:
   - `"gaming"` for bright gaming style
   - `"photo"` for photographic editorial style
   - `"photo-carousel"` for auto-rotating carousel
4. Save the file — hot reload will update automatically

---

## CSS Implementation

### CSS Classes Applied
**Section element:**
```html
<section class="hero hero--gaming">  <!-- or hero--photo or hero--photo-carousel -->
```

**Child elements use semantic classes:**
- `.hero__overlay` - Main overlay (light or dark depending on variant)
- `.hero__colored-overlay` - Gaming variant only
- `.hero__glow-container` - Gaming variant only (animated orbs)
- `.hero__grid` - Gaming variant only (grid pattern)

### CSS Location
All variant styles are in [src/index.css](src/index.css) starting at line 161

---

## Technical Details

### No Layout Shift
- Both variants use identical HTML structure
- Spacing, alignment, and text content remain the same
- Only background images, overlays, and effects change

### No Duplication
- Single hero component
- Single set of markup
- CSS-only variant switching

### Performance
- No JavaScript required for rendering
- CSS-only styling changes
- All effects use CSS properties (no canvas/WebGL)

---

## Example Use Cases

### Seasonal Campaigns
Switch to "photo" variant for holiday campaigns with lifestyle photography

### Product Launches
Use "gaming" variant for gaming gear launches
Use "photo" variant for premium tech products

### A/B Testing
Toggle between variants to test conversion rates

---

## Customization

### Adding More Variants
1. Add new variant to the type union:
   ```typescript
   const HERO_VARIANT: "gaming" | "photo" | "minimal" = "gaming";
   ```

2. Add CSS rules in [index.css](src/index.css):
   ```css
   .hero--minimal .hero__overlay {
     background: rgba(255, 255, 255, 0.95);
   }

   .hero--minimal .hero__colored-overlay,
   .hero--minimal .hero__glow-container,
   .hero--minimal .hero__grid {
     display: none;
   }
   ```

### Changing Background Image
The background image is set in [HeroSection.tsx:14](src/components/HeroSection.tsx)
```typescript
style={{
  backgroundImage: `url(${heroBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}}
```

To use different images per variant:
```typescript
const bgImage = HERO_VARIANT === "photo" ? photoBg : heroBg;
```

---

## Browser Support
- All modern browsers (Chrome, Firefox, Safari, Edge)
- CSS custom properties (CSS variables) required
- CSS backdrop-filter support recommended but optional
