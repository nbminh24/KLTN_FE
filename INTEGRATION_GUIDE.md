# Frontend Integration Guide

**Using DB Schema + API Services in Components**

This guide shows how to integrate the API Service Layer with UI components using both `API_INVENTORY.md` and `DB_SCHEMA.md` as sources of truth.

---

## 📚 Sources of Truth

1. **`DB_SCHEMA.md`** - Data types, enums, constraints, relationships
2. **`API_INVENTORY.md`** - Endpoints, request/response formats
3. **`lib/types/`** - TypeScript types matching DB schema exactly
4. **`lib/services/`** - API service methods

---

## 🎯 Integration Principles

### 1. Use DB-Aligned Types
Import types from `lib/types/models.ts` and enums from `lib/types/enums.ts`:

```typescript
import { 
  Product, 
  ProductVariant, 
  Order, 
  CartItem 
} from '@/lib/types/models';

import { 
  ProductStatus, 
  OrderFulfillmentStatus,
  PaymentMethod 
} from '@/lib/types/enums';
```

### 2. Match DB Constraints in Forms
Use DB constraints to build validation rules:

```typescript
// DB: quantity integer NOT NULL CHECK (quantity > 0)
<Input
  type="number"
  min={1}
  required
  name="quantity"
/>

// DB: rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5)
<Input
  type="number"
  min={1}
  max={5}
  required
  name="rating"
/>

// DB: email character varying NOT NULL UNIQUE
<Input
  type="email"
  required
  name="email"
  // Handle 409 Conflict error for duplicate email
/>
```

### 3. Use Enums Instead of Magic Strings

**❌ Bad - Magic Strings:**
```typescript
if (order.fulfillment_status === 'pending') {
  // Easy to make typos: 'Pending', 'PENDING', 'pending '
}
```

**✅ Good - Type-Safe Enums:**
```typescript
import { OrderFulfillmentStatus } from '@/lib/types/enums';

if (order.fulfillment_status === OrderFulfillmentStatus.PENDING) {
  // TypeScript autocomplete + compile-time checking
}
```

---

## 📦 Example Integrations

### Example 1: Product List Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { productService } from '@/lib/services';
import { Product } from '@/lib/types/models';
import { ProductStatus } from '@/lib/types/enums';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts({
        page: 1,
        limit: 20,
        status: ProductStatus.ACTIVE, // Type-safe enum
      });
      
      setProducts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg p-4">
      <img src={product.thumbnail_url || '/placeholder.png'} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="text-lg font-bold">
        {product.selling_price.toLocaleString('vi-VN')} ₫
      </p>
      {product.cost_price && (
        <p className="text-sm line-through text-gray-500">
          {product.cost_price.toLocaleString('vi-VN')} ₫
        </p>
      )}
      <div className="flex items-center">
        <span>⭐ {product.average_rating.toFixed(1)}</span>
        <span className="text-sm text-gray-500">({product.total_reviews})</span>
      </div>
    </div>
  );
}
```

---

### Example 2: Add to Cart with Validation

```typescript
'use client';

import { useState } from 'react';
import { cartService } from '@/lib/services';
import { MIN_QUANTITY } from '@/lib/types/enums';
import { isValidQuantity, ValidationErrors } from '@/lib/types/validation';

interface AddToCartProps {
  variantId: number;
  maxStock: number;
}

export default function AddToCart({ variantId, maxStock }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    // Client-side validation matching DB constraint
    // DB: CHECK (quantity > 0)
    if (!isValidQuantity(quantity)) {
      setError(ValidationErrors.INVALID_QUANTITY);
      return;
    }

    if (quantity > maxStock) {
      setError(`Only ${maxStock} items available`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await cartService.addToCart({
        variant_id: variantId,
        quantity,
      });
      
      alert('Added to cart successfully!');
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response.data.message || 'Invalid quantity');
      } else {
        setError('Failed to add to cart');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setQuantity(Math.max(MIN_QUANTITY, quantity - 1))}
          className="px-3 py-1 border"
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || MIN_QUANTITY)}
          min={MIN_QUANTITY}
          max={maxStock}
          className="w-20 text-center border"
        />
        <button
          onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
          className="px-3 py-1 border"
        >
          +
        </button>
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <button
        onClick={handleAddToCart}
        disabled={loading || quantity < MIN_QUANTITY || quantity > maxStock}
        className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-300"
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

---

### Example 3: Order List with Status Filtering

