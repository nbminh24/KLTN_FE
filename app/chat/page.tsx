'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Trash2, Menu, X, Camera, Bot } from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    image?: string;
}

interface ChatSession {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: Date;
}

export default function ChatPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentSessionId, setCurrentSessionId] = useState<string>('1');
    const [sessions, setSessions] = useState<ChatSession[]>([
        {
            id: '1',
            title: 'New conversation',
            lastMessage: 'Hello! How can I help you today?',
            timestamp: new Date(),
        },
    ]);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! How can I help you today? 👋',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim() && !uploadedImage) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue || 'What products are similar to this?',
            sender: 'user',
            timestamp: new Date(),
            image: uploadedImage || undefined,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setUploadedImage(null);

        // Update session last message
        setSessions((prev) =>
            prev.map((session) =>
                session.id === currentSessionId
                    ? { ...session, lastMessage: userMessage.text, timestamp: new Date() }
                    : session
            )
        );

        // Simulate bot response
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: uploadedImage
                    ? 'Great! I found some similar products based on your image. Let me show you the best matches from our collection. Would you like to see items in a specific category or price range?'
                    : 'Thank you for your message! I can help you with product recommendations, order tracking, and general questions. How can I assist you?',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
        }, 1000);
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

    const handleNewChat = () => {
        const newSession: ChatSession = {
            id: Date.now().toString(),
            title: 'New conversation',
            lastMessage: 'Started a new conversation',
            timestamp: new Date(),
        };
        setSessions((prev) => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        setMessages([
            {
                id: '1',
                text: 'Hello! How can I help you today? 👋',
                sender: 'bot',
                timestamp: new Date(),
            },
        ]);
    };

    const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        if (currentSessionId === sessionId && sessions.length > 1) {
            const remainingSessions = sessions.filter((s) => s.id !== sessionId);
            setCurrentSessionId(remainingSessions[0].id);
        }
    };

    const handleSelectSession = (sessionId: string) => {
        setCurrentSessionId(sessionId);
        // In real app, load messages for this session
        setMessages([
            {
                id: '1',
                text: 'Hello! How can I help you today? 👋',
                sender: 'bot',
                timestamp: new Date(),
            },
        ]);
    };

    const groupSessionsByTime = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const grouped: { [key: string]: ChatSession[] } = {
            'Hôm nay': [],
            'Hôm qua': [],
            '7 ngày trước': [],
            'Cũ hơn': [],
        };

        sessions.forEach((session) => {
            const sessionDate = new Date(session.timestamp);
            if (sessionDate >= today) {
                grouped['Hôm nay'].push(session);
            } else if (sessionDate >= yesterday) {
                grouped['Hôm qua'].push(session);
            } else if (sessionDate >= sevenDaysAgo) {
                grouped['7 ngày trước'].push(session);
            } else {
                grouped['Cũ hơn'].push(session);
            }
        });

        return grouped;
    };

    const groupedSessions = groupSessionsByTime();

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
                    <div className="flex-1 overflow-y-auto p-3 space-y-4">
                        {Object.entries(groupedSessions).map(([group, sessionsInGroup]) =>
                            sessionsInGroup.length > 0 ? (
                                <div key={group}>
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                                        {group}
                                    </h3>
                                    <div className="space-y-1">
                                        {sessionsInGroup.map((session) => (
                                            <button
                                                key={session.id}
                                                onClick={() => handleSelectSession(session.id)}
                                                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 transition group ${currentSessionId === session.id ? 'bg-gray-200' : ''
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {session.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {session.lastMessage}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => handleDeleteSession(session.id, e)}
                                                        className="ml-2 opacity-0 group-hover:opacity-100 transition"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                                                    </button>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null
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
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-5 py-3 ${message.sender === 'user'
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-black'
                                            }`}
                                    >
                                        {message.image && (
                                            <div className="relative w-full h-48 mb-3 rounded-lg overflow-hidden">
                                                <Image
                                                    src={message.image}
                                                    alt="Uploaded"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <p className="text-sm leading-relaxed">{message.text}</p>
                                        <p
                                            className={`text-xs mt-2 ${message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'
                                                }`}
                                        >
                                            {message.timestamp.toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
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
                                    disabled={!inputValue.trim() && !uploadedImage}
                                    className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
