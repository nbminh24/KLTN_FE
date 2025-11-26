# Database Schema Documentation

**Last Updated:** November 26, 2024  
**Purpose:** Deep Source of Truth for Data Types, Relationships, and Constraints

---

## Overview

This document contains the complete PostgreSQL database schema for the LeCas Fashion E-commerce platform. Use this as the authoritative reference for:
- Data types and constraints
- Foreign key relationships
- Enum values and validation rules
- Default values
- Unique constraints

---

## Tables

### 1. admins

Admin user accounts for managing the platform.

```sql
CREATE TABLE public.admins (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying,
  email character varying NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role character varying NOT NULL,
  CONSTRAINT admins_pkey PRIMARY KEY (id)
);
```

**Constraints:**
- `email` must be unique
- `role` is required (e.g., 'admin', 'super_admin')

---

### 2. customers

Customer user accounts.

```sql
CREATE TABLE public.customers (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying,
  email character varying NOT NULL UNIQUE,
  password_hash text,
  status character varying DEFAULT 'inactive'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  refresh_token text,
  refresh_token_expires timestamp with time zone,
  CONSTRAINT customers_pkey PRIMARY KEY (id)
);
```

**Constraints:**
- `email` must be unique
- `status` enum: 'active', 'inactive'
- Default status: 'inactive'

---

### 3. customer_addresses

Customer shipping addresses.

```sql
CREATE TABLE public.customer_addresses (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  customer_id bigint NOT NULL,
  is_default boolean DEFAULT false,
  address_type character varying DEFAULT 'Home'::character varying,
  detailed_address text NOT NULL,
  phone_number character varying NOT NULL,
  CONSTRAINT customer_addresses_pkey PRIMARY KEY (id),
  CONSTRAINT customer_addresses_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id)
);
```

**Constraints:**
- `customer_id` references `customers(id)`
- `detailed_address` is required
- `phone_number` is required
- `address_type` default: 'Home'

---

### 4. categories

Product categories.

```sql
CREATE TABLE public.categories (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  status character varying DEFAULT 'active'::character varying,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
```

**Constraints:**
- `slug` must be unique
- `status` enum: 'active', 'inactive'
- Default status: 'active'

---

### 5. products

Products catalog.

```sql
CREATE TABLE public.products (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  category_id bigint,
  name character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  description text,
  full_description text,
  cost_price numeric,
  selling_price numeric NOT NULL,
  status character varying DEFAULT 'active'::character varying,
  thumbnail_url text,
  average_rating numeric DEFAULT 0.00,
  total_reviews integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
```

**Constraints:**
- `slug` must be unique
- `selling_price` is required
- `status` enum: 'active', 'inactive'
- `category_id` references `categories(id)`

---

### 6. sizes

Product sizes.

```sql
CREATE TABLE public.sizes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  sort_order integer DEFAULT 0,
  CONSTRAINT sizes_pkey PRIMARY KEY (id)
);
```

---

### 7. colors

Product colors.

```sql
CREATE TABLE public.colors (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  hex_code character varying,
  CONSTRAINT colors_pkey PRIMARY KEY (id)
);
```

---

### 8. product_variants

Product variants (size/color combinations).

```sql
CREATE TABLE public.product_variants (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  product_id bigint NOT NULL,
  size_id bigint,
  color_id bigint,
  name character varying,
  sku character varying NOT NULL UNIQUE,
  total_stock integer DEFAULT 0,
  reserved_stock integer DEFAULT 0,
  reorder_point integer DEFAULT 0,
  status character varying DEFAULT 'active'::character varying,
  CONSTRAINT product_variants_pkey PRIMARY KEY (id),
  CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT product_variants_size_id_fkey FOREIGN KEY (size_id) REFERENCES public.sizes(id),
  CONSTRAINT product_variants_color_id_fkey FOREIGN KEY (color_id) REFERENCES public.colors(id)
);
```

**Constraints:**
- `sku` must be unique
- `status` enum: 'active', 'inactive'
- Stock fields default to 0
- References: `products(id)`, `sizes(id)`, `colors(id)`

---

### 9. product_images

Product variant images.

```sql
CREATE TABLE public.product_images (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  variant_id bigint NOT NULL,
  image_url text NOT NULL,
  is_main boolean DEFAULT false,
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id)
);
```

**Constraints:**
- `variant_id` references `product_variants(id)`
- `image_url` is required

