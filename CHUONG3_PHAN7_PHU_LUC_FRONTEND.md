# CHƯƠNG 3 - PHẦN 7: PHỤ LỤC YÊU CẦU FRONTEND

## 7. PHỤ LỤC - YÊU CẦU FRONTEND

### 7.1. Tổng quan yêu cầu

Backend đã cung cấp đầy đủ:
- ✅ 140+ API endpoints
- ✅ Database schema với 29 tables
- ✅ Swagger documentation tại `/api-docs`
- ✅ Authentication (JWT + Refresh Token)
- ✅ AI integration (Chatbot + Image Search)

**Frontend cần bổ sung:**

### 7.2. Danh sách màn hình (Screens)

#### A. PUBLIC SCREENS (Guest)

| STT | Tên màn hình | Route | Mô tả | APIs sử dụng |
|-----|--------------|-------|-------|--------------|
| 1 | Homepage | `/` | Trang chủ với featured products | GET /products/featured |
| 2 | Product List | `/products` | Danh sách sản phẩm + filter | GET /products |
| 3 | Product Detail | `/products/:slug` | Chi tiết sản phẩm | GET /products/:slug |
| 4 | New Arrivals | `/products/new-arrivals` | Sản phẩm mới | GET /products/new-arrivals |
| 5 | Flash Sale | `/products/on-sale` | Khuyến mãi | GET /products/on-sale |
| 6 | Login | `/auth/login` | Đăng nhập | POST /api/v1/auth/login |
| 7 | Register | `/auth/register` | Đăng ký | POST /api/v1/auth/register |
| 8 | Forgot Password | `/auth/forgot-password` | Quên mật khẩu | POST /api/v1/auth/forgot-password |
| 9 | Reset Password | `/auth/reset-password` | Reset password | POST /api/v1/auth/reset-password |
| 10 | Order Tracking | `/orders/track` | Tra cứu đơn hàng | GET /orders/track |

#### B. CUSTOMER SCREENS (Protected)

