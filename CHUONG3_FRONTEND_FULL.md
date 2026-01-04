# CHƯƠNG 3 - THIẾT KẾ HỆ THỐNG FRONTEND

> File này bổ sung đầy đủ tài liệu Frontend cho báo cáo KLTN Chương 3

---

## 📑 MỤC LỤC

1. [Kiến trúc Frontend](#1-kiến-trúc-frontend)
2. [Các Module Frontend](#2-các-module-frontend)  
3. [Phân tích yêu cầu nghiệp vụ](#3-phân-tích-yêu-cầu-nghiệp-vụ)
4. [Thiết kế Use Case](#4-thiết-kế-use-case)
5. [Thiết kế giao diện](#5-thiết-kế-giao-diện)
6. [Danh sách màn hình](#6-danh-sách-màn-hình)
7. [Sequence Diagrams](#7-sequence-diagrams)

---

## 1. KIẾN TRÚC FRONTEND

### 1.1. Tổng quan

**Framework & Công nghệ:**
- React 18+ với TypeScript
- Kiến trúc: Component-based (Container/Presentational pattern)
- Routing: React Router v6
- State: Redux Toolkit + React Query
- UI: TailwindCSS + shadcn/ui
- Build: Vite

**Đặc điểm:**
- Single Page Application (SPA)
- Client-side rendering (CSR)
- Responsive design (Mobile-first)
- Progressive Web App (PWA) ready

### 1.2. Sơ đồ kiến trúc

```
┌─────────────────────────────────────────────┐
│         PRESENTATION LAYER                   │
│  ┌────────────────────────────────────────┐ │
│  │  React Components                       │ │
│  │  (Public | Customer | Admin Pages)     │ │
│  └────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         APPLICATION LAYER                    │
│  ┌─────────────┐  ┌──────────────────────┐ │
│  │Redux Store  │  │  React Query Cache   │ │
│  │(Global)     │  │  (Server State)      │ │
│  └─────────────┘  └──────────────────────┘ │
│  ┌─────────────────────────────────────┐   │
│  │  Custom Hooks & Business Logic      │   │
│  └─────────────────────────────────────┘   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         SERVICE LAYER                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │API Client│  │Auth Svc  │  │Storage   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
         [Backend REST API]
         http://localhost:3001
```

### 1.3. Tech Stack

| Thành phần | Công nghệ | Mục đích |
|-----------|-----------|----------|
| UI Library | React 18+ | Component rendering |
| Type Safety | TypeScript | Static typing |
| State (Global) | Redux Toolkit | Auth, Cart state |
| State (Server) | React Query | API data + caching |
| Routing | React Router v6 | Navigation |
| Styling | TailwindCSS | Utility-first CSS |
| Components | shadcn/ui | Reusable UI |
| Forms | React Hook Form | Form handling |
| HTTP Client | Axios | API calls |
| Icons | Lucide React | Icon library |
| Build Tool | Vite | Fast dev + build |

### 1.4. Cấu trúc thư mục

```
src/
├── components/        # Reusable components
│   ├── layout/       # Header, Footer, Sidebar
│   ├── product/      # Product-related components
│   ├── shopping/     # Cart, Checkout
│   ├── ai/           # Chat, Image search
│   └── ui/           # shadcn/ui components
│
├── pages/            # Page components
│   ├── public/       # Homepage, Products, ProductDetail
│   ├── auth/         # Login, Register
│   ├── customer/     # Cart, Orders, Profile
│   └── admin/        # Admin dashboard & management
│
├── features/         # Feature modules
│   ├── auth/         # Auth slice, hooks, API
│   ├── cart/         # Cart slice, hooks, API
│   ├── products/     # Product slice, hooks, API
│   └── orders/       # Order slice, hooks, API
│
├── services/         # API services
│   ├── api.ts        # Axios config + interceptors
│   └── *.service.ts  # Service per feature
│
├── store/            # Redux store
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript types
└── routes/           # Route configuration
```

---

## 2. CÁC MODULE FRONTEND

### 2.1. Authentication Module

**Chức năng:**
- Đăng ký (Email/Password + Google OAuth)
- Đăng nhập
- Quên mật khẩu & Reset
- Auto refresh token
- Logout

**Components:**
- LoginForm, RegisterForm
- ForgotPasswordForm, ResetPasswordForm
- GoogleLoginButton
- AuthGuard (Protected Route HOC)

**State:**
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
```

**APIs:**
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/google
- POST /api/v1/auth/refresh
- POST /api/v1/auth/logout

---

### 2.2. Product Display Module

**Chức năng:**
- Danh sách sản phẩm + pagination
- Filter (category, price, size, color)
- Search
- Chi tiết sản phẩm
- Reviews & ratings

**Components:**
- ProductList, ProductCard, ProductDetail
- ProductFilter, ProductSearch
- ImageGallery, VariantSelector
- ReviewList, RatingStars

**APIs:**
- GET /products
- GET /products/:slug
- GET /products/featured
- GET /categories, /sizes, /colors

---

### 2.3. Shopping Cart Module

**Chức năng:**
- Add to cart
- Update quantity
- Remove item
- Calculate totals
- Sync với backend

**Components:**
- CartPage, CartItem
- CartSummary, QuantitySelector
- EmptyCart, CartIcon (with badge)

**APIs:**
- GET /cart
- POST /cart/items
- PUT /cart/items/:id
- DELETE /cart/items/:id

---

### 2.4. Checkout & Payment Module

**Chức năng:**
- Chọn địa chỉ giao hàng
- Chọn payment method (COD/VNPay)
- Tạo order
- VNPay integration

**Components:**
- CheckoutPage, ShippingForm
- AddressSelector
- PaymentMethodSelector
- OrderSummary, OrderConfirmation
- PaymentSuccess

**APIs:**
- POST /api/v1/checkout
- POST /api/v1/checkout/create-payment-url
- GET /api/v1/payment/vnpay-return

---

### 2.5. Order Management Module

**Chức năng:**
- Xem danh sách đơn hàng
- Chi tiết đơn hàng
- Theo dõi trạng thái
- Hủy đơn hàng
- Đánh giá sản phẩm

**Components:**
- OrderListPage, OrderCard
- OrderDetailPage
- OrderStatusTimeline
- OrderTracking
- CancelOrderModal

**APIs:**
- GET /orders
- GET /orders/:id
- GET /orders/track
- POST /orders/:id/cancel

---

### 2.6. AI Integration Module

**Chức năng:**
- Chat với AI Chatbot (Rasa)
- Tìm kiếm bằng ảnh (Computer Vision)
- Product recommendations

**Components:**
- ChatWidget, ChatWindow
- ChatMessage, ChatInput
- ImageSearchUpload
- ImageSearchResults
- ProductRecommendations

**APIs:**
- POST /ai/chatbot
- POST /ai/search/image

---

### 2.7. Admin Dashboard Module

**Chức năng:**
- Dashboard thống kê (KPIs, charts)
- Quản lý sản phẩm (CRUD)
- Quản lý đơn hàng (update status)
- Quản lý khách hàng
- Quản lý inventory
- Quản lý reviews
- Quản lý promotions
- Analytics (chatbot, sales)

**Components:**
- AdminLayout
- Dashboard: KPICards, RevenueChart, RecentOrdersTable
- Products: ProductListPage, ProductForm
- Orders: OrderListPage, UpdateStatusModal
- Customers, Inventory, Reviews, Promotions...

**APIs:**
- GET /admin/dashboard/*
- GET/POST/PUT/DELETE /admin/products/*
- GET/PATCH /admin/orders/*
- GET /admin/customers/*

---

## 3. PHÂN TÍCH YÊU CẦU NGHIỆP VỤ

### 3.1. Actors

| Actor | Mô tả | Quyền hạn |
|-------|-------|-----------|
| Guest | Khách vãng lai | Xem, tìm kiếm sản phẩm, chat AI |
| Customer | Khách đã đăng ký | Guest + Mua hàng, quản lý đơn |
| Admin | Quản trị viên | Toàn quyền quản lý hệ thống |

### 3.2. Bảng chức năng

| STT | Chức năng | Mô tả | Actor |
|-----|-----------|-------|-------|
| 1 | Đăng ký | Tạo tài khoản mới | Guest |
| 2 | Đăng nhập | Xác thực người dùng | Guest |
| 3 | Xem sản phẩm | Danh sách + filter | Guest, Customer |
| 4 | Chi tiết sản phẩm | Xem thông tin chi tiết | Guest, Customer |
| 5 | Tìm kiếm | Search theo keyword | Guest, Customer |
| 6 | Chat AI | Chatbot hỗ trợ | Guest, Customer |
| 7 | Tìm kiếm ảnh | Upload ảnh tìm sản phẩm | Guest, Customer |
| 8 | Add to cart | Thêm vào giỏ | Customer |
| 9 | Update cart | Sửa số lượng | Customer |
| 10 | Checkout | Tạo đơn hàng | Customer |
| 11 | Thanh toán VNPay | Payment gateway | Customer |
| 12 | Xem đơn hàng | Lịch sử orders | Customer |
| 13 | Theo dõi đơn | Track order status | Customer |
| 14 | Hủy đơn | Cancel order | Customer |
| 15 | Đánh giá | Review sản phẩm | Customer |
| 16 | Quản lý profile | Update thông tin | Customer |
| 17 | Quản lý địa chỉ | CRUD addresses | Customer |
| 18 | Admin Login | Đăng nhập admin | Admin |
| 19 | Dashboard | Thống kê KPI | Admin |
| 20 | Quản lý sản phẩm | CRUD products | Admin |
| 21 | Quản lý đơn hàng | Update order status | Admin |
| 22 | Quản lý khách hàng | View customers | Admin |
| 23 | Quản lý inventory | Update stock | Admin |
| 24 | Quản lý reviews | Moderate reviews | Admin |
| 25 | Quản lý promotions | CRUD promotions | Admin |
| 26 | Analytics | View statistics | Admin |

---

## 4. THIẾT KẾ USE CASE

### 4.1. Sơ đồ Use Case

```
┌─────────────────────────────────────────┐
│          HỆ THỐNG E-COMMERCE            │
│                                          │
│  GUEST                                   │
│   ├─ UC-01: Xem sản phẩm                │
│   ├─ UC-02: Tìm kiếm                    │
│   ├─ UC-03: Chat AI                     │
│   ├─ UC-04: Đăng ký                     │
│   └─ UC-05: Đăng nhập                   │
│         │ extends                        │
│         ▼                                │
│  CUSTOMER                                │
│   ├─ UC-06: Add to cart                 │
│   ├─ UC-07: Checkout                    │
│   ├─ UC-08: Thanh toán VNPay            │
│   ├─ UC-09: Xem đơn hàng                │
│   ├─ UC-10: Đánh giá                    │
│   └─ UC-11: Quản lý profile             │
│                                          │
│  ADMIN                                   │
│   ├─ UC-12: Dashboard                   │
│   ├─ UC-13: Quản lý sản phẩm            │
│   ├─ UC-14: Quản lý đơn hàng            │
│   └─ UC-15: Analytics                   │
└─────────────────────────────────────────┘
```

### 4.2. Đặc tả Use Case quan trọng

#### UC-04: Đăng ký tài khoản

**Actor:** Guest  
**Mô tả:** Tạo tài khoản mới

**Tiền điều kiện:** Không

**Hậu điều kiện:** 
- Account được tạo
- User tự động đăng nhập

**Luồng chính:**
1. Guest click "Đăng ký"
2. Hiển thị RegisterForm (email, password, name)
3. Guest nhập thông tin
4. Frontend validate form
5. Frontend gọi POST /api/v1/auth/register
6. Backend tạo user mới
7. Backend trả tokens + user info
8. Frontend lưu tokens vào localStorage
9. Redirect về Homepage
10. Hiển thị "Đăng ký thành công"

**Luồng phụ:**
- **5a. Đăng ký Google:**
  - Google OAuth popup
  - Frontend gọi POST /api/v1/auth/google
  - Continue bước 7

**Luồng ngoại lệ:**
- **6a. Email đã tồn tại:**
  - Backend trả lỗi
  - Hiển thị error message
  - User thử email khác

---

#### UC-06: Add to Cart

**Actor:** Customer  
**Mô tả:** Thêm sản phẩm vào giỏ

**Tiền điều kiện:**
- User đã login
- Product có stock > 0

**Hậu điều kiện:**
- Cart item added to DB
- UI cart badge updated

**Luồng chính:**
1. Customer ở ProductDetail page
2. Chọn size, color
3. Chọn quantity
4. Click "Add to Cart"
5. Frontend validate (variant, quantity, stock)
6. Frontend gọi POST /cart/items {variant_id, quantity}
7. Backend check stock
8. Backend tạo/update cart_item
9. Backend trả updated cart
10. Frontend update CartState
11. Update cart badge
12. Toast "Đã thêm vào giỏ"

**Luồng ngoại lệ:**
- **7a. Hết hàng:**
  - Backend trả "Out of stock"
  - Hiển thị error toast
  - Disable button
  - Show "Hết hàng"

---

#### UC-07: Checkout

**Actor:** Customer  
**Mô tả:** Tạo đơn hàng

**Tiền điều kiện:**
- User đã login
- Cart có >= 1 item
- Items còn stock

**Hậu điều kiện:**
- Order created (status Pending)
- Cart cleared
- Email sent

**Luồng chính:**
1. Customer click "Checkout" từ Cart
2. Navigate to /checkout
3. Hiển thị CheckoutPage (summary, address, payment)
4. Load saved addresses
5. Customer chọn/nhập địa chỉ
6. Customer chọn payment method
7. Click "Đặt hàng"
8. Frontend validate
9. Frontend gọi POST /api/v1/checkout
10. Backend:
    - Validate cart
    - Check stock
    - Create order + order_items
    - Reduce stock
    - Clear cart
    - Create payment record
11. Backend trả order_id
12. **Nếu COD:** Navigate /checkout/success
13. **Nếu VNPay:** → Continue UC-08

**Luồng ngoại lệ:**
- **10a. Items hết stock:**
  - Rollback transaction
  - Trả lỗi với items list
  - Remove items khỏi cart
  - User review cart

---

#### UC-08: Thanh toán VNPay

**Actor:** Customer  
**Mô tả:** Thanh toán qua VNPay gateway

**Tiền điều kiện:**
- Order đã được tạo
- Payment method = VNPay

**Hậu điều kiện:**
- Payment status = Paid
- Order status = Processing

**Luồng chính:**
1. (Từ UC-07) Frontend có order_id
2. Frontend gọi POST /api/v1/checkout/create-payment-url {order_id, return_url}
3. Backend gọi VNPay API
4. Backend trả payment_url
5. Frontend redirect đến VNPay
6. Customer nhập thông tin thẻ
7. VNPay xử lý thanh toán
8. VNPay redirect về return_url với query params
9. Frontend parse params
10. Frontend gọi GET /api/v1/payment/vnpay-return?...
11. Backend verify signature
12. Backend update payment + order status
13. Backend gửi email
14. Backend trả result
15. **Nếu success:** Navigate /checkout/success
16. **Nếu failed:** Navigate /checkout/failed

**Luồng ngoại lệ:**
- **7a. User hủy:**
  - VNPay redirect với failed code
  - Payment status = Failed
  - Order vẫn Pending

---

#### UC-14: Quản lý đơn hàng (Admin)

**Actor:** Admin  
**Mô tả:** Cập nhật trạng thái đơn hàng

**Tiền điều kiện:** Admin đã login

**Hậu điều kiện:**
- Order status updated
- Email sent to customer

**Luồng chính:**
1. Admin login → /admin/orders
2. Hiển thị OrderTable với filters
3. Frontend gọi GET /admin/orders?page=1
4. Backend trả orders list
5. Admin click order → View detail
6. Navigate /admin/orders/:id
7. Frontend gọi GET /admin/orders/:id
8. Hiển thị order info + status timeline
9. Admin click "Cập nhật trạng thái"
10. Hiển thị UpdateStatusModal
11. Admin chọn new status + notes
12. Click "Xác nhận"
13. Frontend gọi PATCH /admin/orders/:id/status {status, notes}
14. Backend validate transition
15. Backend update status
16. Backend gửi email
17. Backend trả updated order
18. Frontend update UI
19. Close modal
20. Toast "Cập nhật thành công"

**Luồng ngoại lệ:**
- **14a. Invalid transition:**
  - Backend trả error
  - Hiển thị error trong modal
  - Admin chọn status khác

---

## 5. THIẾT KẾ GIAO DIỆN

### 5.1. Design System

#### Colors
```css
--primary: #3b82f6;      /* Blue */
--secondary: #64748b;    /* Slate */
--success: #10b981;      /* Green */
--error: #ef4444;        /* Red */
--warning: #f59e0b;      /* Amber */
```

#### Typography
```css
--font-sans: 'Inter', sans-serif;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
```

#### Spacing (Tailwind scale)
```css
--spacing-2: 0.5rem;   /* 8px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
```

### 5.2. Component Library

Sử dụng **shadcn/ui** components:
- Button, Input, Textarea
- Select, Dialog, Sheet
- Card, Table, DataTable
- Form (React Hook Form)
- Toast, Alert, Badge
- Avatar, Skeleton
- Tabs, Accordion
- Dropdown, Pagination

### 5.3. Responsive Breakpoints

```css
/* Mobile first */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

---

## 6. DANH SÁCH MÀN HÌNH

### 6.1. Public Screens (Guest)

| STT | Screen | Route | APIs |
|-----|--------|-------|------|
| 1 | Homepage | / | GET /products/featured |
| 2 | Product List | /products | GET /products |
| 3 | Product Detail | /products/:slug | GET /products/:slug |
| 4 | New Arrivals | /products/new-arrivals | GET /products/new-arrivals |
| 5 | Flash Sale | /products/on-sale | GET /products/on-sale |
| 6 | Login | /auth/login | POST /api/v1/auth/login |
| 7 | Register | /auth/register | POST /api/v1/auth/register |
| 8 | Forgot Password | /auth/forgot-password | POST /api/v1/auth/forgot-password |
| 9 | Reset Password | /auth/reset-password | POST /api/v1/auth/reset-password |
| 10 | Order Tracking | /orders/track | GET /orders/track |

### 6.2. Customer Screens (Protected)

| STT | Screen | Route | APIs |
|-----|--------|-------|------|
| 11 | Cart | /cart | GET/POST/PUT/DELETE /cart/* |
| 12 | Checkout | /checkout | POST /api/v1/checkout |
| 13 | Payment VNPay | /checkout/payment | POST /api/v1/checkout/create-payment-url |
| 14 | Payment Success | /checkout/success | - |
| 15 | My Orders | /account/orders | GET /orders |
| 16 | Order Detail | /account/orders/:id | GET /orders/:id |
| 17 | My Profile | /account/profile | GET /account/profile |
| 18 | My Addresses | /account/addresses | GET/POST/PUT/DELETE /account/addresses/* |
| 19 | My Reviews | /account/reviews | GET /reviews/my-reviews |
| 20 | Wishlist | /account/wishlist | GET /wishlist |
| 21 | Support Tickets | /account/support | GET/POST /support/tickets |

### 6.3. Admin Screens

| STT | Screen | Route | APIs |
|-----|--------|-------|------|
| 22 | Admin Login | /admin/login | POST /admin/auth/login |
| 23 | Dashboard | /admin/dashboard | GET /admin/dashboard/* |
| 24 | Products Mgmt | /admin/products | GET/POST/PUT/DELETE /admin/products/* |
| 25 | Orders Mgmt | /admin/orders | GET/PATCH /admin/orders/* |
| 26 | Customers Mgmt | /admin/customers | GET /admin/customers/* |
| 27 | Inventory Mgmt | /admin/inventory | GET/POST /admin/inventory/* |
| 28 | Reviews Mgmt | /admin/reviews | GET/PATCH /admin/reviews/* |
| 29 | Promotions Mgmt | /admin/promotions | GET/POST/PUT/DELETE /admin/promotions/* |
| 30 | Chatbot Analytics | /admin/chatbot | GET /admin/chatbot/* |

**Tổng: 30 screens**

---

## 7. SEQUENCE DIAGRAMS

### 7.1. Đăng nhập

```
User          Frontend       Backend        Database
  |               |              |              |
  |--nhập email-->|              |              |
  |  password     |              |              |
  |               |              |              |
  |--submit------>|              |              |
  |               |--POST------->|              |
  |               | /auth/login  |              |
  |               |              |--verify----->|
  |               |              |  credentials |
  |               |              |<--user data--|
  |               |              |              |
  |               |<--tokens-----|              |
  |               |   user info  |              |
  |<--redirect----|              |              |
  |  homepage     |(save tokens) |              |
```

### 7.2. Add to Cart

```
User        Frontend      Backend       Database
  |             |             |             |
  |--select---->|             |             |
  |  variant    |             |             |
  |             |             |             |
  |--click----->|             |             |
  | "Add Cart"  |             |             |
  |             |--POST------>|             |
  |             | /cart/items |             |
  |             |             |--check----->|
  |             |             |   stock     |
  |             |             |<--OK--------|
  |             |             |             |
  |             |             |--INSERT---->|
  |             |             | cart_item   |
  |             |             |<--success---|
  |             |             |             |
  |             |<--cart------|             |
  |             |   updated   |             |
  |<--toast-----|             |             |
  | "Đã thêm"   |(update UI)  |             |
```

### 7.3. Checkout + VNPay

```
User       Frontend     Backend      Database     VNPay
  |            |            |            |           |
  |--submit--->|            |            |           |
  | checkout   |            |            |           |
  |            |--POST----->|            |           |
  |            | /checkout  |            |           |
  |            |            |<-BEGIN---->|           |
  |            |            |  Transaction           |
  |            |            |-CREATE---->|           |
  |            |            |  order     |           |
  |            |            |<-success---|           |
  |            |            |            |           |
  |            |<-order_id--|            |           |
  |            |            |            |           |
  |            |--POST----->|            |           |
  |            | create-    |            |           |
  |            | payment-url|            |           |
  |            |            |--request-->|           |
  |            |            |   payment  |           |
  |            |            |<-URL-------|           |
  |            |<-URL-------|            |           |
  |            |            |            |           |
  |--redirect---------------->|          |           |
  |                           |--pay---->|           |
  |                           |          |           |
  |<-redirect with params-----|<-return--|           |
  |            |            |            |           |
  |            |--GET------>|            |           |
  |            | vnpay-     |            |           |
  |            | return     |            |           |
  |            |            |--verify--->|           |
  |            |            |  signature |           |
  |            |            |<-OK--------|           |
  |            |            |            |           |
  |            |            |--UPDATE--->|           |
  |            |            | payment+   |           |
  |            |            | order      |           |
  |            |            |<-success---|           |
  |            |            |            |           |
  |            |<-result----|            |           |
  |<-navigate--|            |            |           |
  | /success   |            |            |           |
```

### 7.4. Admin Update Order Status

```
Admin      Frontend      Backend      Database     Email
  |            |             |            |           |
  |--login---->|             |            |           |
  |            |--GET------->|            |           |
  |            | /admin/     |            |           |
  |            | orders      |            |           |
  |            |             |--SELECT--->|           |
  |            |             |<-orders----|           |
  |            |<-list-------|            |           |
  |<-render----|             |            |           |
  |            |             |            |           |
  |--click---->|             |            |           |
  | order      |             |            |           |
  |            |--GET------->|            |           |
  |            | /orders/:id |            |           |
  |            |<-detail-----|            |           |
  |            |             |            |           |
  |--select--->|             |            |           |
  | new status |             |            |           |
  |--submit--->|             |            |           |
  |            |--PATCH----->|            |           |
  |            | /orders/:id |            |           |
  |            | /status     |            |           |
  |            |             |--UPDATE--->|           |
  |            |             | order      |           |
  |            |             |<-success---|           |
  |            |             |            |           |
  |            |             |--send----->|           |
  |            |             | email      |           |
  |            |             |<-sent------|           |
  |            |             |            |           |
  |            |<-updated----|            |           |
  |<-toast-----|             |            |           |
  | "Success"  |(refresh UI) |            |           |
```

---

## 📌 TÓM TẮT

### ✅ Frontend cần cung cấp (đã hoàn thiện):

1. **Kiến trúc hệ thống Frontend**
   - Sơ đồ kiến trúc tổng quan
   - Tech stack chi tiết
   - Cấu trúc thư mục dự án

2. **8 Module chính**
   - Authentication
   - Product Display
   - Shopping Cart
   - Checkout & Payment
   - Order Management
   - AI Integration
   - User Profile
   - Admin Dashboard

3. **Phân tích nghiệp vụ**
   - 3 Actors (Guest, Customer, Admin)
   - 26 chức năng chính
   - Bảng yêu cầu chức năng đầy đủ

4. **Thiết kế Use Case**
   - Sơ đồ Use Case tổng quan
   - 15 Use Cases chính
   - Đặc tả chi tiết 5 Use Cases quan trọng nhất

5. **Thiết kế giao diện**
   - Design System (Colors, Typography, Spacing)
   - Component Library (shadcn/ui)
   - Responsive Breakpoints

6. **Danh sách màn hình**
   - **30 screens** tổng cộng:
     - 10 Public screens
     - 11 Customer screens
     - 9 Admin screens
   - APIs mapping cho từng screen

7. **Sequence Diagrams**
   - Đăng nhập
   - Add to Cart
   - Checkout + VNPay
   - Admin Update Order Status

---

## 🔗 File liên quan

- `CHUONG3_PHAN7_PHU_LUC_FRONTEND.md` - Chi tiết implementation
- Backend API docs: `http://localhost:3001/api-docs`
- Database schema: (Xem file backend)

---

**Ghi chú:** File này cung cấp đầy đủ tài liệu Frontend cho Chương 3 báo cáo KLTN. Bao gồm kiến trúc, module, nghiệp vụ, use case, giao diện và sequence diagrams.
