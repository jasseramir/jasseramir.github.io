# Design System

This document describes the visual language of the portfolio so new sections and components stay consistent. Every value here comes from `assets/css/styles.css`.

## Principles

1. **Flat.** No shadows, anywhere. Depth comes from color blocks, borders, and spacing. The stylesheet enforces this with `box-shadow: none !important` and `text-shadow: none !important` on `*`.
2. **Soft and rounded.** Large radii and pill shapes. Nothing has sharp corners.
3. **Color as structure.** Lavender, sky, white, and navy blocks separate content instead of dividers and heavy chrome.
4. **One typeface, strong weights.** Hierarchy is made with weight (700 to 900) and size, not with extra fonts.
5. **Content-first.** Sections are driven by data, so every component must look right with any amount of text.

## Color

Defined as custom properties on `:root`.

| Token | Value | Role |
| --- | --- | --- |
| `--cobalt` | `#0A1CF0` | Accent: section titles, active nav link, logo dot, metric bullets |
| `--lav` | `#E6C8F5` | Primary soft fill: hero frame, pills, primary buttons, chips |
| `--lav-h` | `#D8B5EB` | Hover for lavender |
| `--sky` | `#BDE6FB` | Secondary soft fill: skills card, certificates panel |
| `--navy` | `#1A1D27` | Dark surface and primary action: contact panel, dark buttons |
| `--off` | `#F7F7F8` | Page background and header |
| `--soft` | `#EFEDF1` | Quiet fill: stats bar, inputs, tags |
| `--line` | `#E5E7EB` | Borders and dividers |
| `--ink` | `#111827` | Body text |
| `--g3` | `#D1D5DB` | Muted text on navy, metric dividers |
| `--g6` | `#4B5563` | Secondary text |
| `--g7` | `#374151` | Card body text on colored fills |

### Card tones

Cards use one of three tones, set by a class:

| Class | Background | Notes |
| --- | --- | --- |
| `.c-lav` | Lavender | Sets `--d` for its inner divider |
| `.c-sky` | Sky | Sets `--d` for its inner divider |
| `.c-white` | White with a 1px `--line` border | Uses `--g6` body text |

`.foot` draws its top border with `var(--d, var(--line))`, so a footer divider automatically matches the tone of the card it sits in. Project cards cycle through `c-white`, `c-sky`, `c-lav` by index.

### Usage rules

- Cobalt is for accents only. Never use it as a large fill.
- On a white card, secondary buttons are `soft`. On a colored card, they are `white`, so they stay visible.
- Navy is reserved for the most important action in a region, and for the contact panel.

## Typography

**Typeface:** Plus Jakarta Sans (weights 400, 500, 600, 700, 800), loaded from Google Fonts, with `sans-serif` fallback.

| Use | Size | Weight | Notes |
| --- | --- | --- | --- |
| Hero name (`h1`) | 2.35rem, 4.5rem from 640px | 800 | `line-height: 1.05`, `letter-spacing: -.025em` |
| Section title (`.title`) | 1.875rem, 3rem from 640px | 800 | Cobalt, `letter-spacing: -.025em` |
| Card heading | 1.35rem to 1.5rem | 800 | Tight tracking `-.025em` |
| Contact heading | 1.5rem, 2.25rem from 1024px | 800 | `line-height: 1.2` |
| Certificate title (`h4`) | 1.35rem | 900 | |
| Logo | 1.375rem | 900 | |
| Nav links | 1rem | 800 | |
| Body in cards | 14px | 400 | `line-height: 1.6` |
| Eyebrow label (`.label`) | 11px | 700 | Uppercase, `letter-spacing: .05em` |
| Pills and buttons | 12px | 700 | Large buttons use 14px |

Headings use negative letter-spacing. Uppercase labels use positive letter-spacing. Keep that pairing.

## Shape and Spacing

| Element | Radius |
| --- | --- |
| Cards, panels, form card | 24px, 32px from 640px |
| Hero frame | 24px, 32px from 640px |
| Hero inner card | 18px, 20px from 640px |
| Stats bar | 14px, 16px from 640px |
| Inputs, icon tiles | 14px |
| Certificate tiles | 16px |
| Pills, buttons, chips, tags | 999px (fully round) |
| Burger button | 50% |

**Card padding:** 24px, 40px from 640px.

