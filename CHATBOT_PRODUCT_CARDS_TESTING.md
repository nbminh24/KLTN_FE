# 🤖 CHATBOT PRODUCT CARDS - TESTING GUIDE

## 📋 MỤC ĐÍCH
Kiểm tra xem Backend và Rasa Chatbot đã hỗ trợ hiển thị sản phẩm dạng thẻ (Product Cards) trong chat chưa.

---

## 🔄 LUỒNG HOẠT ĐỘNG MONG MUỐN

```
┌─────────┐      ┌─────────┐      ┌──────┐      ┌─────────┐
│Frontend │─────▶│ Backend │─────▶│ Rasa │─────▶│ Backend │
│  (UI)   │      │   API   │      │  Bot │      │ Product │
└─────────┘      └─────────┘      └──────┘      │   API   │
     ▲                │                 │         └─────────┘
     │                │                 │              │
     │                │                 ◀──────────────┘
     │                │                 │
     │                ◀─────────────────┘
     │                │
     ◀────────────────┘
```

### Chi Tiết:

1. **User gửi message:** "Tìm áo thun nam"
2. **Frontend → Backend:** POST `/api/v1/chat/send`
3. **Backend → Rasa:** Forward message đến Rasa
4. **Rasa xử lý:** Nhận diện intent → Gọi custom action
5. **Rasa → Backend Product API:** Tìm kiếm sản phẩm
6. **Rasa trả response:** Text + Custom data (products)
7. **Backend → Frontend:** Forward response với `custom` field
8. **Frontend render:** `MessageRenderer` hiển thị `ProductCarousel`

---

## 🧪 TEST CASES

### Test 1: Search Products (Tìm kiếm sản phẩm)

#### Request
```http
POST http://localhost:3001/api/v1/chat/send
Content-Type: application/json
Authorization: Bearer {{access_token}}

{
  "message": "Tìm áo thun nam",
  "session_id": 123
}
```

#### Expected Response
```json
{
  "success": true,
  "customer_message": {
    "id": 456,
    "message": "Tìm áo thun nam",
    "sender": "customer",
    "created_at": "2024-12-14T02:00:00.000Z"
  },
  "bot_responses": [
    {
      "id": 457,
      "message": "Tôi tìm thấy 6 áo thun nam phù hợp với bạn:",
      "sender": "bot",
      "created_at": "2024-12-14T02:00:01.000Z",
      "custom": {
        "type": "products",
        "products": [
          {
            "product_id": 496,
            "name": "ONE LIFE GRAPHIC T-SHIRT",
            "slug": "one-life-graphic-t-shirt",
            "price": 26.00,
            "thumbnail": "https://example.com/images/product-496.jpg",
            "rating": 4.5,
            "reviews": 120,
            "in_stock": true
          },
          {
            "product_id": 497,
            "name": "POLO WITH TIPPING DETAILS",
            "slug": "polo-with-tipping-details",
            "price": 18.00,
            "thumbnail": "https://example.com/images/product-497.jpg",
            "rating": 4.8,
            "reviews": 85,
            "in_stock": true
          },
          {
            "product_id": 498,
            "name": "BLACK STRIPED T-SHIRT",
            "slug": "black-striped-t-shirt",
            "price": 12.00,
            "thumbnail": "https://example.com/images/product-498.jpg",
            "rating": 4.2,
            "reviews": 95,
            "in_stock": true
          }
        ],
        "total": 6
      }
    }
  ]
}
```

#### ✅ Verification Points
- [ ] `bot_responses[0].custom` tồn tại
- [ ] `custom.type === "products"`
- [ ] `custom.products` là array có ít nhất 1 item
- [ ] Mỗi product có đủ fields: `product_id`, `name`, `slug`, `price`, `thumbnail`
- [ ] `in_stock` là boolean
- [ ] Frontend hiển thị ProductCarousel thay vì plain text

---

### Test 2: Filter by Category (Lọc theo danh mục)

