# 🚀 CHATBOT - QUICK START GUIDE

## ⚡ 3 BƯỚC ĐỂ TEST NGAY

### **Bước 1: Cài đặt**
```bash
cd c:\Users\USER\Downloads\kltn_fe
npm install
```

### **Bước 2: Chạy**
```bash
npm run dev
```

### **Bước 3: Test**
Mở trình duyệt: `http://localhost:3000`

---

## 🧪 TEST CASES

### ✅ **Test 1: Chat Widget**
1. Vào trang chủ hoặc bất kỳ trang nào (không phải /admin hoặc /chat)
2. Click nút chat góc phải dưới
3. Gõ: "Tìm áo thun đen"
4. **Kỳ vọng:** Danh sách sản phẩm hiện ra dạng carousel

### ✅ **Test 2: Slot Filling (Thêm giỏ hàng)**
1. Click "Thêm giỏ" trên 1 sản phẩm
2. **Kỳ vọng:** Bot hỏi "Bạn muốn size nào?"
3. Click chọn size "M"
4. **Kỳ vọng:** Bot hỏi "Màu nào bạn nhỉ?"
5. Click chọn màu "Đen"
6. **Kỳ vọng:** "Đã thêm vào giỏ hàng!"

### ✅ **Test 3: Upload Ảnh**
1. Click icon camera
2. Chọn ảnh sản phẩm
3. Click send
4. **Kỳ vọng:** Bot tìm sản phẩm tương tự

### ✅ **Test 4: Full Screen Chat**
1. Vào `/chat`
2. Test giống như widget
3. Click "New Chat" để reset

---

## 🔧 NẾU GẶP LỖI

### Lỗi: "Cannot find module 'zustand'"
**Giải pháp:**
```bash
npm install zustand
```

### Lỗi: "Network Error" khi gửi tin nhắn
**Kiểm tra:**
1. Backend có chạy không? → `http://localhost:3001`
2. Rasa có chạy không? → `http://localhost:5005`

### Backend chưa chạy?
```bash
# Vào thư mục backend
cd path/to/backend
npm run start:dev
```

### Rasa chưa chạy?
```bash
# Vào thư mục rasa
cd path/to/rasa
rasa run --enable-api
```

---

## 📋 CHECKLIST TRƯỚC KHI TEST

- [ ] Backend đang chạy (`http://localhost:3001`)
- [ ] Rasa đang chạy (`http://localhost:5005`)
- [ ] Frontend đang chạy (`http://localhost:3000`)
- [ ] Đã chạy `npm install`
- [ ] Database có data mẫu

---

## 🎯 CÁC TÍNH NĂNG ĐÃ SẴN SÀNG

### ✅ Chat Cơ Bản
- Gửi/nhận tin nhắn
- Lịch sử chat (persistent)
- Guest mode (không cần login)
- Typing indicator

### ✅ Rich Content
- Product carousel (danh sách sản phẩm)
- Size/Color selector (slot filling)
- Action buttons (quick replies)
- Order timeline (theo dõi đơn hàng)
- Ticket confirmation (hỗ trợ)

### ✅ Tính Năng Nâng Cao
- Upload ảnh tìm sản phẩm
- Unread notification badge
- Auto-scroll messages
- Image preview
- Loading states

---

## 💬 TEST MESSAGES GỢI Ý

```
"Chào shop"
"Tìm áo thun đen"
"Mình cao 1m7, 65kg nên mặc size gì?"
"Thêm vào giỏ hàng"
"Tra đơn hàng #12345"
"Đi đám cưới mặc gì?"
"Gặp nhân viên hỗ trợ"
```

---

## 📞 HỖ TRỢ

**Nếu có vấn đề:**
1. Check console log (F12)
2. Check network tab
3. Check backend/rasa logs
4. Báo lỗi với chi tiết

---

**Ready to go!** 🎉
