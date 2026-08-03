# Blinkit UX → Stopme Store: UX Blueprint

**Purpose of this doc:** Define the *interaction model* (Blinkit-inspired) for a standalone ecommerce site selling personalized photo goodies, to later be skinned with the Stopme design system (`spotmeui.md`). This is a planning artifact — no visual styling decisions here, only structure, flows, states, and component inventory. Styling pass happens in a follow-up doc once this is locked.

**Stack target:** Next.js (App Router) + React + TypeScript + Tailwind CSS. Fully responsive: desktop/laptop (≥1024px) and mobile (<768px), with a tablet fallback treated as "compressed desktop."

**Why Blinkit as the UX reference (not visual reference):** Blinkit's core genius isn't grocery-specific — it's **friction removal**. Every pattern below is chosen because it minimizes taps-to-cart and keeps the user oriented without leaving the current screen. For photo goodies (mugs, frames, calendars, photo books), the equivalent friction points are personalization steps (upload → crop → preview) rather than SKU selection, so several patterns are adapted, not copied 1:1.

---

## 1. Core UX Principles Carried Over

1. **Never leave the list.** Adding an item to cart happens inline (grid card → stepper), never via a full page navigation. Applies here too — but "add" for a personalizable product opens a **lightweight customization drawer**, not a silent add.
2. **Cart is always visible, always summarized.** A persistent cart bar (mobile: bottom sticky bar; desktop: top-right cart pill + slide-over drawer) shows item count + running total at all times once cart is non-empty.
3. **Two-pane browse, not deep navigation.** Blinkit's category screen = left rail of categories + right scrollable product grid, both visible together. We reuse this for desktop. On mobile it collapses to a horizontal category chip scroller pinned above the grid.
4. **Progressive disclosure for complexity.** Blinkit hides delivery-slot complexity until checkout. We hide personalization complexity (image upload, cropping, text engraving) until the user has expressed clear intent (tapped a product), never on the grid.
5. **Transparency at checkout.** Full price breakdown always visible and expanded by default (per the Blinkit case-study finding above — hiding totals erodes trust). No collapsed "show breakdown" toggles.
6. **State persistence across the session.** Cart, in-progress personalization, and last-viewed category persist via local state (Zustand or Context) so a back-navigation never loses work — critical here since photo uploads are expensive to redo.

---

## 2. Information Architecture

```
/                          → Landing (hero + curated collections + trending)
/shop                      → Full catalog (two-pane category browse)
/shop/[category]           → Pre-filtered category view
/product/[slug]            → Product detail + personalization studio
/cart                      → Full cart page (mobile deep-link target; desktop uses drawer primarily)
/checkout                  → Address → Review → Payment (single scrollable page, not wizard)
/checkout/success           → Order confirmation
/account                   → Profile home
/account/orders            → Order history + tracking
/account/orders/[id]       → Order detail / reorder
/account/addresses         → Saved addresses
/search                    → Search results (also overlay on desktop, full page on mobile)
```