#### Request
```http
POST http://localhost:3001/api/v1/chat/send
Content-Type: application/json
Authorization: Bearer {{access_token}}

{
  "message": "Cho tôi xem áo khoác",
  "session_id": 123
}
```

#### Expected Response
```json
{
  "success": true,
  "bot_responses": [
    {
      "message": "Đây là những áo khoác đang hot nhất:",
      "custom": {
        "type": "products",
        "products": [
          {
            "product_id": 500,
            "name": "CASUAL JACKET",
            "slug": "casual-jacket",
            "price": 45.00,
            "thumbnail": "https://...",
            "in_stock": true
          }
        ]
      }
    }
  ]
}
```

---

### Test 3: Price Range Filter (Lọc theo giá)

#### Request
```http
POST http://localhost:3001/api/v1/chat/send
Content-Type: application/json

{
  "message": "Tìm áo thun dưới 20 đô",
  "session_id": 123
}
```

#### Expected Response
```json
{
  "bot_responses": [
    {
      "message": "Tôi tìm thấy 8 áo thun dưới $20:",
      "custom": {
        "type": "products",
        "products": [
          {
            "product_id": 499,
            "name": "BASIC TEE",
            "price": 15.00,
            "thumbnail": "https://...",
            "in_stock": true
          }
        ]
      }
    }
  ]
}
```

---

### Test 4: No Results (Không tìm thấy)

#### Request
```http
POST http://localhost:3001/api/v1/chat/send
Content-Type: application/json

{
  "message": "Tìm áo khoác lông gấu bắc cực",
  "session_id": 123
}
```

#### Expected Response
```json
{
  "bot_responses": [
    {
      "message": "Xin lỗi, tôi không tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn. Bạn có thể thử tìm kiếm khác không?",
      "custom": {
        "type": "buttons",
        "buttons": [
          {
            "text": "Xem tất cả sản phẩm",
            "action": "view_all_products",
            "variant": "primary"
          },
          {
            "text": "Tìm áo khoác",
            "action": "search_category",
            "payload": { "category": "jackets" },
            "variant": "outline"
          }
        ]
      }
    }
  ]
}
```

---

### Test 5: Product Detail Request (Hỏi chi tiết sản phẩm)

#### Request
```http
POST http://localhost:3001/api/v1/chat/send
Content-Type: application/json

{
  "message": "Cho tôi xem thông tin sản phẩm ID 496",
  "session_id": 123
}
```

#### Expected Response
```json
{
  "bot_responses": [
    {
      "message": "Đây là thông tin chi tiết của ONE LIFE GRAPHIC T-SHIRT:",
      "custom": {
        "type": "product_actions",
        "product_id": 496,
        "product_name": "ONE LIFE GRAPHIC T-SHIRT",
        "product_price": 26.00,
        "product_thumbnail": "https://...",
        "available_colors": [
          { "id": 1, "name": "Black", "hex": "#000000" },
          { "id": 2, "name": "White", "hex": "#FFFFFF" }
        ],
        "available_sizes": [
          { "id": 1, "name": "S" },
          { "id": 2, "name": "M" },
          { "id": 3, "name": "L" }
        ]
      }
    }
  ]
}
```

---

## 🐛 DEBUG CHECKLIST

### Backend API (`/api/v1/chat/send`)

**Check Response Structure:**
```javascript
console.log('Backend response:', response.data);
console.log('Bot responses:', response.data.bot_responses);
console.log('First bot message:', response.data.bot_responses[0]);
console.log('Custom data:', response.data.bot_responses[0].custom);
```

**Expected Console Output:**
```
✅ Backend response: { success: true, bot_responses: [...] }
✅ Bot responses: Array(1)
✅ First bot message: { message: "...", custom: {...} }
✅ Custom data: { type: "products", products: [...] }
```

**❌ Common Issues:**
```
❌ custom: undefined          → Backend không forward từ Rasa
❌ custom: null               → Rasa không gửi custom data
❌ custom.products: []        → Rasa không tìm thấy sản phẩm
❌ custom.type: "text"        → Rasa gửi sai type
```

---

### Rasa Server