---

### 10. carts

Shopping carts (session or customer-based).

```sql
CREATE TABLE public.carts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  customer_id bigint UNIQUE,
  session_id character varying UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT carts_pkey PRIMARY KEY (id),
  CONSTRAINT carts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id)
);
```

**Constraints:**
- `customer_id` must be unique (one cart per customer)
- `session_id` must be unique (for guest carts)
- Either `customer_id` OR `session_id` should be set

---

### 11. cart_items

Items in shopping carts.

```sql
CREATE TABLE public.cart_items (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  cart_id bigint NOT NULL,
  variant_id bigint NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  CONSTRAINT cart_items_pkey PRIMARY KEY (id),
  CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id),
  CONSTRAINT cart_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id)
);
```

**Constraints:**
- `quantity` must be > 0
- `cart_id` references `carts(id)`
- `variant_id` references `product_variants(id)`

---

### 12. orders

Customer orders.

```sql
CREATE TABLE public.orders (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  customer_id bigint,
  customer_email character varying,
  shipping_address text NOT NULL,
  shipping_phone character varying NOT NULL,
  fulfillment_status character varying DEFAULT 'pending'::character varying,
  payment_status character varying DEFAULT 'unpaid'::character varying,
  payment_method character varying DEFAULT 'cod'::character varying,
  shipping_fee numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id)
);
```

**Constraints:**
- `fulfillment_status` enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
- `payment_status` enum: 'unpaid', 'paid', 'refunded'
- `payment_method` enum: 'cod', 'vnpay', 'momo'
- `shipping_address` and `shipping_phone` are required
- `total_amount` is required

---

### 13. order_items

Items in orders.

```sql
CREATE TABLE public.order_items (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  order_id bigint NOT NULL,
  variant_id bigint NOT NULL,
  quantity integer NOT NULL,
  price_at_purchase numeric NOT NULL,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id)
);
```

**Constraints:**
- `quantity` is required
- `price_at_purchase` is required (captures price at time of order)
- References: `orders(id)`, `product_variants(id)`

---

### 14. order_status_history

Order status change tracking.

```sql
CREATE TABLE public.order_status_history (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  order_id bigint NOT NULL,
  status character varying NOT NULL,
  admin_id bigint,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_status_history_pkey PRIMARY KEY (id),
  CONSTRAINT order_status_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT order_status_history_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(id)
);
```

**Constraints:**
- `status` matches order fulfillment_status enum
- `admin_id` references `admins(id)` (nullable for automatic status changes)

---

### 15. product_reviews

Customer product reviews.

```sql
CREATE TABLE public.product_reviews (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  variant_id bigint NOT NULL,
  customer_id bigint NOT NULL,
  order_id bigint NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT now(),
  status character varying DEFAULT 'pending'::character varying,
  CONSTRAINT product_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT product_reviews_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id),
  CONSTRAINT product_reviews_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
  CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
```

**Constraints:**
- `rating` must be between 1 and 5 (inclusive)
- `status` enum: 'pending', 'approved', 'rejected'
- References: `product_variants(id)`, `customers(id)`, `orders(id)`

---

### 16. wishlist_items

Customer wishlist items.

```sql
CREATE TABLE public.wishlist_items (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  customer_id bigint NOT NULL,
  variant_id bigint NOT NULL,
  CONSTRAINT wishlist_items_pkey PRIMARY KEY (id),
  CONSTRAINT wishlist_items_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
  CONSTRAINT wishlist_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id)
);
```

**Constraints:**
- References: `customers(id)`, `product_variants(id)`

---

### 17. promotions

Promotions and flash sales.

```sql
CREATE TABLE public.promotions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  type character varying NOT NULL,
  discount_value numeric NOT NULL,
  discount_type character varying NOT NULL,
  number_limited integer,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  status character varying DEFAULT 'scheduled'::character varying,
  CONSTRAINT promotions_pkey PRIMARY KEY (id)
);
```

**Constraints:**
- `type` enum: 'flash_sale', 'coupon'
- `discount_type` enum: 'percentage', 'fixed'
- `status` enum: 'scheduled', 'active', 'expired', 'inactive'

---

### 18. promotion_products

Products in flash sale promotions.

