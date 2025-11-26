# API Service Layer Documentation

Complete API service layer for LeCas Fashion E-commerce frontend application.

## 📦 Installation

First, install the required dependency:

```bash
npm install axios
```

## 🏗️ Architecture

The API service layer is built with:
- **Axios** for HTTP requests
- **TypeScript** for type safety
- **Interceptors** for automatic token attachment and error handling
- **Modular design** with separate services for each domain

## 📁 Structure

```
lib/services/
├── apiClient.ts              # Axios instance with interceptors
├── index.ts                  # Main export file
│
├── Customer Services
│   ├── authService.ts        # Authentication (login, register, etc.)
│   ├── accountService.ts     # Account profile management
│   ├── addressService.ts     # Shipping addresses
│   ├── userService.ts        # User profile
│   ├── productService.ts     # Products & catalog
│   ├── categoryService.ts    # Categories
│   ├── cartService.ts        # Shopping cart
│   ├── checkoutService.ts    # Checkout & payment
│   ├── orderService.ts       # Order management
│   ├── reviewService.ts      # Product reviews
│   ├── wishlistService.ts    # Wishlist
│   ├── promotionService.ts   # Promotions & coupons
│   ├── supportService.ts     # Support tickets
│   ├── pageService.ts        # CMS pages
│   └── aiService.ts          # AI chatbot & image search
│
├── Admin Services
│   ├── adminAuthService.ts        # Admin authentication
│   ├── adminDashboardService.ts   # Dashboard stats
│   ├── adminProductService.ts     # Product management
│   ├── adminOrderService.ts       # Order management
│   ├── adminCustomerService.ts    # Customer management
│   ├── adminCategoryService.ts    # Category management
│   ├── adminColorService.ts       # Color management
│   ├── adminSizeService.ts        # Size management
│   ├── adminPromotionService.ts   # Promotion management
│   ├── adminReviewService.ts      # Review moderation
│   ├── adminPageService.ts        # CMS page management
│   ├── adminAnalyticsService.ts   # Analytics & reports
│   ├── adminSupportService.ts     # Support ticket management
│   ├── adminInventoryService.ts   # Inventory management
│   └── adminChatbotService.ts     # Chatbot management
│
└── Internal Services
    └── internalService.ts     # Rasa action server APIs
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_INTERNAL_API_KEY=your_internal_api_key
```

### API Client Features

The `apiClient` automatically:
- ✅ Attaches JWT token from localStorage to all requests
- ✅ Handles 401 errors by clearing auth and redirecting to login
- ✅ Provides global error handling
- ✅ Supports multipart/form-data uploads

## 📖 Usage Examples

### Customer Authentication

```typescript
import { authService } from '@/lib/services';

// Login
const handleLogin = async () => {
  try {
    const response = await authService.login({
      email: 'user@example.com',
      password: 'password123'
    });
    
    // Save token
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Register
const handleRegister = async () => {
  const response = await authService.register({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  });
};

// Logout
const handleLogout = async () => {
  await authService.logout();
  localStorage.clear();
  window.location.href = '/login';
};
```

### Products

```typescript
import { productService } from '@/lib/services';

// Get products with filters
const fetchProducts = async () => {
  const response = await productService.getProducts({
    page: 1,
    limit: 20,
    category_slug: 'ao-khoac',
    sort_by: 'price_asc',
    min_price: 100000,
    max_price: 500000
  });
  
  const products = response.data.data;
  const metadata = response.data.metadata;
};

// Get product details
const fetchProduct = async (slug: string) => {
  const response = await productService.getProductBySlug(slug);
  const product = response.data;
};

// Get new arrivals
const fetchNewArrivals = async () => {
  const response = await productService.getNewArrivals(1, 10);
};
```

### Shopping Cart

```typescript
import { cartService } from '@/lib/services';

// Get cart
const fetchCart = async () => {
  const response = await cartService.getCart();
  const cartItems = response.data.cart_items;
  const total = response.data.total;
};

// Add to cart
const addToCart = async (variantId: number, quantity: number) => {
  await cartService.addToCart({ variant_id: variantId, quantity });
};

// Update quantity
const updateQuantity = async (itemId: number, quantity: number) => {
  await cartService.updateCartItem(itemId, { quantity });
};

// Remove item
const removeItem = async (itemId: number) => {
  await cartService.removeCartItem(itemId);
};

// Apply coupon
const applyCoupon = async (code: string) => {
  await cartService.applyCoupon({ code });
};
```

