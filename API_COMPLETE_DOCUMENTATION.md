# 📘 API Documentation - E-Commerce Platform

**Base URL**: `http://localhost:3000` (Development)

---

## 🔐 1. AUTHENTICATION APIs

### `POST /api/v1/auth/register`
**Đăng ký tài khoản** | Public
- **Body**: `{ email, password, fullName, phone }`
- **Response**: 201 - Đăng ký thành công | 409 - Email đã tồn tại

### `GET /api/v1/auth/activate?token={token}`
**Kích hoạt tài khoản (GET)** | Public
- **Response**: 302 - Redirect về FE với tokens | 401 - Token không hợp lệ

### `POST /api/v1/auth/activate`
**Kích hoạt tài khoản (POST)** | Public
- **Body**: `{ token }`
- **Response**: 200 - Kích hoạt thành công | 401 - Token không hợp lệ

### `POST /api/v1/auth/login`
**Đăng nhập** | Public
- **Body**: `{ email, password }`
- **Response**: 200 - { access_token, refresh_token } | 401 - Sai thông tin

### `POST /api/v1/auth/google`
**Đăng nhập Google** | Public
- **Body**: `{ auth_code }`
- **Response**: 200 - { access_token, refresh_token } | 400 - Auth code không hợp lệ

### `POST /api/v1/auth/refresh`
**Làm mới token** | Public
- **Body**: `{ refresh_token }`
- **Response**: 200 - { access_token } | 401 - Token không hợp lệ

### `POST /api/v1/auth/logout`
**Đăng xuất** | JWT Required
- **Response**: 200 - Đăng xuất thành công

### `POST /api/v1/auth/forgot-password`
**Quên mật khẩu** | Public
- **Body**: `{ email }`
- **Response**: 200 - Link đã được gửi (nếu email tồn tại)

### `POST /api/v1/auth/verify-reset-token`
**Kiểm tra reset token** | Public
- **Body**: `{ token }`
- **Response**: 200 - Token hợp lệ | 401 - Token không hợp lệ

### `POST /api/v1/auth/reset-password`
**Đặt lại mật khẩu** | Public
- **Body**: `{ token, newPassword }`
- **Response**: 200 - Đặt lại thành công | 401 - Token không hợp lệ

---

## 👤 2. ACCOUNT MANAGEMENT APIs

### `GET /account/profile`
**Xem profile** | JWT Required
- **Response**: 200 - { user info }

### `PUT /account/profile`
**Cập nhật profile** | JWT Required
- **Body**: `{ fullName, phone, ... }`
- **Response**: 200 - Cập nhật thành công

### `PUT /account/password`
**Đổi mật khẩu** | JWT Required
- **Body**: `{ currentPassword, newPassword }`
- **Response**: 200 - Đổi thành công | 401 - Mật khẩu cũ sai

### `GET /account/addresses`
**Danh sách địa chỉ** | JWT Required
- **Response**: 200 - [{ id, address, is_default, ... }]

### `POST /account/addresses`
**Thêm địa chỉ** | JWT Required
- **Body**: `{ full_name, phone, address, ward, district, city, is_default }`
- **Response**: 201 - Thêm thành công

### `PUT /account/addresses/:id`
**Cập nhật địa chỉ** | JWT Required
- **Body**: `{ full_name, phone, address, ... }`
- **Response**: 200 - Cập nhật thành công | 404 - Không tìm thấy

### `DELETE /account/addresses/:id`
**Xóa địa chỉ** | JWT Required
- **Response**: 200 - Xóa thành công | 404 - Không tìm thấy

---

## 📦 3. PRODUCTS APIs

### `GET /products`
**Danh sách sản phẩm** | Public
- **Query**: `page, limit, category_slug, colors, sizes, min_price, max_price, search, sort_by`
- **Response**: 200 - { data: [], metadata: { total, page, ... } }

### `GET /products/new-arrivals`
**Sản phẩm mới** | Public
- **Query**: `page, limit`
- **Response**: 200 - Sản phẩm mới trong 30 ngày

### `GET /products/on-sale`
**Sản phẩm khuyến mãi** | Public
- **Query**: `page, limit`
- **Response**: 200 - Sản phẩm đang flash sale

### `GET /products/featured`
**Sản phẩm nổi bật** | Public
- **Query**: `limit`
- **Response**: 200 - Top sản phẩm rating cao

