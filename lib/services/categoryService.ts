import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface Category {
    id: number;
    name: string;
    slug: string;
    product_count?: number;
}

export interface CategoryProductsFilters {
    page?: number;
    limit?: number;
    colors?: string;
    sizes?: string;
    min_price?: number;
    max_price?: number;
    search?: string;
    sort_by?: 'newest' | 'price_asc' | 'price_desc' | 'rating';
}

// ========== CATEGORY SERVICE ==========

const categoryService = {
    /**
     * Get all active categories
     * GET /categories
     */
    getCategories: async (): Promise<AxiosResponse<{ categories: Category[] }>> => {
        return apiClient.get('/categories');
    },

    /**
     * Get products by category slug
     * GET /categories/:slug/products
     */
    getCategoryProducts: async (
        slug: string,
        filters?: CategoryProductsFilters
    ): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        return apiClient.get(`/categories/${slug}/products?${params.toString()}`);
    },
};

export default categoryService;
