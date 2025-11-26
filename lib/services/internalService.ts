import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Base URL from environment or default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create separate client for internal APIs with API Key authentication
const createInternalClient = (): AxiosInstance => {
    const apiKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY || '';

    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
        },
        timeout: 30000,
    });
};

const internalClient = createInternalClient();

// ========== INTERFACES ==========

export interface ProductSearchFilters {
    search?: string;
    category?: string;
    limit?: number;
}

export interface VariantSearchFilters {
    product_id?: number;
    sku?: string;
    size?: string;
    color?: string;
    in_stock?: boolean;
    limit?: number;
}

export interface SizingAdviceData {
    height: number;
    weight: number;
    category: string;
}

export interface SubscribeNotificationData {
    email: string;
    product_id: number;
    notification_type: 'restock' | 'price_drop';
}

export interface CreateTicketData {
    email: string;
    subject: string;
    message: string;
    category?: string;
}

// ========== INTERNAL/RASA SERVICE ==========

const internalService = {
    /**
     * Get order details for chatbot
     * GET /internal/orders/:id
     */
    getOrderById: async (id: string): Promise<AxiosResponse> => {
        return internalClient.get(`/internal/orders/${id}`);
    },

    /**
     * Search products for chatbot
     * GET /internal/products
     */
    searchProducts: async (filters?: ProductSearchFilters): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        return internalClient.get(`/internal/products?${params.toString()}`);
    },

    /**
     * Get static page content for chatbot
     * GET /internal/pages/:slug
     */
    getPageBySlug: async (slug: string): Promise<AxiosResponse> => {
        return internalClient.get(`/internal/pages/${slug}`);
    },

    /**
     * Search FAQ/content for chatbot
     * GET /internal/faq
     */
    searchFaq: async (query: string): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        params.append('query', query);
        return internalClient.get(`/internal/faq?${params.toString()}`);
    },

    /**
     * Get user by email for chatbot
     * GET /internal/users/email/:email
     */
    getUserByEmail: async (email: string): Promise<AxiosResponse> => {
        return internalClient.get(`/internal/users/email/${email}`);
    },

    /**
     * Get customer orders for chatbot
     * GET /internal/customers/orders
     */
    getCustomerOrders: async (email: string): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        params.append('email', email);
        return internalClient.get(`/internal/customers/orders?${params.toString()}`);
    },

    /**
     * Search product variants for chatbot
     * GET /internal/variants
     */
    searchVariants: async (filters?: VariantSearchFilters): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        return internalClient.get(`/internal/variants?${params.toString()}`);
    },

    /**
     * Get size recommendation for chatbot
     * POST /internal/products/sizing-advice
     */
    getSizingAdvice: async (data: SizingAdviceData): Promise<AxiosResponse> => {
        return internalClient.post('/internal/products/sizing-advice', data);
    },

    /**
     * Get styling suggestions for product
     * GET /internal/products/:id/styling-rules
     */
    getStylingRules: async (id: number): Promise<AxiosResponse> => {
        return internalClient.get(`/internal/products/${id}/styling-rules`);
    },

    /**
     * Get top discounted products
     * GET /internal/promotions/top-discounts
     */
    getTopDiscounts: async (limit?: number): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit.toString());
        return internalClient.get(`/internal/promotions/top-discounts?${params.toString()}`);
    },

    /**
     * Subscribe to product notifications
     * POST /internal/notifications/subscribe
     */
    subscribeToNotification: async (data: SubscribeNotificationData): Promise<AxiosResponse> => {
        return internalClient.post('/internal/notifications/subscribe', data);
    },

    /**
     * Create support ticket from chatbot
     * POST /internal/support/create-ticket
     */
    createSupportTicket: async (data: CreateTicketData): Promise<AxiosResponse> => {
        return internalClient.post('/internal/support/create-ticket', data);
    },
};

export default internalService;