### `GET /products/filters`
**Filter options** | Public
- **Query**: `category_id`
- **Response**: 200 - { sizes: [], colors: [], price_range: {} }

### `GET /products/attributes`
**Danh sách attributes** | Public
- **Response**: 200 - [attribute keys]

### `GET /products/availability`
**Kiểm tra tồn kho (Chatbot)** | Public
- **Query**: `name, size, color`
- **Response**: 200 - { available, stock_info }

### `GET /products/id/:id`
**Chi tiết sản phẩm (ID)** | Public
- **Response**: 200 - { product, variants, promotions, related } | 404 - Không tìm thấy

### `GET /products/:slug`
**Chi tiết sản phẩm (Slug)** | Public
- **Response**: 200 - Chi tiết đầy đủ | 404 - Không tìm thấy

### `GET /products/:productId/reviews`
**Reviews sản phẩm** | Public
- **Query**: `page, limit, sort, order`
- **Response**: 200 - { reviews: [], rating_summary }

### `GET /products/:productId/related`
**Sản phẩm liên quan** | Public
- **Query**: `limit`
- **Response**: 200 - [related products]

### `POST /products/id/:id/notify`
**Đăng ký thông báo** | JWT Required
- **Body**: `{ notification_type }`
- **Response**: 201 - Đăng ký thành công | 404 - Không tìm thấy

---

## 📂 4. CATEGORIES APIs

### `GET /categories`
**Danh sách categories** | Public
- **Response**: 200 - [{ id, name, slug, product_count }]

### `GET /categories/:slug/products`
**Sản phẩm theo category** | Public
- **Query**: `page, limit, sort_by, ...`
- **Response**: 200 - { products: [], metadata }

---

## ⭐ 5. REVIEWS APIs

### `POST /reviews`
**Gửi đánh giá** | JWT Required
- **Body**: `{ product_id, order_item_id, rating, comment, images }`
- **Response**: 201 - Gửi thành công | 403 - Không có quyền | 409 - Đã đánh giá

### `GET /reviews/account/reviewable-items`
**Sản phẩm có thể đánh giá** | JWT Required
- **Response**: 200 - [{ order_item, product }]

### `GET /reviews/customers/me/reviews`
**Reviews đã viết** | JWT Required
- **Response**: 200 - [{ review }]

---

## 🛒 6. CART & CHECKOUT APIs

### `GET /cart`
**Xem giỏ hàng** | JWT Required
- **Response**: 200 - { items: [], subtotal, total }

### `POST /cart/items`
**Thêm vào giỏ** | JWT Required
- **Body**: `{ variant_id, quantity }`
- **Response**: 201 - Thêm thành công | 400 - Không đủ hàng

### `PUT /cart/items/:id`
**Cập nhật số lượng** | JWT Required
- **Body**: `{ quantity }`
- **Response**: 200 - Cập nhật thành công | 400 - Không đủ hàng

### `DELETE /cart/items/:id`
**Xóa khỏi giỏ** | JWT Required
- **Response**: 200 - Xóa thành công

### `DELETE /cart/clear`
**Xóa toàn bộ giỏ** | JWT Required
- **Response**: 200 - Đã xóa

### `POST /cart/apply-coupon`
**Áp dụng mã giảm giá** | JWT Required
- **Body**: `{ code }`
- **Response**: 200 - Áp dụng thành công | 400 - Mã không hợp lệ

### `POST /cart/merge`
**Merge cart** | JWT Required
- **Body**: `{ session_id }`
- **Response**: 200 - Merge thành công

### `POST /api/v1/checkout`
**Tạo đơn hàng** | JWT Required
- **Body**: `{ address_id, payment_method, shipping_method, notes }`
- **Response**: 201 - { order_id } | 400 - Giỏ trống/Không đủ hàng

### `POST /api/v1/checkout/create-payment-url`
**Tạo link thanh toán VNPAY** | JWT Required
- **Body**: `{ order_id }`
- **Response**: 200 - { paymentUrl } | 404 - Không tìm thấy đơn

---

## 📦 7. ORDERS APIs

### `GET /orders`
**Lịch sử đơn hàng** | JWT Required
- **Query**: `page, limit, status`
- **Response**: 200 - { orders: [], metadata }

### `GET /orders/:id`
**Chi tiết đơn hàng** | JWT Required
- **Response**: 200 - { order details } | 404 - Không tìm thấy

