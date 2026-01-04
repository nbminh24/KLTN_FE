# 📍 API Địa Chỉ Việt Nam - Frontend Integration Guide

**Version:** 2.0 - NSO/CASSO API (Cấu trúc 2 cấp: Tỉnh → Xã)  
**Last Updated:** 21/12/2025  
**Base URL:** `http://localhost:3001/api/v1`

---

## 🎯 Tổng Quan

### Cấu Trúc Mới (Sau Sáp Nhập 7/2025)
- ✅ **Tỉnh/Thành phố** → **Xã/Phường** (2 cấp)
- ❌ Không còn Quận/Huyện (đã sáp nhập)
- 📊 Dữ liệu từ **Cục Thống Kê** (NSO)
- 🔄 Auto-update hằng ngày
- 📅 Hỗ trợ tra cứu theo thời điểm (effectiveDate)

---

## 📋 Danh Sách API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/address/provinces` | Lấy danh sách tỉnh/thành phố |
| `GET` | `/address/wards` | Lấy danh sách xã/phường theo tỉnh |
| `POST` | `/address/reverse-geocode` | Chuyển GPS thành địa chỉ |

---

## 1️⃣ GET /address/provinces

### Mô tả
Lấy danh sách tất cả tỉnh/thành phố tại Việt Nam.

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `effectiveDate` | string | No | `latest` | Ngày hiệu lực: `latest` hoặc `YYYY-MM-DD` |

### Request Example
```bash
GET /api/v1/address/provinces?effectiveDate=latest
```

### Response Example
```json
[
  {
    "code": "01",
    "name": "Thành phố Hà Nội",
    "englishName": "",
    "administrativeLevel": "Thành phố Trung ương",
    "decree": ""
  },
  {
    "code": "79",
    "name": "Thành phố Hồ Chí Minh",
    "englishName": "",
    "administrativeLevel": "Thành phố Trung ương",
    "decree": "202/2025/QH15 - 12/06/2025"
  },
  {
    "code": "48",
    "name": "Thành phố Đà Nẵng",
    "englishName": "",
    "administrativeLevel": "Thành phố Trung ương",
    "decree": "202/2025/QH15 - 12/06/2025"
  }
]
```

### TypeScript Interface
```typescript
interface Province {
  code: string;                // "01", "79", "48"...
  name: string;                // "Thành phố Hà Nội"
  englishName?: string;        // English name (optional)
  administrativeLevel?: string; // "Thành phố Trung ương", "Tỉnh"
  decree?: string;             // "202/2025/QH15 - 12/06/2025"
}
```

### Frontend Code
```typescript
// Fetch provinces
const fetchProvinces = async (): Promise<Province[]> => {
  const response = await fetch(
    'http://localhost:3001/api/v1/address/provinces?effectiveDate=latest'
  );
  return response.json();
};

// React hook
const useProvinces = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  
  useEffect(() => {
    fetchProvinces().then(setProvinces);
  }, []);
  
  return provinces;
};
```

---

## 2️⃣ GET /address/wards

### Mô tả
Lấy danh sách tất cả xã/phường thuộc một tỉnh/thành phố.

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `province_code` | string | **Yes** | - | Mã tỉnh (ví dụ: "01", "79") |
| `effectiveDate` | string | No | `latest` | Ngày hiệu lực: `latest` hoặc `YYYY-MM-DD` |

### Request Example
```bash
GET /api/v1/address/wards?province_code=01&effectiveDate=latest
```

### Response Example
```json
[
  {
    "code": "00004",
    "name": "Phường Ba Đình",
    "englishName": "",
    "administrativeLevel": "Phường",
    "provinceCode": "01",
    "provinceName": "Thành phố Hà Nội",
    "decree": "Số: 1656/NQ-UBTVQH15; Ngày: 16/06/2025"
  },
  {
    "code": "00008",
    "name": "Phường Ngọc Hà",
    "englishName": "Lieu Giai Commune",
    "administrativeLevel": "Phường",
    "provinceCode": "01",
    "provinceName": "Thành phố Hà Nội",
    "decree": "Số: 1656/NQ-UBTVQH15; Ngày: 16/06/2025"
  },
  {
    "code": "00376",
    "name": "Xã Sóc Sơn",
    "englishName": "",
    "administrativeLevel": "Xã",
    "provinceCode": "01",
    "provinceName": "Thành phố Hà Nội",
    "decree": "Số: 1656/NQ-UBTVQH15; Ngày: 16/06/2025"
  }
]
```