**Navigation model:**
- **Mobile:** Bottom tab bar — `Home | Categories | Search | Cart | Account` (5 tabs, thumb-zone optimized, matches Blinkit's bottom-nav rationale — reachability over discoverability).
- **Desktop:** Sticky top navbar (reusing Stopme's navbar pattern) — logo left, search bar center (persistent, not a modal), Cart + Account icons right. No bottom nav on desktop.

---

## 3. Page-by-Page Breakdown

### 3.1 Landing Page (`/`)

**Goal:** Get the user into a category or a specific "gift moment" (birthday, anniversary, home decor) within one scroll.

| Section | Mobile | Desktop |
|---|---|---|
| Hero | Single full-bleed banner, swipeable, CTA "Start Creating" | Split hero: left copy + CTA, right rotating product mockups |
| Occasion shortcuts | Horizontal scroll chips ("Birthday", "Anniversary", "Home", "Pets") | Row of 5–6 large tappable cards, grid |
| Trending products | Horizontal scroll product cards (Blinkit-style, snap-scroll) | 4–5 column grid, no scroll |
| Category tiles | 2-column grid of category cards w/ icon + label | 4–6 column grid |
| Social proof | Compact stacked reviews carousel | 3-column testimonial grid |
| Sticky cart bar | Appears only if cart non-empty | Cart pill in navbar always present |

**Key deviation from Blinkit:** No "delivery time" hero element (that's Blinkit's core hook — 10-min delivery). Our equivalent hook is **"See your photo on it before you buy"** — so the hero should tease the live-preview personalization capability, not speed.

### 3.2 Catalog / Browse (`/shop`, `/shop/[category]`)

This is the most directly Blinkit-inspired screen.

**Desktop layout:**
- Left rail (sticky, ~220px): category list, vertical, active category highlighted with a left border accent + bold — mirrors Blinkit's left category rail exactly.
- Right pane: product grid (4 columns), each card:
  - Product image (mockup on blank canvas — no photo yet, since it's pre-personalization)
  - Name, base price, "From ₹X" if variants exist
  - `+ Customize` button (replaces Blinkit's `+ Add` — because these SKUs require input before they're cart-able)
  - Rating stars if available
- Top of right pane: sort + filter bar (sort by: popularity, price, newest; filters: product type, price range, delivery speed if applicable)

**Mobile layout:**
- Category rail collapses into a horizontal chip scroller, sticky under the search bar.
- Product grid becomes 2 columns.
- Filters open as a bottom sheet (not inline), sort as a small dropdown pill.

**Card interaction states:**
1. Default → shows "Customize" CTA.
2. If product has no required personalization (e.g., a plain sticker pack) → CTA reads "Add" and behaves like Blinkit: tap once → inline quantity stepper appears directly on the card, no drawer.
3. Hover (desktop only) → subtle lift + shadow, per Stopme's `.feature-card` hover pattern (to be applied in styling pass).

### 3.3 Product Detail + Personalization Studio (`/product/[slug]`)

This is the highest-friction screen and the one that most departs from Blinkit (which has no customization step). Design goal: treat personalization like Blinkit treats variant selection (pack size, flavor) — inline, fast, no page reload.

**Desktop layout:** Two-column.
- Left (sticky on scroll): large live preview canvas — shows the product mockup with the user's uploaded photo composited on it in real time.
- Right: scrollable panel —
  1. Title, price, short description
  2. **Upload zone** (drag-and-drop + "choose file" + "use a past upload") — first and most prominent element
  3. Crop/reposition controls (pinch/drag on the preview itself, not a separate modal)
  4. Variant selectors (size, material, frame color) as pill buttons, not dropdowns
  5. Optional text engraving field with live character count
  6. Quantity stepper
  7. Primary CTA: `Add to Cart` — sticky within the right panel as it scrolls
  8. Below the fold: delivery estimate, material/care info as accordions

**Mobile layout:** Single column, vertical order:
1. Preview canvas (fixed aspect ratio, ~60% viewport height)
2. Upload zone directly below (thumb-reachable)
3. Variant pills (horizontal scroll if many)
4. Text field
5. Quantity stepper
6. Sticky bottom bar: price + `Add to Cart` button (always visible once upload is complete — mirrors Blinkit's bottom sticky "Add" affordance)

**Validation/state rule:** `Add to Cart` is disabled (not hidden) until a required photo is uploaded, with a one-line inline hint ("Upload a photo to continue") — never a blocking modal.

### 3.4 Cart (`drawer` primary, `/cart` full page secondary)

- **Desktop:** Clicking the cart icon opens a right-side slide-over drawer (Blinkit pattern), not a page navigation. Drawer shows: line items with thumbnail of the *personalized* preview (not the blank product shot), quantity steppers, remove, subtotal, and a single CTA `Proceed to Checkout`. A "View full cart" link goes to `/cart` for edge cases (editing personalization requires the full page since it re-opens the studio).
- **Mobile:** Bottom sticky bar (visible on every screen once cart is non-empty) shows `N items · ₹total · View Cart`. Tapping it navigates to the full `/cart` page (mobile skips the drawer pattern — screen real estate doesn't support it well).
- **Empty state:** Illustration + "Nothing here yet" + CTA back to `/shop`.
- **Edit personalization from cart:** tapping a line item's thumbnail returns to that product's studio with all prior choices restored (not a fresh start) — this is a hard requirement, since re-uploading is the single biggest drop-off risk.

### 3.5 Checkout (`/checkout`)

Single continuous scrollable page (not a multi-step wizard) — matches the redesigned Blinkit checkout philosophy of minimizing steps for quick-commerce, adapted since our order isn't time-pressured but the principle (fewer clicks, always-visible total) still holds.

Sections top to bottom:
1. Delivery address (saved addresses as selectable cards + "Add new")
2. Delivery/shipping option (standard / express, if offered)
3. Order summary — **always expanded**, full line-item breakdown with per-item personalization thumbnail, never collapsed behind a toggle
4. Payment method selection
5. Sticky bottom/side total bar with final CTA `Place Order`

Mobile: sections stack full-width, order summary is collapsible-but-defaults-open (user can manually collapse, but it's never collapsed by default — directly addressing the Blinkit trust issue noted in research).

Desktop: two-column — left form flow, right sticky order summary card (visible the whole time, no scrolling to find the total).

### 3.6 Order Confirmation (`/checkout/success`)

- Large success state, order number, estimated delivery/production time (photo goods need production time, unlike instant grocery delivery — call this out explicitly, e.g. "Your prints are being made — ready in 2 days").
- CTA row: `Track Order`, `Continue Shopping`.

### 3.7 Account (`/account`, `/account/orders`, `/account/addresses`)

- `/account`: profile summary card, quick links (Orders, Addresses, Saved Payment, Logout).
- `/account/orders`: list of past orders, each row = thumbnail of personalized product + status chip (Processing / Printing / Shipped / Delivered) + reorder button.
- `/account/orders/[id]`: status timeline (stepper, horizontal on desktop / vertical on mobile), item details, reorder-with-same-photo CTA.

### 3.8 Search (`/search`)

- **Desktop:** Persistent search bar in navbar; typing opens an overlay dropdown with live results (grouped: Products, Categories) before full navigation — Blinkit's instant-results pattern.
- **Mobile:** Dedicated search tab; typing shows results inline below the bar, no overlay (avoids covering the keyboard-adjacent area awkwardly).
- Empty query state: recent searches + trending searches.

---

## 4. Persistent/Global Components

| Component | Behavior |
|---|---|
| Sticky Cart Bar (mobile) | Slides up from bottom when cart transitions from empty→non-empty; persists across all routes except `/checkout` and `/cart` itself |
| Cart Drawer (desktop) | Slide-over from right, dims background, closes on outside-click or Esc |
| Toast/Snackbar | Confirms "Added to cart" (bottom on mobile, top-right on desktop), auto-dismiss ~2.5s, includes a `View Cart` inline action |
| Quantity Stepper | Reused identically across product cards, cart lines, and the personalization studio — one component, no visual variants |
| Bottom Sheet (mobile only) | Used for: filters, sort, and address selection — replaces modals wherever the action is mobile-primary |

---

## 5. Responsive Breakpoints (Tailwind defaults, confirm in build)

- `sm` (mobile) < 640px — 2-col grids, bottom nav, sticky bottom bars
- `md` 640–1024px — treated as compressed desktop: 3-col grids, top nav appears, bottom cart bar still used (drawer needs more width to feel right)
- `lg` ≥1024px — full desktop: 4-col grids, left category rail, cart drawer, two-column checkout/product pages

---

## 6. What's Explicitly Deferred (not in this doc)

- Visual styling (colors, radii, shadows, fonts) — comes from `spotmeui.md` in the next pass.
- Payment gateway integration specifics.
- Actual image compositing/cropping implementation (canvas library choice, e.g. `react-easy-crop` vs custom).
- Integration plan into the main Stopme app (explicitly building this standalone first, per your note).

---

## 7. Open Questions for Next Planning Round

1. Do all products require personalization, or is there a mixed catalog (some plain, some customizable)? This changes the card CTA logic in §3.2.
2. Is there a "design library" (pre-made templates/frames users pick before uploading a photo) or is upload-first always the flow?
3. Single photo per product, or multi-photo layouts (e.g., a photo book with N pages, a collage frame with 4 slots)? This significantly changes the personalization studio's complexity (§3.3) — worth deciding before wireframing that screen in detail.
4. Guest checkout, or account-required?

---

**Next step (per your plan):** once this UX structure is confirmed/adjusted, we move to mapping it against `spotmeui.md`'s tokens (colors, type scale, radii, shadows, animation patterns) to produce a merged design spec, then start component build order (design system primitives → product card → PDP studio → cart → checkout).