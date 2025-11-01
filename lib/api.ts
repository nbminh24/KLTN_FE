const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ========== HELPER FUNCTIONS ==========

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

// ========== AUTHENTICATION ==========

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  orders_count?: number;
  total_spent?: string;
  created_at?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
}

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  resetPassword: async (token: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    return handleResponse(response);
  },
};

// ========== USERS ==========

export const usersAPI = {
  getProfile: async (): Promise<{ user: User }> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (data: Partial<User>): Promise<{ user: User }> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse(response);
  },
};

// ========== PRODUCTS ==========

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  category_id?: string;
  price: string | number;
  original_price?: string | number;
  rating?: number;
  reviews_count?: number;
  sold_count?: number;
  status: string;
  category?: {
    id: string;
    name: string;
  };
  images?: Array<{
    id: string;
    image_url: string;
    is_primary: boolean;
  }>;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size?: string;
  color?: string;
  stock: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'bestseller';
  hasDiscount?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export const productsAPI = {
  getProducts: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const response = await fetch(`${API_BASE_URL}/products?${params}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<ProductsResponse>(response);
  },

  getProduct: async (id: string): Promise<{ product: Product }> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  createReview: async (productId: string, data: { rating: number; title?: string; comment: string }) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

// ========== CATEGORIES ==========

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  products_count?: number;
  status: string;
}

export const categoriesAPI = {
  getCategories: async (): Promise<{ categories: Category[] }> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },
};

// ========== CART ==========

export interface CartItemData {
  product_id: string;
  product_variant_id?: string;
  quantity: number;
}

export interface CartItem {
  id: string;
  product_id: string;
  product_variant_id?: string;
  quantity: number;
  product: Product;
  product_variant?: ProductVariant;
}

export interface CartResponse {
  items: CartItem[];
  summary: {
    subtotal: string;
    itemsCount: number;
  };
}

export const cartAPI = {
  getCart: async (): Promise<CartResponse> => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<CartResponse>(response);
  },

  addToCart: async (data: CartItemData) => {
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity }),
    });
    return handleResponse(response);
  },

  removeCartItem: async (itemId: string) => {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  applyCoupon: async (code: string, subtotal: number) => {
    const response = await fetch(`${API_BASE_URL}/cart/apply-coupon`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ code, subtotal }),
    });
    return handleResponse(response);
  },
};

// ========== ORDERS ==========

export interface CreateOrderData {
  payment_method: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state?: string;
  shipping_postal_code: string;
  promo_code?: string;
  delivery_fee: number;
  discount: number;
}

export interface OrderItem {
  id: string;
  product_name: string;
  product_image?: string;
  size?: string;
  color?: string;
  price: string;
  quantity: number;
  subtotal: string;
}

export interface Order {
  id: string;
  subtotal: string;
  discount: string;
  delivery_fee: string;
  total: string;
  status: string;
  payment_method: string;
  payment_status: string;
  promo_code?: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state?: string;
  shipping_postal_code: string;
  tracking_number?: string;
  created_at: string;
  delivered_date?: string;
  items: OrderItem[];
}

export const ordersAPI = {
  createOrder: async (data: CreateOrderData): Promise<{ order: Order }> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getOrders: async (): Promise<{ orders: Order[] }> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getOrder: async (id: string): Promise<{ order: Order }> => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  cancelOrder: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ========== WISHLIST ==========

export const wishlistAPI = {
  getWishlist: async (): Promise<{ items: Product[] }> => {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  addToWishlist: async (product_id: string) => {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_id }),
    });
    return handleResponse(response);
  },

  removeFromWishlist: async (product_id: string) => {
    const response = await fetch(`${API_BASE_URL}/wishlist/${product_id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ========== ADDRESSES ==========

export interface Address {
  id: string;
  user_id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  postal_code: string;
  phone: string;
  is_default: boolean;
}

export const addressesAPI = {
  getAddresses: async (): Promise<{ addresses: Address[] }> => {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  addAddress: async (data: Omit<Address, 'id' | 'user_id'>) => {
    const response = await fetch(`${API_BASE_URL}/addresses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updateAddress: async (id: string, data: Partial<Address>) => {
    const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  deleteAddress: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/addresses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  setDefaultAddress: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/addresses/${id}/set-default`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ========== PROMOTIONS ==========

export interface Promotion {
  id: string;
  code: string;
  type: string;
  discount_value: string;
  min_order_value?: string;
  start_date?: string;
  expiry_date?: string;
  status: string;
}

export const promotionsAPI = {
  getPublicPromotions: async (): Promise<{ promotions: Promotion[] }> => {
    const response = await fetch(`${API_BASE_URL}/promotions/public`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },
};

// ========== SUPPORT ==========

export interface SupportTicket {
  id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  admin_reply?: string;
  created_at: string;
}

export const supportAPI = {
  createTicket: async (data: { customer_name: string; customer_email: string; subject: string; message: string }) => {
    const response = await fetch(`${API_BASE_URL}/support/tickets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getTickets: async (): Promise<{ tickets: SupportTicket[] }> => {
    const response = await fetch(`${API_BASE_URL}/support/tickets`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getTicket: async (id: string): Promise<{ ticket: SupportTicket }> => {
    const response = await fetch(`${API_BASE_URL}/support/tickets/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ========== AI CHATBOT ==========

export const aiAPI = {
  sendMessage: async (message: string, conversationId?: string) => {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, conversation_id: conversationId }),
    });
    return handleResponse(response);
  },

  getChatHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/ai/chat/history`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  imageSearch: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const response = await fetch(`${API_BASE_URL}/ai/image-search`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return handleResponse(response);
  },
};