```sql
CREATE TABLE public.promotion_products (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  promotion_id bigint NOT NULL,
  product_id bigint NOT NULL,
  flash_sale_price numeric NOT NULL,
  CONSTRAINT promotion_products_pkey PRIMARY KEY (id),
  CONSTRAINT promotion_products_promotion_id_fkey FOREIGN KEY (promotion_id) REFERENCES public.promotions(id),
  CONSTRAINT promotion_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
```

---

### 19. promotion_usage

Coupon usage tracking.

```sql
CREATE TABLE public.promotion_usage (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  promotion_id bigint NOT NULL,
  order_id bigint NOT NULL,
  customer_id bigint NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT promotion_usage_pkey PRIMARY KEY (id),
  CONSTRAINT promotion_usage_promotion_id_fkey FOREIGN KEY (promotion_id) REFERENCES public.promotions(id),
  CONSTRAINT promotion_usage_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT promotion_usage_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id)
);
```

---

### 20. pages

CMS pages (About, FAQ, Terms, etc.).

```sql
CREATE TABLE public.pages (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  content text,
  status character varying DEFAULT 'Draft'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pages_pkey PRIMARY KEY (id)
);
```

**Constraints:**
- `slug` must be unique
- `status` enum: 'Draft', 'published'

---

### 21. support_tickets

Customer support tickets.

```sql
CREATE TABLE public.support_tickets (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  ticket_code character varying NOT NULL UNIQUE,
  customer_id bigint,
  customer_email character varying,
  subject character varying NOT NULL,
  status character varying DEFAULT 'pending'::character varying,
  source character varying DEFAULT 'contact_form'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  user_id bigint,
  message text,
  priority character varying DEFAULT 'medium'::character varying,
  CONSTRAINT support_tickets_pkey PRIMARY KEY (id),
  CONSTRAINT support_tickets_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id)
);
```

**Constraints:**
- `ticket_code` must be unique
- `status` enum: 'pending', 'open', 'resolved', 'closed'
- `source` enum: 'contact_form', 'chatbot', 'email'
- `priority` enum: 'low', 'medium', 'high', 'urgent'

---

### 22. support_ticket_replies

Replies to support tickets.

```sql
CREATE TABLE public.support_ticket_replies (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  ticket_id bigint NOT NULL,
  admin_id bigint,
  body text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT support_ticket_replies_pkey PRIMARY KEY (id),
  CONSTRAINT support_ticket_replies_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id),
  CONSTRAINT support_ticket_replies_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(id)
);
```

---

### 23. restock_batches

Inventory restock batches.

```sql
CREATE TABLE public.restock_batches (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  admin_id bigint NOT NULL,
  type character varying DEFAULT 'Manual'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT restock_batches_pkey PRIMARY KEY (id),
  CONSTRAINT restock_batches_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(id)
);
```

**Constraints:**
- `type` enum: 'Manual', 'Excel Upload'

---

### 24. restock_items

Items in restock batches.

```sql
CREATE TABLE public.restock_items (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  batch_id bigint NOT NULL,
  variant_id bigint NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  CONSTRAINT restock_items_pkey PRIMARY KEY (id),
  CONSTRAINT restock_items_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.restock_batches(id),
  CONSTRAINT restock_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id)
);
```

**Constraints:**
- `quantity` must be > 0

---

### 25. product_notifications

Product restock/price drop notifications.

```sql
CREATE TABLE public.product_notifications (
  id character varying NOT NULL,
  user_id bigint NOT NULL,
  product_id bigint NOT NULL,
  size character varying,
  price_condition numeric,
  status character varying DEFAULT 'active'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  notified_at timestamp with time zone,
  CONSTRAINT product_notifications_pkey PRIMARY KEY (id),
  CONSTRAINT product_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.customers(id),
  CONSTRAINT product_notifications_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
```

**Constraints:**
- `status` enum: 'active', 'sent', 'cancelled'

---

## Common Enums Reference

### Customer Status
- `active`
- `inactive`

### Category/Product/Variant Status
- `active`
- `inactive`

### Order Fulfillment Status
- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

### Payment Status
- `unpaid`
- `paid`
- `refunded`

### Payment Method
- `cod` (Cash on Delivery)
- `vnpay`
- `momo`

### Review Status
- `pending`
- `approved`
- `rejected`

### Review Rating
- Integer: 1-5 (inclusive)

### Promotion Type
- `flash_sale`
- `coupon`

### Discount Type
- `percentage`
- `fixed`

### Promotion Status
- `scheduled`
- `active`
- `expired`
- `inactive`

### Page Status
- `Draft`
- `published`

