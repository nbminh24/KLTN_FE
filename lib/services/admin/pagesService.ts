import apiClient from '../apiClient';
import { AxiosResponse } from 'axios';

export interface AdminPage {
    id: number;
    title: string;
    slug: string;
    content?: string;
    status: 'Draft' | 'Published';
    created_at: string;
    updated_at: string;
}

export interface CreatePageData {
    title: string;
    slug?: string;
    content?: string;
    status?: 'Draft' | 'Published';
}

export interface PagesListResponse {
    pages: AdminPage[];
    total: number;
}

const adminPagesService = {
    /**
     * Get all CMS pages
     * GET /admin/pages
     */
    getPages: async (): Promise<AxiosResponse<PagesListResponse>> => {
        return apiClient.get('/admin/pages');
    },

    /**
     * Get page by ID
     * GET /admin/pages/:id
     */
    getPageById: async (id: number): Promise<AxiosResponse<AdminPage>> => {
        return apiClient.get(`/admin/pages/${id}`);
    },

    /**
     * Get page by slug
     * GET /admin/pages/slug/:slug
     */
    getPageBySlug: async (slug: string): Promise<AxiosResponse<AdminPage>> => {
        return apiClient.get(`/admin/pages/slug/${slug}`);
    },

    /**
     * Create page
     * POST /admin/pages
     */
    createPage: async (data: CreatePageData): Promise<AxiosResponse<AdminPage>> => {
        return apiClient.post('/admin/pages', data);
    },

    /**
     * Update page
     * PUT /admin/pages/:id
     */
    updatePage: async (id: number, data: Partial<CreatePageData>): Promise<AxiosResponse<AdminPage>> => {
        return apiClient.put(`/admin/pages/${id}`, data);
    },

    /**
     * Delete page
     * DELETE /admin/pages/:id
     */
    deletePage: async (id: number): Promise<AxiosResponse<void>> => {
        return apiClient.delete(`/admin/pages/${id}`);
    },
};

export default adminPagesService;
