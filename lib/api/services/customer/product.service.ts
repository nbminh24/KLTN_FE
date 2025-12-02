import apiClient from '../../client';
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

        return apiClient.get(`/api/v1/products?${queryParams.toString()}`);
    },

    /**
     * Get new arrivals (created within 30 days)
     * GET /api/v1/products/new-arrivals
     */
    getNewArrivals: async (page: number = 1, limit: number = 12): Promise<AxiosResponse<ProductsResponse>> => {
        return apiClient.get('/api/v1/products/new-arrivals', {
            params: { page, limit },
        });
    },

    /**
     * Get products on sale (has active promotion)
     * GET /api/v1/products/on-sale
     */
    getOnSale: async (page: number = 1, limit: number = 12): Promise<AxiosResponse<ProductsResponse>> => {
        return apiClient.get('/api/v1/products/on-sale', {
            params: { page, limit },
        });
    },

    /**
     * Get product details by slug
     * GET /api/v1/products/:slug
     */
    getProductBySlug: async (slug: string): Promise<AxiosResponse<{ product: Product }>> => {
        return apiClient.get(`/api/v1/products/${slug}`);
    },

    /**
     * Get related products (same category, exclude current)
     * GET /api/v1/products/:id/related
     */
    getRelatedProducts: async (id: number, limit: number = 4): Promise<AxiosResponse<{ products: Product[] }>> => {
        return apiClient.get(`/api/v1/products/${id}/related`, {
            params: { limit },
        });
    },

    /**
     * Get all categories
     * GET /api/v1/categories
     */
    getCategories: async (): Promise<AxiosResponse<{ categories: Category[] }>> => {
        return apiClient.get('/api/v1/categories');
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
        return apiClient.get(`/api/v1/categories/${slug}/products`, {
            params: { page, limit },
        });
    },
};

export default productService;