### `GET /orders/:id/status-history`
**Lịch sử trạng thái** | JWT Required
- **Response**: 200 - [{ status, changed_at, admin }]

### `POST /orders/:id/cancel`
**Hủy đơn hàng** | JWT Required
- **Response**: 200 - Hủy thành công | 400 - Không thể hủy

### `GET /orders/track`
**Tracking đơn hàng (Public)** | Public
- **Query**: `order_id, phone, email`
- **Response**: 200 - { order info } | 404 - Không tìm thấy

---

## 📍 8. ADDRESSES APIs

### `GET /addresses`
**Danh sách địa chỉ** | JWT Required
- **Response**: 200 - [addresses]

### `POST /addresses`
**Thêm địa chỉ** | JWT Required
- **Body**: `{ full_name, phone, address, ward, district, city, is_default }`
- **Response**: 201 - Tạo thành công

### `PUT /addresses/:id`
**Cập nhật địa chỉ** | JWT Required
- **Body**: `{ ... }`
- **Response**: 200 - Cập nhật thành công

### `DELETE /addresses/:id`
**Xóa địa chỉ** | JWT Required
- **Response**: 200 - Xóa thành công

---

## ❤️ 9. WISHLIST APIs

### `GET /wishlist`
**Danh sách yêu thích** | JWT Required
- **Response**: 200 - [{ variant, product }]

### `POST /wishlist/toggle`
**Toggle wishlist** | JWT Required
- **Body**: `{ variant_id }`
- **Response**: 200 - { action: 'added' | 'removed' }

### `DELETE /wishlist/:variantId`
**Xóa khỏi wishlist** | JWT Required
- **Response**: 200 - Xóa thành công

---

## 🎯 10. PROMOTIONS APIs

### `GET /promotions/public`
**Danh sách mã giảm giá** | Public
- **Query**: `type`
- **Response**: 200 - [{ code, discount_value, ... }]

### `GET /promotions/active`
**Promotions active** | Public
- **Response**: 200 - [active promotions]

### `POST /promotions/validate`
**Validate mã giảm giá** | Public
- **Body**: `{ codes: [], subtotal }`
- **Response**: 200 - { valid, total_discount }

### `POST /promotions/validate-mix`
**Kiểm tra logic gộp mã** | Public
- **Body**: `{ codes: [] }`
- **Response**: 200 - { can_combine }

---

## 🎨 11. SIZES & COLORS APIs

### `GET /api/v1/sizes`
**Danh sách sizes** | Public
- **Query**: `page, limit, search, sort`
- **Response**: 200 - { data: [], metadata }

### `GET /api/v1/sizes/all`
**Tất cả sizes (dropdown)** | Public
- **Response**: 200 - [{ id, name, sort_order }]

### `GET /api/v1/colors`
**Danh sách colors** | Public
- **Query**: `page, limit, search, sort`
- **Response**: 200 - { data: [], metadata }

### `GET /api/v1/colors/all`
**Tất cả colors (dropdown)** | Public
- **Response**: 200 - [{ id, name, hex_code }]

---

## 📄 12. PAGES (CMS) APIs

### `GET /pages/:slug`
**Xem trang tĩnh** | Public
- **Response**: 200 - { title, content, slug } | 404 - Không tìm thấy

---

## 🆘 13. SUPPORT APIs

### `POST /support/tickets`
**Gửi yêu cầu hỗ trợ** | Public
- **Body**: `{ name, email, phone, subject, message }`
- **Response**: 201 - Gửi thành công

### `GET /customers/me/tickets`
**Tickets của tôi** | JWT Required
- **Query**: `status, page, limit`
- **Response**: 200 - [tickets]

### `GET /tickets/:id`
**Chi tiết ticket** | Public
- **Response**: 200 - { ticket, replies }

### `POST /tickets/:id/reply`
**Trả lời ticket** | JWT Required
- **Body**: `{ message }`
- **Response**: 201 - Reply thành công

---

## 🤖 14. CHAT & CHATBOT APIs

### `POST /chat/session`
**Tạo/Lấy session** | Public
- **Body**: `{ visitor_id, customer_id? }`
- **Response**: 201 - { session_id }

### `GET /chat/history`
**Lịch sử chat** | Public
- **Query**: `session_id, limit, offset`
- **Response**: 200 - { messages: [] }

