# 🐛 BACKEND BUG REPORT - Chat Session API Response

**Date:** December 7, 2025  
**Reporter:** Frontend Team  
**Severity:** HIGH (Blocking chatbot feature)  
**Status:** OPEN

---

## 📋 SUMMARY

API endpoint `POST /chat/session` không trả về đúng response structure như documentation, gây lỗi frontend không parse được session ID.

---

## 🔴 ISSUE

### **Endpoint:**
```
POST /chat/session
```

### **Request Body:**
```json
{
  "visitor_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### **Expected Response (theo docs):**
```json
{
  "session": {
    "id": 1,
    "visitor_id": "550e8400-e29b-41d4-a716-446655440000",
    "customer_id": null,
    "created_at": "2024-12-07T10:00:00.000Z",
    "updated_at": "2024-12-07T10:00:00.000Z"
  },
  "is_new": true
}
```

### **Actual Response:**
**Unknown** - Frontend không parse được, nhưng console log hiển thị:
```
[ChatStore] Session response: Object
```

Có khả năng response structure là một trong các trường hợp sau:

#### **Possibility 1: Wrapped in `data`**
```json
{
  "data": {
    "session": {
      "id": 1,
      ...
    },
    "is_new": true
  }
}
```

#### **Possibility 2: Direct object (không có `session` wrapper)**
```json
{
  "id": 1,
  "visitor_id": "...",
  "customer_id": null,
  "is_new": true,
  ...
}
```

#### **Possibility 3: Completely different structure**
```json
// Unknown structure
```

---

## 💥 IMPACT

### **Frontend Effects:**
- ✅ API call thành công (status 200)
- ❌ Không parse được `session.id`
- ❌ Throw error: "Invalid session response structure"
- ⚠️ Fallback to local mode (chatbot vẫn hoạt động nhưng không lưu database)

### **User Impact:**
- Chatbot UI vẫn hiển thị
- User có thể chat
- **NHƯNG:** Messages không được lưu vào database
- **NHƯNG:** Không load được history
- **NHƯNG:** Không merge session được khi login

---

## 🔍 ROOT CAUSE

Frontend code expect response structure:
```typescript
interface CreateSessionResponse {
  session: {
    id: number;
    visitor_id: string | null;
    customer_id: number | null;
    created_at: string;
    updated_at: string;
  };
  is_new: boolean;
}
```

Backend trả về structure khác → Frontend không tìm thấy `response.data.session.id`

---

## ✅ EXPECTED BEHAVIOR

API `POST /chat/session` phải trả về:

```json
{
  "session": {
    "id": 1,
    "visitor_id": "550e8400-e29b-41d4-a716-446655440000",
    "customer_id": null,
    "created_at": "2024-12-07T10:00:00.000Z",
    "updated_at": "2024-12-07T10:00:00.000Z"
  },
  "is_new": true
}
```

**Không được wrap thêm layer `data` bên ngoài.**

---

## 🛠️ HOW TO REPRODUCE

### **Step 1: Call API**
```bash
curl -X POST http://localhost:3001/chat/session \
  -H "Content-Type: application/json" \
  -d '{
    "visitor_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### **Step 2: Check Response**
Verify response structure có đúng format như Expected không.

---

## 🔧 SUGGESTED FIX

### **Option A: Backend sửa response structure (RECOMMENDED)**

File: `src/chat/chat.controller.ts` hoặc tương tự

**Before:**
```typescript
// Nếu đang return như này
return {
  data: {
    session: newSession,
    is_new: true
  }
};
```

**After:**
```typescript
// Đổi thành
return {
  session: newSession,
  is_new: true
};
```

### **Option B: Frontend adapt (NOT RECOMMENDED)**

Nếu không thể sửa backend, frontend sẽ phải handle nhiều structures:
- Tăng complexity
- Khó maintain
- Dễ bug

---

## 📊 RELATED APIS

Các API khác cũng cần check consistency:

| Endpoint | Expected Response | Status |
|----------|------------------|--------|
| `POST /chat/session` | `{session, is_new}` | ❌ BUG |
| `GET /chat/history` | `{messages[], pagination}` | ❓ Need verify |
| `POST /chat/send` | `{customer_message, bot_responses[]}` | ❓ Need verify |
| `PUT /chat/merge` | `{message, merged_count}` | ❓ Need verify |

**ACTION:** Verify tất cả chat APIs trả về đúng structure.

---

## 🧪 TEST CASES

### **Test 1: New Guest Session**
```bash
POST /chat/session
Body: {"visitor_id": "new-uuid-123"}

Expected: 
{
  "session": {"id": 1, "visitor_id": "new-uuid-123", ...},
  "is_new": true
}
```

### **Test 2: Existing Guest Session**
```bash
POST /chat/session
Body: {"visitor_id": "existing-uuid-456"}

Expected:
{
  "session": {"id": 5, "visitor_id": "existing-uuid-456", ...},
  "is_new": false
}
```

### **Test 3: Logged-in User Session**
```bash
POST /chat/session
Headers: Authorization: Bearer <token>
Body: {"customer_id": 10}

Expected:
{
  "session": {"id": 20, "customer_id": 10, ...},
  "is_new": true
}
```

---

## 📞 CONTACT

**Frontend Team:**
- File: `lib/stores/useChatStore.ts`
- Service: `lib/services/chatService.ts`

**Backend Team:**
- Controller: `src/chat/chat.controller.ts`
- Service: `src/chat/chat.service.ts`

---

## 🎯 PRIORITY

**HIGH** - Blocking chatbot integration

**Required for:**
- ✅ Chat session creation
- ✅ Message persistence
- ✅ History loading
- ✅ Session merging

**Timeline:** Please fix ASAP

---

## 📝 NOTES

Frontend đã implement workaround (fallback mode), nhưng:
- Không ideal
- Mất tính năng persistence
- Cần fix backend ASAP

---

**Bug Report v1.0**  
**Created:** 2024-12-07 17:20  
**Last Updated:** 2024-12-07 17:20
