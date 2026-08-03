# Stopme Store

Welcome to the Stopme e-commerce application! This platform allows users to browse premium personalized photo gifts, customize their items in our interactive studio, and securely checkout.

## Overview

The Stopme Store is designed with a premium, warm aesthetic and features an engaging user experience with smooth interactions, glassmorphism elements, and a mobile-optimized layout.

### Application Pages

Here is a quick breakdown of all the pages available in the application:

* **Home (`/`)**: The main landing page featuring our hero section, a showcase of trending products, and quick access to start creating.
* **Shop (`/shop`)**: The full catalog displaying all our customizable products, complete with mobile-friendly category chips and desktop navigation rails.
* **Category View (`/shop/[category]`)**: Filtered views of the shop tailored to specific product categories (e.g., Gifts, Home Decor).
* **Personalization Studio (`/product/[slug]`)**: The core interactive product page where users can upload photos, select variants (like size or color), and preview their custom creations before adding them to the cart.
* **Cart (`/cart`)**: A detailed view of the user's shopping cart, also accessible globally via the slide-out Cart Drawer and mobile Sticky Cart Bar.
* **Checkout (`/checkout`)**: A streamlined, single-page checkout flow for providing delivery details and payment methods.
* **Order Confirmation (`/checkout/success`)**: A success page confirming the order has been placed successfully.
* **My Account (`/account`)**: A dashboard giving users quick access to their personal store data.
* **Orders (`/account/orders`)**: A list of past and current orders.
* **Order Details (`/account/orders/[id]`)**: Specific order tracking and status updates.
* **Saved Addresses (`/account/addresses`)**: A quick view of saved delivery addresses.

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