### `POST /chat/send`
**Gửi tin nhắn** | Public
- **Body**: `{ session_id, message, sender_type }`
- **Response**: 201 - { response từ bot }

### `PUT /chat/merge`
**Merge session** | JWT Required
- **Body**: `{ visitor_id }`
- **Response**: 200 - Merge thành công

### `GET /chat/sessions/history`
**Lịch sử sessions** | Public
- **Query**: `customer_id, visitor_id, page, limit`
- **Response**: 200 - { sessions grouped by time }

### `GET /chat/sessions/active`
**Active session** | Public
- **Query**: `customer_id, visitor_id`
- **Response**: 200 - { session } | 404

### `DELETE /chat/sessions/:id`
**Xóa session** | Public
- **Response**: 200 - Xóa thành công

### `POST /chat/upload-image`
**Upload ảnh trong chat** | Public
- **Body**: FormData with `file`
- **Response**: 201 - { image_url }

### `PUT /chat/messages/:id/read`
**Đánh dấu đã đọc** | Public
- **Response**: 200 - OK

---

## 🧠 15. CONSULTANT (AI) APIs

### `POST /consultant/styling`
**Tư vấn phối đồ** | Public
- **Body**: `{ occasion, style, budget }`
- **Response**: 200 - [recommended products]

### `POST /consultant/sizing`
**Tư vấn kích cỡ** | Public
- **Body**: `{ height, weight, product_id }`
- **Response**: 200 - { recommended_size, availability }

### `POST /consultant/compare`
**So sánh sản phẩm** | Public
- **Body**: `{ product_ids: [] }`
- **Response**: 200 - { comparison_table }

---

## 💳 16. PAYMENT APIs

### `POST /payment/create_url`
**Tạo URL thanh toán VNPAY** | Public
- **Body**: `{ order_id, bank_code? }`
- **Response**: 201 - { paymentUrl }

### `GET /payment/vnpay_return`
**VNPAY Return URL** | Public
- **Query**: VNPAY params
- **Response**: 200 - Redirect về FE

### `GET /payment/vnpay_ipn`
**VNPAY IPN** | Public
- **Query**: VNPAY params
- **Response**: 200 - { RspCode, Message }

---

## 🤖 17. AI FEATURES APIs

### `POST /ai/chatbot`
**Chatbot AI (Rasa Proxy)** | Public
- **Body**: `{ message, session_id }`
- **Response**: 200 - { responses từ Rasa }

### `POST /ai/search/image`
**Tìm kiếm bằng ảnh** | Public
- **Body**: FormData with `image`
- **Response**: 200 - { results: [], count }

---

## 🔐 18. ADMIN - AUTHENTICATION APIs

### `POST /api/v1/admin/auth/login`
**Đăng nhập Admin** | Public
- **Body**: `{ email, password }`
- **Response**: 200 - { access_token, admin } | 401 - Sai thông tin

### `GET /api/v1/admin/auth/me`
**Profile Admin** | Admin Required
- **Response**: 200 - { admin info }

### `POST /api/v1/admin/auth/logout`
**Đăng xuất Admin** | Admin Required
- **Response**: 200 - Logout thành công

### `POST /api/v1/admin/auth/create`
**Tạo admin mới** | Admin Required
- **Body**: `{ name, email, password, role }`
- **Response**: 201 - Tạo thành công | 409 - Email đã tồn tại

### `POST /api/v1/admin/auth/reset-password`
**Reset password admin** | Admin Required
- **Body**: `{ email, new_password }`
- **Response**: 200 - Reset thành công

### `POST /api/v1/admin/auth/public-reset-password`
**Reset password (Public)** | Public
- **Body**: `{ email, new_password, secret_code? }`
- **Response**: 200 - Reset thành công

---

## 📊 19. ADMIN - DASHBOARD & ANALYTICS APIs

### `GET /admin/dashboard/stats`
**Thống kê tổng quan** | Admin Required
- **Response**: 200 - { total_orders, customers, revenue, ... }

### `GET /admin/dashboard/recent-orders`
**Đơn hàng gần đây** | Admin Required
- **Query**: `limit`
- **Response**: 200 - { recent_orders: [] }

### `GET /admin/dashboard/top-products`
**Sản phẩm bán chạy** | Admin Required
- **Query**: `limit`
- **Response**: 200 - { top_products: [] }

