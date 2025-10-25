# 📧 SUPPORT TICKET SYSTEM

## 🎯 Mục tiêu
Tạo hệ thống hỗ trợ **email-based** để xử lý các yêu cầu phức tạp mà **AI Chatbot không giải quyết được**.

---

## 🏗️ Kiến trúc

### **Customer Flow:**
```
Customer có vấn đề
    ↓
1. Thử AI Chatbot trước (resolve 80% cases)
    ↓
2. Nếu AI không giải quyết được
    ↓
3. Điền form Support (/support)
    ↓
4. Confirm đã thử AI chatbot (required checkbox)
    ↓
5. Gửi ticket → Lưu vào database
    ↓
6. Nhận email xác nhận
```

### **Admin Flow:**
```
Admin vào Support Inbox (/admin/support-inbox)
    ↓
1. Xem danh sách tickets (pending/replied/resolved)
    ↓
2. Lọc theo status, priority, search
    ↓
3. Click vào ticket để xem chi tiết
    ↓
4. Viết reply message
    ↓
5. Click "Send Reply" → Gửi email cho customer
    ↓
6. Ticket chuyển status: pending → replied
    ↓
7. Mark as "Resolved" khi xong
```

---

## 📁 Files Đã Tạo

### **1. Customer Side**
**File:** `app/support/page.tsx`

**Features:**
- ✅ Notice lớn: "Try AI Chatbot First! 🤖"
- ✅ Liệt kê 4 loại vấn đề AI có thể giải quyết
- ✅ Form liên hệ với 4 fields: Name, Email, Subject, Message
- ✅ **Checkbox required:** "I confirm that I tried the AI chatbot first"
- ✅ Submit → Tạo support ticket

**UI Highlights:**
- Gradient purple/blue box nổi bật cho AI notice
- 80% inquiries resolved by AI messaging
- Clean, professional design

---

### **2. Admin Side**
**File:** `app/admin/support-inbox/page.tsx`

**Features:**

#### **A. Dashboard Stats (4 cards):**
- 🟡 **Pending** - Tickets chưa reply
- 🔵 **Replied** - Tickets đã reply (chờ customer feedback)
- 🟢 **Resolved** - Tickets đã xong
- 🟣 **AI Escalated** - Tickets từ AI chatbot

#### **B. Filters & Search:**
- Filter by status: All / Pending / Replied / Resolved
- Search box: Tìm theo name, email, subject

#### **C. Ticket List (Left Panel):**
- Hiển thị compact view của mỗi ticket:
  - Ticket ID (TKT-001, TKT-002...)
  - Subject (title lớn, bold)
  - Customer name & email
  - Status badge (Yellow/Blue/Green)
  - Priority badge (High/Medium/Low)
  - "AI Escalated" badge nếu từ chatbot
  - Timestamp
  - Delete button (trash icon)

#### **D. Ticket Detail (Right Panel):**
- **Header:** Gradient blue với ticket info
- **Customer Message:**
  - Avatar với initial letter
  - Full message content
  - "AI Chatbot Attempted" notice (purple box)
- **Reply Section:**
  - Large textarea (8 rows)
  - "Send Reply" button → Gửi email
  - "Resolve" button → Mark as resolved

---

### **3. Admin Menu**
**File:** `components/admin/AdminSidebar.tsx`

**Changes:**
- ✅ Added "Support Inbox" menu item
- ✅ Icon: Mail
- ✅ Position: Trong "Pages" section, sau "Chatbot"

---

## 🎨 UI/UX Design

