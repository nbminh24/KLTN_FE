# LeCas BackOffice - Complete Admin Pages

Tôi đã tạo xong **Admin Layout + Dashboard + Products List**. 

Dưới đây là danh sách **toàn bộ các trang còn lại** cần tạo. Bạn có thể sao chép code từ đây:

---

## ✅ ĐÃ TẠO XONG:

1. ✅ **Admin Layout** (`app/admin/layout.tsx`)
2. ✅ **AdminSidebar** (`components/admin/AdminSidebar.tsx`)  
3. ✅ **AdminTopBar** (`components/admin/AdminTopBar.tsx`)
4. ✅ **Dashboard** (`app/admin/page.tsx`)
5. ✅ **Products List** (`app/admin/products/page.tsx`)

---

## 📝 CÒN LẠI CẦN TẠO (10 màn hình):

### **Products (3 pages):**
- `app/admin/products/add/page.tsx` - Add Product Form
- `app/admin/products/[id]/edit/page.tsx` - Edit Product Form  
- `app/admin/products/import/page.tsx` - **Import CSV/Excel** ⭐

### **Categories (1 page):**
- `app/admin/categories/page.tsx` - Categories CRUD

### **Orders (2 pages):**
- `app/admin/orders/page.tsx` - Orders List
- `app/admin/orders/[id]/page.tsx` - Order Detail

### **Customers (2 pages):**
- `app/admin/customers/page.tsx` - Customers List
- `app/admin/customers/[id]/page.tsx` - Customer Detail

### **Returns (2 pages):**
- `app/admin/returns/page.tsx` - Returns List
- `app/admin/returns/[id]/page.tsx` - Return Detail

### **Promotions (1 page):**
- `app/admin/promotions/page.tsx` - Vouchers & Campaigns

### **Inventory (1 page):**
- `app/admin/inventory/page.tsx` - Stock Management

### **Chatbot (3 pages):**
- `app/admin/chatbot/page.tsx` - Analytics Overview ⭐
- `app/admin/chatbot/conversations/page.tsx` - Conversation Logs
- `app/admin/chatbot/unanswered/page.tsx` - Fallback Messages

### **Support (1 page):**
- `app/admin/support/page.tsx` - **Support Messages** ⭐

### **Settings (1 page):**
- `app/admin/settings/page.tsx` - Settings

---

## 🎨 Design System đang dùng:

```tsx
// Colors
Primary: #4880FF (Blue)
Success: #00B69B (Green)
Warning: #FCBE2D (Yellow)
Danger: #F93C65 (Red)
Text: #202224 (Dark)
Background: #F5F6FA (Light Gray)
Border: #E0E0E0

// Typography
Font: Nunito Sans
Sizes: 12px, 14px, 16px, 20px, 24px, 32px
Weights: 400, 600, 700, 800

// Components
Button: rounded-lg, px-4 py-2.5
Card: bg-white rounded-xl shadow-sm border
Input: border-gray-300 rounded-lg
Status Badge: rounded-full px-3 py-1 text-xs font-bold
```

---

Bạn có muốn tôi tiếp tục tạo **từng page một** hay bạn muốn tôi tạo **tất cả cùng lúc**?

Tôi suggest: Tạo **5 pages quan trọng nhất** trước:
1. ⭐ Orders List + Detail (quan trọng nhất)
2. ⭐ Support Messages (cần cho KLTN)
3. ⭐ Products Import CSV (300+ sản phẩm)
4. ⭐ Chatbot Analytics (KLTN feature)
5. Customers List

Bạn muốn tôi làm theo thứ tự nào?
