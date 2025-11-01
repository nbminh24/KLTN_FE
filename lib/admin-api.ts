// Admin-specific API endpoints
import { Product, Category, Order, User, Address, Promotion, SupportTicket } from './api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

// ========== ADMIN PRODUCTS ==========

export interface AdminProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sort?: string;
}

export const adminProductsAPI = {
  // List products with admin filters
  getProducts: async (filters?: AdminProductFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const response = await fetch(`${API_BASE_URL}/admin/products?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get single product
  getProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Create product
  createProduct: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Update product
  updateProduct: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Delete product
  deleteProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update product status
  updateStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};

// ========== ADMIN CATEGORIES ==========

export const adminCategoriesAPI = {
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createCategory: async (data: { name: string; description?: string; slug: string }) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updateCategory: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  deleteCategory: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/categories/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};

// ========== ADMIN ORDERS ==========

export const adminOrdersAPI = {
  getOrders: async (filters?: { page?: number; limit?: number; status?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const response = await fetch(`${API_BASE_URL}/admin/orders?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getOrder: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  updatePaymentStatus: async (id: string, payment_status: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/payment-status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ payment_status }),
    });
    return handleResponse(response);
  },

  updateTracking: async (id: string, tracking_number: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/tracking`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ tracking_number }),
    });
    return handleResponse(response);
  },
};

// ========== ADMIN CUSTOMERS ==========

export const adminCustomersAPI = {
  getCustomers: async (filters?: { page?: number; limit?: number; search?: string }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const response = await fetch(`${API_BASE_URL}/admin/customers?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getCustomer: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/customers/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateCustomer: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/customers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

// ========== ADMIN PROMOTIONS ==========

export const adminPromotionsAPI = {
  getPromotions: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/promotions`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createPromotion: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/promotions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updatePromotion: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/promotions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  deletePromotion: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/promotions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/promotions/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};

// ========== ADMIN SUPPORT ==========

export const adminSupportAPI = {
  getTickets: async (filters?: { page?: number; limit?: number; status?: string; priority?: string }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const response = await fetch(`${API_BASE_URL}/admin/support/tickets?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getTicket: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/support/tickets/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateTicketStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/support/tickets/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  updateTicketPriority: async (id: string, priority: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/support/tickets/${id}/priority`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ priority }),
    });
    return handleResponse(response);
  },

  replyToTicket: async (id: string, admin_reply: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/support/tickets/${id}/reply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ admin_reply }),
    });
    return handleResponse(response);
  },
};

// ========== ADMIN ANALYTICS ==========

export const adminAnalyticsAPI = {
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getSalesStats: async (period?: string) => {
    const params = period ? `?period=${period}` : '';
    const response = await fetch(`${API_BASE_URL}/admin/analytics/sales${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