### TypeScript Interface
```typescript
interface Commune {
  code: string;                // "00004", "00008"...
  name: string;                // "Phường Ba Đình", "Xã Sóc Sơn"
  englishName?: string;        // English name (optional)
  administrativeLevel?: string; // "Phường", "Xã", "Thị trấn"
  provinceCode?: string;       // "01"
  provinceName?: string;       // "Thành phố Hà Nội"
  decree?: string;             // Decree info
}
```

### Frontend Code
```typescript
// Fetch communes by province
const fetchCommunes = async (provinceCode: string): Promise<Commune[]> => {
  const response = await fetch(
    `http://localhost:3001/api/v1/address/wards?province_code=${provinceCode}&effectiveDate=latest`
  );
  return response.json();
};

// React hook
const useCommunes = (provinceCode: string) => {
  const [communes, setCommunes] = useState<Commune[]>([]);
  
  useEffect(() => {
    if (provinceCode) {
      fetchCommunes(provinceCode).then(setCommunes);
    }
  }, [provinceCode]);
  
  return communes;
};
```

---

## 3️⃣ POST /address/reverse-geocode

### Mô tả
Chuyển đổi tọa độ GPS (latitude, longitude) thành địa chỉ.

### Request Body
```json
{
  "latitude": 21.0285,
  "longitude": 105.8542
}
```

### Request Example
```bash
POST /api/v1/address/reverse-geocode
Content-Type: application/json

{
  "latitude": 21.0285,
  "longitude": 105.8542
}
```

### Response Example
```json
{
  "province": "Hà Nội",
  "district": "Phường Hoàn Kiếm",
  "ward": null,
  "street_address": "79, Phố Đinh Tiên Hoàng",
  "display_name": "Uỷ ban nhân dân thành phố Hà Nội, 79, Phố Đinh Tiên Hoàng, Phường Hoàn Kiếm, Hà Nội, 10140, Việt Nam"
}
```

### TypeScript Interface
```typescript
interface ReverseGeocodeRequest {
  latitude: number;   // 21.0285
  longitude: number;  // 105.8542
}

interface ReverseGeocodeResponse {
  province: string | null;      // "Hà Nội"
  district: string | null;      // "Phường Hoàn Kiếm" (legacy, có thể null)
  ward: string | null;          // "Phường Ngọc Hà" (có thể null)
  street_address: string | null; // "79, Phố Đinh Tiên Hoàng"
  display_name: string;         // Full address string
}
```

### Frontend Code
```typescript
// Reverse geocode
const reverseGeocode = async (
  lat: number, 
  lng: number
): Promise<ReverseGeocodeResponse> => {
  const response = await fetch(
    'http://localhost:3001/api/v1/address/reverse-geocode',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: lat, longitude: lng })
    }
  );
  return response.json();
};

// Get current location address
const getCurrentLocationAddress = async () => {
  return new Promise<ReverseGeocodeResponse>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const address = await reverseGeocode(
          position.coords.latitude,
          position.coords.longitude
        );
        resolve(address);
      },
      (error) => reject(error)
    );
  });
};
```

---

## 🎨 UI Component Examples

### 1. Address Form (React + TailwindCSS)

```tsx
import { useState, useEffect } from 'react';

interface AddressFormProps {
  onSubmit: (address: Address) => void;
}

interface Address {
  province: string;
  provinceCode: string;
  commune: string;
  communeCode: string;
  street_address: string;
  phone_number: string;
}