**Test Rasa Directly:**
```bash
# Test Rasa endpoint trực tiếp (bỏ qua backend)
curl -X POST http://localhost:5005/webhooks/rest/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "test_user",
    "message": "Tìm áo thun"
  }'
```

**Expected Rasa Response:**
```json
[
  {
    "recipient_id": "test_user",
    "text": "Tôi tìm thấy 6 áo thun phù hợp:",
    "custom": {
      "type": "products",
      "products": [...]
    }
  }
]
```

**Check Rasa Actions:**
```bash
# Trong Rasa project folder
rasa run actions --debug

# Xem logs khi action được trigger
```

---

### Frontend (React DevTools)

**Check Chat Store:**
```javascript
// Browser console
const chatStore = useChatStore.getState();
console.log('Messages:', chatStore.messages);
console.log('Last bot message:', chatStore.messages[chatStore.messages.length - 1]);
console.log('Custom data:', chatStore.messages[chatStore.messages.length - 1].custom);
```

**Check Component Rendering:**
```javascript
// Trong MessageRenderer.tsx - thêm log
console.log('🎨 Rendering message:', message);
console.log('🎨 Custom type:', message.custom?.type);
console.log('🎨 Products count:', message.custom?.products?.length);
```

---

## 📊 MOCK DATA (Để Test Frontend Riêng)

Nếu Backend/Rasa chưa sẵn sàng, dùng mock data này:

```typescript
// lib/stores/useChatStore.ts - Thêm action mock
addMockProductMessage: () => {
    const mockMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Đây là những sản phẩm tôi tìm được:",
        sender: 'bot',
        timestamp: new Date(),
        custom: {
            type: 'products',
            products: [
                {
                    product_id: 496,
                    name: "ONE LIFE GRAPHIC T-SHIRT",
                    slug: "one-life-graphic-t-shirt",
                    price: 26.00,
                    thumbnail: "https://via.placeholder.com/300x300?text=Product+1",
                    rating: 4.5,
                    reviews: 120,
                    in_stock: true
                },
                {
                    product_id: 497,
                    name: "POLO WITH TIPPING DETAILS",
                    slug: "polo-with-tipping-details",
                    price: 18.00,
                    thumbnail: "https://via.placeholder.com/300x300?text=Product+2",
                    rating: 4.8,
                    reviews: 85,
                    in_stock: true
                }
            ]
        }
    };
    
    set((state) => ({
        messages: [...state.messages, mockMessage]
    }));
}
```

**Test trong browser console:**
```javascript
useChatStore.getState().addMockProductMessage();
```

---

## ✅ ACCEPTANCE CRITERIA

### Backend Team:
- [ ] API `/api/v1/chat/send` trả về `custom` field trong `bot_responses`
- [ ] `custom.type` đúng với message type (products, buttons, etc.)
- [ ] Product data đầy đủ: id, name, slug, price, thumbnail, in_stock
- [ ] Handle edge cases: no results, errors

### Rasa Team:
- [ ] Implement `action_search_products` 
- [ ] Return `json_message` với `custom` object
- [ ] Call Backend Product API để lấy data thật
- [ ] Format data đúng schema của Frontend

### Frontend Team:
- [x] `MessageRenderer` đã hỗ trợ `custom.type === "products"`
- [x] `ProductCarousel` component hoạt động
- [x] `useChatStore` đã parse `custom` và `buttons`
- [ ] Test với mock data thành công
- [ ] Test với real API thành công

---

## 🚀 NEXT STEPS

1. **Backend Dev:** Copy test cases này vào Postman/Insomnia
2. **Rasa Dev:** Implement actions theo expected response
3. **QA:** Test từng case một, check console logs
4. **Frontend:** Sẵn sàng, chỉ cần Backend/Rasa ready

---

## 📞 SUPPORT

Nếu gặp vấn đề, check:
1. Console logs (Frontend, Backend, Rasa)
2. Network tab (Chrome DevTools)
3. Rasa action logs (`rasa run actions --debug`)
4. Backend logs

**Contact:** Báo lại nếu cần support!
