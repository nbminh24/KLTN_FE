import { createFormDataClient } from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface ImageSearchResult {
    product_id: number;
    product_name: string;
    similarity_score: number;
    thumbnail_url: string;
    selling_price: number;
}

export interface ImageSearchResponse {
    message: string;
    results: ImageSearchResult[];
    count: number;
}

// ========== AI SERVICE ==========
// Note: Chat APIs have been moved to chatService.ts

const aiService = {
    /**
     * AI-powered image search - upload image to find similar products
     * POST /ai/search/image
     * 
     * Uses computer vision to find similar products based on uploaded image.
     */
    imageSearch: async (imageFile: File): Promise<AxiosResponse<ImageSearchResponse>> => {
        const formData = new FormData();
        formData.append('image', imageFile);

        const formDataClient = createFormDataClient();
        return formDataClient.post('/ai/search/image', formData);
    },
};

export default aiService;
