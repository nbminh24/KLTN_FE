import apiClient, { createFormDataClient } from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface AdminProductFilters {
    page?: number;
    limit?: number;
    category_id?: number;
    status?: string;
    search?: string;
    sort?: string;
}

export interface CreateProductData {
    name: string;
    category_id: number;
    description: string;
    original_price: number;
    selling_price: number;
    variants: Array<{
        size_id: number;
        color_id: number;
        sku: string;
        total_stock: number;
    }>;
}

export interface UpdateProductData {
    name?: string;
    category_id?: number;
    description?: string;
    original_price?: number;
    selling_price?: number;
}

export interface UpdateProductStatusData {
    status: 'active' | 'inactive';
}

export interface UpdateVariantData {
    sku?: string;
    status?: string;
}

// ========== ADMIN PRODUCT SERVICE ==========

const adminProductService = {
    /**
     * Get all products (Admin)
     * GET /api/v1/admin/products
     */
    getAllProducts: async (filters?: AdminProductFilters): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        return apiClient.get(`/api/v1/admin/products?${params.toString()}`);
    },

    /**
     * Get product details (Admin)
     * GET /api/v1/admin/products/:id
     */
    getProductById: async (id: number): Promise<AxiosResponse> => {
        return apiClient.get(`/api/v1/admin/products/${id}`);
    },

    /**
     * Create new product
     * POST /api/v1/admin/products
     */
    createProduct: async (data: CreateProductData): Promise<AxiosResponse> => {
        return apiClient.post('/api/v1/admin/products', data);
    },

    /**
     * Update product
     * PUT /api/v1/admin/products/:id
     */
    updateProduct: async (id: number, data: UpdateProductData): Promise<AxiosResponse> => {
        return apiClient.put(`/api/v1/admin/products/${id}`, data);
    },

    /**
     * Update product status
     * PATCH /api/v1/admin/products/:id/status
     */
    updateProductStatus: async (id: number, data: UpdateProductStatusData): Promise<AxiosResponse> => {
        return apiClient.patch(`/api/v1/admin/products/${id}/status`, data);
    },

    /**
     * Get product variants
     * GET /api/v1/admin/products/:id/variants
     */
    getProductVariants: async (id: number): Promise<AxiosResponse> => {
        return apiClient.get(`/api/v1/admin/products/${id}/variants`);
    },

    /**
     * Update variant
     * PUT /api/v1/admin/variants/:id
     */
    updateVariant: async (id: number, data: UpdateVariantData): Promise<AxiosResponse> => {
        return apiClient.put(`/api/v1/admin/variants/${id}`, data);
    },

    /**
     * Upload variant images
     * POST /api/v1/admin/variants/:id/images
     */
    uploadVariantImages: async (id: number, files: File[], isMain?: boolean): Promise<AxiosResponse> => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const params = new URLSearchParams();
        if (isMain !== undefined) {
            params.append('is_main', isMain.toString());
        }

        const formDataClient = createFormDataClient();
        return formDataClient.post(`/api/v1/admin/variants/${id}/images?${params.toString()}`, formData);
    },

    /**
     * Delete image
     * DELETE /api/v1/admin/images/:id
     */
    deleteImage: async (id: number): Promise<AxiosResponse> => {
        return apiClient.delete(`/api/v1/admin/images/${id}`);
    },
};

export default adminProductService;
