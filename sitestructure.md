# Stopme Store — Site Structure & Page Inventory

Follow-on to `blinkitux.md`. That doc defined *behavior*; this doc defines *what files exist* — the Next.js App Router folder structure, every page with its purpose/components, shared layout composition, and the minimal state/data model needed to build frontend-only (mock data, no real backend yet).

**Assumptions locked for v1** (flip any of these later, structure below accommodates it):
- Mixed catalog: some products need personalization, some don't.
- Upload-first personalization, no template gallery yet.
- Single photo per product (data model leaves room for multi-slot later).
- Guest checkout allowed; account is optional, not required.

---

## 1. App Router Folder Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout: fonts, providers, Navbar/BottomNav shell
│   ├── page.tsx                      # Landing (/)
│   ├── globals.css                   # Tailwind base + Stopme design tokens as CSS vars
│   │
│   ├── shop/
│   │   ├── page.tsx                  # /shop — full catalog, two-pane browse
│   │   └── [category]/
│   │       └── page.tsx              # /shop/[category] — pre-filtered view
│   │
│   ├── product/
│   │   └── [slug]/
│   │       └── page.tsx              # /product/[slug] — PDP + personalization studio
│   │
│   ├── cart/
│   │   └── page.tsx                  # /cart — full cart (mobile deep-link target)
│   │
│   ├── checkout/
│   │   ├── page.tsx                  # /checkout — address/summary/payment, single scroll
│   │   └── success/
│   │       └── page.tsx              # /checkout/success — confirmation
│   │
│   ├── account/
│   │   ├── page.tsx                  # /account — profile home
│   │   ├── orders/
│   │   │   ├── page.tsx              # /account/orders — order history
│   │   │   └── [id]/
│   │   │       └── page.tsx          # /account/orders/[id] — order detail/tracking
│   │   └── addresses/
│   │       └── page.tsx              # /account/addresses
│   │
│   ├── search/
│   │   └── page.tsx                  # /search — mobile full-page results
│   │
│   └── api/                          # Mock route handlers (frontend-only, static/mock data)
│       ├── products/route.ts
│       ├── products/[slug]/route.ts
│       └── orders/route.ts
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                 # Desktop top nav
│   │   ├── BottomNav.tsx              # Mobile 5-tab bar
│   │   ├── Footer.tsx
│   │   └── CartDrawer.tsx             # Desktop slide-over
│   │
│   ├── product/
│   │   ├── ProductCard.tsx            # Grid card: image, price, Customize/Add CTA
│   │   ├── ProductGrid.tsx
│   │   ├── CategoryRail.tsx           # Desktop left rail
│   │   ├── CategoryChips.tsx          # Mobile horizontal scroller
│   │   ├── FilterSortBar.tsx
│   │   └── QuantityStepper.tsx        # Shared: cards, cart, PDP
│   │
│   ├── studio/                        # Personalization studio (PDP-specific)
│   │   ├── PreviewCanvas.tsx          # Live composited preview
│   │   ├── UploadZone.tsx             # Drag/drop + file picker
│   │   ├── CropControls.tsx
│   │   ├── VariantPills.tsx           # Size/material/color selectors
│   │   └── EngravingField.tsx         # Optional text input
│   │
│   ├── cart/
│   │   ├── CartLineItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── StickyCartBar.tsx          # Mobile bottom bar
│   │
│   ├── checkout/
│   │   ├── AddressCard.tsx
│   │   ├── AddressForm.tsx
│   │   ├── OrderSummaryPanel.tsx      # Always-expanded breakdown
│   │   └── PaymentMethodSelect.tsx
│   │
│   ├── account/
│   │   ├── OrderRow.tsx
│   │   └── StatusTimeline.tsx         # Horizontal (desktop) / vertical (mobile)
│   │
│   └── ui/                            # Design-system primitives (styled per spotmeui.md later)
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Toast.tsx
│       ├── BottomSheet.tsx
│       ├── Chip.tsx
│       └── Accordion.tsx
│
├── lib/
│   ├── data/
│   │   ├── products.ts                # Mock product catalog
│   │   └── categories.ts
│   ├── store/
│   │   ├── cartStore.ts               # Zustand: cart line items, totals
│   │   └── studioStore.ts             # Zustand: in-progress personalization per product
│   └── types/
│       └── index.ts                   # Product, CartItem, Order, Address types
│
└── hooks/
    ├── useCart.ts
    └── useMediaQuery.ts                # breakpoint-aware component swaps (rail vs chips, etc.)
