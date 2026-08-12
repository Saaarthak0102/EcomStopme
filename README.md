# Stopme Store

Welcome to the Stopme e-commerce application!! This platform allows users to browse premium personalized photo gifts, customize their items in an interactive studio, and securely check out. 

## Overview

The Stopme Store is designed with a premium, warm aesthetic and features an engaging user experience with smooth interactions, glassmorphism elements, and a fully mobile-optimized layout.

### Tech Stack & Architecture
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS (Vanilla CSS tokens in `globals.css` for theming)
- **State Management:** Zustand (`cartStore`, `studioStore`, and `accountStore`)
- **Icons:** Lucide React

## Application Features

### 1. Global State Management
- **Cart Store**: Manages items added to the cart, automatically restoring sessions when returning to the Personalization Studio to edit custom items.
- **Studio Store**: Handles the intricate, step-by-step form state for photo uploads, engraving texts, and variant selections.
- **Account Store**: A robust global store mimicking database behavior. It persists your saved Addresses and Payment Methods locally, making them available simultaneously in the Checkout flow and the Account dashboard.

### 2. Interactive Checkout & Account Management
The checkout and account pages feature industry-standard interactive modal overlays:
- **Detailed Forms**: Add new addresses using detailed Amazon/Flipkart-style forms (Full Name, PIN, Flat/House, Area/Street, etc.).
- **Live Sync**: Adding an address or payment method during checkout instantly syncs it to your Account settings, and vice-versa.
- **Full CRUD UI**: In the Account section, every button works. You can actively Add, Edit, or Delete your saved addresses and payment methods.

### 3. Shopping Experience
- **URL-Driven Search & Filters**: The shop and category pages feature a robust `searchParams` driven filtering system. Users can search queries or filter by price ranges, and these parameters remain in the URL so links can be shared perfectly intact.
- **Dynamic Cart Drawer**: A sleek cart drawer accessible globally across the app that accurately lists cart contents alongside dynamic quantity steppers.

---

### Application Pages

Here is a quick breakdown of the core routing structure:

* **Shop (`/shop`)**: The primary landing page and full catalog displaying all our customizable products, complete with mobile-friendly category chips, desktop rails, and dynamic search/sort bars.
* **Category View (`/shop/[category]`)**: Filtered views of the shop tailored to specific product categories (e.g., Gifts, Home Decor).
* **Personalization Studio (`/product/[slug]`)**: The interactive product page where users can upload photos, select variants (like size or color), and preview custom creations before adding them to the cart.
* **Cart (`/cart`)**: A detailed view of the user's shopping cart, also accessible globally via the slide-out Cart Drawer and mobile Sticky Cart Bar.
* **Checkout (`/checkout`)**: A streamlined checkout flow prioritized by an upfront Order Items preview, followed by dynamic radio card selections for your saved Addresses and Payment Methods.
* **Order Confirmation (`/checkout/success`)**: A success page confirming the order.
* **My Account (`/account`)**: A dashboard giving users quick access to their personal store data.
  * **Details (`/account/details`)**: Edit your core profile information.
  * **Saved Addresses (`/account/addresses`)**: Add, edit, or delete delivery addresses.
  * **Payment Methods (`/account/payment-methods`)**: Manage your saved cards.
  * **Orders (`/account/orders`)**: A list of past and current orders.

## Running Locally

To run the application on your own machine:

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your web browser.