```typescript
'use client';

import { useState, useEffect } from 'react';
import { orderService } from '@/lib/services';
import { Order } from '@/lib/services/orderService';
import { OrderFulfillmentStatus } from '@/lib/types/enums';

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderFulfillmentStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrders({
        page: 1,
        limit: 20,
        status: filter === 'all' ? undefined : filter,
      });
      
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: OrderFulfillmentStatus) => {
    const statusConfig = {
      [OrderFulfillmentStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [OrderFulfillmentStatus.PROCESSING]: 'bg-blue-100 text-blue-800',
      [OrderFulfillmentStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
      [OrderFulfillmentStatus.DELIVERED]: 'bg-green-100 text-green-800',
      [OrderFulfillmentStatus.CANCELLED]: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusConfig[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-blue-600 text-white px-4 py-2' : 'border px-4 py-2'}
        >
          All
        </button>
        {Object.values(OrderFulfillmentStatus).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={filter === status ? 'bg-blue-600 text-white px-4 py-2' : 'border px-4 py-2'}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                {getStatusBadge(order.fulfillment_status)}
              </div>
              <p className="mt-2 text-lg font-bold">
                {order.total_amount.toLocaleString('vi-VN')} ₫
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### Example 4: Product Review Form

```typescript
'use client';

import { useState } from 'react';
import { reviewService } from '@/lib/services';
import { MIN_RATING, MAX_RATING } from '@/lib/types/enums';
import { isValidRating, ValidationErrors } from '@/lib/types/validation';

interface ReviewFormProps {
  variantId: number;
  orderId: number;
  onSuccess: () => void;
}

export default function ReviewForm({ variantId, orderId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate rating matches DB constraint: CHECK (rating >= 1 AND rating <= 5)
    if (!isValidRating(rating)) {
      setError(ValidationErrors.INVALID_RATING);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await reviewService.submitReview({
        variant_id: variantId,
        order_id: orderId,
        rating,
        comment: comment.trim() || undefined,
      });
      
      alert('Review submitted successfully!');
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Rating *</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-2xl"
            >
              {star <= rating ? '⭐' : '☆'}
            </button>
          ))}
        </div>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          min={MIN_RATING}
          max={MAX_RATING}
          required
          className="hidden" // Hidden but enforces HTML5 validation
        />
      </div>

      <div>
        <label className="block mb-2">Comment (Optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          rows={4}
          className="w-full border rounded p-2"
          placeholder="Share your experience with this product..."
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading || !isValidRating(rating)}
        className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-300"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
```

---

### Example 5: Customer Address Form

```typescript
'use client';

import { useState } from 'react';
import { addressService } from '@/lib/services';
import { AddressType } from '@/lib/types/enums';
import { isValidPhoneNumber, ValidationErrors } from '@/lib/types/validation';

