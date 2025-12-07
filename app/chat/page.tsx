'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Trash2, Menu, X, Camera, Bot } from 'lucide-react';
import Header from '@/components/Header';
import useChatStore from '@/lib/stores/useChatStore';
import MessageRenderer from '@/components/chatbot/MessageRenderer';
import TypingIndicator from '@/components/chatbot/TypingIndicator';
import chatService from '@/lib/services/chatService';

export default function ChatPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Zustand store
    const {
        messages,
        isTyping,
        initSession,
        sendMessage,
        clearMessages,
    } = useChatStore();

    const [inputValue, setInputValue] = useState('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize session on mount
    useEffect(() => {
        initSession();
    }, [initSession]);

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
                imageUrl = uploadResponse.data.image_url;
            } catch (error) {
                console.error('Failed to upload image:', error);
            } finally {
                setIsUploading(false);
            }
        }

        // Send message via store
        const messageText = inputValue || (imageUrl ? 'Sản phẩm tương tự với ảnh này?' : '');
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
        clearMessages();
        await initSession();
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

                    {/* Chat History - TODO: Implement session history */}
                    <div className="flex-1 overflow-y-auto p-3">
                        <p className="text-xs text-gray-500 text-center py-4">
                            Session history coming soon
                        </p>
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
