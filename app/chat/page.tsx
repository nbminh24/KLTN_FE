'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Trash2, Menu, X, Camera, Bot, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import useChatStore from '@/lib/stores/useChatStore';
import MessageRenderer from '@/components/chatbot/MessageRenderer';
import TypingIndicator from '@/components/chatbot/TypingIndicator';
import chatService, { SessionItem } from '@/lib/services/chatService';

export default function ChatPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [sessionsHistory, setSessionsHistory] = useState<{
        today: SessionItem[];
        yesterday: SessionItem[];
        last_7_days: SessionItem[];
        older: SessionItem[];
    }>({ today: [], yesterday: [], last_7_days: [], older: [] });
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

    // Zustand store
    const {
        messages,
        isTyping,
        sessionId,
        initSession,
        sendMessage,
        clearMessages,
        loadHistory,
    } = useChatStore();

    const [inputValue, setInputValue] = useState('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize session and load history on mount
    useEffect(() => {
        initSession();
        loadSessionsHistory();
    }, [initSession]);

    // Update active session when sessionId changes
    useEffect(() => {
        if (sessionId) {
            setActiveSessionId(sessionId.toString());
        }
    }, [sessionId]);

    const loadSessionsHistory = async () => {
        try {
            setLoadingHistory(true);
            const token = localStorage.getItem('access_token');
            const visitorId = localStorage.getItem('visitor_id');

            let params: any = {};

            if (token) {
                // Logged-in user: Send empty params - backend will extract customer_id from JWT
                params = {};
            } else if (visitorId) {
                // Guest user: Send visitor_id
                params = { visitor_id: visitorId, limit: 50 };
            } else {
                // No auth - skip loading
                console.warn('[Chat] No token or visitor_id - skipping sessions history');
                setLoadingHistory(false);
                return;
            }

            const response = await chatService.getSessionsHistory(params);
            setSessionsHistory(response.data.sessions);
        } catch (error) {
            console.error('Failed to load sessions history:', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim() && !uploadedImage) return;

        let imageUrl = uploadedImage;

        // Upload image if exists
        if (uploadedImage) {
            setIsUploading(true);
            try {
                const response = await fetch(uploadedImage);
                const blob = await response.blob();
                const file = new File([blob], 'uploaded-image.jpg', { type: 'image/jpeg' });
                const uploadResponse = await chatService.uploadImage(file);
                console.log('[Chat] Upload response:', uploadResponse.data);
                imageUrl = uploadResponse.data.url;
                console.log('[Chat] Extracted imageUrl:', imageUrl);
            } catch (error) {
                console.error('Failed to upload image:', error);
            } finally {
                setIsUploading(false);
            }
        }

        // Send message via store
        const messageText = inputValue || (imageUrl ? 'Sản phẩm tương tự với ảnh này?' : '');
        console.log('[Chat] Before sendMessage - messageText:', messageText, 'imageUrl:', imageUrl);
        await sendMessage(messageText, imageUrl || undefined);

        // Clear input
        setInputValue('');
        setUploadedImage(null);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNewChat = async () => {
        try {
            console.log('[Chat] Creating new chat session...');

            // Clear current messages
            clearMessages();

            // Create brand new session using force_new parameter
            const response = await chatService.createNewSession();

            // Parse response and set new session
            const data = response.data as any;
            const newSessionId = data?.session?.id
                ? (typeof data.session.id === 'string' ? parseInt(data.session.id, 10) : data.session.id)
                : null;

            if (newSessionId) {
                console.log('[Chat] New session created:', newSessionId);
                setActiveSessionId(newSessionId.toString());

                // Refresh store with new session
                await initSession();

                // Refresh sidebar to show new session
                await loadSessionsHistory();
            } else {
                console.warn('[Chat] Failed to get new session ID from response');
                throw new Error('No session ID in response');
            }
        } catch (error) {
            console.error('[Chat] Failed to create new chat:', error);

            // Fallback: init session normally
            clearMessages();
            await initSession();
            await loadSessionsHistory();
        }
    };

    const handleSessionClick = async (session: SessionItem) => {
        try {
            setActiveSessionId(session.id);
            await loadHistory(Number(session.id));
        } catch (error) {
            console.error('Failed to load session history:', error);
        }
    };

    const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Delete this chat session?')) return;

        try {
            await chatService.deleteSession(Number(sessionId));
            loadSessionsHistory();
            if (activeSessionId === sessionId) {
                handleNewChat();
            }
        } catch (error) {
            console.error('Failed to delete session:', error);
        }
    };

    const formatSessionTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const renderSessionGroup = (title: string, sessions: SessionItem[]) => {
        if (sessions.length === 0) return null;

        return (
            <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 mb-2">{title}</h3>
                <div className="space-y-1">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            onClick={() => handleSessionClick(session)}
                            className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition ${activeSessionId === session.id
                                ? 'bg-black text-white'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        Chat {session.id}
                                    </p>
                                    <p className={`text-xs ${activeSessionId === session.id ? 'text-gray-300' : 'text-gray-500'
                                        }`}>
                                        {formatSessionTime(session.updated_at)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleDeleteSession(session.id, e)}
                                className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition ${activeSessionId === session.id ? 'text-white hover:text-red-600' : 'text-gray-400 hover:text-red-600'
                                    }`}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Handlers for rich content
    const handleAddToCart = (productId: number) => {
        sendMessage(`Thêm sản phẩm ${productId} vào giỏ hàng`);
    };

    const handleAddToWishlist = (productId: number) => {
        sendMessage(`Thêm sản phẩm ${productId} vào yêu thích`);
    };

    const handleSizeSelect = (size: string) => {
        sendMessage(size);
    };

    const handleColorSelect = (color: string) => {
        sendMessage(color);
    };

    const handleButtonClick = (action: string, payload?: any) => {
        if (action === 'quick_reply') {
            sendMessage(payload?.text || action);
        } else {
            sendMessage(action);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <Header />
            <div className="flex flex-1 bg-white overflow-hidden">
                {/* Sidebar */}
                <div
                    className={`${isSidebarOpen ? 'w-64' : 'w-0'
                        } bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col overflow-hidden`}
                >
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-gray-200">
                        <button
                            onClick={handleNewChat}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-medium">New Chat</span>
                        </button>
                    </div>

                    {/* Chat History */}
                    <div className="flex-1 overflow-y-auto p-3">
                        {loadingHistory ? (
                            <p className="text-xs text-gray-500 text-center py-4">Loading...</p>
                        ) : (
                            <>
                                {renderSessionGroup('Today', sessionsHistory.today)}
                                {renderSessionGroup('Yesterday', sessionsHistory.yesterday)}
                                {renderSessionGroup('Last 7 Days', sessionsHistory.last_7_days)}
                                {renderSessionGroup('Older', sessionsHistory.older)}
                                {Object.values(sessionsHistory).flat().length === 0 && (
                                    <p className="text-xs text-gray-500 text-center py-4">
                                        No chat history yet
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition"
                        >
                            <Menu className="w-5 h-5" />
                            <span className="text-sm">Collapse</span>
                        </button>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="bg-black text-white p-4 flex items-center justify-between border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            {!isSidebarOpen && (
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="p-2 hover:bg-gray-800 rounded-lg transition"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                            )}
                            <div className="bg-white p-2 rounded-full">
                                <Bot className="w-5 h-5 text-black" />
                            </div>
                            <div>
                                <h3 className="font-bold">LeCas Assistant</h3>
                                <p className="text-xs text-gray-300">Always here to help</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {messages.map((message) => (
                                <MessageRenderer
                                    key={message.id}
                                    message={message}
                                    onAddToCart={handleAddToCart}
                                    onAddToWishlist={handleAddToWishlist}
                                    onSizeSelect={handleSizeSelect}
                                    onColorSelect={handleColorSelect}
                                    onButtonClick={handleButtonClick}
                                    onRasaButtonClick={handleButtonClick}
                                />
                            ))}
                            {isTyping && <TypingIndicator />}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => setInputValue('Track my order')}
                                    className="text-xs bg-white px-4 py-2 rounded-full hover:bg-gray-100 transition border border-gray-200"
                                >
                                    Track Order
                                </button>
                                <button
                                    onClick={() => setInputValue('Show me new arrivals')}
                                    className="text-xs bg-white px-4 py-2 rounded-full hover:bg-gray-100 transition border border-gray-200"
                                >
                                    New Arrivals
                                </button>
                                <button
                                    onClick={() => setInputValue('Help with returns')}
                                    className="text-xs bg-white px-4 py-2 rounded-full hover:bg-gray-100 transition border border-gray-200"
                                >
                                    Returns
                                </button>
                                <button
                                    onClick={() => setInputValue('Product recommendations')}
                                    className="text-xs bg-white px-4 py-2 rounded-full hover:bg-gray-100 transition border border-gray-200"
                                >
                                    Recommendations
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Input */}
                    <div className="p-6 border-t border-gray-200 bg-white">
                        <div className="max-w-4xl mx-auto">
                            {/* Image Preview */}
                            {uploadedImage && (
                                <div className="mb-4 relative inline-block">
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-300">
                                        <Image
                                            src={uploadedImage}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setUploadedImage(null)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                                    title="Upload image"
                                >
                                    <Camera className="w-5 h-5 text-gray-600" />
                                </button>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message..."
                                    className="flex-1 px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black text-sm"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={(!inputValue.trim() && !uploadedImage) || isUploading}
                                    className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isUploading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
