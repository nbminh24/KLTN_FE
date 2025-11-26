import apiClient, { createFormDataClient } from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface ChatbotMessageData {
    message: string;
    session_id: string;
}

export interface ChatbotResponse {
    responses: Array<{
        text: string;
    }>;
}

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

const aiService = {
    /**
     * Send message to Rasa AI chatbot
     * POST /ai/chatbot
     */
    sendChatbotMessage: async (data: ChatbotMessageData): Promise<AxiosResponse<ChatbotResponse>> => {
        return apiClient.post('/ai/chatbot', data);
    },

    /**
     * AI-powered image search - upload image to find similar products
     * POST /ai/search/image
     */
    imageSearch: async (imageFile: File): Promise<AxiosResponse<ImageSearchResponse>> => {
        const formData = new FormData();
        formData.append('image', imageFile);

        const formDataClient = createFormDataClient();
        return formDataClient.post('/ai/search/image', formData);
    },
};

export default aiService;
