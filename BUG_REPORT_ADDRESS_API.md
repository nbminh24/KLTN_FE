# 🐛 BUG REPORT: Missing Address API Endpoints

**Date:** 2025-12-21  
**Reporter:** Frontend Team  
**Priority:** HIGH  
**Status:** Backend Implementation Required

---

## ✅ RESOLUTION UPDATE (2025-12-21)

**Backend Fixed!** All endpoints now operational:
- ✅ `GET /api/v1/address/provinces` - **Working** (7875 bytes, tested)
- ✅ `GET /api/v1/address/wards?province_code=1` - **Working** (57655 bytes, ~400+ wards)
- ⚠️ `POST /api/v1/address/reverse-geocode` - Ready, awaiting test

**Remaining Steps:**
1. Run SQL migration: `fix-customer-addresses-schema.sql`
2. Test reverse geocoding endpoint (PowerShell)
3. Frontend integration testing

---

## 📋 Original Summary

~~Frontend address form is failing because backend address API endpoints are not implemented. All address-related API calls are returning **404 Not Found**.~~

**UPDATE:** Backend team implemented all endpoints. Issue was missing module restart.

---

## ❌ Current Errors

### 1. Provinces Endpoint
```
GET http://localhost:3001/address/provinces
Status: 404 Not Found
```

### 2. Wards Endpoint
```
GET http://localhost:3001/address/wards?province_code=1
Status: 404 Not Found
```

### 3. Reverse Geocoding Endpoint
```
POST http://localhost:3001/address/reverse-geocode
Status: 404 Not Found
```

---

## 📝 Required Implementation

Backend team needs to implement **3 endpoints** as documented in `ADDRESS_API_DOCS.md`:

### 1️⃣ GET /address/provinces
**Purpose:** Get list of all provinces/cities

**Expected Response:**
```json
[
  {
    "code": 1,
    "name": "Thành phố Hà Nội",
    "name_with_type": "Thành phố Hà Nội",
    "division_type": "Thành phố Trung ương",
    "codename": "ha_noi"
  },
  {
    "code": 79,
    "name": "Thành phố Hồ Chí Minh",
    "name_with_type": "Thành phố Hồ Chí Minh",
    "division_type": "Thành phố Trung ương",
    "codename": "ho_chi_minh"
  }
]
```

---

### 2️⃣ GET /address/wards?province_code={code}
**Purpose:** Get wards/communes by province (post-merger structure, no districts)

**Parameters:**
- `province_code` (number, required): Province code from `/address/provinces`

**Example Request:**
```
GET /address/wards?province_code=1
```

**Expected Response:**
```json
[
  {
    "code": 1,
    "name": "Phường Phúc Xá",
    "name_with_type": "Phường Phúc Xá",
    "division_type": "Phường",
    "codename": "phuc_xa",
    "province_code": 1
  },
  {
    "code": 4,
    "name": "Phường Trúc Bạch",
    "name_with_type": "Phường Trúc Bạch",
    "division_type": "Phường",
    "codename": "truc_bach",
    "province_code": 1
  }
]
```

**Note:** After administrative merger 7/2025, structure is Province → Ward (no districts).

---

### 3️⃣ POST /address/reverse-geocode
**Purpose:** Convert GPS coordinates to address

**Request Body:**
```json
{
  "latitude": 21.0285,
  "longitude": 105.8542
}
```

**Expected Response:**
```json
{
  "province": "Hà Nội",
  "district": null,
  "ward": "Phường Ngọc Hà",
  "street_address": "Đường Hoàng Diệu",
  "display_name": "Hoàng Diệu, Ngọc Hà, Hà Nội, Việt Nam"
}
```

---

## 🔧 Implementation Notes

### Data Source
Use **provinces.open-api.vn** (free, no API key required):
- Provinces: `https://provinces.open-api.vn/api/p/`
- Districts: `https://provinces.open-api.vn/api/p/{province_code}?depth=2`
- Wards: `https://provinces.open-api.vn/api/d/{district_code}?depth=2`

### Reverse Geocoding
Use **Nominatim OpenStreetMap** (free):
```
https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&accept-language=vi
```

**IMPORTANT:** Follow Nominatim usage policy:
- Add `User-Agent` header
- Rate limit: max 1 request/second
- Cache results

### Post-merger Structure (7/2025)
- Old structure: Province → District → Ward
- **New structure: Province → Ward** (districts eliminated in administrative reform)
- Backend should return wards directly by province code
- `district` field can be `null` in responses

---

## 🎯 Frontend Integration Status

Frontend is **READY** and waiting for backend:
- ✅ `addressService.ts` created with API calls
- ✅ `AddressForm.tsx` component with GPS + cascading selects
- ✅ Shadcn UI select components integrated
- ✅ Error handling implemented
- ❌ **BLOCKED:** All endpoints return 404

---

## 📊 User Flow (Once Implemented)

1. User clicks "Add New Address"
2. User can choose:
   - **GPS Mode:** Click "Lấy vị trí" → auto-fill province/ward
   - **Manual Mode:** Select Province → Select Ward → Enter street address
3. Submit → Save to database

---

## 🚨 Impact

**Severity:** HIGH  
**Blocker:** YES  

Address management feature is **completely non-functional** until backend implements these endpoints. Users cannot:
- Add new addresses
- Edit existing addresses with new structure
- Use GPS auto-fill

---

## ✅ Acceptance Criteria

Backend implementation is complete when:
- [ ] `GET /address/provinces` returns array of provinces
- [ ] `GET /address/wards?province_code=X` returns wards for given province
- [ ] `POST /address/reverse-geocode` returns address from GPS coordinates
- [ ] All endpoints return proper HTTP status codes (200, 400, 404, 500)
- [ ] CORS configured for `http://localhost:3000`
- [ ] Error responses follow API standard format

---

## 📚 Reference Documents

1. **ADDRESS_API_DOCS.md** - Complete API specification
2. **Frontend Code:**
   - `lib/services/addressService.ts` - API client
   - `components/AddressForm.tsx` - Form component
   - `lib/services/accountService.ts` - Address data model

---

## 👥 Next Steps

**Backend Team:**
1. Review `ADDRESS_API_DOCS.md`
2. Implement 3 endpoints
3. Test with Postman/curl
4. Deploy to `http://localhost:3001`
5. Notify frontend team

**Frontend Team:**
- Waiting for backend implementation
- Will test immediately upon deployment

---

**Contact:** Frontend Lead  
**Estimated Backend Effort:** 4-6 hours  
**Blocking:** Address Management Feature
