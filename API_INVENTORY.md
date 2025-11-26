# API Inventory - LeCas Fashion E-commerce Backend

**Version:** 1.0.0  
**Last Updated:** November 26, 2024  
**Base URL:** `http://localhost:3001`  
**Swagger Documentation:** `http://localhost:3001/api-docs`

---

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
  - [Customer Authentication](#customer-authentication)
  - [Admin Authentication](#admin-authentication)
- [Customer APIs](#customer-apis)
  - [Account Module](#account-module)
  - [Addresses Module](#addresses-module)
  - [Cart Module](#cart-module)
  - [Checkout & Payment Module](#checkout--payment-module)
  - [Orders Module](#orders-module)
  - [Products Module (Public)](#products-module-public)
  - [Reviews Module](#reviews-module)
  - [Wishlist Module](#wishlist-module)
  - [Users Module](#users-module)
  - [Promotions Module (Public)](#promotions-module-public)
  - [Categories Module (Public)](#categories-module-public)
  - [Pages Module (Public CMS)](#pages-module-public-cms)
  - [Support Module](#support-module)
- [AI Features](#ai-features)
  - [AI Chatbot & Image Search](#ai-chatbot--image-search)
- [Admin APIs](#admin-apis)
  - [Admin Dashboard & Management](#admin-dashboard--management)
  - [Admin Analytics](#admin-analytics)
  - [Admin Products Management](#admin-products-management)
  - [Admin Categories Management](#admin-categories-management)
  - [Admin Reviews Management](#admin-reviews-management)
  - [Admin Pages (CMS) Management](#admin-pages-cms-management)
  - [Admin Colors Management](#admin-colors-management)
  - [Admin Sizes Management](#admin-sizes-management)
- [Internal APIs](#internal-apis)
  - [Rasa Action Server APIs](#rasa-action-server-apis)
- [Summary Statistics](#summary-statistics)

---

## Overview

This document provides a **complete inventory** of all API endpoints in the LeCas Fashion E-commerce backend system. The backend is built with **NestJS**, **PostgreSQL**, and integrates **AI features** (Chatbot via Rasa + Image Search via FastAPI).

### Technology Stack
- **Framework:** NestJS (Node.js + TypeScript)
- **Database:** PostgreSQL with TypeORM
- **Authentication:** JWT (Access Token + Refresh Token)
- **File Storage:** Supabase Storage
- **Payment Gateway:** VNPAY
- **AI Services:** Rasa NLU (Chatbot) + FastAPI (Image Search with pgvector)

### Authentication Types
1. **Customer JWT:** Bearer token from `/api/v1/auth/login` or `/api/v1/auth/register`
2. **Admin JWT:** Bearer token from `/api/v1/admin/auth/login`
3. **API Key:** `x-api-key` header for Internal APIs (Rasa Action Server)

---

## Authentication

### Customer Authentication

**Base Path:** `/api/v1/auth`

#### Register Account

- **Method:** `POST`
- **Path:** `/api/v1/auth/register`
- **Description:** Register new customer account with email/password. Sends activation email.
- **Authentication:** None (Public)
- **Request Body:**
```json
{
  "email": "customer@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```
- **Response:** 201 Created
```json
{
  "message": "Registration successful. Please check your email to activate your account."
}
```

---

#### Activate Account (GET)

- **Method:** `GET`
- **Path:** `/api/v1/auth/activate`
- **Description:** Activate account via email link (redirect flow)
- **Authentication:** None (Public)
- **Query Parameters:**
  - `token` (string, required): Activation token from email
- **Response:** 302 Redirect to frontend with tokens

---

#### Activate Account (POST)

- **Method:** `POST`
- **Path:** `/api/v1/auth/activate`
- **Description:** Activate account via API call
- **Authentication:** None (Public)
- **Request Body:**
```json
{
  "token": "activation_token_string"
}
```
- **Response:** 200 OK
```json
{
  "message": "Account activated successfully",
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

---

#### Login

- **Method:** `POST`
- **Path:** `/api/v1/auth/login`
- **Description:** Login with email/password. Returns access_token (15min) and refresh_token (30 days)
- **Authentication:** None (Public)
- **Request Body:**
```json
{
  "email": "customer@example.com",
  "password": "SecurePass123"
}
```
- **Response:** 200 OK
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "customer@example.com",
    "name": "John Doe"
  }
}
```

---

#### Google OAuth Login

- **Method:** `POST`
- **Path:** `/api/v1/auth/google`
- **Description:** Login or register with Google OAuth
- **Authentication:** None (Public)
- **Request Body:**
```json
{
  "auth_code": "google_authorization_code"
}
```
- **Response:** 200 OK (same as login)

---

#### Refresh Token

- **Method:** `POST`
- **Path:** `/api/v1/auth/refresh`
- **Description:** Refresh access token using refresh_token
- **Authentication:** None (Public)
- **Request Body:**
```json
{
  "refresh_token": "eyJhbGc..."
}
```
- **Response:** 200 OK
```json
{
  "access_token": "new_access_token"
}
```

---

#### Logout

- **Method:** `POST`
- **Path:** `/api/v1/auth/logout`
- **Description:** Logout and invalidate refresh_token
- **Authentication:** JWT (Bearer Token)
- **Response:** 200 OK
```json
{
  "message": "Logout successful"
}
```

---

#### Forgot Password

- **Method:** `POST`
- **Path:** `/api/v1/auth/forgot-password`
- **Description:** Send password reset email
- **Authentication:** None (Public)
- **Request Body:**
```json
{
  "email": "customer@example.com"
}
```
- **Response:** 200 OK
```json
{
  "message": "If the email exists, a reset link has been sent."
}
```

---

#### Verify Reset Token

- **Method:** `POST`
- **Path:** `/api/v1/auth/verify-reset-token`
- **Description:** Verify password reset token validity
- **Authentication:** None (Public)
- **Request Body:**
```json
{
  "token": "reset_token_string"
}
```
- **Response:** 200 OK
```json
{
  "valid": true
}
```

---

#### Reset Password

- **Method:** `POST`
- **Path:** `/api/v1/auth/reset-password`
- **Description:** Reset password with valid token
- **Authentication:** None (Public)
- **Request Body:**
```json
{
  "token": "reset_token_string",
  "newPassword": "NewSecurePass123"
}
```
- **Response:** 200 OK
```json
{
  "message": "Password reset successful"
}
```

---

### Admin Authentication

**Base Path:** `/api/v1/admin/auth`

#### Admin Login

- **Method:** `POST`
- **Path:** `/api/v1/admin/auth/login`
- **Description:** Admin login with email/password. Returns access_token (8 hours)
- **Authentication:** None (Public)
- **Request Body:**
```json
{
  "email": "admin@shop.com",
  "password": "AdminPass123"
}
```
- **Response:** 200 OK
```json
{
  "message": "Admin login successful",
  "access_token": "eyJhbGc...",
  "admin": {
    "id": 1,
    "name": "Super Admin",
    "email": "admin@shop.com",
    "role": "super_admin"
  }
}
```

---

## Customer APIs

### Account Module

**Base Path:** `/account`  
**Authentication:** JWT Required

#### Get Profile

- **Method:** `GET`
- **Path:** `/account/profile`
- **Description:** Get customer account profile information
- **Response:** 200 OK
```json
{
  "id": 1,
  "email": "customer@example.com",
  "name": "John Doe",
  "phone": "+84912345678"
}
```

---

#### Update Profile

- **Method:** `PUT`
- **Path:** `/account/profile`
- **Description:** Update customer profile information
- **Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+84987654321"
}
```
- **Response:** 200 OK

---

#### Change Password

- **Method:** `PUT`
- **Path:** `/account/password`
- **Description:** Change customer password
- **Request Body:**
```json
{
  "old_password": "OldPass123",
  "new_password": "NewPass456"
}
```
- **Response:** 200 OK

---

#### Get Addresses

- **Method:** `GET`
- **Path:** `/account/addresses`
- **Description:** Get list of saved shipping addresses
- **Response:** 200 OK
```json
{
  "addresses": [
    {
      "id": 1,
      "recipient_name": "John Doe",
      "phone": "+84912345678",
      "address_line": "123 Main St",
      "city": "Ho Chi Minh City",
      "district": "District 1",
      "ward": "Ward 1",
      "is_default": true
    }
  ]
}
```

---

#### Add Address

- **Method:** `POST`
- **Path:** `/account/addresses`
- **Description:** Add new shipping address
- **Request Body:**
```json
{
  "recipient_name": "John Doe",
  "phone": "+84912345678",
  "address_line": "123 Main St",
  "city": "Ho Chi Minh City",
  "district": "District 1",
  "ward": "Ward 1",
  "is_default": false
}
```
- **Response:** 201 Created

---

#### Update Address

- **Method:** `PUT`
- **Path:** `/account/addresses/:id`
- **Description:** Update shipping address
- **Path Parameters:**
  - `id` (integer): Address ID
- **Request Body:** (same as Add Address)
- **Response:** 200 OK

---

#### Delete Address

- **Method:** `DELETE`
- **Path:** `/account/addresses/:id`
- **Description:** Delete shipping address
- **Path Parameters:**
  - `id` (integer): Address ID
- **Response:** 200 OK

---

### Addresses Module

**Base Path:** `/addresses`  
**Authentication:** JWT Required

#### Get All Addresses

- **Method:** `GET`
- **Path:** `/addresses`
- **Description:** Get all saved addresses for logged-in user
- **Response:** 200 OK (same format as `/account/addresses`)

---

#### Create Address

- **Method:** `POST`
- **Path:** `/addresses`
- **Description:** Create new shipping address
- **Request Body:** (same as `/account/addresses`)
- **Response:** 201 Created

---

#### Update Address

- **Method:** `PUT`
- **Path:** `/addresses/:id`
- **Description:** Update existing address
- **Path Parameters:**
  - `id` (integer): Address ID
- **Request Body:** (address fields)
- **Response:** 200 OK

---

#### Delete Address

- **Method:** `DELETE`
- **Path:** `/addresses/:id`
- **Description:** Delete address
- **Path Parameters:**
  - `id` (integer): Address ID
- **Response:** 200 OK

---

### Cart Module

**Base Path:** `/cart`  
**Authentication:** JWT Required

#### Get Cart

- **Method:** `GET`
- **Path:** `/cart`
- **Description:** Get customer's shopping cart with all items
- **Response:** 200 OK
```json
{
  "cart_items": [
    {
      "id": 1,
      "variant_id": 10,
      "product_name": "Áo Khoác Denim",
      "size": "L",
      "color": "Xanh",
      "price": 450000,
      "quantity": 2,
      "subtotal": 900000,
      "image_url": "https://..."
    }
  ],
  "total": 900000,
  "item_count": 2
}
```

---

#### Add to Cart

- **Method:** `POST`
- **Path:** `/cart/items`
- **Description:** Add variant to cart (or increase quantity if exists)
- **Request Body:**
```json
{
  "variant_id": 10,
  "quantity": 1
}
```
- **Response:** 201 Created

---

#### Update Cart Item

- **Method:** `PUT`
- **Path:** `/cart/items/:id`
- **Description:** Update cart item quantity
- **Path Parameters:**
  - `id` (integer): Cart item ID
- **Request Body:**
```json
{
  "quantity": 3
}
```
- **Response:** 200 OK

---

#### Remove from Cart

- **Method:** `DELETE`
- **Path:** `/cart/items/:id`
- **Description:** Remove item from cart
- **Path Parameters:**
  - `id` (integer): Cart item ID
- **Response:** 200 OK

---

#### Apply Coupon

- **Method:** `POST`
- **Path:** `/cart/apply-coupon`
- **Description:** Apply coupon/discount code to cart
- **Request Body:**
```json
{
  "code": "SUMMER2024"
}
```
- **Response:** 200 OK

---

### Checkout & Payment Module

**Base Path:** `/api/v1/checkout`  
**Authentication:** JWT Required

#### Create Order

- **Method:** `POST`
- **Path:** `/api/v1/checkout`
- **Description:** Create order from cart items (Step 1 of checkout). Checks stock, reserves inventory, clears cart.
- **Request Body:**
```json
{
  "address_id": 1,
  "payment_method": "vnpay",
  "shipping_fee": 30000,
  "notes": "Please deliver in the morning"
}
```
- **Response:** 201 Created
```json
{
  "order_id": 123,
  "total_amount": 930000,
  "message": "Order created successfully"
}
```

---

#### Create VNPAY Payment URL

- **Method:** `POST`
- **Path:** `/api/v1/checkout/create-payment-url`
- **Description:** Generate VNPAY payment URL for order (Step 2 of checkout)
- **Request Body:**
```json
{
  "order_id": 123
}
```
- **Response:** 200 OK
```json
{
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
}
```

---

#### VNPAY Return URL

- **Method:** `GET`
- **Path:** `/api/v1/payment/vnpay-return`
- **Description:** VNPAY callback URL (Step 3). Verifies payment signature and updates order status. Redirects to frontend.
- **Authentication:** None (Public - called by VNPAY)
- **Query Parameters:** (Multiple params from VNPAY including vnp_ResponseCode, vnp_TxnRef, vnp_SecureHash, etc.)
- **Response:** 302 Redirect to frontend

---

### Orders Module

**Base Path:** `/orders`  
**Authentication:** JWT Required

#### Get Order History

- **Method:** `GET`
- **Path:** `/orders`
- **Description:** Get customer's order history with pagination and filters
- **Query Parameters:**
  - `page` (integer, optional): Page number (default: 1)
  - `limit` (integer, optional): Items per page (default: 10)
  - `status` (string, optional): Filter by status (pending, processing, shipped, delivered, cancelled)
- **Response:** 200 OK
```json
{
  "data": [
    {
      "id": 123,
      "order_id": 123,
      "status": "delivered",
      "payment_status": "paid",
      "total_amount": 930000,
      "created_at": "2024-11-20T10:00:00Z",
      "items_count": 2
    }
  ],
  "metadata": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "total_pages": 2
  }
}
```

---

#### Get Order Details

- **Method:** `GET`
- **Path:** `/orders/:id`
- **Description:** Get order details including items, address, payment status
- **Path Parameters:**
  - `id` (integer): Order ID
- **Response:** 200 OK
```json
{
  "id": 123,
  "order_id": 123,
  "status": "delivered",
  "payment_status": "paid",
  "total_amount": 930000,
  "shipping_fee": 30000,
  "items": [
    {
      "product_name": "Áo Khoác Denim",
      "size": "L",
      "color": "Xanh",
      "quantity": 2,
      "price_at_purchase": 450000
    }
  ],
  "shipping_address": {
    "recipient_name": "John Doe",
    "phone": "+84912345678",
    "address": "123 Main St, District 1, Ho Chi Minh City"
  }
}
```

---

#### Get Order Status History

- **Method:** `GET`
- **Path:** `/orders/:id/status-history`
- **Description:** Get order status timeline/history
- **Path Parameters:**
  - `id` (integer): Order ID
- **Response:** 200 OK
```json
{
  "history": [
    {
      "status": "pending",
      "changed_at": "2024-11-20T10:00:00Z",
      "changed_by": "System"
    },
    {
      "status": "confirmed",
      "changed_at": "2024-11-20T11:00:00Z",
      "changed_by": "Admin"
    }
  ]
}
```

---

#### Cancel Order

- **Method:** `POST`
- **Path:** `/orders/:id/cancel`
- **Description:** Cancel order (only if status is pending). Releases reserved stock.
- **Path Parameters:**
  - `id` (integer): Order ID
- **Response:** 200 OK

---

### Products Module (Public)

**Base Path:** `/products`  
**Authentication:** None (Public)

#### Get Product List

- **Method:** `GET`
- **Path:** `/products`
- **Description:** Get product list with filters, search, sort, pagination
- **Query Parameters:**
  - `page` (integer, optional): Page number
  - `limit` (integer, optional): Items per page
  - `category_slug` (string, optional): Filter by category
  - `colors` (string, optional): Filter by color IDs (comma-separated: "1,2,3")
  - `sizes` (string, optional): Filter by size IDs (comma-separated: "1,2,3")
  - `min_price` (number, optional): Minimum price
  - `max_price` (number, optional): Maximum price
  - `search` (string, optional): Search by name or description
  - `sort_by` (string, optional): Sort by (newest, price_asc, price_desc, rating)
- **Response:** 200 OK
```json
{
  "data": [
    {
      "id": 1,
      "name": "Áo Khoác Denim Oversize",
      "slug": "ao-khoac-denim-oversize",
      "selling_price": 450000,
      "original_price": 550000,
      "discount_percentage": 18,
      "thumbnail_url": "https://...",
      "category_name": "Áo Khoác",
      "average_rating": 4.5,
      "total_reviews": 25
    }
  ],
  "metadata": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "total_pages": 5
  }
}
```

---

#### Get New Arrivals

- **Method:** `GET`
- **Path:** `/products/new-arrivals`
- **Description:** Get new arrival products (created within 30 days)
- **Query Parameters:**
  - `page` (integer, optional)
  - `limit` (integer, optional)
- **Response:** 200 OK (same format as product list)

---

#### Get Products On Sale

- **Method:** `GET`
- **Path:** `/products/on-sale`
- **Description:** Get products on flash sale/promotion
- **Query Parameters:**
  - `page` (integer, optional)
  - `limit` (integer, optional)
- **Response:** 200 OK (same format as product list)

---

#### Get Product Details

- **Method:** `GET`
- **Path:** `/products/:slug`
- **Description:** Get product details by slug with variants, images, promotions, related products
- **Path Parameters:**
  - `slug` (string): Product slug
- **Response:** 200 OK
```json
{
  "id": 1,
  "name": "Áo Khoác Denim Oversize",
  "slug": "ao-khoac-denim-oversize",
  "description": "Áo khoác denim phong cách oversize...",
  "selling_price": 450000,
  "original_price": 550000,
  "category": {
    "id": 2,
    "name": "Áo Khoác",
    "slug": "ao-khoac"
  },
  "variants": [
    {
      "id": 10,
      "sku": "AKD-L-XANH",
      "size": "L",
      "color": "Xanh Denim",
      "color_hex": "#4682B4",
      "total_stock": 25,
      "available_stock": 22,
      "images": ["https://image1.jpg", "https://image2.jpg"]
    }
  ],
  "available_options": {
    "sizes": ["S", "M", "L", "XL"],
    "colors": [
      {"name": "Xanh Denim", "hex": "#4682B4"},
      {"name": "Đen", "hex": "#000000"}
    ]
  },
  "promotion": {
    "discount_percentage": 18,
    "valid_until": "2024-12-31T23:59:59Z"
  },
  "reviews": {
    "average_rating": 4.5,
    "total_reviews": 25,
    "rating_distribution": {
      "5": 15,
      "4": 8,
      "3": 2,
      "2": 0,
      "1": 0
    }
  },
  "related_products": [
    {
      "id": 2,
      "name": "Áo Thun Basic",
      "slug": "ao-thun-basic",
      "selling_price": 150000,
      "thumbnail_url": "https://..."
    }
  ]
}
```

---

### Reviews Module

**Base Path:** `/reviews`  
**Authentication:** JWT Required

#### Submit Review

- **Method:** `POST`
- **Path:** `/reviews`
- **Description:** Submit product review. Status starts as 'pending' until admin approval.
- **Request Body:**
```json
{
  "product_id": 1,
  "rating": 5,
  "comment": "Great product! Highly recommended."
}
```
- **Response:** 201 Created

---

#### Get Reviewable Items

- **Method:** `GET`
- **Path:** `/reviews/account/reviewable-items`
- **Description:** Get list of products customer can review (purchased but not reviewed)
- **Response:** 200 OK
```json
{
  "reviewable_items": [
    {
      "product_id": 1,
      "product_name": "Áo Khoác Denim",
      "order_id": 123,
      "purchased_at": "2024-11-20T10:00:00Z",
      "thumbnail_url": "https://..."
    }
  ]
}
```

---

### Wishlist Module

**Base Path:** `/wishlist`  
**Authentication:** JWT Required

#### Get Wishlist

- **Method:** `GET`
- **Path:** `/wishlist`
- **Description:** Get customer's wishlist with product details
- **Response:** 200 OK
```json
{
  "wishlist_items": [
    {
      "id": 1,
      "variant_id": 10,
      "product_name": "Áo Khoác Denim",
      "size": "L",
      "color": "Xanh",
      "price": 450000,
      "image_url": "https://...",
      "added_at": "2024-11-15T10:00:00Z"
    }
  ],
  "total_items": 5
}
```

---

#### Toggle Wishlist

- **Method:** `POST`
- **Path:** `/wishlist/toggle`
- **Description:** Add or remove variant from wishlist (toggle action)
- **Request Body:**
```json
{
  "variant_id": 10
}
```
- **Response:** 200 OK
```json
{
  "action": "added",
  "message": "Added to wishlist"
}
```

---

#### Remove from Wishlist

- **Method:** `DELETE`
- **Path:** `/wishlist/:variantId`
- **Description:** Remove variant from wishlist
- **Path Parameters:**
  - `variantId` (integer): Variant ID
- **Response:** 200 OK

---

### Users Module

**Base Path:** `/users`  
**Authentication:** JWT Required

#### Get User Profile

- **Method:** `GET`
- **Path:** `/users/profile`
- **Description:** Get user profile information
- **Response:** 200 OK

---

#### Update User Profile

- **Method:** `PUT`
- **Path:** `/users/profile`
- **Description:** Update user profile
- **Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+84987654321"
}
```
- **Response:** 200 OK

---

#### Change Password

- **Method:** `POST`
- **Path:** `/users/change-password`
- **Description:** Change user password
- **Request Body:**
```json
{
  "current_password": "OldPass123",
  "new_password": "NewPass456"
}
```
- **Response:** 200 OK

---

### Promotions Module (Public)

**Base Path:** `/promotions`  
**Authentication:** None (Public)

#### Get Active Promotions

- **Method:** `GET`
- **Path:** `/promotions/public`
- **Description:** Get active public promotions/coupons
- **Query Parameters:**
  - `type` (string, optional): Filter by type (percentage/fixed)
- **Response:** 200 OK
```json
{
  "promotions": [
    {
      "id": 1,
      "code": "SUMMER2024",
      "type": "percentage",
      "discount_value": 20,
      "description": "Summer Sale - 20% off",
      "min_order_value": 500000,
      "valid_from": "2024-06-01T00:00:00Z",
      "valid_until": "2024-08-31T23:59:59Z",
      "usage_limit": 1000,
      "used_count": 234
    }
  ]
}
```

---

### Categories Module (Public)

**Base Path:** `/categories`  
**Authentication:** None (Public)

#### Get All Categories

- **Method:** `GET`
- **Path:** `/categories`
- **Description:** Get all active categories (public)
- **Response:** 200 OK
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Áo Sơ Mi",
      "slug": "ao-so-mi",
      "product_count": 45
    }
  ]
}
```

---

#### Get Products by Category

- **Method:** `GET`
- **Path:** `/categories/:slug/products`
- **Description:** Get products by category slug
- **Path Parameters:**
  - `slug` (string): Category slug
- **Query Parameters:** (same as `/products` endpoint)
- **Response:** 200 OK (same format as product list)

---

### Pages Module (Public CMS)

**Base Path:** `/pages`  
**Authentication:** None (Public)

#### Get Page Content

- **Method:** `GET`
- **Path:** `/pages/:slug`
- **Description:** Get static page content (About Us, FAQ, Terms, Privacy Policy)
- **Path Parameters:**
  - `slug` (string): Page slug (e.g., "about-us", "faq", "terms-and-conditions")
- **Response:** 200 OK
```json
{
  "id": 1,
  "slug": "about-us",
  "title": "About Us",
  "body_content": "<p>Welcome to LeCas Fashion...</p>",
  "meta_description": "Learn more about LeCas Fashion"
}
```

---

### Support Module

**Base Path:** `/support`  
**Authentication:** None (Public)

#### Submit Support Ticket

- **Method:** `POST`
- **Path:** `/support/tickets`
- **Description:** Submit customer support request/contact form (public, no login required)
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "customer@example.com",
  "subject": "Question about my order",
  "message": "I have a question regarding order #123..."
}
```
- **Response:** 201 Created
```json
{
  "message": "Your support request has been submitted. We'll respond soon.",
  "ticket_id": 45
}
```

---

## AI Features

### AI Chatbot & Image Search

**Base Path:** `/ai`  
**Authentication:** None (Public)

#### AI Chatbot

- **Method:** `POST`
- **Path:** `/ai/chatbot`
- **Description:** Send message to Rasa AI chatbot (proxy endpoint)
- **Request Body:**
```json
{
  "message": "Tôi muốn tìm áo khoác",
  "session_id": "user_session_123"
}
```
- **Response:** 200 OK
```json
{
  "responses": [
    {
      "text": "Chúng tôi có nhiều mẫu áo khoác đẹp. Bạn thích kiểu nào?"
    }
  ]
}
```

---

#### AI Image Search

- **Method:** `POST`
- **Path:** `/ai/search/image`
- **Description:** AI-powered image search - upload image to find similar products
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  - `image` (file): Image file to search
- **Response:** 200 OK
```json
{
  "message": "Image search completed",
  "results": [
    {
      "product_id": 1,
      "product_name": "Áo Khoác Denim",
      "similarity_score": 0.95,
      "thumbnail_url": "https://...",
      "selling_price": 450000
    }
  ],
  "count": 10
}
```

---

## Admin APIs

### Admin Dashboard & Management

**Base Path:** `/admin`  
**Authentication:** Admin JWT Required

#### Get Dashboard Statistics

- **Method:** `GET`
- **Path:** `/admin/dashboard/stats`
- **Description:** Dashboard overview statistics - orders, customers, products, revenue, recent orders
- **Response:** 200 OK
```json
{
  "total_orders": 1250,
  "total_customers": 850,
  "total_products": 160,
  "total_revenue": 250000000,
  "pending_orders": 45,
  "recent_orders": [
    {
      "id": 123,
      "customer_name": "John Doe",
      "total_amount": 930000,
      "status": "pending",
      "created_at": "2024-11-26T10:00:00Z"
    }
  ]
}
```

---

#### Get All Promotions (Admin)

- **Method:** `GET`
- **Path:** `/admin/promotions`
- **Description:** Get all promotions/coupons with pagination and filters
- **Query Parameters:**
  - `page` (integer, optional)
  - `limit` (integer, optional)
  - `status` (string, optional): Filter by status
  - `search` (string, optional): Search by code
  - `active` (boolean, optional): Only active promotions
- **Response:** 200 OK

---

#### Get Promotion Details

- **Method:** `GET`
- **Path:** `/admin/promotions/:id`
- **Description:** Get promotion details by ID
- **Path Parameters:**
  - `id` (integer): Promotion ID
- **Response:** 200 OK

---

#### Create Promotion

- **Method:** `POST`
- **Path:** `/admin/promotions`
- **Description:** Create new promotion/coupon code
- **Request Body:**
```json
{
  "code": "SUMMER2024",
  "type": "percentage",
  "discount_value": 20,
  "description": "Summer Sale",
  "min_order_value": 500000,
  "max_discount_value": 100000,
  "valid_from": "2024-06-01T00:00:00Z",
  "valid_until": "2024-08-31T23:59:59Z",
  "usage_limit": 1000,
  "status": "active"
}
```
- **Response:** 201 Created

---

#### Update Promotion

- **Method:** `PUT`
- **Path:** `/admin/promotions/:id`
- **Description:** Update promotion details (cannot change code)
- **Path Parameters:**
  - `id` (integer): Promotion ID
- **Request Body:** (promotion fields)
- **Response:** 200 OK

---

#### Delete Promotion

- **Method:** `DELETE`
- **Path:** `/admin/promotions/:id`
- **Description:** Delete promotion
- **Path Parameters:**
  - `id` (integer): Promotion ID
- **Response:** 200 OK

---

#### Toggle Promotion Status

- **Method:** `POST`
- **Path:** `/admin/promotions/:id/toggle`
- **Description:** Toggle promotion status (Active/Inactive)
- **Path Parameters:**
  - `id` (integer): Promotion ID
- **Response:** 200 OK

---

#### Get Promotion Usage Stats

- **Method:** `GET`
- **Path:** `/admin/promotions/:code/usage`
- **Description:** Get promotion usage statistics
- **Path Parameters:**
  - `code` (string): Promotion code
- **Response:** 200 OK

---

#### Get All Orders (Admin)

- **Method:** `GET`
- **Path:** `/admin/orders`
- **Description:** Get all orders from all customers with pagination and filters
- **Query Parameters:**
  - `page` (integer, optional)
  - `limit` (integer, optional)
  - `status` (string, optional)
  - `customer_email` (string, optional)
- **Response:** 200 OK

---

#### Update Order Status

- **Method:** `PUT`
- **Path:** `/admin/orders/:id/status`
- **Description:** Update order status. Sends email notification to customer.
- **Path Parameters:**
  - `id` (integer): Order ID
- **Request Body:**
```json
{
  "status": "confirmed"
}
```
- **Response:** 200 OK

---

#### Get All Customers

- **Method:** `GET`
- **Path:** `/admin/customers`
- **Description:** Get all customers with order stats and spending
- **Query Parameters:**
  - `page` (integer, optional)
  - `limit` (integer, optional)
  - `search` (string, optional): Search by name or email
- **Response:** 200 OK

---

#### Get Customer Details

- **Method:** `GET`
- **Path:** `/admin/customers/:id`
- **Description:** Get customer details with orders, addresses, total spending
- **Path Parameters:**
  - `id` (integer): Customer ID
- **Response:** 200 OK

---

#### Update Customer Status

- **Method:** `PATCH`
- **Path:** `/admin/customers/:id/status`
- **Description:** Activate/Deactivate customer account
- **Path Parameters:**
  - `id` (integer): Customer ID
- **Request Body:**
```json
{
  "status": "active"
}
```
- **Response:** 200 OK

---

#### Update Support Ticket

- **Method:** `PUT`
- **Path:** `/admin/support/tickets/:id`
- **Description:** Update support ticket status
- **Path Parameters:**
  - `id` (integer): Ticket ID
- **Request Body:**
```json
{
  "status": "resolved",
  "admin_notes": "Issue resolved via phone call"
}
```
- **Response:** 200 OK

---

#### Update CMS Page

- **Method:** `PUT`
- **Path:** `/admin/pages/:slug`
- **Description:** Update CMS static page content
- **Path Parameters:**
  - `slug` (string): Page slug
- **Request Body:**
```json
{
  "title": "About Us - Updated",
  "body_content": "<p>Updated content...</p>",
  "status": "published"
}
```
- **Response:** 200 OK

---

#### Get Chatbot Conversations

- **Method:** `GET`
- **Path:** `/admin/chatbot/conversations`
- **Description:** Get all chatbot conversations with filters
- **Query Parameters:**
  - `page` (integer, optional)
  - `limit` (integer, optional)
  - `resolved` (boolean, optional)
  - `search` (string, optional)
- **Response:** 200 OK

---

#### Get Conversation Details

- **Method:** `GET`
- **Path:** `/admin/chatbot/conversations/:id`
- **Description:** Get chatbot conversation details with all messages
- **Path Parameters:**
  - `id` (string): Conversation ID
- **Response:** 200 OK

---

#### Get Chatbot Analytics

- **Method:** `GET`
- **Path:** `/admin/chatbot/analytics`
- **Description:** Chatbot analytics - conversations, messages, resolved rate, top intents
- **Response:** 200 OK

---

#### Get Unanswered Conversations

- **Method:** `GET`
- **Path:** `/admin/chatbot/unanswered`
- **Description:** Get unresolved conversations with high message count
- **Response:** 200 OK

---

#### Get AI Recommendations

- **Method:** `GET`
- **Path:** `/admin/ai/recommendations`
- **Description:** Get all AI recommendations with filters
- **Query Parameters:**
  - `page` (integer, optional)
  - `limit` (integer, optional)
  - `user_id` (integer, optional)
  - `product_id` (integer, optional)
- **Response:** 200 OK

---

#### Get Recommendation Stats

- **Method:** `GET`
- **Path:** `/admin/ai/recommendations/stats`
- **Description:** AI recommendations statistics
- **Response:** 200 OK

---

#### Get Inventory Status

- **Method:** `GET`
- **Path:** `/admin/inventory`
- **Description:** Get inventory status for all products and variants
- **Query Parameters:**
  - `low_stock` (boolean, optional): Only show low stock items
- **Response:** 200 OK

---

#### Manual Restock

- **Method:** `POST`
- **Path:** `/admin/inventory/restock`
- **Description:** Manual inventory restock - create stock receipt
- **Request Body:**
```json
{
  "items": [
    {
      "variant_id": 10,
      "quantity": 50
    }
  ],
  "notes": "Weekly restock"
}
```
- **Response:** 201 Created

---

#### Batch Restock (Excel)

- **Method:** `POST`
- **Path:** `/admin/inventory/restock-batch`
- **Description:** Batch inventory restock via Excel upload
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  - `file` (file): Excel file with columns: sku, quantity
- **Response:** 201 Created

---

#### Get All Support Tickets

- **Method:** `GET`
- **Path:** `/admin/support-tickets`
- **Description:** Get all support tickets with filters
- **Query Parameters:**
  - `page` (integer, optional)
  - `limit` (integer, optional)
  - `status` (string, optional)
- **Response:** 200 OK

---

#### Get Support Ticket Detail

- **Method:** `GET`
- **Path:** `/admin/support-tickets/:id`
- **Description:** Get support ticket detail with reply history
- **Path Parameters:**
  - `id` (integer): Ticket ID
- **Response:** 200 OK

---

#### Reply to Support Ticket

- **Method:** `POST`
- **Path:** `/admin/support-tickets/:id/reply`
- **Description:** Admin reply to support ticket. Sends email notification.
- **Path Parameters:**
  - `id` (integer): Ticket ID
- **Request Body:**
```json
{
  "message": "Thank you for contacting us. We have processed your request..."
}
```
- **Response:** 201 Created

---

### Admin Analytics

**Base Path:** `/admin/analytics`  
**Authentication:** Admin JWT Required

#### Get Dashboard Stats

- **Method:** `GET`
- **Path:** `/admin/analytics/stats`
- **Description:** Dashboard KPIs - Total Revenue, New Orders, Avg Order Value, AI Escalated
- **Query Parameters:**
  - `period` (string, optional): 7d, 30d, 90d (default: 7d)
- **Response:** 200 OK
```json
{
  "total_revenue": 250000000,
  "new_orders": 145,
  "avg_order_value": 850000,
  "ai_escalated": 12
}
```

---

#### Get Sales Overview

- **Method:** `GET`
- **Path:** `/admin/analytics/sales-overview`
- **Description:** Sales overview chart data by date
- **Query Parameters:**
  - `period` (string, optional): 7d, 30d, 90d (default: 30d)
- **Response:** 200 OK
```json
{
  "data": [
    {
      "date": "2024-11-01",
      "revenue": 8500000,
      "orders": 25
    }
  ]
}
```

---

#### Get Product Analytics

- **Method:** `GET`
- **Path:** `/admin/products/:id/analytics`
- **Description:** Product-specific analytics - Units Sold, Total Orders, Avg Rating, Total Reviews
- **Path Parameters:**
  - `id` (integer): Product ID
- **Response:** 200 OK

---

#### Get Variant Sales Distribution

- **Method:** `GET`
- **Path:** `/admin/products/:id/variant-sales`
- **Description:** Variant sales distribution (Pie Chart data)
- **Path Parameters:**
  - `id` (integer): Product ID
- **Response:** 200 OK

---

#### Get Rating Distribution

- **Method:** `GET`
- **Path:** `/admin/products/:id/rating-distribution`
- **Description:** Rating distribution chart data
- **Path Parameters:**
  - `id` (integer): Product ID
- **Response:** 200 OK

---

#### Get Order Status Counts

- **Method:** `GET`
- **Path:** `/admin/orders/status-counts`
- **Description:** Count orders by status
- **Response:** 200 OK

---

#### Get Inventory Stats

- **Method:** `GET`
- **Path:** `/admin/inventory/stats`
- **Description:** Inventory statistics
- **Response:** 200 OK

---

#### Get Support Ticket Status Counts

- **Method:** `GET`
- **Path:** `/admin/support-tickets/status-counts`
- **Description:** Count support tickets by status
- **Response:** 200 OK

---

### Admin Products Management

**Base Path:** `/api/v1/admin/products`  
**Authentication:** Admin JWT Required

#### Get All Products (Admin)

- **Method:** `GET`
- **Path:** `/api/v1/admin/products`
- **Description:** Get all products with pagination, filters, sort, search
- **Query Parameters:**
  - `page`, `limit`, `category_id`, `status`, `search`, `sort`
- **Response:** 200 OK

---

#### Get Product Details (Admin)

- **Method:** `GET`
- **Path:** `/api/v1/admin/products/:id`
- **Description:** Get product details for editing
- **Path Parameters:**
  - `id` (integer): Product ID
- **Response:** 200 OK

---

#### Create Product

- **Method:** `POST`
- **Path:** `/api/v1/admin/products`
- **Description:** Create new product with variants in transaction
- **Request Body:**
```json
{
  "name": "Áo Khoác Denim Oversize",
  "category_id": 2,
  "description": "Áo khoác denim phong cách oversize...",
  "original_price": 550000,
  "selling_price": 450000,
  "variants": [
    {
      "size_id": 2,
      "color_id": 1,
      "sku": "AKD-M-XANH",
      "total_stock": 50
    }
  ]
}
```
- **Response:** 201 Created

---

#### Update Product

- **Method:** `PUT`
- **Path:** `/api/v1/admin/products/:id`
- **Description:** Update product and handle variant logic
- **Path Parameters:**
  - `id` (integer): Product ID
- **Request Body:** (product fields)
- **Response:** 200 OK

---

#### Update Product Status

- **Method:** `PATCH`
- **Path:** `/api/v1/admin/products/:id/status`
- **Description:** Update product status (active/inactive) - soft delete
- **Path Parameters:**
  - `id` (integer): Product ID
- **Request Body:**
```json
{
  "status": "inactive"
}
```
- **Response:** 200 OK

---

#### Get Product Variants

- **Method:** `GET`
- **Path:** `/api/v1/admin/products/:id/variants`
- **Description:** Get all variants for a product
- **Path Parameters:**
  - `id` (integer): Product ID
- **Response:** 200 OK

---

#### Update Variant

- **Method:** `PUT` or `PATCH`
- **Path:** `/api/v1/admin/variants/:id`
- **Description:** Update variant (SKU or status)
- **Path Parameters:**
  - `id` (integer): Variant ID
- **Request Body:**
```json
{
  "sku": "AKD-L-XANH-V2",
  "status": "active"
}
```
- **Response:** 200 OK

---

#### Upload Variant Images

- **Method:** `POST`
- **Path:** `/api/v1/admin/variants/:id/images`
- **Description:** Upload images for variant (max 10 files)
- **Path Parameters:**
  - `id` (integer): Variant ID
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  - `files` (file[]): Image files
- **Query Parameters:**
  - `is_main` (boolean, optional): Set first image as main
- **Response:** 201 Created

---

#### Delete Image

- **Method:** `DELETE`
- **Path:** `/api/v1/admin/images/:id`
- **Description:** Delete image from variant and Supabase Storage
- **Path Parameters:**
  - `id` (integer): Image ID
- **Response:** 200 OK

---

### Admin Categories Management

**Base Path:** `/api/v1/admin/categories`  
**Authentication:** Admin JWT Required

#### Get Category Stats

- **Method:** `GET`
- **Path:** `/api/v1/admin/categories/stats`
- **Description:** Get category statistics
- **Response:** 200 OK

---

#### Get All Categories (Dropdown)

- **Method:** `GET`
- **Path:** `/api/v1/admin/categories/all`
- **Description:** Get all active categories for dropdown (no pagination)
- **Response:** 200 OK

---

#### Get All Categories (Admin)

- **Method:** `GET`
- **Path:** `/api/v1/admin/categories`
- **Description:** Get all categories with product count
- **Response:** 200 OK

---

#### Create Category

- **Method:** `POST`
- **Path:** `/api/v1/admin/categories`
- **Description:** Create new category. Auto-generates slug.
- **Request Body:**
```json
{
  "name": "Hoodies",
  "status": "active"
}
```
- **Response:** 201 Created

---

#### Update Category

- **Method:** `PUT`
- **Path:** `/api/v1/admin/categories/:id`
- **Description:** Update category name and/or status
- **Path Parameters:**
  - `id` (integer): Category ID
- **Request Body:**
```json
{
  "name": "Updated Category Name",
  "status": "active"
}
```
- **Response:** 200 OK

---

### Admin Reviews Management

**Base Path:** `/admin/reviews`  
**Authentication:** Admin JWT Required

#### Get All Reviews (Admin)

- **Method:** `GET`
- **Path:** `/admin/reviews`
- **Description:** Get all reviews with filters
- **Query Parameters:**
  - `page`, `limit`, `product_id`, `rating`, `status`
- **Response:** 200 OK

---

#### Update Review Status

- **Method:** `PATCH`
- **Path:** `/admin/reviews/:id/status`
- **Description:** Approve or reject review
- **Path Parameters:**
  - `id` (integer): Review ID
- **Request Body:**
```json
{
  "status": "approved"
}
```
- **Response:** 200 OK

---

#### Delete Review

- **Method:** `DELETE`
- **Path:** `/admin/reviews/:id`
- **Description:** Delete review
- **Path Parameters:**
  - `id` (integer): Review ID
- **Response:** 200 OK

---

### Admin Pages (CMS) Management

**Base Path:** `/admin/pages`  
**Authentication:** Admin JWT Required

#### Create CMS Page

- **Method:** `POST`
- **Path:** `/admin/pages`
- **Description:** Create new CMS page
- **Request Body:**
```json
{
  "title": "About Us",
  "slug": "about-us",
  "body_content": "<p>Content here...</p>",
  "meta_description": "About our company",
  "status": "published"
}
```
- **Response:** 201 Created

---

#### Get All Pages

- **Method:** `GET`
- **Path:** `/admin/pages`
- **Description:** Get all CMS pages list
- **Response:** 200 OK

---

#### Get Page Details

- **Method:** `GET`
- **Path:** `/admin/pages/:id`
- **Description:** Get CMS page details for editing
- **Path Parameters:**
  - `id` (integer): Page ID
- **Response:** 200 OK

---

#### Update CMS Page

- **Method:** `PUT`
- **Path:** `/admin/pages/:id`
- **Description:** Update CMS page
- **Path Parameters:**
  - `id` (integer): Page ID
- **Request Body:** (page fields)
- **Response:** 200 OK

---

#### Delete CMS Page

- **Method:** `DELETE`
- **Path:** `/admin/pages/:id`
- **Description:** Delete CMS page
- **Path Parameters:**
  - `id` (integer): Page ID
- **Response:** 200 OK

---

### Admin Colors Management

**Base Path:** `/api/v1/admin/colors`  
**Authentication:** Admin JWT Required

#### Get All Colors

- **Method:** `GET`
- **Path:** `/api/v1/admin/colors`
- **Description:** Get all colors with pagination
- **Query Parameters:**
  - `page`, `limit`, `search`
- **Response:** 200 OK

---

#### Get All Colors (Dropdown)

- **Method:** `GET`
- **Path:** `/api/v1/admin/colors/all`
- **Description:** Get all colors for dropdown (no pagination)
- **Response:** 200 OK

---

#### Create Color

- **Method:** `POST`
- **Path:** `/api/v1/admin/colors`
- **Description:** Create new color
- **Request Body:**
```json
{
  "name": "Navy Blue",
  "hex_code": "#000080"
}
```
- **Response:** 201 Created

---

#### Update Color

- **Method:** `PUT`
- **Path:** `/api/v1/admin/colors/:id`
- **Description:** Update color
- **Path Parameters:**
  - `id` (integer): Color ID
- **Request Body:** (color fields)
- **Response:** 200 OK

---

### Admin Sizes Management

**Base Path:** `/api/v1/admin/sizes`  
**Authentication:** Admin JWT Required

#### Get All Sizes

- **Method:** `GET`
- **Path:** `/api/v1/admin/sizes`
- **Description:** Get all sizes with pagination
- **Query Parameters:**
  - `page`, `limit`, `search`
- **Response:** 200 OK

---

#### Get All Sizes (Dropdown)

- **Method:** `GET`
- **Path:** `/api/v1/admin/sizes/all`
- **Description:** Get all sizes for dropdown (no pagination)
- **Response:** 200 OK

---

#### Create Size

- **Method:** `POST`
- **Path:** `/api/v1/admin/sizes`
- **Description:** Create new size
- **Request Body:**
```json
{
  "name": "XXL",
  "sort_order": 5
}
```
- **Response:** 201 Created

---

#### Update Size

- **Method:** `PUT`
- **Path:** `/api/v1/admin/sizes/:id`
- **Description:** Update size
- **Path Parameters:**
  - `id` (integer): Size ID
- **Request Body:** (size fields)
- **Response:** 200 OK

---

## Internal APIs

### Rasa Action Server APIs

**Base Path:** `/internal`  
**Authentication:** API Key (x-api-key header)

#### Get Order by ID

- **Method:** `GET`
- **Path:** `/internal/orders/:id`
- **Description:** Get order details for chatbot
- **Path Parameters:**
  - `id` (string): Order ID
- **Response:** 200 OK

---

#### Search Products (Chatbot)

- **Method:** `GET`
- **Path:** `/internal/products`
- **Description:** Search products for chatbot
- **Query Parameters:**
  - `search` (string, optional): Search term
  - `category` (string, optional): Category slug
  - `limit` (integer, optional): Result limit (default: 10)
- **Response:** 200 OK

---

#### Get Page Content (Chatbot)

- **Method:** `GET`
- **Path:** `/internal/pages/:slug`
- **Description:** Get static page content for chatbot
- **Path Parameters:**
  - `slug` (string): Page slug
- **Response:** 200 OK

---

#### Search FAQ

- **Method:** `GET`
- **Path:** `/internal/faq`
- **Description:** Search FAQ/content for chatbot
- **Query Parameters:**
  - `query` (string): Search query
- **Response:** 200 OK

---

#### Get User by Email

- **Method:** `GET`
- **Path:** `/internal/users/email/:email`
- **Description:** Get user by email for chatbot
- **Path Parameters:**
  - `email` (string): User email
- **Response:** 200 OK

---

#### Get Customer Orders (Chatbot)

- **Method:** `GET`
- **Path:** `/internal/customers/orders`
- **Description:** Get customer orders for chatbot
- **Query Parameters:**
  - `email` (string, REQUIRED): Customer email
- **Response:** 200 OK

---

#### Search Variants (Chatbot)

- **Method:** `GET`
- **Path:** `/internal/variants`
- **Description:** Search product variants for chatbot
- **Query Parameters:**
  - `product_id` (integer, optional)
  - `sku` (string, optional)
  - `size` (string, optional)
  - `color` (string, optional)
  - `in_stock` (boolean, optional)
  - `limit` (integer, optional, default: 20)
- **Response:** 200 OK

---

#### Get Sizing Advice

- **Method:** `POST`
- **Path:** `/internal/products/sizing-advice`
- **Description:** Get size recommendation for chatbot
- **Request Body:**
```json
{
  "height": 175,
  "weight": 70,
  "category": "Áo Khoác"
}
```
- **Response:** 200 OK

---

#### Get Styling Rules

- **Method:** `GET`
- **Path:** `/internal/products/:id/styling-rules`
- **Description:** Get styling suggestions for product
- **Path Parameters:**
  - `id` (integer): Product ID
- **Response:** 200 OK

---

#### Get Top Discounts

- **Method:** `GET`
- **Path:** `/internal/promotions/top-discounts`
- **Description:** Get top discounted products
- **Query Parameters:**
  - `limit` (integer, optional, default: 20)
- **Response:** 200 OK

---

#### Subscribe to Notifications

- **Method:** `POST`
- **Path:** `/internal/notifications/subscribe`
- **Description:** Subscribe to product notifications (restock, price drop)
- **Request Body:**
```json
{
  "email": "customer@example.com",
  "product_id": 1,
  "notification_type": "restock"
}
```
- **Response:** 200 OK

---

#### Create Support Ticket (Chatbot)

- **Method:** `POST`
- **Path:** `/internal/support/create-ticket`
- **Description:** Create support ticket from chatbot
- **Request Body:**
```json
{
  "email": "customer@example.com",
  "subject": "Product inquiry",
  "message": "I need help with...",
  "category": "product_inquiry"
}
```
- **Response:** 201 Created

---

## Summary Statistics

### Total Endpoints: **150+**

### Breakdown by Category:

#### Authentication & User Management (15 endpoints)
- Customer Authentication: 10 endpoints
- Admin Authentication: 1 endpoint
- Account & Addresses: 11 endpoints
- Users: 3 endpoints

#### Shopping & Orders (26 endpoints)
- Cart: 5 endpoints
- Checkout & Payment: 3 endpoints
- Orders: 4 endpoints
- Wishlist: 3 endpoints
- Reviews: 2 endpoints

#### Products & Catalog (13 endpoints)
- Public Products: 4 endpoints
- Public Categories: 2 endpoints
- Public Promotions: 1 endpoint

#### Admin Management (70+ endpoints)
- Admin Dashboard: 1 endpoint
- Admin Analytics: 8 endpoints
- Admin Products: 8 endpoints
- Admin Variants: 3 endpoints
- Admin Images: 2 endpoints
- Admin Categories: 5 endpoints
- Admin Colors: 4 endpoints
- Admin Sizes: 4 endpoints
- Admin Promotions: 7 endpoints
- Admin Orders: 2 endpoints
- Admin Customers: 3 endpoints
- Admin Reviews: 3 endpoints
- Admin Pages (CMS): 5 endpoints
- Admin Inventory: 3 endpoints
- Admin Support Tickets: 4 endpoints
- Admin Chatbot/AI: 8 endpoints

#### AI Features (2 endpoints)
- AI Chatbot: 1 endpoint
- AI Image Search: 1 endpoint

#### Internal APIs (12 endpoints)
- Rasa Action Server Integration

#### Content & Support (3 endpoints)
- Public Pages: 1 endpoint
- Support Tickets: 1 endpoint

---

## Notes

### Global Prefixes
- No global API prefix for most customer endpoints
- Admin endpoints use `/admin` or `/api/v1/admin` prefix
- Auth endpoints use `/api/v1/auth` and `/api/v1/admin/auth`
- Internal APIs use `/internal` prefix

### Authentication Headers
- **Customer/Admin JWT:** `Authorization: Bearer {token}`
- **Internal APIs:** `x-api-key: {api_key}`

### Common Response Codes
- **200 OK:** Successful GET/PUT/PATCH request
- **201 Created:** Successful POST request (resource created)
- **204 No Content:** Successful DELETE request
- **400 Bad Request:** Invalid input data
- **401 Unauthorized:** Missing or invalid authentication
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **409 Conflict:** Duplicate resource (e.g., email already exists)
- **500 Internal Server Error:** Server-side error

### Pagination Format
Most list endpoints support pagination with query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: varies by endpoint)

Response includes metadata:
```json
{
  "data": [...],
  "metadata": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "total_pages": 5
  }
}
```

---

**End of API Inventory**

For interactive testing and detailed schemas, visit: `http://localhost:3001/api-docs`