### `GET /admin/dashboard/revenue-chart`
**Biểu đồ doanh thu** | Admin Required
- **Query**: `period` (7d, 30d, 90d)
- **Response**: 200 - { chart_data: [], total_revenue, growth_percentage }

### `GET /admin/analytics/stats`
**KPIs Dashboard** | Admin Required
- **Query**: `period`
- **Response**: 200 - { total_revenue, new_orders, avg_order_value }

### `GET /admin/analytics/sales-overview`
**Biểu đồ doanh thu** | Admin Required
- **Query**: `period`
- **Response**: 200 - [{ date, orders, revenue }]

### `GET /admin/products/:id/analytics`
**Analytics sản phẩm** | Admin Required
- **Response**: 200 - { units_sold, total_orders, avg_rating }

### `GET /admin/products/:id/variant-sales`
**Doanh thu theo variant** | Admin Required
- **Response**: 200 - [{ variant, sales_percentage }]

### `GET /admin/products/:id/rating-distribution`
**Phân bố đánh giá** | Admin Required
- **Response**: 200 - { 5_star: x, 4_star: y, ... }

### `GET /admin/orders/status-counts`
**Thống kê đơn hàng** | Admin Required
- **Response**: 200 - { pending: x, processing: y, ... }

### `GET /admin/inventory/stats`
**Thống kê kho** | Admin Required
- **Response**: 200 - { total_products, low_stock, out_of_stock }

### `GET /admin/support-tickets/status-counts`
**Thống kê tickets** | Admin Required
- **Response**: 200 - { pending: x, replied: y, ... }

---

## 📦 20. ADMIN - PRODUCTS MANAGEMENT APIs

### `GET /api/v1/admin/products`
**Danh sách sản phẩm** | Admin Required
- **Query**: `page, limit, search, category_id, status, sort`
- **Response**: 200 - { data: [], metadata }

### `GET /api/v1/admin/products/low-stock`
**Sản phẩm tồn kho thấp** | Admin Required
- **Query**: `threshold`
- **Response**: 200 - { products: [], total_variants }

### `GET /api/v1/admin/products/:id`
**Chi tiết sản phẩm** | Admin Required
- **Response**: 200 - { product, variants } | 404

### `POST /api/v1/admin/products`
**Tạo sản phẩm** | Admin Required
- **Body**: `{ name, description, price, category_id, variants: [] }`
- **Response**: 201 - { id } | 400/409

### `PUT /api/v1/admin/products/:id`
**Cập nhật sản phẩm** | Admin Required
- **Body**: `{ name, description, ... }`
- **Response**: 200 - OK | 404/409

### `PATCH /api/v1/admin/products/:id/status`
**Cập nhật trạng thái** | Admin Required
- **Body**: `{ status }`
- **Response**: 200 - OK

### `GET /api/v1/admin/products/:id/variants`
**Danh sách variants** | Admin Required
- **Response**: 200 - { data: [variants] }

### `PUT /api/v1/admin/variants/:id`
**Cập nhật variant** | Admin Required
- **Body**: `{ sku, status }`
- **Response**: 200 - OK | 404/409

### `POST /api/v1/admin/variants/:id/images`
**Upload ảnh variant** | Admin Required
- **Body**: FormData with `files[]`, `is_main`
- **Response**: 201 - { images: [] }

### `DELETE /api/v1/admin/images/:id`
**Xóa ảnh** | Admin Required
- **Response**: 200 - OK

---

## 📂 21. ADMIN - CATEGORIES MANAGEMENT APIs

### `GET /api/v1/admin/categories`
**Danh sách categories** | Admin Required
- **Response**: 200 - { data: [{ id, name, slug, product_count }] }

### `GET /api/v1/admin/categories/stats`
**Thống kê categories** | Admin Required
- **Response**: 200 - { total_categories, active_categories, total_products }

### `GET /api/v1/admin/categories/all`
**Tất cả categories (dropdown)** | Admin Required
- **Response**: 200 - [categories]

### `GET /api/v1/admin/categories/:id`
**Chi tiết category** | Admin Required
- **Response**: 200 - { category } | 404

### `POST /api/v1/admin/categories`
**Tạo category** | Admin Required
- **Body**: `{ name, status }`
- **Response**: 201 - { category } | 409

### `PUT /api/v1/admin/categories/:id`
**Cập nhật category** | Admin Required
- **Body**: `{ name, status }`
- **Response**: 200 - OK | 404/409

