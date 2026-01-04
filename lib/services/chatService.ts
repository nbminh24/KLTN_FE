import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface CreateSessionPayload {
    visitor_id?: string;
    customer_id?: number;
    force_new?: boolean;
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
    session: {
        id: string;
        customer_id: number | null;
        visitor_id: string | null;
        customer?: {
            id: number;
            name: string;
            email: string;
        };
    };
    messages: ChatMessage[];
    total: number;
    limit: number;
    offset: number;
}

export interface SendMessagePayload {
    session_id: number;
    message: string;
    image_url?: string;
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

export interface SessionItem {
    id: string;
    customer_id: number | null;
    visitor_id: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface SessionsHistoryResponse {
    sessions: {
        today: SessionItem[];
        yesterday: SessionItem[];
        last_7_days: SessionItem[];
        older: SessionItem[];
    };
    total: number;
    page: number;
    limit: number;
}

export interface ActiveSessionResponse {
    session_id: string;
    customer_id: number | null;
    visitor_id: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

// ========== CHAT SERVICE ==========

const chatService = {
    /**
     * Create or get chat session
     * POST /api/v1/chat/session
     * 
     * For visitors: provide visitor_id (UUID from Frontend)
     * For customers: provide customer_id (from JWT if logged in)
     */
    createOrGetSession: async (data: CreateSessionPayload): Promise<AxiosResponse<CreateSessionResponse>> => {
        return apiClient.post('/api/v1/chat/session', data);
    },

    /**
     * Create new chat session (force new)
     * POST /api/v1/chat/session
     * 
     * Uses force_new parameter to create fresh conversation (ChatGPT-style)
     */
    createNewSession: async (): Promise<AxiosResponse<CreateSessionResponse>> => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

        if (token) {
            // For logged-in users: Use force_new parameter
            return apiClient.post('/api/v1/chat/session', { force_new: true });
        } else {
            // For guests: Generate new visitor_id to force new session
            const newVisitorId = crypto.randomUUID();
            if (typeof window !== 'undefined') {
                localStorage.setItem('visitor_id', newVisitorId);
            }
            return apiClient.post('/api/v1/chat/session', {
                visitor_id: newVisitorId,
                force_new: true
            });
        }
    },

    /**
     * Get chat history with pagination
     * GET /api/v1/chat/history
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
        return apiClient.get(`/api/v1/chat/history?${queryParams.toString()}`);
    },

    /**
     * Send message to chatbot
     * POST /api/v1/chat/send
     * 
     * Sends customer message → Saves to DB → Calls Rasa Server → Returns bot response
     */
    sendMessage: async (data: SendMessagePayload): Promise<AxiosResponse<SendMessageResponse>> => {
        return apiClient.post('/api/v1/chat/send', data);
    },

    /**
     * Merge visitor chat sessions to customer account after login
     * PUT /api/v1/chat/merge
     * 
     * Requires authentication (JWT).
     * Merges all sessions with visitor_id to customer_id from JWT.
     */
    mergeSession: async (data: MergeSessionPayload): Promise<AxiosResponse<MergeSessionResponse>> => {
        return apiClient.put('/api/v1/chat/merge', data);
    },

    /**
     * Get chat sessions history
     * GET /api/v1/chat/sessions/history
     */
    getSessionsHistory: async (params: {
        customer_id?: number;
        visitor_id?: string;
        page?: number;
        limit?: number;
    }): Promise<AxiosResponse<SessionsHistoryResponse>> => {
        const queryParams = new URLSearchParams();
        if (params.customer_id) queryParams.append('customer_id', params.customer_id.toString());
        if (params.visitor_id) queryParams.append('visitor_id', params.visitor_id);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        return apiClient.get(`/api/v1/chat/sessions/history?${queryParams.toString()}`);
    },

    /**
     * Get active chat session
     * GET /api/v1/chat/sessions/active
     */
    getActiveSession: async (params: {
        customer_id?: number;
        visitor_id?: string;
    }): Promise<AxiosResponse<ActiveSessionResponse>> => {
        const queryParams = new URLSearchParams();
        if (params.customer_id) queryParams.append('customer_id', params.customer_id.toString());
        if (params.visitor_id) queryParams.append('visitor_id', params.visitor_id);
        return apiClient.get(`/api/v1/chat/sessions/active?${queryParams.toString()}`);
    },

    /**
     * Delete chat session
     * DELETE /api/v1/chat/sessions/:id
     */
    deleteSession: async (sessionId: number): Promise<AxiosResponse<{ message: string; session_id: number }>> => {
        return apiClient.delete(`/api/v1/chat/sessions/${sessionId}`);
    },

    /**
     * Upload image in chat
     * POST /api/v1/chat/upload-image
     */
    uploadImage: async (file: File): Promise<AxiosResponse<{ url: string; filename: string; size: number }>> => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post('/api/v1/chat/upload-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    /**
     * Mark message as read
     * PUT /api/v1/chat/messages/:id/read
     */
    markMessageAsRead: async (messageId: number): Promise<AxiosResponse> => {
        return apiClient.put(`/api/v1/chat/messages/${messageId}/read`);
    },
};

export default chatService;
