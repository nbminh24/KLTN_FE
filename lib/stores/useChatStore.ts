import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import chatService from '@/lib/services/chatService';
import { ChatMessage, ChatSession } from '@/lib/types/chat';

interface ChatStore {
    // State
    sessionId: number | null;
    visitorId: string | null;
    messages: ChatMessage[];
    isOpen: boolean;
    isLoading: boolean;
    isTyping: boolean;
    unreadCount: number;
    currentProduct: number | null;

    // Actions
    setIsOpen: (open: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    setIsTyping: (typing: boolean) => void;
    setCurrentProduct: (productId: number | null) => void;

    initSession: () => Promise<void>;
    loadHistory: () => Promise<void>;
    sendMessage: (text: string, image?: string) => Promise<void>;
    addMessage: (message: ChatMessage) => void;
    mergeSession: () => Promise<void>;
    clearMessages: () => void;
    markAsRead: () => void;
}

const useChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            // Initial State
            sessionId: null,
            visitorId: null,
            messages: [],
            isOpen: false,
            isLoading: false,
            isTyping: false,
            unreadCount: 0,
            currentProduct: null,

            // Actions
            setIsOpen: (open) => {
                set({ isOpen: open });
                if (open) {
                    get().markAsRead();
                }
            },

            setIsLoading: (loading) => set({ isLoading: loading }),

            setIsTyping: (typing) => set({ isTyping: typing }),

            setCurrentProduct: (productId) => set({ currentProduct: productId }),

            // Initialize session (guest or logged-in)
            initSession: async () => {
                try {
                    set({ isLoading: true });

                    // Get or create visitor ID
                    let visitorId = get().visitorId;
                    if (!visitorId) {
                        visitorId = crypto.randomUUID();
                        set({ visitorId });
                    }

                    // Create or get session
                    const response = await chatService.createOrGetSession({
                        visitor_id: visitorId,
                    });

                    // Debug log - detailed (serialize to see full structure)
                    console.log('[ChatStore] === DEBUGGING SESSION RESPONSE ===');
                    console.log('[ChatStore] Full response:', JSON.stringify(response, null, 2));
                    console.log('[ChatStore] Response.data:', JSON.stringify(response.data, null, 2));
                    console.log('[ChatStore] Response data type:', typeof response.data);

                    // Cast to any for flexible parsing
                    const data = response.data as any;

                    console.log('[ChatStore] Keys in response.data:', data ? Object.keys(data) : 'null/undefined');
                    console.log('[ChatStore] Session object:', data?.session);
                    console.log('[ChatStore] Session ID:', data?.session?.id);
                    console.log('[ChatStore] Direct ID:', data?.id);
                    console.log('[ChatStore] === END DEBUG ===');

                    // Handle different response structures
                    let sessionId: number | null = null;
                    let isNew = true;

                    // Try different possible structures
                    if (data?.session?.id) {
                        // Standard structure: {session: {id}, is_new}
                        console.log('[ChatStore] Using standard structure');
                        // Parse to number in case backend returns string
                        sessionId = typeof data.session.id === 'string'
                            ? parseInt(data.session.id, 10)
                            : data.session.id;
                        isNew = data.is_new ?? true;
                    } else if (data?.id && !data?.session) {
                        // Direct structure: {id, visitor_id, ...}
                        console.log('[ChatStore] Using direct structure');
                        sessionId = data.id;
                        isNew = data.is_new ?? true;
                    } else if (data?.data?.session?.id) {
                        // Nested structure: {data: {session: {id}}}
                        console.log('[ChatStore] Using nested structure');
                        sessionId = data.data.session.id;
                        isNew = data.data.is_new ?? true;
                    }

                    if (!sessionId) {
                        console.warn('[ChatStore] ⚠️ Could not find session ID in any known structure');
                        console.warn('[ChatStore] ⚠️ Backend may not be running or returning wrong format');
                        console.warn('[ChatStore] ⚠️ Falling back to local mode...');

                        // Don't throw - just use fallback
                        throw new Error('FALLBACK_MODE');
                    }

                    const sessionData = {
                        sessionId,
                        isLoading: false,
                    };

                    set(sessionData);

                    console.log('[ChatStore] Session initialized:', sessionId);

                    // Load history if not new session
                    if (!isNew) {
                        await get().loadHistory();
                    } else {
                        // Add welcome message for new session
                        set((state) => ({
                            messages: [
                                ...state.messages,
                                {
                                    id: '1',
                                    text: 'Xin chào! Mình là trợ lý ảo của LeCas. Mình có thể giúp bạn tìm sản phẩm, tư vấn size, tra đơn hàng và nhiều thứ khác. Bạn cần gì hôm nay? 😊',
                                    sender: 'bot',
                                    timestamp: new Date(),
                                },
                            ],
                        }));
                    }
                } catch (error) {
                    console.error('[ChatStore] Failed to init session:', error);

                    // Log detailed error
                    if (error instanceof Error) {
                        console.error('[ChatStore] Error message:', error.message);
                    }

                    set({ isLoading: false });

                    // Fallback: create local session
                    console.warn('[ChatStore] Using fallback local session');
                    set({
                        sessionId: null,
                        messages: [
                            {
                                id: '1',
                                text: 'Xin chào! Mình là trợ lý ảo của LeCas. Bạn cần gì hôm nay? 😊',
                                sender: 'bot',
                                timestamp: new Date(),
                            },
                        ],
                    });
                }
            },