### `DELETE /api/v1/admin/categories/:id`
**Xóa category** | Admin Required
- **Response**: 200 - OK | 404/409 (nếu còn sản phẩm)

---

## ⭐ 22. ADMIN - REVIEWS MANAGEMENT APIs

### `GET /admin/reviews`
**Danh sách reviews** | Admin Required
- **Query**: `page, limit, product_id, rating, status`
- **Response**: 200 - { reviews: [], metadata }

### `PATCH /admin/reviews/:id/status`
**Duyệt/Từ chối review** | Admin Required
- **Body**: `{ status }` (approved/rejected)
- **Response**: 200 - OK | 404

### `DELETE /admin/reviews/:id`
**Xóa review** | Admin Required
- **Response**: 200 - OK | 404

---

## 📦 23. ADMIN - ORDERS MANAGEMENT APIs

### `GET /admin/orders`
**Danh sách đơn hàng** | Admin Required
- **Query**: `page, limit, status, customer_email`
- **Response**: 200 - { orders: [], metadata }

### `GET /admin/orders/statistics`
**Thống kê đơn hàng** | Admin Required
- **Response**: 200 - { total_orders, by_status, total_revenue, avg_value }

### `GET /admin/orders/:id`
**Chi tiết đơn hàng** | Admin Required
- **Response**: 200 - { order details } | 404

### `PUT /admin/orders/:id/status`
**Cập nhật trạng thái** | Admin Required
- **Body**: `{ status }`
- **Response**: 200 - OK | 404

---

## 👥 24. ADMIN - CUSTOMERS MANAGEMENT APIs

### `GET /admin/customers`
**Danh sách khách hàng** | Admin Required
- **Query**: `page, limit, search`
- **Response**: 200 - { customers: [], metadata }

### `GET /admin/customers/statistics`
**Thống kê khách hàng** | Admin Required
- **Response**: 200 - { total, active, inactive, new_this_month, top_customers }

### `GET /admin/customers/:id`
**Chi tiết khách hàng** | Admin Required
- **Response**: 200 - { customer, orders, addresses } | 404

### `PATCH /admin/customers/:id/status`
**Khóa/Mở khóa tài khoản** | Admin Required
- **Body**: `{ status }`
- **Response**: 200 - OK

---

## 🎯 25. ADMIN - PROMOTIONS MANAGEMENT APIs

### `GET /admin/promotions`
**Danh sách mã giảm giá** | Admin Required
- **Query**: `page, limit, status, search, active`
- **Response**: 200 - { promotions: [], metadata }

### `GET /admin/promotions/:id`
**Chi tiết promotion** | Admin Required
- **Response**: 200 - { promotion } | 404

### `POST /admin/promotions`
**Tạo promotion** | Admin Required
- **Body**: `{ code, type, discount_value, start_date, end_date, ... }`
- **Response**: 201 - OK | 400/409

### `PUT /admin/promotions/:id`
**Cập nhật promotion** | Admin Required
- **Body**: `{ ... }`
- **Response**: 200 - OK | 404

### `DELETE /admin/promotions/:id`
**Xóa promotion** | Admin Required
- **Response**: 200 - OK | 404

### `POST /admin/promotions/:id/toggle`
**Bật/Tắt promotion** | Admin Required
- **Response**: 200 - OK

### `GET /admin/promotions/:code/usage`
**Thống kê sử dụng** | Admin Required
- **Response**: 200 - { used_count, remaining, ... }

---

## 📦 26. ADMIN - INVENTORY MANAGEMENT APIs

### `GET /admin/inventory`
**Quản lý tồn kho** | Admin Required
- **Query**: `low_stock`
- **Response**: 200 - [{ product, variants, stock }]

### `POST /admin/inventory/restock`
**Nhập kho thủ công** | Admin Required
- **Body**: `{ variants: [{ variant_id, quantity }] }`
- **Response**: 201 - OK

### `POST /admin/inventory/restock-batch`
**Nhập kho Excel** | Admin Required
- **Body**: FormData with `file` (Excel)
- **Response**: 201 - { imported_count }

---

## 📄 27. ADMIN - PAGES (CMS) APIs

### `GET /admin/pages`
**Danh sách trang** | Admin Required
- **Response**: 200 - [{ id, title, slug, status }]

### `GET /admin/pages/:id`
**Chi tiết trang** | Admin Required
- **Response**: 200 - { page } | 404

