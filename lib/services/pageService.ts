import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface Page {
    id: number;
    slug: string;
    title: string;
    body_content: string;
    meta_description: string;
}

// ========== PAGE SERVICE (PUBLIC CMS) ==========

const pageService = {
    /**
     * Get static page content (About Us, FAQ, Terms, Privacy Policy)
     * GET /pages/:slug
     */
    getPageBySlug: async (slug: string): Promise<AxiosResponse<Page>> => {
        return apiClient.get(`/pages/${slug}`);
    },
};

export default pageService;
