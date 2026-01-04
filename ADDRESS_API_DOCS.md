# 📍 Address API Documentation

## Base URL
```
http://localhost:3001/api/v1
```

---

## 1. Lấy danh sách Tỉnh/Thành phố

### Endpoint
```http
GET /address/provinces
```

### Response
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

### Frontend Usage
```typescript
const provinces = await fetch('http://localhost:3001/api/v1/address/provinces')
  .then(res => res.json());
```

---

## 2. Lấy danh sách Quận/Huyện theo Tỉnh

### Endpoint
```http
GET /address/districts?province_code={province_code}
```

### Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| province_code | number | Yes | Mã tỉnh/thành phố (từ API provinces) |

### Example Request
```http
GET /address/districts?province_code=1
```

### Response
```json
[
  {
    "code": 1,
    "name": "Quận Ba Đình",
    "name_with_type": "Quận Ba Đình",
    "division_type": "Quận",
    "codename": "ba_dinh",
    "province_code": 1
  },
  {
    "code": 2,
    "name": "Quận Hoàn Kiếm",
    "name_with_type": "Quận Hoàn Kiếm",
    "division_type": "Quận",
    "codename": "hoan_kiem",
    "province_code": 1
  }
]
```

---

## 3. Lấy danh sách Xã/Phường theo Quận

### Endpoint
```http
GET /address/wards?district_code={district_code}
```

### Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| district_code | number | Yes | Mã quận/huyện (từ API districts) |

### Example Request
```http
GET /address/wards?district_code=1
```

### Response
```json
[
  {
    "code": 1,
    "name": "Phường Phúc Xá",
    "name_with_type": "Phường Phúc Xá",
    "division_type": "Phường",
    "codename": "phuc_xa",
    "district_code": 1
  },
  {
    "code": 4,
    "name": "Phường Trúc Bạch",
    "name_with_type": "Phường Trúc Bạch",
    "division_type": "Phường",
    "codename": "truc_bach",
    "district_code": 1
  }
]
```

---

## 4. Reverse Geocoding (GPS → Địa chỉ)

### Endpoint
```http
POST /address/reverse-geocode
```

### Request Body
```json
{
  "latitude": 21.0285,
  "longitude": 105.8542
}
```

### Response
```json
{
  "province": "Hà Nội",
  "district": "Quận Ba Đình",
  "ward": "Phường Ngọc Hà",
  "street_address": "Đường Hoàng Diệu",
  "display_name": "Hoàng Diệu, Ngọc Hà, Ba Đình, Hà Nội, Việt Nam"
}
```

### Frontend Usage
```typescript
const getAddressFromGPS = async (lat: number, lng: number) => {
  const response = await fetch('http://localhost:3001/api/v1/address/reverse-geocode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude: lat, longitude: lng })
  });
  return response.json();
};

// Usage
navigator.geolocation.getCurrentPosition(async (position) => {
  const address = await getAddressFromGPS(
    position.coords.latitude,
    position.coords.longitude
  );
  console.log(address);
});
```

---

## 5. Tạo địa chỉ mới (Account)

### Endpoint
```http
POST /account/addresses
```

### Headers
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Request Body
```json
{
  "province": "Hà Nội",
  "district": "Quận Ba Đình",
  "ward": "Phường Ngọc Hà",
  "street_address": "123 Đường Hoàng Diệu",
  "phone_number": "0901234567",
  "latitude": 21.0285,
  "longitude": 105.8542,
  "address_source": "gps",
  "address_type": "Home",
  "is_default": true
}
```

### Fields

| Field | Type | Required | Description | Values |
|-------|------|----------|-------------|--------|
| province | string | No* | Tỉnh/Thành phố | "Hà Nội", "TP Hồ Chí Minh" |
| district | string | No | Quận/Huyện | "Quận Ba Đình" |
| ward | string | No* | Xã/Phường | "Phường Ngọc Hà" |
| street_address | string | **Yes** | Địa chỉ chi tiết | "123 Đường Hoàng Diệu" |
| phone_number | string | **Yes** | SĐT liên hệ | "0901234567" |
| latitude | number | No | Vĩ độ (GPS) | 21.0285 |
| longitude | number | No | Kinh độ (GPS) | 105.8542 |
| address_source | string | No | Nguồn địa chỉ | "manual" \| "gps" |
| address_type | string | No | Loại địa chỉ | "Home" \| "Office" \| "Other" |
| is_default | boolean | No | Đặt làm mặc định | true \| false |

*Chỉ cần province + ward, district có thể null

### Response
```json
{
  "message": "Địa chỉ đã được thêm",
  "data": {
    "id": "123",
    "customer_id": 1,
    "province": "Hà Nội",
    "district": "Quận Ba Đình",
    "ward": "Phường Ngọc Hà",
    "street_address": "123 Đường Hoàng Diệu",
    "phone_number": "0901234567",
    "latitude": 21.0285,
    "longitude": 105.8542,
    "address_source": "gps",
    "address_type": "Home",
    "is_default": true
  }
}
```

---

## 6. Lấy danh sách địa chỉ

### Endpoint
```http
GET /account/addresses
```

### Headers
```
Authorization: Bearer {access_token}
```