### Support Ticket Status
- `pending`
- `open`
- `resolved`
- `closed`

### Support Ticket Source
- `contact_form`
- `chatbot`
- `email`

### Support Ticket Priority
- `low`
- `medium`
- `high`
- `urgent`

### Restock Type
- `Manual`
- `Excel Upload`

### Notification Status
- `active`
- `sent`
- `cancelled`

---

## Validation Rules for Frontend

### Quantity Fields
- **cart_items.quantity:** Must be > 0
- **restock_items.quantity:** Must be > 0
- **order_items.quantity:** Must be > 0 (implicit)

### Rating
- **product_reviews.rating:** Must be between 1 and 5 (inclusive)

### Required Fields
- **customer_addresses.detailed_address:** Required (NOT NULL)
- **customer_addresses.phone_number:** Required (NOT NULL)
- **products.selling_price:** Required (NOT NULL)
- **orders.shipping_address:** Required (NOT NULL)
- **orders.shipping_phone:** Required (NOT NULL)
- **orders.total_amount:** Required (NOT NULL)

### Unique Constraints
- **customers.email:** Must be unique
- **admins.email:** Must be unique
- **categories.slug:** Must be unique
- **products.slug:** Must be unique
- **product_variants.sku:** Must be unique
- **support_tickets.ticket_code:** Must be unique
- **pages.slug:** Must be unique

### Default Values
- **customers.status:** 'inactive'
- **categories.status:** 'active'
- **products.status:** 'active'
- **products.average_rating:** 0.00
- **products.total_reviews:** 0
- **product_variants.status:** 'active'
- **product_variants.total_stock:** 0
- **product_variants.reserved_stock:** 0
- **orders.fulfillment_status:** 'pending'
- **orders.payment_status:** 'unpaid'
- **orders.payment_method:** 'cod'
- **orders.shipping_fee:** 0
- **product_reviews.status:** 'pending'
- **promotions.status:** 'scheduled'
- **pages.status:** 'Draft'
- **support_tickets.status:** 'pending'
- **support_tickets.priority:** 'medium'

---

## Relationships Diagram

```
customers
  ├─→ customer_addresses (1:N)
  ├─→ carts (1:1)
  ├─→ orders (1:N)
  ├─→ product_reviews (1:N)
  ├─→ wishlist_items (1:N)
  ├─→ support_tickets (1:N)
  └─→ product_notifications (1:N)

categories
  └─→ products (1:N)

products
  ├─→ product_variants (1:N)
  └─→ promotion_products (1:N)

product_variants
  ├─→ product_images (1:N)
  ├─→ cart_items (1:N)
  ├─→ order_items (1:N)
  ├─→ product_reviews (1:N)
  ├─→ wishlist_items (1:N)
  └─→ restock_items (1:N)

sizes
  └─→ product_variants (1:N)

colors
  └─→ product_variants (1:N)

carts
  └─→ cart_items (1:N)

orders
  ├─→ order_items (1:N)
  ├─→ order_status_history (1:N)
  ├─→ product_reviews (1:N)
  └─→ promotion_usage (1:N)

promotions
  ├─→ promotion_products (1:N)
  └─→ promotion_usage (1:N)

admins
  ├─→ order_status_history (1:N)
  ├─→ support_ticket_replies (1:N)
  └─→ restock_batches (1:N)

support_tickets
  └─→ support_ticket_replies (1:N)

restock_batches
  └─→ restock_items (1:N)
```

---

## Usage in Frontend Development

### 1. Type Definitions
Create TypeScript types that match DB schema exactly:

```typescript
// Example: Customer
export interface Customer {
  id: number;
  name: string | null;
  email: string;
  password_hash?: string; // Never sent to frontend
  status: 'active' | 'inactive';
  created_at: string; // ISO timestamp
  updated_at: string;
  refresh_token?: string;
  refresh_token_expires?: string;
}
```

### 2. Form Validation
Use DB constraints for form validation:

```typescript
// Example: Cart Item Quantity
<Input
  type="number"
  min={1}
  required
  // Matches: quantity integer NOT NULL CHECK (quantity > 0)
/>
```

### 3. Enum Constants
Define TypeScript enums for DB enum fields:

```typescript
export enum OrderFulfillmentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  COD = 'cod',
  VNPAY = 'vnpay',
  MOMO = 'momo',
}
```

---

**End of Database Schema Documentation**