| STT | Tên màn hình | Route | Mô tả | APIs sử dụng |
|-----|--------------|-------|-------|--------------|
| 11 | Cart | `/cart` | Giỏ hàng | GET/POST/PUT/DELETE /cart/* |
| 12 | Checkout | `/checkout` | Thanh toán | POST /api/v1/checkout |
| 13 | Payment VNPay | `/checkout/payment` | VNPay redirect | POST /api/v1/checkout/create-payment-url |
| 14 | Payment Success | `/checkout/success` | Thành công | - |
| 15 | My Orders | `/account/orders` | Lịch sử đơn hàng | GET /orders |
| 16 | Order Detail | `/account/orders/:id` | Chi tiết đơn | GET /orders/:id |
| 17 | My Profile | `/account/profile` | Thông tin cá nhân | GET /account/profile |
| 18 | My Addresses | `/account/addresses` | Địa chỉ giao hàng | GET/POST/PUT/DELETE /account/addresses/* |
| 19 | My Reviews | `/account/reviews` | Đánh giá của tôi | GET /reviews/my-reviews |
| 20 | Wishlist | `/account/wishlist` | Yêu thích | GET /wishlist |
| 21 | Support Tickets | `/account/support` | Hỗ trợ | GET/POST /support/tickets |

#### C. ADMIN SCREENS

| STT | Tên màn hình | Route | Mô tả | APIs sử dụng |
|-----|--------------|-------|-------|--------------|
| 22 | Admin Login | `/admin/login` | Đăng nhập admin | POST /admin/auth/login |
| 23 | Dashboard | `/admin/dashboard` | Tổng quan | GET /admin/dashboard/* |
| 24 | Products Management | `/admin/products` | Quản lý sản phẩm | GET/POST/PUT/DELETE /admin/products/* |
| 25 | Orders Management | `/admin/orders` | Quản lý đơn hàng | GET/PATCH /admin/orders/* |
| 26 | Customers Management | `/admin/customers` | Quản lý khách hàng | GET /admin/customers/* |
| 27 | Inventory Management | `/admin/inventory` | Quản lý tồn kho | GET/POST /admin/inventory/* |
| 28 | Reviews Management | `/admin/reviews` | Quản lý đánh giá | GET/PATCH /admin/reviews/* |
| 29 | Promotions Management | `/admin/promotions` | Quản lý khuyến mãi | GET/POST/PUT/DELETE /admin/promotions/* |
| 30 | Chatbot Analytics | `/admin/chatbot` | Quản lý chatbot | GET /admin/chatbot/* |

### 7.3. UI Components cần thiết

#### A. Layout Components
1. **Header**: Logo, Menu, Search, Cart icon, User menu
2. **Footer**: Links, Contact info, Social media
3. **Sidebar**: Filters (category, price, size, color)
4. **Breadcrumb**: Navigation path

#### B. Product Components
1. **ProductCard**: Thumbnail, name, price, rating, "Add to cart" button
2. **ProductGrid**: Grid layout cho danh sách sản phẩm
3. **ProductFilter**: Filter panel
4. **ProductDetail**: Images gallery, variants selector, quantity, description
5. **RatingStars**: Hiển thị rating

#### C. Shopping Components
1. **CartItem**: Product info, quantity selector, remove button
2. **CartSummary**: Subtotal, shipping, total
3. **CheckoutForm**: Address form, payment method selector
4. **OrderCard**: Order summary card
5. **OrderStatus**: Timeline trạng thái đơn hàng

#### D. AI Components
1. **ChatWidget**: Floating chat button + chat window
2. **ChatMessage**: Message bubble (user/bot)
3. **ImageSearchUpload**: Upload ảnh để tìm kiếm
4. **ImageSearchResults**: Kết quả tìm kiếm bằng ảnh

#### E. Form Components
1. **LoginForm**: Email, password, "Remember me"
2. **RegisterForm**: Name, email, password
3. **AddressForm**: Detailed address, phone, type
4. **ReviewForm**: Rating selector, comment textarea

### 7.4. Flow nghiệp vụ Frontend cần implement

#### Flow 1: Mua hàng (Guest → Customer)
```
1. Guest xem sản phẩm → Chi tiết sản phẩm
2. Chọn size, color → Add to Cart
3. Yêu cầu đăng nhập
4. Đăng nhập/Đăng ký
5. Xem Cart → Checkout
6. Chọn địa chỉ, payment method
7. Xác nhận đặt hàng
8. Nếu VNPay: Redirect → Thanh toán → Return
9. Hiển thị "Đặt hàng thành công"
```

#### Flow 2: Chat với AI Chatbot
```
1. User click vào chat widget
2. Frontend load chat_session (hoặc tạo mới)
3. User nhập message
4. Frontend gọi: POST /ai/chatbot
5. Backend proxy → Rasa → trả response
6. Frontend hiển thị message + buttons
7. User click button → trigger action
8. Lặp lại từ bước 3
```

#### Flow 3: Admin cập nhật trạng thái đơn hàng
```
1. Admin login → Dashboard
2. Admin vào "Orders Management"
3. Chọn order → Xem chi tiết
4. Click "Cập nhật trạng thái"
5. Chọn status mới: Processing/Shipped/Delivered
6. Nhập ghi chú (optional)
7. Submit → PATCH /admin/orders/:id/status
8. Backend gửi email thông báo
9. Frontend hiển thị "Cập nhật thành công"
```

### 7.5. Authentication Flow (Frontend)

```javascript
// 1. Login
const login = async (email, password) => {
  const response = await POST('/api/v1/auth/login', {email, password});
  localStorage.setItem('access_token', response.access_token);
  localStorage.setItem('refresh_token', response.refresh_token);
};

// 2. Auto refresh token
const refreshAccessToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  const response = await POST('/api/v1/auth/refresh', {refresh_token});
  localStorage.setItem('access_token', response.access_token);
};

// 3. API call với retry
const apiCall = async (endpoint, options) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });
    
    if (response.status === 401) {
      // Token hết hạn, refresh và retry
      await refreshAccessToken();
      return apiCall(endpoint, options); // Retry
    }
    
    return response.json();
  } catch (error) {
    console.error(error);
  }
};
```

### 7.6. State Management (Frontend)

**Khuyến nghị dùng:**
- React Context API / Redux / Zustand
- React Query (cho data fetching + caching)

**States cần quản lý:**
1. **Auth State**: user, isAuthenticated, access_token
2. **Cart State**: cart_items, total_items, total_price
3. **Product State**: products, filters, pagination
4. **UI State**: loading, errors, modals

### 7.7. API Integration Checklist

#### A. Setup cơ bản
- [ ] Base URL: `http://localhost:3001`
- [ ] Axios/Fetch interceptor cho authentication
- [ ] Error handling (401, 403, 500)
- [ ] Loading states
- [ ] Toast notifications

#### B. Authentication APIs
- [ ] POST /api/v1/auth/register
- [ ] POST /api/v1/auth/login
- [ ] POST /api/v1/auth/google (Google OAuth)
- [ ] POST /api/v1/auth/refresh
- [ ] POST /api/v1/auth/logout
- [ ] POST /api/v1/auth/forgot-password
- [ ] POST /api/v1/auth/reset-password

#### C. Product APIs
- [ ] GET /products (với filter params)
- [ ] GET /products/:slug
- [ ] GET /products/featured
- [ ] GET /products/new-arrivals
- [ ] GET /products/on-sale
- [ ] GET /categories
- [ ] GET /sizes
- [ ] GET /colors

#### D. Cart & Checkout APIs
- [ ] GET /cart
- [ ] POST /cart/items
- [ ] PUT /cart/items/:id
- [ ] DELETE /cart/items/:id
- [ ] POST /api/v1/checkout
- [ ] POST /api/v1/checkout/create-payment-url

#### E. Order APIs
- [ ] GET /orders
- [ ] GET /orders/:id
- [ ] GET /orders/track
- [ ] POST /orders/:id/cancel

#### F. AI APIs
- [ ] POST /ai/chatbot
- [ ] POST /ai/search/image

### 7.8. Sơ đồ Use Case Frontend

**Frontend cần vẽ sơ đồ Use Case với:**

```
┌────────────────────────────────┐
│   GUEST                        │
│   ├─ Xem sản phẩm              │
│   ├─ Tìm kiếm                  │
│   ├─ Lọc sản phẩm              │
│   ├─ Chat với AI               │
│   └─ Đăng ký/Đăng nhập         │
└────────────────────────────────┘
         │ extends
         ▼
┌────────────────────────────────┐
│   CUSTOMER                     │
│   ├─ Thêm vào giỏ             │
│   ├─ Thanh toán                │
│   ├─ Xem đơn hàng              │
│   ├─ Đánh giá sản phẩm         │
│   └─ Quản lý tài khoản         │
└────────────────────────────────┘

┌────────────────────────────────┐
│   ADMIN                        │
│   ├─ Dashboard thống kê        │
│   ├─ Quản lý sản phẩm          │
│   ├─ Quản lý đơn hàng          │
│   ├─ Quản lý khách hàng        │
│   └─ Quản lý chatbot           │
└────────────────────────────────┘
```

### 7.9. Sequence Diagram cần vẽ

**Frontend cần cung cấp Sequence Diagram cho:**

#### 1. Đăng nhập
```
User → Frontend: Nhập email, password
Frontend → Backend: POST /api/v1/auth/login
Backend → Database: Verify credentials
Database → Backend: User info
Backend → Frontend: access_token + refresh_token
Frontend → User: Redirect to homepage
```

#### 2. Thêm vào giỏ hàng
```
User → Frontend: Click "Add to Cart"
Frontend → Backend: POST /cart/items {variant_id, quantity}
Backend → Database: Check stock
Backend → Database: Insert cart_item
Database → Backend: Success
Backend → Frontend: Updated cart
Frontend → User: Show notification "Đã thêm vào giỏ"
```

#### 3. Thanh toán VNPay
```
User → Frontend: Click "Thanh toán VNPay"
Frontend → Backend: POST /api/v1/checkout
Backend → Database: Create order (Transaction)
Database → Backend: Order created
Backend → Frontend: order_id
Frontend → Backend: POST /api/v1/checkout/create-payment-url
Backend → VNPay: Create payment request
VNPay → Backend: payment_url
Backend → Frontend: payment_url
Frontend → User: Redirect to VNPay
User → VNPay: Thanh toán
VNPay → Frontend: Redirect with response_code
Frontend → Backend: GET /api/v1/payment/vnpay-return
Backend → Database: Update payment_status
Frontend → User: Show "Thanh toán thành công"
```

### 7.10. Mockup/Wireframe cần thiết

**Frontend cần cung cấp mockup cho:**

1. **Homepage**
   - Hero banner
   - Featured products grid
   - New arrivals section
   - Flash sale section

2. **Product List Page**
   - Sidebar filters (category, price, size, color)
   - Product grid
   - Pagination
   - Sort dropdown

3. **Product Detail Page**
   - Image gallery
   - Product info
   - Size/Color selector
   - Quantity input
   - Add to cart button
   - Reviews section

4. **Cart Page**
   - Cart items list
   - Quantity selector
   - Remove button
   - Cart summary (subtotal, shipping, total)
   - Checkout button

5. **Checkout Page**
   - Shipping address form
   - Payment method selector (COD/VNPay)
   - Order summary
   - Confirm button

6. **Admin Dashboard**
   - KPI cards (orders, revenue, customers)
   - Revenue chart
   - Recent orders table
   - Quick actions

### 7.11. Responsive Design

**Breakpoints cần support:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**UI components cần responsive:**
- Navigation menu (hamburger menu on mobile)
- Product grid (1 col → 2 col → 4 col)
- Filter sidebar (bottom sheet on mobile)
- Chat widget (full screen on mobile)

### 7.12. Performance Requirements

1. **Initial Load:** < 3s
2. **API Response Time:** < 500ms (backend đã optimize)
3. **Image Optimization:** WebP format, lazy loading
4. **Code Splitting:** Route-based lazy loading
5. **Caching:** React Query với staleTime

### 7.13. Testing Checklist

**Frontend cần test:**
- [ ] Unit tests cho components
- [ ] Integration tests cho API calls
- [ ] E2E tests cho critical flows:
  - [ ] Đăng ký → Đăng nhập → Mua hàng
  - [ ] Admin cập nhật trạng thái đơn
  - [ ] Chat với AI chatbot
  - [ ] Tìm kiếm bằng ảnh

---

## TÓM TẮT YÊU CẦU FRONTEND

### ✅ Backend đã cung cấp:
1. **140+ APIs** với Swagger docs
2. **Database schema** 29 tables
3. **Authentication** JWT + Refresh Token
4. **AI Integration** Chatbot + Image Search
5. **Payment** VNPay integration
6. **Email** Notifications

### 📋 Frontend cần bổ sung:
1. **30+ Screens** (10 public + 11 customer + 9 admin)
2. **UI Components** (Layout, Product, Shopping, AI, Form)
3. **State Management** (Auth, Cart, Product, UI)
4. **API Integration** với error handling
5. **Sơ đồ Use Case** chi tiết
6. **Sequence Diagrams** cho flows chính
7. **Mockups/Wireframes** cho tất cả screens
8. **Responsive Design** (Mobile, Tablet, Desktop)
9. **Testing** (Unit, Integration, E2E)

### 🎯 Ưu tiên implement:
**Phase 1 (Critical):**
- Authentication screens
- Product list + detail
- Cart + Checkout
- Order tracking

**Phase 2 (Important):**
- Admin dashboard
- Admin product management
- Admin order management
- Chat widget (AI)

**Phase 3 (Nice to have):**
- Image search
- Admin analytics
- Reviews system
- Wishlist

---

**Lưu ý:** Tất cả APIs đã sẵn sàng tại `http://localhost:3001` với Swagger docs tại `/api-docs`

