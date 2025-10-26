'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Send, X, MessageCircle, Bot, Camera, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string;
}

export default function Chatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
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

  // Hide chatbot on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

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

  return (
    <>
      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-black text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="font-bold">Shopping Assistant</h3>
                <p className="text-xs text-gray-300">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-800 p-1 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-black'
                  }`}
                >
                  {message.image && (
                    <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden">
                      <Image
                        src={message.image}
                        alt="Uploaded"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'
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

          {/* Quick Actions */}
          <div className="px-4 pb-2">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setInputValue('Track my order')}
                className="text-xs bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition"
              >
                Track Order
              </button>
              <button
                onClick={() => setInputValue('Show me new arrivals')}
                className="text-xs bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition"
              >
                New Arrivals
              </button>
              <button
                onClick={() => setInputValue('Help with returns')}
                className="text-xs bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition"
              >
                Returns
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            {/* Image Preview */}
            {uploadedImage && (
              <div className="mb-3 relative inline-block">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-300">
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
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            <div className="flex gap-2">
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
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() && !uploadedImage}
                className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
