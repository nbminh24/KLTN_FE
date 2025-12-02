import apiClient from '../apiClient';
import { AxiosResponse } from 'axios';

export interface AdminCategory {
    id: number;
    name: string;
    slug: string;
    status: 'active' | 'inactive';
    product_count?: number;
}

export interface CreateCategoryData {
    name: string;
    slug?: string;
    status?: 'active' | 'inactive';
}

const adminCategoryService = {
    /**
     * Get all categories
     * GET /api/v1/admin/categories
     */
    getCategories: async (): Promise<AxiosResponse<AdminCategory[]>> => {
        return apiClient.get('/api/v1/admin/categories');
    },

    /**
     * Get category by ID
     * GET /api/v1/admin/categories/:id
     */
    getCategoryById: async (id: number): Promise<AxiosResponse<AdminCategory>> => {
        return apiClient.get(`/api/v1/admin/categories/${id}`);
    },

    /**
     * Create category
     * POST /api/v1/admin/categories
     */
    createCategory: async (data: CreateCategoryData): Promise<AxiosResponse<AdminCategory>> => {
        return apiClient.post('/api/v1/admin/categories', data);
    },

    /**
     * Update category
     * PUT /api/v1/admin/categories/:id
     */
    updateCategory: async (id: number, data: Partial<CreateCategoryData>): Promise<AxiosResponse<AdminCategory>> => {
        return apiClient.put(`/api/v1/admin/categories/${id}`, data);
    },

    /**
     * Delete category
     * DELETE /api/v1/admin/categories/:id
     */
    deleteCategory: async (id: number): Promise<AxiosResponse<void>> => {
        return apiClient.delete(`/api/v1/admin/categories/${id}`);
    },
};

export default adminCategoryService;