**Section rhythm:** sections are separated by a 48px gap on mobile and 96px from 640px. Inside a section, the gap is 20px. Card grids use 16px to 24px.

**Page width:** `.wrap` is capped at `80rem` with horizontal padding of 16px, 24px (640px+), and 32px (1024px+).

**Header offset:** `--hh` is 70px, 80px from 768px. Body padding and `scroll-margin-top` both use it so anchors never hide under the fixed header.

## Layout

Mobile-first. Breakpoints:

| Breakpoint | Changes |
| --- | --- |
| below 640px | Metrics become a vertical list with cobalt bullets. Buttons stack full width. |
| 640px | Larger type, padding, radii, and section gaps. Form fields split into two columns. Footer goes horizontal. |
| 768px | Desktop nav appears and the drawer and burger are removed. Services form three columns. Projects form two columns. Certificates become tiles in a wrapping row. Stats bar becomes a row. |
| 1024px | 12-column grid for About (7 / 5) and Contact (5 / 7). Projects form three columns. |

Certificate tiles use `flex: 1 1 calc((100% - 48px) / 3)`, so there are at most three per row, fewer certificates stretch to fill the row, and extras wrap.

## Components

### Pills and buttons

Both are `inline-flex`, fully rounded, 12px bold text.

| Variant | Look | Use |
| --- | --- | --- |
| `.navy` | Dark fill, white text, hover to black | Primary action |
| `.lav` | Lavender fill | Primary action on light surfaces, hero resume button |
| `.white` | White fill | Secondary action on colored cards |
| `.soft` | Light gray fill | Secondary action on white cards, quiet pills |
| `.ghost` | 10% white overlay | Secondary action on navy |
| `.btn.lg` | 14px text, larger padding | Hero actions |

Pills (`.pill`) are the non-interactive twin of buttons. They label a card type, such as "Website" or "Game".

Buttons that open another site use an inline arrow SVG and `target="_blank" rel="noopener"`.

### Cards

`.card` is a flex column with `justify-content: space-between`, so the footer area sticks to the bottom and cards in a row line up. A card has an optional `.foot` with a divider above it.

### Icons

Icons are inline SVGs on a 24×24 viewBox, outline style. One global rule sets `fill: none`, `stroke: currentColor`, `stroke-width: 2.2`, round caps and joins, and a default size of 16px. Icons inherit text color. Larger icon tiles (`.ico`) use a 44px rounded square holding a 22px icon.

### Navigation

- **Desktop:** text links, 800 weight. The active link turns cobalt (`.on`).
- **Mobile:** a round burger button opens a drawer that slides down from the top with a 28px bottom radius. It closes on link tap or the Escape key.
- The header is fixed, uses the page background, and has no border or shadow.

### Forms

Inputs and the textarea use the `--soft` fill, 14px radius, no border, and no resize. Labels are uppercase 11px. Focus shows a 2px lavender outline. The honeypot field is positioned off-screen (`.hp`) and hidden from assistive tech with `aria-hidden`.

Form status text appears next to the send button and hides itself after 3.5 seconds.

## Motion

Motion is minimal and purely functional.

- Smooth scrolling for anchor navigation.
- Short color transitions on links and buttons (0.15s to 0.5s).
- Drawer slide of 0.35s.

Under `prefers-reduced-motion: reduce`, smooth scrolling and all transitions are turned off.

## Accessibility

- Visible focus: `:focus-visible` shows a 2px navy outline with a 2px offset.
- Landmarks: `header`, labelled `nav` elements, `main`, `section`, and `footer`.
- The burger button exposes `aria-expanded` and `aria-controls`.
- The form status uses `role="status"` and `aria-live="polite"`.
- Every form field has an associated `label`.
- Text selection uses the lavender brand color with navy text.

## Extending the System

When adding a new component:

1. Reuse tokens. Don't introduce new hex values unless a new token is added to `:root` first.
2. Pick a tone class (`c-lav`, `c-sky`, `c-white`) instead of custom backgrounds.
3. Use the existing radius scale. Round interactive elements fully.
4. No shadows. Separate with fill color, a 1px `--line` border, or space.
5. Build mobile styles first, then add changes at 640px, 768px, and 1024px.
6. Make sure the component still looks right with long text and with a single item, since content comes from data files.
7. Render user-facing data through the `esc()` helper in `main.js` before inserting it as HTML.