### Checkout & Orders

```typescript
import { checkoutService, orderService } from '@/lib/services';

// Create order
const createOrder = async () => {
  const response = await checkoutService.createOrder({
    address_id: 1,
    payment_method: 'vnpay',
    shipping_fee: 30000,
    notes: 'Please deliver in the morning'
  });
  
  const orderId = response.data.order_id;
  
  // Create payment URL for VNPAY
  const paymentResponse = await checkoutService.createPaymentUrl({
    order_id: orderId
  });
  
  // Redirect to payment
  window.location.href = paymentResponse.data.paymentUrl;
};

// Get order history
const fetchOrders = async () => {
  const response = await orderService.getOrders({
    page: 1,
    limit: 10,
    status: 'delivered'
  });
};

// Cancel order
const cancelOrder = async (orderId: number) => {
  await orderService.cancelOrder(orderId);
};
```

### AI Features

```typescript
import { aiService } from '@/lib/services';

// Chatbot
const sendMessage = async (message: string, sessionId: string) => {
  const response = await aiService.sendChatbotMessage({
    message,
    session_id: sessionId
  });
  
  const botResponses = response.data.responses;
};

// Image search
const searchByImage = async (file: File) => {
  const response = await aiService.imageSearch(file);
  const results = response.data.results;
};
```

### Admin Product Management

```typescript
import { adminProductService } from '@/lib/services';

// Get all products (admin)
const fetchAdminProducts = async () => {
  const response = await adminProductService.getAllProducts({
    page: 1,
    limit: 20,
    search: 'áo khoác',
    status: 'active'
  });
};

// Create product
const createProduct = async () => {
  await adminProductService.createProduct({
    name: 'Áo Khoác Denim Oversize',
    category_id: 2,
    description: 'Áo khoác denim phong cách oversize...',
    original_price: 550000,
    selling_price: 450000,
    variants: [
      {
        size_id: 2,
        color_id: 1,
        sku: 'AKD-M-XANH',
        total_stock: 50
      }
    ]
  });
};

// Upload variant images
const uploadImages = async (variantId: number, files: File[]) => {
  await adminProductService.uploadVariantImages(variantId, files, true);
};
```

### Admin Analytics

```typescript
import { adminAnalyticsService } from '@/lib/services';

// Get dashboard stats
const fetchStats = async () => {
  const response = await adminAnalyticsService.getStats('30d');
  const { total_revenue, new_orders, avg_order_value } = response.data;
};

// Get sales overview
const fetchSalesOverview = async () => {
  const response = await adminAnalyticsService.getSalesOverview('30d');
  const chartData = response.data.data;
};
```

## 🔐 Authentication Flow

### Customer Authentication

1. User logs in via `authService.login()`
2. Token is saved to localStorage
3. `apiClient` interceptor automatically attaches token to all requests
4. On 401 error, user is logged out and redirected to login

### Admin Authentication

1. Admin logs in via `adminAuthService.login()`
2. Admin token is saved to localStorage
3. Same interceptor flow as customer auth

## 🛡️ Error Handling

All services use Axios which throws errors. Wrap calls in try-catch:

```typescript
try {
  const response = await productService.getProducts();
  // Handle success
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error('API Error:', error.response?.data);
    console.error('Status:', error.response?.status);
  }
}
```

## 📝 TypeScript Support

All services are fully typed. Import types:

```typescript
import type { 
  Product, 
  ProductFilters, 
  CartItem,
  Order 
} from '@/lib/services';
```

## 🔄 Response Format

Most endpoints follow this format:

```typescript
{
  data: T[],
  metadata: {
    total: number,
    page: number,
    limit: number,
    total_pages: number
  }
}
```

## 📚 API Inventory Reference

See `API_INVENTORY.md` for complete endpoint documentation.

## ⚡ Performance Tips

1. Use React Query or SWR for caching:
```typescript
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/lib/services';

const { data, isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: () => productService.getProducts()
});
```

2. Implement debouncing for search:
```typescript
import { debounce } from 'lodash';

const searchProducts = debounce(async (query: string) => {
  await productService.getProducts({ search: query });
}, 300);
```

## 🚀 Next Steps

1. Install axios: `npm install axios`
2. Set up environment variables
3. Import services in your components
4. Implement error boundaries
5. Add loading states
6. Set up React Query for caching (recommended)

## 📞 Support

For issues or questions about the API service layer, refer to:
- API Inventory documentation
- Backend Swagger docs: `http://localhost:3001/api-docs`