            // Load chat history
            loadHistory: async () => {
                const sessionId = get().sessionId;
                if (!sessionId) return;

                try {
                    const response = await chatService.getChatHistory(sessionId, {
                        limit: 50,
                        offset: 0,
                    });

                    const historyMessages: ChatMessage[] = response.data.messages.map((msg: any) => ({
                        id: msg.id.toString(),
                        text: msg.message,
                        sender: msg.sender === 'customer' ? 'user' : 'bot',
                        timestamp: new Date(msg.created_at),
                        custom: msg.custom || undefined,
                    }));

                    set({ messages: historyMessages });
                } catch (error) {
                    console.error('Failed to load history:', error);
                }
            },

            // Send message to bot
            sendMessage: async (text: string, image?: string) => {
                const sessionId = get().sessionId;

                // If no session, init first
                if (!sessionId) {
                    await get().initSession();
                }

                const currentSessionId = get().sessionId;
                if (!currentSessionId) {
                    console.error('No session ID available');
                    return;
                }

                try {
                    // Add user message to UI immediately
                    const userMessage: ChatMessage = {
                        id: Date.now().toString(),
                        text: text || 'Sản phẩm tương tự với ảnh này?',
                        sender: 'user',
                        timestamp: new Date(),
                        image: image,
                    };

                    set((state) => ({
                        messages: [...state.messages, userMessage],
                    }));

                    // Show typing indicator
                    set({ isTyping: true });

                    // Send to backend
                    const response = await chatService.sendMessage({
                        session_id: currentSessionId,
                        message: text,
                    });

                    console.log('[ChatStore] Send message response:', JSON.stringify(response.data, null, 2));

                    // Hide typing indicator
                    set({ isTyping: false });

                    // Check if bot_responses exists (backend uses bot_messages instead)
                    const data = response.data as any;
                    const botResponses = data?.bot_responses || data?.bot_messages || data?.responses || [];

                    if (!botResponses || botResponses.length === 0) {
                        console.warn('[ChatStore] ⚠️ No bot responses in API response');
                        console.warn('[ChatStore] Response keys:', Object.keys(data || {}));

                        // Add fallback message
                        const fallbackMessage: ChatMessage = {
                            id: (Date.now() + 1).toString(),
                            text: 'Bot đang được kết nối với Rasa server. Vui lòng kiểm tra lại.',
                            sender: 'bot',
                            timestamp: new Date(),
                        };

                        set((state) => ({
                            messages: [...state.messages, fallbackMessage],
                        }));
                        return;
                    }

                    // Add bot responses to UI
                    const botMessages: ChatMessage[] = botResponses.map((msg: any) => ({
                        id: msg.id?.toString() || Date.now().toString(),
                        text: msg.message || msg.text || 'No message',
                        sender: 'bot' as const,
                        timestamp: new Date(msg.created_at || new Date()),
                        custom: msg.custom || undefined,
                    }));

                    set((state) => ({
                        messages: [...state.messages, ...botMessages],
                    }));

                    // Update unread count if widget is closed
                    if (!get().isOpen) {
                        set((state) => ({
                            unreadCount: state.unreadCount + botMessages.length,
                        }));
                    }

                } catch (error) {
                    console.error('Failed to send message:', error);
                    set({ isTyping: false });

                    // Add error message
                    const errorMessage: ChatMessage = {
                        id: (Date.now() + 1).toString(),
                        text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
                        sender: 'bot',
                        timestamp: new Date(),
                    };

                    set((state) => ({
                        messages: [...state.messages, errorMessage],
                    }));
                }
            },

            // Add message manually
            addMessage: (message) => {
                set((state) => ({
                    messages: [...state.messages, message],
                }));
            },

            // Merge sessions after login
            mergeSession: async () => {
                const visitorId = get().visitorId;
                if (!visitorId) return;

                try {
                    await chatService.mergeSession({ visitor_id: visitorId });

                    // Clear visitor ID after merge
                    set({ visitorId: null });

                    // Reload session
                    await get().initSession();
                } catch (error) {
                    console.error('Failed to merge session:', error);
                }
            },

            // Clear all messages
            clearMessages: () => {
                set({ messages: [] });
            },

            // Mark messages as read
            markAsRead: () => {
                set({ unreadCount: 0 });
            },
        }),
        {
            name: 'chat-storage',
            partialize: (state) => ({
                visitorId: state.visitorId,
                sessionId: state.sessionId,
            }),
        }
    )
);

export default useChatStore;
