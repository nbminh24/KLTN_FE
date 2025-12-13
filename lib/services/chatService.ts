import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface CreateSessionPayload {
    visitor_id?: string;
    customer_id?: number;
}

export interface ChatSession {
    id: number;
    customer_id: number | null;
    visitor_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateSessionResponse {
    session: ChatSession;
    is_new: boolean;
}

export interface ChatMessage {
    id: number;
    session_id: number;
    sender: 'customer' | 'bot' | 'admin';
    message: string;
    is_read: boolean;
    created_at: string;
}

export interface ChatHistoryResponse {
    messages: ChatMessage[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        has_more: boolean;
    };
}

export interface SendMessagePayload {
    session_id: number;
    message: string;
    metadata?: Record<string, any>;
}

export interface SendMessageResponse {
    customer_message: ChatMessage;
    bot_responses: ChatMessage[];
}

export interface MergeSessionPayload {
    visitor_id: string;
}

export interface MergeSessionResponse {
    message: string;
    merged_count: number;
    customer_id: number;
}

// ========== CHAT SERVICE ==========

const chatService = {
    /**
     * Create or get chat session
     * POST /chat/session
     * 
     * For visitors: provide visitor_id (UUID from Frontend)
     * For customers: provide customer_id (from JWT if logged in)
     */
    createOrGetSession: async (data: CreateSessionPayload): Promise<AxiosResponse<CreateSessionResponse>> => {
        return apiClient.post('/chat/session', data);
    },

    /**
     * Get chat history with pagination
     * GET /chat/history
     * 
     * Query params:
     * - session_id: ID of chat session (required)
     * - limit: Number of messages per page (default: 50)
     * - offset: Starting position (default: 0)
     */
    getChatHistory: async (
        sessionId: number,
        params?: {
            limit?: number;
            offset?: number;
        }
    ): Promise<AxiosResponse<ChatHistoryResponse>> => {
        const queryParams = new URLSearchParams();
        queryParams.append('session_id', sessionId.toString());
        if (params) {
            if (params.limit) queryParams.append('limit', params.limit.toString());
            if (params.offset) queryParams.append('offset', params.offset.toString());
        }
        return apiClient.get(`/chat/history?${queryParams.toString()}`);
    },

    /**
     * Send message to chatbot
     * POST /chat/send
     * 
     * Sends customer message → Saves to DB → Calls Rasa Server → Returns bot response
     */
    sendMessage: async (data: SendMessagePayload): Promise<AxiosResponse<SendMessageResponse>> => {
        return apiClient.post('/chat/send', data);
    },

    /**
     * Merge visitor chat sessions to customer account after login
     * PUT /chat/merge
     * 
     * Requires authentication (JWT).
     * Merges all sessions with visitor_id to customer_id from JWT.
     */
    mergeSession: async (data: MergeSessionPayload): Promise<AxiosResponse<MergeSessionResponse>> => {
        return apiClient.put('/chat/merge', data);
    },

    /**
     * Get chat sessions history
     * GET /chat/sessions/history
     */
    getSessionsHistory: async (params: {
        customer_id?: number;
        visitor_id?: string;
        page?: number;
        limit?: number;
    }): Promise<AxiosResponse> => {
        const queryParams = new URLSearchParams();
        if (params.customer_id) queryParams.append('customer_id', params.customer_id.toString());
        if (params.visitor_id) queryParams.append('visitor_id', params.visitor_id);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        return apiClient.get(`/chat/sessions/history?${queryParams.toString()}`);
    },

    /**
     * Get active chat session
     * GET /chat/sessions/active
     */
    getActiveSession: async (params: {
        customer_id?: number;
        visitor_id?: string;
    }): Promise<AxiosResponse> => {
        const queryParams = new URLSearchParams();
        if (params.customer_id) queryParams.append('customer_id', params.customer_id.toString());
        if (params.visitor_id) queryParams.append('visitor_id', params.visitor_id);
        return apiClient.get(`/chat/sessions/active?${queryParams.toString()}`);
    },

    /**
     * Delete chat session
     * DELETE /chat/sessions/:id
     */
    deleteSession: async (sessionId: number): Promise<AxiosResponse> => {
        return apiClient.delete(`/chat/sessions/${sessionId}`);
    },

    /**
     * Upload image in chat
     * POST /chat/upload-image
     */
    uploadImage: async (file: File): Promise<AxiosResponse<{ image_url: string }>> => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post('/chat/upload-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    /**
     * Mark message as read
     * PUT /chat/messages/:id/read
     */
    markMessageAsRead: async (messageId: number): Promise<AxiosResponse> => {
        return apiClient.put(`/chat/messages/${messageId}/read`);
    },
};

export default chatService;
