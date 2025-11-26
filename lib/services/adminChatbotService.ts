import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface ChatbotConversationFilters {
    page?: number;
    limit?: number;
    resolved?: boolean;
    search?: string;
}

export interface RecommendationFilters {
    page?: number;
    limit?: number;
    user_id?: number;
    product_id?: number;
}

// ========== ADMIN CHATBOT SERVICE ==========

const adminChatbotService = {
    /**
     * Get all chatbot conversations
     * GET /admin/chatbot/conversations
     */
    getConversations: async (filters?: ChatbotConversationFilters): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        return apiClient.get(`/admin/chatbot/conversations?${params.toString()}`);
    },

    /**
     * Get chatbot conversation details
     * GET /admin/chatbot/conversations/:id
     */
    getConversationById: async (id: string): Promise<AxiosResponse> => {
        return apiClient.get(`/admin/chatbot/conversations/${id}`);
    },

    /**
     * Get chatbot analytics
     * GET /admin/chatbot/analytics
     */
    getAnalytics: async (): Promise<AxiosResponse> => {
        return apiClient.get('/admin/chatbot/analytics');
    },

    /**
     * Get unanswered conversations
     * GET /admin/chatbot/unanswered
     */
    getUnansweredConversations: async (): Promise<AxiosResponse> => {
        return apiClient.get('/admin/chatbot/unanswered');
    },

    /**
     * Get all AI recommendations
     * GET /admin/ai/recommendations
     */
    getRecommendations: async (filters?: RecommendationFilters): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        return apiClient.get(`/admin/ai/recommendations?${params.toString()}`);
    },

    /**
     * Get AI recommendation statistics
     * GET /admin/ai/recommendations/stats
     */
    getRecommendationStats: async (): Promise<AxiosResponse> => {
        return apiClient.get('/admin/ai/recommendations/stats');
    },
};

export default adminChatbotService;
