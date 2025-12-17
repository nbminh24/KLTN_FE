import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface HandoffRequest {
    session_id: number;
    reason?: string;
}

export interface HandoffResponse {
    success: boolean;
    message: string;
    session: {
        id: number;
        status: 'human_pending' | 'human_active';
        handoff_requested_at: string;
        working_hours: boolean;
    };
}

export interface PendingConversation {
    session_id: number;
    customer: {
        id: number;
        name: string;
        email: string;
    } | null;
    visitor_id: string | null;
    handoff_reason: string | null;
    handoff_requested_at: string;
    created_at: string;
}

export interface PendingConversationsResponse {
    total: number;
    conversations: PendingConversation[];
}

export interface ActiveConversation {
    session_id: number;
    customer: {
        id: number;
        name: string;
        email: string;
    } | null;
    visitor_id: string | null;
    handoff_reason: string | null;
    handoff_accepted_at: string;
    updated_at: string;
}

export interface ActiveConversationsResponse {
    total: number;
    conversations: ActiveConversation[];
}

export interface AcceptConversationResponse {
    success: boolean;
    message: string;
    session: {
        id: number;
        status: 'human_active';
        assigned_admin_id: number;
        handoff_accepted_at: string;
    };
}

export interface CloseConversationResponse {
    success: boolean;
    message: string;
    session_id: number;
}

export interface AdminMessage {
    id: number;
    session_id: number;
    sender: 'admin';
    message: string;
    created_at: string;
}

export interface SendAdminMessageResponse {
    success: boolean;
    message: AdminMessage;
}

// ========== HANDOFF SERVICE ==========

const handoffService = {
    /**
     * Request human support (Customer side)
     * POST /api/v1/chat/handoff
     * 
     * Transitions session status from 'bot' to 'human_pending'
     */
    requestHandoff: async (data: HandoffRequest): Promise<AxiosResponse<HandoffResponse>> => {
        return apiClient.post('/api/v1/chat/handoff', data);
    },

    /**
     * Get pending handoff conversations (Admin side)
     * GET /api/v1/chat/conversations/pending
     * 
     * Returns list of customers waiting for human support
     */
    getPendingConversations: async (): Promise<AxiosResponse<PendingConversationsResponse>> => {
        return apiClient.get('/api/v1/chat/conversations/pending');
    },

    /**
     * Get admin's active conversations
     * GET /api/v1/chat/conversations/admin/:adminId
     * 
     * Returns conversations currently handled by this admin
     */
    getActiveConversations: async (adminId: number): Promise<AxiosResponse<ActiveConversationsResponse>> => {
        return apiClient.get(`/api/v1/chat/conversations/admin/${adminId}`);
    },

    /**
     * Accept pending conversation (Admin side)
     * POST /api/v1/chat/conversations/:sessionId/accept
     * 
     * Assigns conversation to admin and changes status to 'human_active'
     */
    acceptConversation: async (
        sessionId: number,
        adminId: number
    ): Promise<AxiosResponse<AcceptConversationResponse>> => {
        return apiClient.post(
            `/api/v1/chat/conversations/${sessionId}/accept?admin_id=${adminId}`
        );
    },

    /**
     * Close conversation (Admin side)
     * POST /api/v1/chat/conversations/:sessionId/close
     * 
     * Returns conversation to bot mode (status: 'bot')
     */
    closeConversation: async (
        sessionId: number,
        adminId: number
    ): Promise<AxiosResponse<CloseConversationResponse>> => {
        return apiClient.post(
            `/api/v1/chat/conversations/${sessionId}/close?admin_id=${adminId}`
        );
    },

    /**
     * Send admin message to customer
     * POST /api/v1/chat/conversations/:sessionId/admin-message
     * 
     * Saves message with sender='admin'
     */
    sendAdminMessage: async (
        sessionId: number,
        adminId: number,
        message: string
    ): Promise<AxiosResponse<SendAdminMessageResponse>> => {
        return apiClient.post(
            `/api/v1/chat/conversations/${sessionId}/admin-message?admin_id=${adminId}`,
            { message }
        );
    },
};

export default handoffService;