### Response
```json
{
  "data": [
    {
      "id": "123",
      "province": "Hà Nội",
      "district": "Quận Ba Đình",
      "ward": "Phường Ngọc Hà",
      "street_address": "123 Đường Hoàng Diệu",
      "phone_number": "0901234567",
      "address_type": "Home",
      "is_default": true
    }
  ]
}
```

---

## 7. Cập nhật địa chỉ

### Endpoint
```http
PUT /account/addresses/{address_id}
```

### Headers
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Request Body
```json
{
  "province": "Hà Nội",
  "ward": "Phường Điện Biên",
  "street_address": "456 Đường Điện Biên Phủ",
  "phone_number": "0987654321"
}
```

---

## 8. Xóa địa chỉ

### Endpoint
```http
DELETE /account/addresses/{address_id}
```

### Headers
```
Authorization: Bearer {access_token}
```

### Response
```json
{
  "message": "Xóa địa chỉ thành công"
}
```

---

## Frontend Integration Example

### React/Next.js Component

```typescript
import { useState, useEffect } from 'react';

const AddressForm = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [formData, setFormData] = useState({
    province: '',
    district: '',
    ward: '',
    street_address: '',
    phone_number: '',
    address_source: 'manual'
  });

  // Load provinces on mount
  useEffect(() => {
    fetch('http://localhost:3001/api/v1/address/provinces')
      .then(res => res.json())
      .then(data => setProvinces(data));
  }, []);

  // Load districts when province changes
  const handleProvinceChange = async (provinceCode) => {
    const provinceName = provinces.find(p => p.code === provinceCode)?.name;
    setFormData({ ...formData, province: provinceName });
    
    const res = await fetch(`http://localhost:3001/api/v1/address/districts?province_code=${provinceCode}`);
    const data = await res.json();
    setDistricts(data);
  };

  // Load wards when district changes
  const handleDistrictChange = async (districtCode) => {
    const districtName = districts.find(d => d.code === districtCode)?.name;
    setFormData({ ...formData, district: districtName });
    
    const res = await fetch(`http://localhost:3001/api/v1/address/wards?district_code=${districtCode}`);
    const data = await res.json();
    setWards(data);
  };

  // Submit address
  const handleSubmit = async () => {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch('http://localhost:3001/api/v1/account/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    console.log('Address created:', result);
  };

  return (
    <form>
      <select onChange={(e) => handleProvinceChange(e.target.value)}>
        <option>Chọn Tỉnh/Thành phố</option>
        {provinces.map(p => (
          <option key={p.code} value={p.code}>{p.name}</option>
        ))}
      </select>

      <select onChange={(e) => handleDistrictChange(e.target.value)}>
        <option>Chọn Quận/Huyện</option>
        {districts.map(d => (
          <option key={d.code} value={d.code}>{d.name}</option>
        ))}
      </select>

      <select onChange={(e) => {
        const wardName = wards.find(w => w.code === e.target.value)?.name;
        setFormData({ ...formData, ward: wardName });
      }}>
        <option>Chọn Xã/Phường</option>
        {wards.map(w => (
          <option key={w.code} value={w.code}>{w.name}</option>
        ))}
      </select>

      <input
        placeholder="Số nhà, đường..."
        value={formData.street_address}
        onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
      />

      <input
        placeholder="Số điện thoại"
        value={formData.phone_number}
        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
      />

      <button type="button" onClick={handleSubmit}>
        Lưu địa chỉ
      </button>
    </form>
  );
};
```

---

## GPS Integration Example

```typescript
const AddressWithGPS = () => {
  const [address, setAddress] = useState(null);

  const getCurrentLocationAddress = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      
      // Get address from GPS
      const response = await fetch('http://localhost:3001/api/v1/address/reverse-geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude })
      });
      
      const addressData = await response.json();
      
      // Save address
      const token = localStorage.getItem('access_token');
      await fetch('http://localhost:3001/api/v1/account/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          province: addressData.province,
          district: addressData.district,
          ward: addressData.ward,
          street_address: addressData.street_address || 'Chưa xác định',
          phone_number: '0901234567', // User input
          latitude,
          longitude,
          address_source: 'gps'
        })
      });
    });
  };

  return (
    <button onClick={getCurrentLocationAddress}>
      📍 Lấy vị trí hiện tại
    </button>
  );
};
```

---

## Notes

1. **Cấu trúc đơn giản:** Chỉ cần **Tỉnh + Xã/Phường**, `district` có thể null
2. **Free APIs:** Sử dụng provinces.open-api.vn (không cần API key)
3. **GPS Support:** Nominatim OpenStreetMap (free, cần follow usage policy)
4. **Authentication:** Endpoints `/account/*` cần JWT token
5. **CORS:** Backend đã config CORS cho `http://localhost:3000`

---

## Error Handling

```typescript
try {
  const response = await fetch('http://localhost:3001/api/v1/address/provinces');
  if (!response.ok) {
    throw new Error('Failed to fetch provinces');
  }
  const data = await response.json();
  setProvinces(data);
} catch (error) {
  console.error('Error:', error);
  alert('Không thể tải danh sách tỉnh/thành phố');
}
```
