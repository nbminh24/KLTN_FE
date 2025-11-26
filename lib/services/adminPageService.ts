import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface CreatePageData {
    title: string;
    slug: string;
    body_content: string;
    meta_description: string;
    status: 'published' | 'draft';
}

export interface UpdatePageData {
    title?: string;
    slug?: string;
    body_content?: string;
    meta_description?: string;
    status?: 'published' | 'draft';
}

// ========== ADMIN PAGE SERVICE (CMS) ==========

const adminPageService = {
    /**
     * Create new CMS page
     * POST /admin/pages
     */
    createPage: async (data: CreatePageData): Promise<AxiosResponse> => {
        return apiClient.post('/admin/pages', data);
    },

    /**
     * Get all CMS pages
     * GET /admin/pages
     */
    getAllPages: async (): Promise<AxiosResponse> => {
        return apiClient.get('/admin/pages');
    },

    /**
     * Get CMS page details for editing
     * GET /admin/pages/:id
     */
    getPageById: async (id: number): Promise<AxiosResponse> => {
        return apiClient.get(`/admin/pages/${id}`);
    },

    /**
     * Update CMS page
     * PUT /admin/pages/:id
     */
    updatePage: async (id: number, data: UpdatePageData): Promise<AxiosResponse> => {
        return apiClient.put(`/admin/pages/${id}`, data);
    },

    /**
     * Update CMS page by slug
     * PUT /admin/pages/:slug
     */
    updatePageBySlug: async (slug: string, data: UpdatePageData): Promise<AxiosResponse> => {
        return apiClient.put(`/admin/pages/${slug}`, data);
    },

    /**
     * Delete CMS page
     * DELETE /admin/pages/:id
     */
    deletePage: async (id: number): Promise<AxiosResponse> => {
        return apiClient.delete(`/admin/pages/${id}`);
    },
};

export default adminPageService;