export default function AddressForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    detailed_address: '', // DB: text NOT NULL
    phone_number: '',     // DB: character varying NOT NULL
    address_type: AddressType.HOME, // DB: DEFAULT 'Home'
    is_default: false,    // DB: boolean DEFAULT false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // DB constraint: detailed_address NOT NULL
    if (!formData.detailed_address.trim()) {
      newErrors.detailed_address = ValidationErrors.REQUIRED_FIELD;
    } else if (formData.detailed_address.trim().length < 10) {
      newErrors.detailed_address = 'Address must be at least 10 characters';
    }

    // DB constraint: phone_number NOT NULL
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = ValidationErrors.REQUIRED_FIELD;
    } else if (!isValidPhoneNumber(formData.phone_number)) {
      newErrors.phone_number = ValidationErrors.INVALID_PHONE;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);

    try {
      await addressService.createAddress({
        detailed_address: formData.detailed_address.trim(),
        phone_number: formData.phone_number.trim(),
        address_type: formData.address_type,
        is_default: formData.is_default,
      });
      
      alert('Address added successfully!');
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Address Type</label>
        <select
          value={formData.address_type}
          onChange={(e) => setFormData({ ...formData, address_type: e.target.value as AddressType })}
          className="w-full border rounded p-2"
        >
          {Object.values(AddressType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2">Detailed Address *</label>
        <textarea
          value={formData.detailed_address}
          onChange={(e) => setFormData({ ...formData, detailed_address: e.target.value })}
          required
          minLength={10}
          rows={3}
          className="w-full border rounded p-2"
          placeholder="Street address, city, district..."
        />
        {errors.detailed_address && (
          <p className="text-red-500 text-sm mt-1">{errors.detailed_address}</p>
        )}
      </div>

      <div>
        <label className="block mb-2">Phone Number *</label>
        <input
          type="tel"
          value={formData.phone_number}
          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          required
          pattern="(\+84|0)[0-9]{9,10}"
          className="w-full border rounded p-2"
          placeholder="0912345678 or +84912345678"
        />
        {errors.phone_number && (
          <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.is_default}
          onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
          className="mr-2"
          id="is_default"
        />
        <label htmlFor="is_default">Set as default address</label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-300"
      >
        {loading ? 'Saving...' : 'Save Address'}
      </button>
    </form>
  );
}
```

---

### Example 6: Admin Order Status Update

```typescript
'use client';

import { useState } from 'react';
import { adminOrderService } from '@/lib/services';
import { OrderFulfillmentStatus } from '@/lib/types/enums';

interface OrderStatusUpdateProps {
  orderId: number;
  currentStatus: OrderFulfillmentStatus;
  onUpdate: () => void;
}

export default function OrderStatusUpdate({ 
  orderId, 
  currentStatus, 
  onUpdate 
}: OrderStatusUpdateProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  // Define valid status transitions based on business logic
  const getAvailableStatuses = (current: OrderFulfillmentStatus): OrderFulfillmentStatus[] => {
    const transitions: Record<OrderFulfillmentStatus, OrderFulfillmentStatus[]> = {
      [OrderFulfillmentStatus.PENDING]: [
        OrderFulfillmentStatus.PROCESSING,
        OrderFulfillmentStatus.CANCELLED,
      ],
      [OrderFulfillmentStatus.PROCESSING]: [
        OrderFulfillmentStatus.SHIPPED,
        OrderFulfillmentStatus.CANCELLED,
      ],
      [OrderFulfillmentStatus.SHIPPED]: [
        OrderFulfillmentStatus.DELIVERED,
      ],
      [OrderFulfillmentStatus.DELIVERED]: [], // Final state
      [OrderFulfillmentStatus.CANCELLED]: [], // Final state
    };

    return transitions[current] || [];
  };

  const handleUpdate = async () => {
    if (selectedStatus === currentStatus) return;

    setLoading(true);

    try {
      await adminOrderService.updateOrderStatus(orderId, {
        status: selectedStatus,
      });
      
      alert('Order status updated successfully!');
      onUpdate();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const availableStatuses = getAvailableStatuses(currentStatus);

  if (availableStatuses.length === 0) {
    return (
      <div className="text-gray-500">
        Order is in final state: {currentStatus}
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as OrderFulfillmentStatus)}
        className="border rounded p-2"
      >
        <option value={currentStatus}>{currentStatus}</option>
        {availableStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <button
        onClick={handleUpdate}
        disabled={loading || selectedStatus === currentStatus}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {loading ? 'Updating...' : 'Update Status'}
      </button>
    </div>
  );
}
```

---

## 🛡️ Error Handling Patterns

### Handle Duplicate Unique Constraints

```typescript
// DB: email UNIQUE
try {
  await authService.register({ email, password, name });
} catch (err: any) {
  if (err.response?.status === 409) {
    // Handle duplicate email
    setError(ValidationErrors.DUPLICATE_EMAIL);
  }
}

// DB: slug UNIQUE
try {
  await adminProductService.createProduct({ slug, name, ... });
} catch (err: any) {
  if (err.response?.status === 409) {
    setError(ValidationErrors.DUPLICATE_SLUG);
  }
}
```

### Handle Validation Errors

```typescript
try {
  await cartService.addToCart({ variant_id, quantity: -1 });
} catch (err: any) {
  if (err.response?.status === 400) {
    // Server-side validation failed
    // DB CHECK constraint violated
    setError(err.response.data.message);
  }
}
```

---

## 📋 Form Validation Checklist

When building forms, ensure:

- [ ] Required fields match DB `NOT NULL` constraints
- [ ] Number inputs have `min`/`max` matching DB `CHECK` constraints
- [ ] Unique fields handle 409 Conflict errors
- [ ] Enum fields use dropdown with DB enum values
- [ ] Phone/email fields have regex validation
- [ ] Quantity fields enforce `min={1}` (DB: `quantity > 0`)
- [ ] Rating fields enforce `min={1} max={5}`
- [ ] Default values match DB defaults

---

## 🔄 React Query Integration (Recommended)

For better caching and state management:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/lib/services';

// Fetch products with caching
function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
  });
}

// Add to cart with optimistic updates
function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartData) => cartService.addToCart(data),
    onSuccess: () => {
      // Invalidate and refetch cart
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Usage in component
function ProductPage() {
  const { data, isLoading } = useProducts({ page: 1, limit: 20 });
  const addToCart = useAddToCart();

  const handleAddToCart = (variantId: number) => {
    addToCart.mutate({ variant_id: variantId, quantity: 1 });
  };

  // ...
}
```

---

## 📊 Quick Reference

| Component Type | DB Schema Reference | Validation |
|---------------|-------------------|------------|
| Product List | `products` table | `status = 'active'` |
| Cart | `cart_items` table | `quantity > 0` |
| Checkout | `orders` table | Required: `shipping_address`, `shipping_phone` |
| Reviews | `product_reviews` table | `rating` 1-5 |
| Addresses | `customer_addresses` table | Required: `detailed_address`, `phone_number` |
| Order Status | `orders.fulfillment_status` | Use `OrderFulfillmentStatus` enum |
| Payment | `orders.payment_method` | Use `PaymentMethod` enum |

---

**End of Integration Guide**

For more details, see:
- `DB_SCHEMA.md` - Complete database schema
- `API_INVENTORY.md` - API endpoints
- `lib/services/README.md` - Service layer usage
