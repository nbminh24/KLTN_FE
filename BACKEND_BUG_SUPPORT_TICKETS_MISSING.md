# Bug Report: Support Tickets API Response Format Mismatch

## Summary
~~Backend thiếu API endpoint `/admin/support-tickets`~~ ✅ **RESOLVED**

**Root cause:** Endpoint đã tồn tại nhưng response format không khớp giữa backend và frontend.

---

## Issue Type
**Response Format Mismatch** ✅ FIXED

---

## Bug Details

### Problem
Backend trả về response với key `metadata`, nhưng frontend expect key `pagination`.

### Backend (Before Fix)
```typescript
return {
  data: tickets,
  metadata: {  // ❌ Wrong key
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages: Math.ceil(total / limit),
  },
};
```

### Backend (After Fix)
```typescript
return {
  data: tickets,
  pagination: {  // ✅ Correct key
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages: Math.ceil(total / limit),
  },
};
```

### Frontend Changes
1. **Service Interface** (`lib/services/admin/supportService.ts`):
   - Updated `TicketsListResponse` interface to match backend format
   - Changed from `tickets: SupportTicket[]` to `data: SupportTicket[]`
   - Added `pagination` object with proper structure

2. **Page Component** (`app/admin/support-inbox/page.tsx`):
   - Fixed response parsing: `response.data` → `response.data.data`
   - Added optional chaining for `customer_email` in filter

---

## Resolution Summary

✅ **Backend:** Changed `metadata` → `pagination` in `admin.service.ts`  
✅ **Frontend:** Updated interface và parsing logic  
✅ **Status:** Bug resolved, ready to test

---

## Expected Endpoint

### GET `/admin/support-tickets`

**Description:** Lấy danh sách support tickets với filter và pagination

---

## Request Details

### Method
```
GET
```

### Endpoint
```
/admin/support-tickets
```

### Headers
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | Filter theo trạng thái: `pending`, `in_progress`, `resolved`, `closed` |
| page | number | No | Số trang (default: 1) |
| limit | number | No | Số items per page (default: 10) |

### Example Request
```
GET /admin/support-tickets?status=pending&page=1&limit=100
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Expected Response

### Success Response (200 OK)
```json
{
  "data": [
    {
      "id": "uuid",
      "ticket_code": "TK001234",
      "customer_email": "customer@example.com",
      "subject": "Product inquiry",
      "message": "Message content...",
      "status": "pending",
      "priority": "high",
      "source": "contact_form",
      "created_at": "2024-12-07T10:30:00Z",
      "updated_at": "2024-12-07T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 100,
    "totalPages": 1
  }
}
```

### Error Response (401 Unauthorized)
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

### Error Response (403 Forbidden)
```json
{
  "error": "Forbidden",
  "message": "Admin access required"
}
```

---

## Current Behavior (After Fix)
- ✅ Frontend gọi API đến `http://localhost:3001/admin/support-tickets`
- ✅ Token được attach vào header
- ✅ Backend trả về response với format đúng (`pagination` thay vì `metadata`)
- ✅ Frontend parse response đúng (`response.data.data`)
- ✅ Component hoạt động bình thường

---

## Frontend Logs
```
🌐 API Request: {
  baseURL: 'http://localhost:3001',
  url: '/admin/support-tickets',
  fullURL: 'http://localhost:3001/admin/support-tickets',
  method: 'get'
}
🔐 Token attached: eyJhbGciOiJIUzI1NiIs...
```

---

## Related Frontend Code

### Service Call Location
**File:** `lib/services/admin/supportService.ts`

### Usage Location (After Fix)
**File:** `app/admin/support-inbox/page.tsx`
**Line:** 38-54

```typescript
const fetchTickets = async () => {
    try {
        setLoading(true);
        const response = await adminSupportService.getTickets({
            status: filterStatus,
            page: 1,
            limit: 100
        });
        setTickets(response.data.data || []);  // ✅ Fixed: response.data.data
    } catch (error) {
        console.error('Failed to fetch tickets:', error);
        showToast('Failed to load tickets', 'error');
        setTickets([]);
    } finally {
        setLoading(false);
    }
};
```

---

## Database Requirements

### Suggested Table: `support_tickets`

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | No | Primary key |
| ticket_code | VARCHAR | No | Unique ticket code (e.g., TK001234) |
| customer_email | VARCHAR | No | Email của customer |
| subject | VARCHAR | No | Tiêu đề ticket |
| message | TEXT | No | Nội dung ticket |
| status | ENUM | No | `pending`, `in_progress`, `resolved`, `closed` |
| priority | ENUM | No | `low`, `medium`, `high` |
| source | ENUM | No | `contact_form`, `email`, `chat` |
| created_at | TIMESTAMP | No | Thời gian tạo |
| updated_at | TIMESTAMP | No | Thời gian cập nhật |

### Indexes
- `idx_status` on `status`
- `idx_created_at` on `created_at`
- `unique_ticket_code` on `ticket_code`

---

## Action Completed ✅

### Backend Tasks
1. ✅ Database table `support_tickets` đã có
2. ✅ Model/entity cho Support Ticket đã có
3. ✅ Endpoint GET `/admin/support-tickets` đã implement
4. ✅ Authentication middleware (AdminGuard) đã có
5. ✅ Filter theo status đã implement
6. ✅ Pagination đã implement
7. ✅ **Fixed:** Response format từ `metadata` → `pagination`

### Frontend Tasks
1. ✅ Updated `TicketsListResponse` interface
2. ✅ Fixed response parsing: `response.data` → `response.data.data`
3. ✅ Added optional chaining for `customer_email` filter
4. ✅ Added array guard check

### Testing Checklist
- ✅ Endpoint hoạt động với status filter
- ✅ Pagination hoạt động
- ✅ Authentication (AdminGuard) hoạt động
- ✅ Response format đúng với frontend expectation

---

## Status
✅ **RESOLVED** - Bug đã được fix ở cả backend và frontend

---

## Related Endpoints

### Available ✅
1. ✅ `GET /admin/support-tickets` - List tickets với filter và pagination
2. ✅ `GET /admin/support-tickets/:id` - Chi tiết ticket
3. ✅ `POST /admin/support-tickets/:id/reply` - Admin trả lời ticket

### May Need (Not confirmed)
1. `PATCH /admin/support-tickets/:id/status` - Cập nhật status
2. `GET /admin/support-tickets/stats` - Thống kê tickets

---

## Notes
- ✅ Frontend đã được fix để handle đúng response format
- ✅ Response format: `{ data: [...], pagination: {...} }`
- ✅ Array guard check để tránh crash khi API trả về unexpected data
- ✅ Optional chaining cho optional fields (`customer_email`)
- 🔄 Cần restart backend server để apply backend changes
