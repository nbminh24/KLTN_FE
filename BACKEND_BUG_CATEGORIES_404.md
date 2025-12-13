# 🐛 BACKEND BUG REPORT - Categories API 404 Error

**Reporter:** Frontend Team  
**Date:** 13/12/2025  
**Priority:** HIGH  
**Affected Feature:** Product Filters - Category Selection

---

## 📋 Bug Description

API endpoint `/api/v1/categories/all` đang trả về **404 Not Found** error.

---

## 🔍 Current Behavior

**Request:**
```
GET http://localhost:3001/api/v1/categories/all
```

**Response:**
```
Status: 404 Not Found
Error: Resource not found
```

**Error Stack:**
```
AxiosError: Request failed with status code 404
    at fetchFilterOptions (app\products\page.tsx:50:52)
```

---

## ✅ Expected Behavior

Theo `PUBLIC_API_ENDPOINTS.md`:

```
GET /api/v1/categories/all

Response:
[
  {
    "id": 1,
    "name": "Áo Sơ Mi",
    "slug": "ao-so-mi",
    "status": "active"
  }
]
```

---

## 📁 Affected Files

- **Frontend:** `lib/services/filterService.ts` line 49
- **API Spec:** `PUBLIC_API_ENDPOINTS.md` line 11-25

---

## 🔧 Request to Backend Team

1. ✅ Kiểm tra xem endpoint `/api/v1/categories/all` đã được implement chưa?
2. ✅ Nếu chưa, vui lòng implement theo spec trong `PUBLIC_API_ENDPOINTS.md`
3. ✅ Nếu đã implement nhưng path khác, vui lòng thông báo path chính xác
4. ✅ Deploy endpoint lên server development

---

## 🚧 Temporary Workaround

Frontend sẽ tạm thời:
- Catch error và hiển thị empty categories
- Log warning thay vì crash app
- Cho phép user vẫn filter theo colors/sizes/price/rating

---

## 📝 Notes

**Related APIs working fine:**
- ✅ `/api/v1/colors/all` - OK
- ✅ `/api/v1/sizes/all` - OK
- ❌ `/api/v1/categories/all` - 404

**Impact:** 
- User không thể filter theo category trong Products page
- Các filter khác vẫn hoạt động bình thường