export const AddressForm: React.FC<AddressFormProps> = ({ onSubmit }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [formData, setFormData] = useState<Address>({
    province: '',
    provinceCode: '',
    commune: '',
    communeCode: '',
    street_address: '',
    phone_number: '',
  });

  // Load provinces on mount
  useEffect(() => {
    fetch('http://localhost:3001/api/v1/address/provinces?effectiveDate=latest')
      .then(res => res.json())
      .then(setProvinces);
  }, []);

  // Load communes when province changes
  useEffect(() => {
    if (selectedProvince) {
      fetch(`http://localhost:3001/api/v1/address/wards?province_code=${selectedProvince}&effectiveDate=latest`)
        .then(res => res.json())
        .then(setCommunes);
    }
  }, [selectedProvince]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const province = provinces.find(p => p.code === code);
    
    setSelectedProvince(code);
    setFormData({
      ...formData,
      provinceCode: code,
      province: province?.name || '',
      commune: '',
      communeCode: '',
    });
    setCommunes([]);
  };

  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const commune = communes.find(c => c.code === code);
    
    setFormData({
      ...formData,
      communeCode: code,
      commune: commune?.name || '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Province Select */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Tỉnh/Thành phố *
        </label>
        <select
          value={selectedProvince}
          onChange={handleProvinceChange}
          required
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Chọn tỉnh/thành phố</option>
          {provinces.map(p => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Commune Select */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Xã/Phường *
        </label>
        <select
          value={formData.communeCode}
          onChange={handleCommuneChange}
          required
          disabled={!selectedProvince}
          className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
        >
          <option value="">Chọn xã/phường</option>
          {communes.map(c => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Street Address */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Số nhà, tên đường *
        </label>
        <input
          type="text"
          value={formData.street_address}
          onChange={e => setFormData({ ...formData, street_address: e.target.value })}
          required
          placeholder="Ví dụ: 123 Đường Hoàng Diệu"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Số điện thoại *
        </label>
        <input
          type="tel"
          value={formData.phone_number}
          onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
          required
          placeholder="0901234567"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Lưu địa chỉ
      </button>
    </form>
  );
};
```

### 2. GPS Location Picker

```tsx
import { useState } from 'react';
import { MapPin } from 'lucide-react';

export const GPSLocationPicker = ({ onLocationSelect }) => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode
      const response = await fetch(
        'http://localhost:3001/api/v1/address/reverse-geocode',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude, longitude })
        }
      );

      const addressData = await response.json();
      setAddress(addressData);
      onLocationSelect({ latitude, longitude, ...addressData });
    } catch (error) {
      alert('Không thể lấy vị trí: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleGetCurrentLocation}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
      >
        <MapPin size={20} />
        {loading ? 'Đang lấy vị trí...' : 'Lấy vị trí hiện tại'}
      </button>

      {address && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="font-medium">Địa chỉ đã phát hiện:</p>
          <p className="text-sm text-gray-600 mt-1">{address.display_name}</p>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>
              <span className="text-gray-500">Tỉnh:</span> {address.province}
            </div>
            <div>
              <span className="text-gray-500">Đường:</span> {address.street_address || 'N/A'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 📊 Integration với Account API

### Tạo địa chỉ mới
```typescript
interface CreateAddressPayload {
  province: string;           // "Thành phố Hà Nội"
  district?: string | null;   // null (không dùng nữa)
  ward: string;               // "Phường Ba Đình"
  street_address: string;     // "123 Đường Hoàng Diệu"
  phone_number: string;       // "0901234567"
  latitude?: number;          // 21.0285 (optional)
  longitude?: number;         // 105.8542 (optional)
  address_source?: 'manual' | 'gps';
  address_type?: 'Home' | 'Office' | 'Other';
  is_default?: boolean;
}

const createAddress = async (payload: CreateAddressPayload) => {
  const response = await fetch('http://localhost:3001/api/v1/account/addresses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  return response.json();
};
```

---

## 🔍 Notes & Best Practices

### 1. Caching
```typescript
// Cache provinces (rarely change)
const PROVINCES_CACHE_KEY = 'provinces_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const getCachedProvinces = async (): Promise<Province[]> => {
  const cached = localStorage.getItem(PROVINCES_CACHE_KEY);
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  
  const provinces = await fetchProvinces();
  localStorage.setItem(PROVINCES_CACHE_KEY, JSON.stringify({
    data: provinces,
    timestamp: Date.now()
  }));
  
  return provinces;
};
```

### 2. Error Handling
```typescript
const fetchWithErrorHandling = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

### 3. TypeScript Types File
```typescript
// types/address.ts
export interface Province {
  code: string;
  name: string;
  englishName?: string;
  administrativeLevel?: string;
  decree?: string;
}

export interface Commune {
  code: string;
  name: string;
  englishName?: string;
  administrativeLevel?: string;
  provinceCode?: string;
  provinceName?: string;
  decree?: string;
}

export interface ReverseGeocodeRequest {
  latitude: number;
  longitude: number;
}

export interface ReverseGeocodeResponse {
  province: string | null;
  district: string | null;
  ward: string | null;
  street_address: string | null;
  display_name: string;
}

export interface Address {
  id?: string;
  province: string;
  district?: string | null;
  ward: string;
  street_address: string;
  phone_number: string;
  latitude?: number;
  longitude?: number;
  address_source?: 'manual' | 'gps';
  address_type?: 'Home' | 'Office' | 'Other';
  is_default?: boolean;
}
```

---

## ✅ Checklist Integration

- [ ] Setup types/interfaces
- [ ] Implement API calls
- [ ] Add caching layer
- [ ] Build address form component
- [ ] Add GPS location picker
- [ ] Test with real data
- [ ] Handle errors gracefully
- [ ] Add loading states

---

## 📞 Support

**Backend API:** http://localhost:3001  
**Data Source:** NSO/CASSO (https://addresskit.cas.so)  
**Update Frequency:** Daily  
**Contact:** Backend Team
