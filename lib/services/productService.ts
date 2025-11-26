import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface ProductFilters {
    page?: number;
    limit?: number;
    category_slug?: string;
    colors?: string; // comma-separated IDs: "1,2,3"
    sizes?: string; // comma-separated IDs: "1,2,3"
    min_price?: number;
    max_price?: number;
    search?: string;
    sort_by?: 'newest' | 'price_asc' | 'price_desc' | 'rating';
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    selling_price: number;
    original_price: number;
    discount_percentage?: number;
    thumbnail_url?: string;
    category_name?: string;
    average_rating?: number;
    total_reviews?: number;
    description?: string;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    variants?: ProductVariant[];
    available_options?: {
        sizes: string[];
        colors: Array<{ name: string; hex: string }>;
    };
    promotion?: {
        discount_percentage: number;
        valid_until: string;
    };
    reviews?: {
        average_rating: number;
        total_reviews: number;
        rating_distribution: Record<string, number>;
    };
    related_products?: Product[];
}

export interface ProductVariant {
    id: number;
    sku: string;
    size: string;
    color: string;
    color_hex: string;
    total_stock: number;
    available_stock: number;
    images: string[];
}

export interface ProductsResponse {
    data: Product[];
    metadata: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    };
}

// ========== PRODUCT SERVICE ==========

const productService = {
    /**
     * Get product list with filters
     * GET /products
     */
    getProducts: async (filters?: ProductFilters): Promise<AxiosResponse<ProductsResponse>> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        return apiClient.get(`/products?${params.toString()}`);
    },

    /**
     * Get new arrivals (created within 30 days)
     * GET /products/new-arrivals
     */
    getNewArrivals: async (page?: number, limit?: number): Promise<AxiosResponse<ProductsResponse>> => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        return apiClient.get(`/products/new-arrivals?${params.toString()}`);
    },

    /**
     * Get products on sale
     * GET /products/on-sale
     */
    getOnSale: async (page?: number, limit?: number): Promise<AxiosResponse<ProductsResponse>> => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        return apiClient.get(`/products/on-sale?${params.toString()}`);
    },

    /**
     * Get product details by slug
     * GET /products/:slug
     */
    getProductBySlug: async (slug: string): Promise<AxiosResponse<Product>> => {
        return apiClient.get(`/products/${slug}`);
    },
};

export default productService;