### `POST /admin/pages`
**Tạo trang** | Admin Required
- **Body**: `{ title, slug, content, status }`
- **Response**: 201 - OK | 409

### `PUT /admin/pages/:id`
**Cập nhật trang** | Admin Required
- **Body**: `{ title, content, ... }`
- **Response**: 200 - OK | 404/409

### `DELETE /admin/pages/:id`
**Xóa trang** | Admin Required
- **Response**: 200 - OK | 404

---

## 🆘 28. ADMIN - SUPPORT TICKETS APIs

### `GET /admin/support-tickets`
**Danh sách tickets** | Admin Required
- **Query**: `page, limit, status`
- **Response**: 200 - { tickets: [], metadata }

### `GET /admin/support-tickets/:id`
**Chi tiết ticket** | Admin Required
- **Response**: 200 - { ticket, replies }

### `POST /admin/support-tickets/:id/reply`
**Admin trả lời** | Admin Required
- **Body**: `{ message }`
- **Response**: 201 - OK

### `PUT /admin/support/tickets/:id`
**Cập nhật trạng thái ticket** | Admin Required
- **Body**: `{ status }`
- **Response**: 200 - OK

---

## 🎨 29. ADMIN - SIZES & COLORS APIs

### `GET /api/v1/admin/sizes`
**Danh sách sizes** | Admin Required
- **Query**: `page, limit, search, sort`
- **Response**: 200 - { data: [], metadata }

### `GET /api/v1/admin/sizes/all`
**Tất cả sizes** | Admin Required
- **Response**: 200 - [sizes]

### `POST /api/v1/admin/sizes`
**Tạo size** | Admin Required
- **Body**: `{ name, sort_order }`
- **Response**: 201 - OK | 409

### `PUT /api/v1/admin/sizes/:id`
**Cập nhật size** | Admin Required
- **Body**: `{ name, sort_order }`
- **Response**: 200 - OK | 404/409

### `GET /api/v1/admin/colors`
**Danh sách colors** | Admin Required
- **Query**: `page, limit, search, sort`
- **Response**: 200 - { data: [], metadata }

### `GET /api/v1/admin/colors/all`
**Tất cả colors** | Admin Required
- **Response**: 200 - [colors]

### `POST /api/v1/admin/colors`
**Tạo color** | Admin Required
- **Body**: `{ name, hex_code }`
- **Response**: 201 - OK | 409

### `PUT /api/v1/admin/colors/:id`
**Cập nhật color** | Admin Required
- **Body**: `{ name, hex_code }`
- **Response**: 200 - OK | 404/409

---

## 🤖 ADMIN - CHATBOT & AI APIs

### `GET /admin/chatbot/conversations`
**Danh sách conversations** | Admin Required
- **Query**: `page, limit, resolved, search`
- **Response**: 200 - { conversations: [] }

### `GET /admin/chatbot/conversations/:id`
**Chi tiết conversation** | Admin Required
- **Response**: 200 - { session, messages }

### `POST /admin/chat/:id/reply`
**Admin reply chat** | Admin Required
- **Body**: `{ message }`
- **Response**: 201 - OK

### `GET /admin/chatbot/analytics`
**Analytics chatbot** | Admin Required
- **Response**: 200 - { total_conversations, resolved_rate, top_intents }

### `GET /admin/chatbot/unanswered`
**Câu hỏi chưa trả lời** | Admin Required
- **Response**: 200 - [unresolved conversations]

### `GET /admin/ai/recommendations`
**Danh sách AI recommendations** | Admin Required
- **Query**: `page, limit, user_id, product_id`
- **Response**: 200 - { recommendations: [] }

### `GET /admin/ai/recommendations/stats`
**Thống kê recommendations** | Admin Required
- **Response**: 200 - { total, top_products, top_users }

### `GET /admin/transactions`
**Danh sách giao dịch** | Admin Required
- **Query**: `start_date, end_date, status, page, limit`
- **Response**: 200 - { transactions: [] }

---

## 📝 NOTES

### Authentication Headers
```
Authorization: Bearer {access_token}
```

### Response Format
**Success**:
```json
{
  "message": "Success message",
  "data": { ... }
}
```

**Error**:
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

### Pagination Metadata
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

**Tổng số endpoints**: 180+ APIs
**Cập nhật lần cuối**: Dec 4, 2025
