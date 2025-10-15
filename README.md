# LeCas E-commerce - Next.js Frontend

Modern fashion e-commerce platform built with Next.js, TypeScript, and TailwindCSS.

## Features

- 🏠 **Home Page**: Hero section with brand showcase, new arrivals, top selling products
- 🛍️ **Product Listing**: Filter by categories, price, color, size, and style
- 📦 **Product Detail**: Image gallery, size/color selection, reviews
- 🛒 **Shopping Cart**: Add/remove items, quantity management, promo codes
- 💳 **Checkout**: Shipping information, payment methods
- 📋 **Orders**: Order history and tracking
- 👤 **Profile**: Account management, addresses, wishlist
- 💬 **AI Chatbot**: Shopping assistance and customer support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Images**: Next/Image with optimization

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── products/          # Product listing & detail
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── orders/            # Order history
│   └── profile/           # User profile
├── components/            # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── Chatbot.tsx
└── public/                # Static assets

```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Pages

- `/` - Home page
- `/products` - Product listing with filters
- `/products/[id]` - Product detail page
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/orders` - Order history
- `/profile` - User profile

## Features to Add (Backend Integration)

- User authentication (login/signup)
- Product API integration
- Payment gateway integration
- Order management system
- Real-time chatbot with AI
- Search functionality
- Product recommendations

## Customization

### Colors

Update `tailwind.config.ts` to customize the color palette.

### Fonts

Add custom fonts to `/public/fonts/` and update `app/globals.css`.

### Logo

Replace the "SHOP.CO" text with your logo image in `components/Header.tsx`.

## License

This project is for educational/demonstration purposes.
