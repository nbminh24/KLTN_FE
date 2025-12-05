# API Documentation

## Table of Contents
1. [Authentication](#authentication-)
2. [Users](#users-)
3. [Products](#products-)
4. [Wishlist](#wishlist-)
5. [Chat & Support](#chat--support-)
6. [Admin - Products](#admin---products-)
7. [Admin - Reviews](#admin---reviews-)
8. [Admin - Dashboard](#admin---dashboard-)

---

## Authentication 🔐

### Register
- **Endpoint**: `POST /api/v1/auth/register`
- **Description**: Đăng ký tài khoản mới
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Nguyen Van A",
    "phone": "0901234567"
  }
  ```
- **Responses**:
  - 201: Đăng ký thành công, vui lòng kiểm tra email
  - 409: Email đã tồn tại

### Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Description**: Đăng nhập bằng email/password
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Responses**:
  - 200: Đăng nhập thành công (trả về access_token và refresh_token)
  - 401: Email/password không chính xác hoặc tài khoản chưa kích hoạt

### Refresh Token
- **Endpoint**: `POST /api/v1/auth/refresh`
- **Description**: Làm mới Access Token
- **Request Body**:
  ```json
  {
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Responses**:
  - 200: Refresh token thành công (trả về access_token mới)
  - 401: Refresh token không hợp lệ hoặc đã hết hạn

### Forgot Password
- **Endpoint**: `POST /api/v1/auth/forgot-password`
- **Description**: Gửi yêu cầu đặt lại mật khẩu
- **Request Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Responses**:
  - 200: Nếu email tồn tại, link đã được gửi

### Reset Password
- **Endpoint**: `POST /api/v1/auth/reset-password`
- **Description**: Đặt mật khẩu mới
- **Request Body**:
  ```json
  {
    "token": "reset_token_here",
    "newPassword": "newPassword123"
  }
  ```
- **Responses**:
  - 200: Đặt lại mật khẩu thành công
  - 401: Token không hợp lệ hoặc đã hết hạn

---

## Users 👥

### Get Profile
- **Endpoint**: `GET /users/profile`
- **Authentication**: Required
- **Description**: Lấy thông tin profile người dùng
- **Responses**:
  - 200: Thành công
  - 401: Chưa đăng nhập

### Update Profile
- **Endpoint**: `PUT /users/profile`
- **Authentication**: Required
- **Description**: Cập nhật thông tin profile
- **Request Body**:
  ```json
  {
    "fullName": "Nguyen Van B",
    "phone": "0908765432",
    "address": "123 Đường ABC, Quận 1, TP.HCM"
  }
  ```
- **Responses**:
  - 200: Cập nhật thành công
  - 401: Chưa đăng nhập

### Change Password
- **Endpoint**: `POST /users/change-password`
- **Authentication**: Required
- **Description**: Đổi mật khẩu
- **Request Body**:
  ```json
  {
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword123"
  }
  ```
- **Responses**:
  - 200: Đổi mật khẩu thành công
  - 401: Mật khẩu hiện tại không đúng

---

## Products 📦

### Get All Products
- **Endpoint**: `GET /products`
- **Description**: Lấy danh sách sản phẩm với filter
- **Query Parameters**:
  - `page`: Trang hiện tại (mặc định: 1)
  - `limit`: Số sản phẩm mỗi trang (mặc định: 20)
  - `category_slug`: Lọc theo danh mục
  - `colors`: Lọc theo màu (có thể nhiều, cách nhau bằng dấu phẩy)
  - `sizes`: Lọc theo size (có thể nhiều, cách nhau bằng dấu phẩy)
  - `min_price`: Giá tối thiểu
  - `max_price`: Giá tối đa
  - `search`: Tìm kiếm theo tên hoặc mô tả
  - `sort_by`: Sắp xếp (newest, price_asc, price_desc, rating)
- **Responses**:
  - 200: Danh sách sản phẩm với metadata phân trang

### Get Product by ID
- **Endpoint**: `GET /products/id/:id`
- **Description**: Lấy chi tiết sản phẩm theo ID
- **Responses**:
  - 200: Chi tiết sản phẩm đầy đủ
  - 404: Không tìm thấy sản phẩm

### Get Product by Slug
- **Endpoint**: `GET /products/:slug`
- **Description**: Lấy chi tiết sản phẩm theo slug
- **Responses**:
  - 200: Chi tiết sản phẩm đầy đủ
  - 404: Không tìm thấy sản phẩm

### Get New Arrivals
- **Endpoint**: `GET /products/new-arrivals`
- **Description**: Lấy sản phẩm mới trong vòng 30 ngày qua
- **Query Parameters**:
  - `page`: Trang hiện tại (mặc định: 1)
  - `limit`: Số sản phẩm mỗi trang (mặc định: 12)
- **Responses**:
  - 200: Danh sách sản phẩm mới

### Get On Sale Products
- **Endpoint**: `GET /products/on-sale`
- **Description**: Lấy sản phẩm đang khuyến mãi
- **Query Parameters**:
  - `page`: Trang hiện tại (mặc định: 1)
  - `limit`: Số sản phẩm mỗi trang (mặc định: 12)
- **Responses**:
  - 200: Danh sách sản phẩm khuyến mãi

### Get Product Reviews
- **Endpoint**: `GET /products/:productId/reviews`
- **Description**: Lấy đánh giá sản phẩm
- **Query Parameters**:
  - `page`: Trang hiện tại (mặc định: 1)
  - `limit`: Số đánh giá mỗi trang (mặc định: 10)
  - `sort`: Sắp xếp (created_at, rating)
  - `order`: Thứ tự (asc, desc)
- **Responses**:
  - 200: Danh sách đánh giá

### Get Related Products
- **Endpoint**: `GET /products/:productId/related`
- **Description**: Lấy sản phẩm liên quan
- **Query Parameters**:
  - `limit`: Số sản phẩm (mặc định: 8)
- **Responses**:
  - 200: Danh sách sản phẩm liên quan

### Check Product Availability
- **Endpoint**: `GET /products/availability`
- **Description**: Kiểm tra tồn kho sản phẩm (cho chatbot)
- **Query Parameters**:
  - `name`: Tên sản phẩm (bắt buộc)
  - `size`: Kích cỡ (tùy chọn)
  - `color`: Màu sắc (tùy chọn)
- **Responses**:
  - 200: Thông tin tồn kho

---

## Wishlist ❤️

### Get Wishlist
- **Endpoint**: `GET /wishlist`
- **Authentication**: Required
- **Description**: Lấy danh sách sản phẩm yêu thích
- **Responses**:
  - 200: Danh sách wishlist

### Toggle Wishlist
- **Endpoint**: `POST /wishlist/toggle`
- **Authentication**: Required
- **Description**: Thêm/Xóa sản phẩm khỏi wishlist
- **Request Body**:
  ```json
  {
    "variant_id": 123
  }
  ```
- **Responses**:
  - 200: Toggle thành công
  - 404: Không tìm thấy variant

### Remove from Wishlist
- **Endpoint**: `DELETE /wishlist/:variantId`
- **Authentication**: Required
- **Description**: Xóa sản phẩm khỏi wishlist
- **Responses**:
  - 200: Xóa thành công
  - 404: Không tìm thấy variant trong wishlist

---

## Chat & Support 🤖

### Create/Get Chat Session
- **Endpoint**: `POST /chat/session`
- **Description**: Tạo hoặc lấy phiên chat
- **Request Body**:
  ```json
  {
    "visitor_id": "unique_visitor_id"
  }
  ```
- **Responses**:
  - 201: Session được tạo hoặc lấy thành công

### Get Chat History
- **Endpoint**: `GET /chat/history`
- **Query Parameters**:
  - `session_id`: ID phiên chat (bắt buộc)
  - `limit`: Số tin nhắn (mặc định: 50)
  - `offset`: Vị trí bắt đầu (mặc định: 0)
- **Responses**:
  - 200: Lịch sử chat

### Send Message
- **Endpoint**: `POST /chat/send`
- **Description**: Gửi tin nhắn
- **Request Body**:
  ```json
  {
    "session_id": 1,
    "message": "Xin chào",
    "sender_type": "user"
  }
  ```
- **Responses**:
  - 201: Tin nhắn đã gửi và nhận phản hồi

---

## Admin - Products 📊

### Get All Products (Admin)
- **Endpoint**: `GET /api/v1/admin/products`
- **Authentication**: Required (Admin)
- **Description**: Lấy danh sách sản phẩm (Admin)
- **Query Parameters**:
  - Các tham số tương tự như API public
- **Responses**:
  - 200: Danh sách sản phẩm

### Get Low Stock Products
- **Endpoint**: `GET /api/v1/admin/products/low-stock`
- **Authentication**: Required (Admin)
- **Description**: Lấy danh sách sản phẩm tồn kho thấp
- **Query Parameters**:
  - `threshold`: Ngưỡng tồn kho (mặc định: 10)
- **Responses**:
  - 200: Danh sách sản phẩm tồn kho thấp

### Create Product
- **Endpoint**: `POST /api/v1/admin/products`
- **Authentication**: Required (Admin)
- **Description**: Tạo sản phẩm mới
- **Request Body**:
  ```json
  {
    "name": "Tên sản phẩm",
    "description": "Mô tả sản phẩm",
    "price": 100000,
    "category_id": 1,
    "status": "active"
  }
  ```
- **Responses**:
  - 201: Tạo thành công
  - 400: Dữ liệu không hợp lệ
  - 409: SKU đã tồn tại

### Update Product
- **Endpoint**: `PUT /api/v1/admin/products/:id`
- **Authentication**: Required (Admin)
- **Description**: Cập nhật sản phẩm
- **Responses**:
  - 200: Cập nhật thành công
  - 404: Không tìm thấy sản phẩm
  - 409: SKU đã tồn tại

### Update Product Status
- **Endpoint**: `PATCH /api/v1/admin/products/:id/status`
- **Authentication**: Required (Admin)
- **Description**: Cập nhật trạng thái sản phẩm (active/inactive)
- **Request Body**:
  ```json
  {
    "status": "inactive"
  }
  ```
- **Responses**:
  - 200: Cập nhật thành công
  - 404: Không tìm thấy sản phẩm

---

## Admin - Reviews ⭐

### Get All Reviews (Admin)
- **Endpoint**: `GET /admin/reviews`
- **Authentication**: Required (Admin)
- **Description**: Lấy danh sách tất cả đánh giá
- **Query Parameters**:
  - `page`: Trang hiện tại (mặc định: 1)
  - `limit`: Số đánh giá mỗi trang (mặc định: 20)
  - `product_id`: Lọc theo sản phẩm
  - `rating`: Lọc theo đánh giá (1-5)
  - `status`: Lọc theo trạng thái (pending/approved/rejected)
- **Responses**:
  - 200: Danh sách đánh giá

### Update Review Status
- **Endpoint**: `PATCH /admin/reviews/:id/status`
- **Authentication**: Required (Admin)
- **Description**: Duyệt/Từ chối đánh giá
- **Request Body**:
  ```json
  {
    "status": "approved"
  }
  ```
- **Responses**:
  - 200: Cập nhật trạng thái thành công
  - 404: Không tìm thấy đánh giá

### Delete Review
- **Endpoint**: `DELETE /admin/reviews/:id`
- **Authentication**: Required (Admin)
- **Description**: Xóa đánh giá
- **Responses**:
  - 200: Xóa thành công
  - 404: Không tìm thấy đánh giá

---

## Admin - Dashboard 📊

### Get Dashboard Stats
- **Endpoint**: `GET /admin/dashboard/stats`
- **Authentication**: Required (Admin)
- **Description**: Lấy thống kê tổng quan
- **Responses**:
  - 200: Thống kê tổng quan

### Get Recent Orders
- **Endpoint**: `GET /admin/dashboard/recent-orders`
- **Authentication**: Required (Admin)
- **Description**: Lấy danh sách đơn hàng gần đây
- **Query Parameters**:
  - `limit`: Số đơn hàng (mặc định: 10)
- **Responses**:
  - 200: Danh sách đơn hàng gần đây

### Get Top Products
- **Endpoint**: `GET /admin/dashboard/top-products`
- **Authentication**: Required (Admin)
- **Description**: Lấy danh sách sản phẩm bán chạy
- **Query Parameters**:
  - `limit`: Số sản phẩm (mặc định: 10)
- **Responses**:
  - 200: Danh sách sản phẩm bán chạy

### Get Revenue Chart
- **Endpoint**: `GET /admin/dashboard/revenue-chart`
- **Authentication**: Required (Admin)
- **Description**: Lấy dữ liệu biểu đồ doanh thu
- **Query Parameters**:
  - `period`: Chu kỳ (7d, 30d, 90d, mặc định: 7d)
- **Responses**:
  - 200: Dữ liệu biểu đồ doanh thu
