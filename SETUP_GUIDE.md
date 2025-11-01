# 🚀 Quick Setup Guide

## Bước 1: Cấu Hình Backend URL

Tạo file `.env.local` trong thư mục root:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Hoặc** để mặc định (đã config sẵn trong code).

---

## Bước 2: Fix Addresses Page

Rename file addresses mới:
```bash
# Windows PowerShell
mv app/addresses/page_new.tsx app/addresses/page.tsx -Force

# Hoặc copy nội dung từ page_new.tsx vào page.tsx
```

---

## Bước 3: Cài Đặt & Chạy

```bash
# Install dependencies (nếu chưa)
npm install

# Chạy dev server
npm run dev
```

Frontend chạy tại: `http://localhost:3000`

---

## Bước 4: Kiểm Tra Backend

Đảm bảo backend đang chạy:
```bash
curl http://localhost:3001/products
# Hoặc mở browser: http://localhost:3001/api-docs
```

---

## 🎯 Test Flow

### 1. Authentication
- Mở `/signup` → Đăng ký tài khoản mới
- Auto login → Redirect về home
- `/profile` → Xem thông tin user

### 2. Browse Products
- Homepage → Xem New Arrivals, Top Selling, Recommended
- `/products` → Filter by category, sort, pagination

### 3. Shopping
- Click vào product (cần update product detail page)
- Add to cart
- `/cart` → View cart, update quantity, apply promo
- `/checkout` → Create order (cần update)

### 4. User Features
- `/wishlist` → Save favorite products
- `/addresses` → Manage delivery addresses
- `/orders` → View order history
- `/support` → Submit support ticket

---

## ⚠️ Known Issues / TODO

### Cần Update Thêm:

1. **Product Detail Page** (`app/products/[id]/page.tsx`)
   - Load từ `/products/:id`
   - Add to cart với variant selection
   - Display reviews

2. **Checkout Page** (`app/checkout/page.tsx`)
   - Finalize order creation
   - Payment integration

3. **Chatbot Component** (`components/Chatbot.tsx`)
   - Call `/ai/chat`
   - Chat history

4. **Admin Pages**
   - Chưa update (theo yêu cầu ban đầu)

---

## 📁 Files Created/Updated

### Created:
- `lib/api.ts` - API service layer
- `contexts/AuthContext.tsx` - Auth context
- `app/addresses/page_new.tsx` - New addresses page
- `.env.example` - Example env vars
- `API_INTEGRATION_COMPLETE.md` - Detailed docs

### Updated:
- `app/layout.tsx` - AuthProvider wrapper
- `app/login/page.tsx` - API login
- `app/signup/page.tsx` - API register
- `app/profile/page.tsx` - API profile
- `app/page.tsx` - API products (homepage)
- `app/products/page.tsx` - API products listing
- `app/cart/page.tsx` - API cart
- `app/orders/page.tsx` - API orders
- `app/wishlist/page.tsx` - API wishlist
- `app/support/page.tsx` - API support

---

## 💡 Tips

### Debug API Calls
Mở DevTools → Network tab → Filter "XHR" để xem API requests

### Auth Issues
Nếu bị logout liên tục:
```javascript
// Check localStorage
localStorage.getItem('access_token')

// Clear và login lại
localStorage.removeItem('access_token')
```

### CORS Errors
Kiểm tra backend CORS config cho `http://localhost:3000`

---

## 📞 Need Help?

Nếu gặp vấn đề:
1. Check backend có chạy không
2. Check console errors (F12)
3. Verify API response format
4. Báo tôi với error message cụ thể

---

**All done! Happy testing! 🎉**
