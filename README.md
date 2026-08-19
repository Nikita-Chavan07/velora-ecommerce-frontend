# VELORA – Fashion & Beauty E-Commerce Frontend

> A premium, modern e-commerce frontend for fashion, beauty, and lifestyle products.

---

## Overview

**VELORA** is a complete, production-quality responsive e-commerce web application built with React, Vite, and Tailwind CSS. It features a fully functional shopping experience — product listing, search & filtering, product details, cart, wishlist, checkout, and order success — all built with clean, component-based architecture.

---

## Features

- **Homepage** — Hero banner, category grid, featured products, promotional section, lookbook editorial, newsletter signup
- **Product Listing** — Responsive grid with skeleton loaders, load more pagination
- **Search & Filtering** — Real-time search by name/brand/category, filter by category, gender, price range, rating, and availability, with a mobile filter drawer
- **Sorting** — Featured, Price (asc/desc), Rating, Newest, Biggest Discount
- **Product Detail** — Image gallery with thumbnails, color/size selector, quantity selector, add to cart, buy now, wishlist, tabbed info (description, ingredients, shipping), reviews, related products
- **Shopping Cart** — Full cart management (add, remove, update quantity, move to wishlist), order summary with subtotal/discount/shipping/tax/total, cart persistence via localStorage
- **Wishlist** — Save/remove products, move to cart, persistent via localStorage
- **Checkout** — Shipping form with validation, delivery method selection, mock payment (card/UPI/COD), order summary
- **Order Success** — Confirmation page with order ID, summary, estimated delivery
- **Authentication UI** — Login, Sign Up, Forgot Password pages (mock, no real auth)
- **404 Page** — Custom not found page
- **Toast Notifications** — Cart & wishlist interactions, form feedback
- **Skeleton Loaders** — While products are loading
- **Error States** — "Unable to load" + "Try Again" button
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Animations** — Product hover, heart/wishlist animation, fade-in transitions, smooth loading states

---

## Technologies Used

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 8 | Build tool & dev server |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| React Router v7 | Client-side routing |
| Axios | API calls |
| Lucide React | Icon library |
| Context API | State management (Cart, Wishlist, Order, Toast) |

---

## Project Structure

```
velora/
├── public/
│   └── _redirects         # Netlify SPA routing
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Sticky nav, search, cart/wishlist badges
│   │   │   └── Footer.tsx       # Links, social, contact
│   │   ├── product/
│   │   │   ├── ProductCard.tsx  # Product card with hover, wishlist, quick-add
│   │   │   ├── ProductGrid.tsx  # Responsive grid, loading/error states
│   │   │   └── FilterSidebar.tsx # Desktop sidebar + mobile drawer
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── RatingStars.tsx
│   │       ├── QuantitySelector.tsx
│   │       ├── SkeletonLoader.tsx
│   │       └── EmptyState.tsx
│   ├── context/
│   │   ├── CartContext.tsx      # Cart state with localStorage persistence
│   │   ├── WishlistContext.tsx  # Wishlist state with persistence
│   │   ├── OrderContext.tsx     # Order state for checkout → success flow
│   │   └── ToastContext.tsx     # Toast notification system
│   ├── data/
│   │   ├── products.ts          # 24+ detailed local product entries
│   │   └── reviews.ts           # Sample customer reviews
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ShopPage.tsx         # Full filtering/search/sort logic
│   │   ├── FashionPage.tsx
│   │   ├── BeautyPage.tsx
│   │   ├── NewArrivalsPage.tsx
│   │   ├── OffersPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── WishlistPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── OrderSuccessPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignUpPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/
│   │   └── api.ts               # Axios API service with local fallback
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── App.tsx                  # Routes, providers, lazy loading
│   ├── main.tsx
│   └── index.css                # Tailwind + custom animations
├── vercel.json                  # Vercel SPA rewrite config
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/velora.git
cd velora

# Install dependencies
npm install
```

---

## Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Build for Production

```bash
npm run build
```

Output is in the `dist/` folder.

---

## Preview Production Build

```bash
npm run preview
```

---

## API

Products are fetched from [FakeStore API](https://fakestoreapi.com) and merged with a rich local dataset (`src/data/products.ts`).

**Fallback behaviour:** If the external API is unavailable or times out (8-second timeout), the application falls back entirely to the 24+ local products so it always works — even offline.

The API service is in `src/services/api.ts` and decoupled from all UI components.

---

## Responsive Design

| Breakpoint | Layout |
|---|---|
| Mobile (< 640px) | Single-column grid, hamburger nav, mobile filter drawer |
| Tablet (640–1024px) | 2-column grid, adapted spacing |
| Desktop (> 1024px) | 4-column grid, sidebar filters, full navigation |

---

## Screenshots

> _Add screenshots here after deployment_

| Page | Screenshot |
|---|---|
| Homepage | |
| Shop / Listing | |
| Product Detail | |
| Cart | |
| Checkout | |
| Order Success | |

---

## Live Demo

> _Add deployed URL here (e.g. Vercel/Netlify)_

🔗 [https://velora.vercel.app](https://velora.vercel.app)

---

## GitHub Repository

> _Add your repository URL here_

🔗 [https://github.com/yourusername/velora](https://github.com/yourusername/velora)

---

## Deployment

### Vercel

1. Import project from GitHub
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. The `vercel.json` handles SPA routing automatically

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. The `public/_redirects` file handles SPA routing automatically

---

## Notes

- No real payments are processed — checkout is a frontend mock
- No real authentication — login/signup uses mock state
- No API keys or secrets are required

---

*Built with ❤️ for the VELORA premium fashion & beauty brand.*
