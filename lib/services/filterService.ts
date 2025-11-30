import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface Color {
    id: number;
    name: string;
    hex_code: string;
}

export interface Size {
    id: number;
    name: string;
    sort_order: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    status: string;
}

// ========== FILTER SERVICE ==========

const filterService = {
    /**
     * Get all colors (for dropdown/filters)
     * GET /api/v1/colors/all
     */
    getAllColors: async (): Promise<AxiosResponse<Color[]>> => {
        return apiClient.get('/api/v1/colors/all');
    },

    /**
     * Get all sizes (for dropdown/filters)
     * GET /api/v1/sizes/all
     */
    getAllSizes: async (): Promise<AxiosResponse<Size[]>> => {
        return apiClient.get('/api/v1/sizes/all');
    },

    /**
     * Get all categories (for dropdown/filters)
     * GET /api/v1/categories/all
     */
    getAllCategories: async (): Promise<AxiosResponse<Category[]>> => {
        return apiClient.get('/api/v1/categories/all');
    },
};

export default filterService;
