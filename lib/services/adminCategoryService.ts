import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface CreateCategoryData {
    name: string;
    status: 'active' | 'inactive';
}

export interface UpdateCategoryData {
    name?: string;
    status?: 'active' | 'inactive';
}

// ========== ADMIN CATEGORY SERVICE ==========

const adminCategoryService = {
    /**
     * Get category statistics
     * GET /api/v1/admin/categories/stats
     */
    getCategoryStats: async (): Promise<AxiosResponse> => {
        return apiClient.get('/api/v1/admin/categories/stats');
    },

    /**
     * Get all active categories for dropdown
     * GET /api/v1/admin/categories/all
     */
    getAllCategoriesDropdown: async (): Promise<AxiosResponse> => {
        return apiClient.get('/api/v1/admin/categories/all');
    },

    /**
     * Get all categories with product count
     * GET /api/v1/admin/categories
     */
    getAllCategories: async (): Promise<AxiosResponse> => {
        return apiClient.get('/api/v1/admin/categories');
    },

    /**
     * Create new category
     * POST /api/v1/admin/categories
     */
    createCategory: async (data: CreateCategoryData): Promise<AxiosResponse> => {
        return apiClient.post('/api/v1/admin/categories', data);
    },

    /**
     * Update category
     * PUT /api/v1/admin/categories/:id
     */
    updateCategory: async (id: number, data: UpdateCategoryData): Promise<AxiosResponse> => {
        return apiClient.put(`/api/v1/admin/categories/${id}`, data);
    },
};

export default adminCategoryService;
