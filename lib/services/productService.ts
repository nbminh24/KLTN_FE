import apiClient from './apiClient';
import { AxiosResponse } from 'axios';
import type {
    Product,
    ProductsResponse,
    ProductSearchParams,
    Category,
} from '@/lib/types/backend';

// ========== PRODUCT SERVICE ==========

const productService = {
    /**
     * Get product list with filters, search, sort, pagination
     * GET /api/v1/products
     */
    getProducts: async (params?: ProductSearchParams): Promise<AxiosResponse<ProductsResponse>> => {
        const queryParams = new URLSearchParams();

        if (params) {
            // Basic params
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());
            if (params.category_slug) queryParams.append('category_slug', params.category_slug);
            if (params.search) queryParams.append('search', params.search);

            // Price range
            if (params.min_price !== undefined) queryParams.append('min_price', params.min_price.toString());
            if (params.max_price !== undefined) queryParams.append('max_price', params.max_price.toString());

            // Filters
            if (params.colors) queryParams.append('colors', params.colors);
            if (params.sizes) queryParams.append('sizes', params.sizes);

            // Sort
            if (params.sort_by) queryParams.append('sort_by', params.sort_by);

            // JSONB attributes filter
            if (params.attributes) {
                Object.entries(params.attributes).forEach(([key, value]) => {
                    queryParams.append(`attributes[${key}]`, value);
                });
            }
        }

        return apiClient.get(`/products?${queryParams.toString()}`);
    },

    /**
     * Get new arrivals (created within 30 days)
     * GET /api/v1/products/new-arrivals
     */
    getNewArrivals: async (page: number = 1, limit: number = 12): Promise<AxiosResponse<ProductsResponse>> => {
        return apiClient.get('/products/new-arrivals', {
            params: { page, limit },
        });
    },

    /**
     * Get products on sale (has active promotion)
     * GET /products/on-sale
     */
    getOnSale: async (page: number = 1, limit: number = 12): Promise<AxiosResponse<ProductsResponse>> => {
        return apiClient.get('/products/on-sale', {
            params: { page, limit },
        });
    },

    /**
     * Get featured products (top rated)
     * GET /products/featured
     */
    getFeatured: async (limit: number = 12): Promise<AxiosResponse<ProductsResponse>> => {
        return apiClient.get('/products/featured', {
            params: { limit },
        });
    },

    /**
     * Get filter options for products
     * GET /products/filters
     */
    getFilters: async (categoryId?: number): Promise<AxiosResponse<{
        sizes: any[];
        colors: any[];
        price_range: { min: number; max: number };
    }>> => {
        const params = categoryId ? { category_id: categoryId } : {};
        return apiClient.get('/products/filters', { params });
    },

    /**
     * Get list of product attributes
     * GET /products/attributes
     */
    getAttributes: async (): Promise<AxiosResponse<string[]>> => {
        return apiClient.get('/products/attributes');
    },

    /**
     * Get product details by ID
     * GET /products/id/:id
     */
    getProductById: async (id: number): Promise<AxiosResponse<{ product: Product }>> => {
        return apiClient.get(`/products/id/${id}`);
    },

    /**
     * Get product details by slug
     * GET /products/:slug
     */
    getProductBySlug: async (slug: string): Promise<AxiosResponse<{ product: Product }>> => {
        return apiClient.get(`/products/${slug}`);
    },

    /**
     * Get product reviews with pagination
     * GET /products/:productId/reviews
     */
    getProductReviews: async (
        productId: number,
        params?: {
            page?: number;
            limit?: number;
            sort?: 'created_at' | 'rating';
            order?: 'asc' | 'desc';
        }
    ): Promise<AxiosResponse> => {
        const queryParams = new URLSearchParams();
        if (params) {
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());
            if (params.sort) queryParams.append('sort', params.sort);
            if (params.order) queryParams.append('order', params.order);
        }
        return apiClient.get(`/products/${productId}/reviews?${queryParams.toString()}`);
    },

    /**
     * Check product availability (for chatbot)
     * GET /products/availability
     */
    checkAvailability: async (params: {
        name: string;
        size?: string;
        color?: string;
    }): Promise<AxiosResponse> => {
        const queryParams = new URLSearchParams();
        queryParams.append('name', params.name);
        if (params.size) queryParams.append('size', params.size);
        if (params.color) queryParams.append('color', params.color);
        return apiClient.get(`/products/availability?${queryParams.toString()}`);
    },

    /**
     * Get related products (same category, exclude current)
     * GET /api/v1/products/:id/related
     */
    getRelatedProducts: async (id: number, limit: number = 4): Promise<AxiosResponse<{ products: Product[] }>> => {
        return apiClient.get(`/products/${id}/related`, {
            params: { limit },
        });
    },

    /**
     * Subscribe to product notifications (restock/price drop)
     * POST /products/id/:id/notify
     */
    subscribeNotification: async (productId: number, notificationType: 'restock' | 'price_drop'): Promise<AxiosResponse> => {
        return apiClient.post(`/products/id/${productId}/notify`, {
            notification_type: notificationType,
        });
    },

    /**
     * Get all categories
     * GET /categories
     */
    getCategories: async (): Promise<AxiosResponse<{ categories: Category[] }>> => {
        return apiClient.get('/categories');
    },

    /**
     * Get products by category slug
     * GET /api/v1/categories/:slug/products
     */
    getProductsByCategorySlug: async (
        slug: string,
        page: number = 1,
        limit: number = 12
    ): Promise<AxiosResponse<ProductsResponse>> => {
        return apiClient.get(`/categories/${slug}/products`, {
            params: { page, limit },
        });
    },
};

export default productService;