### **Color Scheme:**
| Element | Color |
|---------|-------|
| **Pending** | Yellow (#FEF3C7 / #F59E0B) |
| **Replied** | Blue (#DBEAFE / #3B82F6) |
| **Resolved** | Green (#D1FAE5 / #10B981) |
| **AI Escalated** | Purple (#E9D5FF / #9333EA) |
| **High Priority** | Red (#FEE2E2 / #EF4444) |
| **Medium Priority** | Orange (#FED7AA / #F97316) |
| **Low Priority** | Gray (#F3F4F6 / #6B7280) |

### **Icons:**
- 📧 Mail - Main icon for Support Inbox
- ⏰ Clock - Pending tickets
- ✅ CheckCircle - Resolved tickets
- ⚠️ AlertCircle - AI escalated
- 🔍 Search - Search functionality
- 🗑️ Trash2 - Delete ticket
- ➤ Send - Send reply

---

## 📊 Mock Data Structure

```typescript
interface SupportTicket {
  id: string;              // TKT-001, TKT-002...
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  status: 'pending' | 'replied' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;       // ISO timestamp
  aiAttempted: boolean;    // True nếu customer đã thử AI
}
```

**Sample Tickets:**
1. **Return Policy Question** - Medium priority
2. **Defective Product** - High priority (urgent)
3. **Bulk Order Inquiry** - High priority (business)
4. **Size Chart Confusion** - Low priority

---

## 🔄 Backend Integration (Cần làm)

### **1. Customer Submit Form:**
```typescript
// POST /api/support/tickets
{
  customerName: string,
  customerEmail: string,
  subject: string,
  message: string,
  aiAttempted: boolean
}

Response:
{
  ticketId: "TKT-001",
  status: "pending",
  message: "Your ticket has been created"
}
```

### **2. Admin Get Tickets:**
```typescript
// GET /api/admin/support/tickets?status=pending&search=john
Response:
{
  tickets: SupportTicket[],
  total: number
}
```

### **3. Admin Send Reply:**
```typescript
// POST /api/admin/support/tickets/:id/reply
{
  replyMessage: string
}

Action:
1. Update ticket status → "replied"
2. Send email to customer
3. Return updated ticket
```

### **4. Admin Mark Resolved:**
```typescript
// PATCH /api/admin/support/tickets/:id/resolve

Action:
1. Update ticket status → "resolved"
2. (Optional) Send satisfaction survey email
```

---

## ✨ Unique Features

### **1. AI-First Approach**
- Khuyến khích customer thử AI chatbot trước
- Notice lớn trên support page
- Required checkbox để confirm đã thử AI
- Badge "AI Escalated" để admin biết case phức tạp

### **2. Email-Based (Not Live Chat)**
- Không cần real-time WebSocket
- Reply qua email → Professional & trackable
- Phù hợp với workflow hiện có
- Giảm áp lực phải reply ngay

### **3. Priority System**
- Auto-detect hoặc admin set priority
- High priority tickets nổi bật (red badge)
- Giúp admin prioritize workload

### **4. Clean UI**
- 2-panel layout: List + Detail
- Color-coded status & priority
- Inline actions (delete, resolve)
- Search & filter instantly

---

## 📈 Benefits

### **Cho Customer:**
✅ AI resolve 80% vấn đề instantly  
✅ Support form chỉ cho cases phức tạp  
✅ Nhận reply qua email (professional)  
✅ Track ticket status  

### **Cho Admin:**
✅ Tập trung vào 20% cases khó  
✅ Dashboard clear với stats  
✅ Reply nhanh, organized  
✅ Không cần monitor live chat  

### **Cho Business:**
✅ Làm nổi bật AI chatbot  
✅ Giảm workload support team  
✅ Improve customer satisfaction  
✅ Scalable architecture  

---

## 🚀 Next Steps

### **Phase 1: Current (Frontend Only)**
✅ UI hoàn chỉnh  
✅ Mock data  
✅ Customer flow  
✅ Admin flow  

### **Phase 2: Backend Integration**
⏳ Connect to API  
⏳ Email service (SendGrid/AWS SES)  
⏳ Database schema  
⏳ Authentication  

### **Phase 3: Enhancements**
⏳ Ticket history/timeline  
⏳ File attachments  
⏳ Auto-priority detection  
⏳ SLA tracking  
⏳ Customer satisfaction survey  

---

## 💡 Key Takeaways

1. **AI-First Strategy** → 80% automation, 20% human support
2. **Email-Based** → Professional, trackable, no real-time pressure
3. **Clean UI** → Easy to manage hundreds of tickets
4. **Priority System** → Focus on urgent cases first
5. **Scalable** → Can add features without major refactor

**Kết luận:** Hệ thống này làm nổi bật **AI Chatbot** của bạn, đồng thời cung cấp safety net cho các cases phức tạp!