```

---

## 2. Page-by-Page Spec

For each page: purpose, primary components used, and the one thing that must not break.

### `/` — Landing
- **Components:** Hero, occasion shortcut cards, `ProductGrid` (horizontal scroll variant), category tiles, testimonial section.
- **Data needed:** featured/trending product list, category list.
- **Must not break:** hero CTA → `/shop` in one click, no dead ends.

### `/shop`, `/shop/[category]`
- **Components:** `CategoryRail` (desktop) / `CategoryChips` (mobile), `FilterSortBar`, `ProductGrid` → `ProductCard`.
- **Data needed:** full product list, filterable/sortable client-side for v1 (no real backend yet).
- **State:** selected category, sort, filters — URL-synced (`?category=&sort=`) so it's shareable/back-button-safe.
- **Must not break:** switching category never triggers full page reload feel — client-side filter/transition.

### `/product/[slug]`
- **Components:** `PreviewCanvas`, `UploadZone`, `CropControls`, `VariantPills`, `EngravingField`, `QuantityStepper`, sticky CTA.
- **Data needed:** single product record (mock, by slug) with: base image, variant options, personalization requirements (`requiresPhoto: boolean`, `maxTextLength?: number`).
- **State:** `studioStore` holds in-progress upload/crop/variant selection per slug, so navigating away and back (e.g., to check something in `/cart`) doesn't lose the work — this is the single highest-risk drop-off point per `blinkit-ux.md` §3.4.
- **Must not break:** `Add to Cart` stays disabled with an inline hint until required photo is present — never a blocking modal.

### `/cart`
- **Components:** `CartLineItem` (list), `CartSummary`, empty state.
- **Data needed:** `cartStore` state only — no fetch.
- **Must not break:** tapping a line item's thumbnail routes back to `/product/[slug]` with `studioStore` state restored, not blank.

### `/checkout`
- **Components:** `AddressCard`/`AddressForm`, `OrderSummaryPanel` (always expanded), `PaymentMethodSelect`, sticky total + CTA.
- **Data needed:** cart contents, mock saved addresses.
- **Must not break:** order summary never defaults to collapsed (trust issue flagged in `blinkit-ux.md`).

### `/checkout/success`
- **Components:** success state, order number, estimated production time, `Track Order`/`Continue Shopping` CTAs.
- **Data needed:** last placed order (mock, from `cartStore` snapshot before clear).

### `/account`, `/account/orders`, `/account/orders/[id]`, `/account/addresses`
- **Components:** `OrderRow`, `StatusTimeline`, `AddressCard`.
- **Data needed:** mock order history, mock saved addresses.
- Low priority for first build pass — stub these last.

### `/search`
- **Components:** results list, recent/trending searches (empty state).
- **Desktop equivalent:** overlay dropdown from the navbar search input, not this full page — this route is the mobile target and the desktop "view all results" fallback.

---

## 3. Shared Layout Composition (`app/layout.tsx`)

```tsx
<Providers>              // cartStore/studioStore context if not using pure Zustand
  <Navbar />             // hidden on mobile via breakpoint, or rendered conditionally
  {children}
  <Footer />             // hidden on mobile
  <BottomNav />          // mobile only
  <StickyCartBar />      // mobile only, conditional on cart non-empty
  <CartDrawer />         // desktop only, toggled via cartStore.isDrawerOpen
  <ToastProvider />
</Providers>
```

Breakpoint switches (Navbar/BottomNav, CategoryRail/CategoryChips, CartDrawer/StickyCartBar) should all key off one shared `useMediaQuery('lg')` hook so there's a single source of truth for the mobile/desktop split — avoids the two versions drifting out of sync as the build grows.

---

## 4. Minimal Data Model (`lib/types/index.ts`)

```typescript
type Product = {
  slug: string;
  name: string;
  category: string;
  basePrice: number;
  images: string[];               // blank mockup shots
  requiresPhoto: boolean;
  variants?: {
    size?: string[];
    material?: string[];
    frameColor?: string[];
  };
  maxEngravingLength?: number;
};

type CartItem = {
  id: string;                     // unique per customization, not per product
  productSlug: string;
  quantity: number;
  selectedVariants: Record<string, string>;
  uploadedImage?: string;         // data URL or object URL for v1 mock
  engravingText?: string;
  previewThumbnail: string;       // composited preview shown in cart
};

type Address = { id: string; label: string; fullAddress: string; isDefault?: boolean };

type Order = {
  id: string;
  items: CartItem[];
  status: 'processing' | 'printing' | 'shipped' | 'delivered';
  placedAt: string;
  estimatedReady: string;
};
```

---

## 5. Suggested Build Order

1. `lib/types`, mock `products.ts`/`categories.ts`, `cartStore`, `studioStore` — get state right before any UI.
2. `ui/` primitives (Button, Card, Chip, Accordion, BottomSheet) — unstyled/minimally styled, styling pass comes once `spotmeui.md` tokens are mapped in.
3. `ProductCard` + `ProductGrid` + `/shop` — this is the screen that proves the two-pane pattern works.
4. `/product/[slug]` studio — highest complexity, do it early while context is fresh, not last.
5. Cart (drawer + bar + page).
6. Checkout + success.
7. Account/orders/addresses — stub last, lowest traffic.
