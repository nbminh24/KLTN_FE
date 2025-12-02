import apiClient from '../../client';
import { AxiosResponse } from 'axios';

export interface AdminProduct {
    id: number;
    name: string;
    slug: string;
    description?: string;
    full_description?: string;
    category_id: number;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    thumbnail_url?: string;
    selling_price: number;
    cost_price: number;
    total_stock: number;
    total_sold: number;
    status: 'active' | 'inactive';
    average_rating?: number;
    total_reviews?: number;
    created_at: string;
    updated_at: string;
    variants?: ProductVariant[];
}

export interface ProductVariant {
    id: number;
    product_id: number;
    size_id: number;
    color_id: number;
    name?: string;
    sku: string;
    total_stock: number;
    reserved_stock: number;
    reorder_point: number;
    status: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;
    // Extended fields for display
    size?: { id: number; name: string };
    color?: { id: number; name: string; hex_code?: string };
    images?: string[];
}

export interface CreateProductData {
    name: string;
    slug?: string;
    description?: string;
    full_description?: string;
    category_id: number;
    selling_price: number;
    cost_price: number;
    thumbnail_url?: string;
    status?: 'active' | 'inactive';
    variants?: Array<{
        size_id: number;
        color_id: number;
        name?: string;
        sku: string;
        total_stock: number;
        reserved_stock?: number;
        reorder_point?: number;
        status?: 'active' | 'inactive';
    }>;
}

export interface UpdateProductData {
    name?: string;
    slug?: string;
    description?: string;
    full_description?: string;
    category_id?: number;
    selling_price?: number;
    cost_price?: number;
    thumbnail_url?: string;
    status?: 'active' | 'inactive';
}

export interface ProductsListResponse {
    products: AdminProduct[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

const adminProductService = {
    /**
     * Get all products (admin)
     * GET /api/v1/admin/products
     */
    getProducts: async (params?: {
        page?: number;
        limit?: number;
        category_id?: number;
        status?: string;
        search?: string;
        sort_by?: string;
        order?: 'asc' | 'desc';
    }): Promise<AxiosResponse<ProductsListResponse>> => {
        return apiClient.get('/api/v1/admin/products', { params });
    },

    /**
     * Get product detail (admin)
     * GET /api/v1/admin/products/:id
     */
    getProductById: async (id: number): Promise<AxiosResponse<AdminProduct>> => {
        return apiClient.get(`/api/v1/admin/products/${id}`);
    },

    /**
     * Create new product
     * POST /api/v1/admin/products
     */
    createProduct: async (data: CreateProductData): Promise<AxiosResponse<AdminProduct>> => {
        return apiClient.post('/api/v1/admin/products', data);
    },

    /**
     * Update product
     * PUT /api/v1/admin/products/:id
     */
    updateProduct: async (id: number, data: UpdateProductData): Promise<AxiosResponse<AdminProduct>> => {
        return apiClient.put(`/api/v1/admin/products/${id}`, data);
    },

    /**
     * Delete product
     * DELETE /api/v1/admin/products/:id
     */
    deleteProduct: async (id: number): Promise<AxiosResponse<void>> => {
        return apiClient.delete(`/api/v1/admin/products/${id}`);
    },

    /**
     * Upload variant images
     * POST /api/v1/admin/products/:id/variants/:variantId/images
     */
    uploadVariantImages: async (
        productId: number,
        variantId: number,
        images: File[]
    ): Promise<AxiosResponse<{ images: string[] }>> => {
        const formData = new FormData();
        images.forEach((image) => {
            formData.append('images', image);
        });
        return apiClient.post(`/api/v1/admin/products/${productId}/variants/${variantId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    /**
     * Delete variant image
     * DELETE /api/v1/admin/products/:id/variants/:variantId/images/:imageUrl
     */
    deleteVariantImage: async (
        productId: number,
        variantId: number,
        imageUrl: string
    ): Promise<AxiosResponse<void>> => {
        return apiClient.delete(
            `/api/v1/admin/products/${productId}/variants/${variantId}/images/${encodeURIComponent(imageUrl)}`
        );
    },

    /**
     * Import products from CSV/Excel
     * POST /api/v1/admin/products/import
     */
    importProducts: async (file: File): Promise<AxiosResponse<{
        success_count: number;
        error_count: number;
        errors?: Array<{ row: number; message: string }>;
    }>> => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post('/api/v1/admin/products/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    /**
     * Get low stock products
     * GET /api/v1/admin/products/low-stock
     */
    getLowStockProducts: async (threshold?: number): Promise<AxiosResponse<AdminProduct[]>> => {
        return apiClient.get('/api/v1/admin/products/low-stock', {
            params: { threshold },
        });
    },
};

export default adminProductService;
