'use client';

import { useRef, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Send, X, MessageCircle, Bot, Camera, Maximize2 } from 'lucide-react';
import useChatStore from '@/lib/stores/useChatStore';
import MessageRenderer from './chatbot/MessageRenderer';
import TypingIndicator from './chatbot/TypingIndicator';
import chatService from '@/lib/services/chatService';
import { RasaButton } from '@/lib/types/chat';
import Image from 'next/image';

export default function Chatbot() {
  const pathname = usePathname();
  const router = useRouter();

  // Zustand store
  const {
    messages,
    isOpen,
    isTyping,
    unreadCount,
    setIsOpen,
    initSession,
    sendMessage,
    disableButtonsInMessage,
    addMessage,
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
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Hide chatbot on admin pages and chat page
  if (pathname?.startsWith('/admin') || pathname === '/chat') {
    return null;
  }

  const handleSend = async () => {
    if (!inputValue.trim() && !uploadedImage) return;

    setIsUploading(true);
    let imageUrl: string | undefined = undefined;

    try {
      // Upload image if exists and get URL
      if (uploadedImage) {
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        const file = new File([blob], 'uploaded-image.jpg', { type: 'image/jpeg' });
        const uploadResponse = await chatService.uploadImage(file);
        imageUrl = uploadResponse.data.image_url;
      }

      // Send message via store with image_url
      const messageText = inputValue || (imageUrl ? '📷 Tìm sản phẩm tương tự với ảnh này' : '');
      await sendMessage(messageText, imageUrl);

      // Clear input
      setInputValue('');
      setUploadedImage(null);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsUploading(false);
    }
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

  // Handlers for rich content interactions
  const handleAddToCart = (productId: number) => {
    sendMessage(`Thêm sản phẩm ${productId} vào giỏ hàng`);
  };

  const handleAddToCartWithVariant = async (productId: number, colorId: number, sizeId: number) => {
    await sendMessage('Thêm vào giỏ hàng', undefined, {
      action: 'add_to_cart',
      product_id: productId,
      color_id: colorId,
      size_id: sizeId,
    });
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

  const handleRasaButtonClick = async (button: RasaButton, messageId: string) => {
    // Disable buttons in the message immediately
    disableButtonsInMessage(messageId);

    // Display user's selection in chat
    addMessage({
      id: Date.now().toString(),
      text: button.title,
      sender: 'user',
      timestamp: new Date(),
    });

    // Send payload to backend
    await sendMessage(button.payload, undefined, {
      button_clicked: true,
      button_title: button.title,
    });
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
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
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
                <h3 className="font-bold">Trợ Lý Mua Sắm</h3>
                <p className="text-xs text-gray-300">Luôn sẵn sàng hỗ trợ bạn</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/chat')}
                className="hover:bg-gray-800 p-1 rounded"
                title="Mở toàn màn hình"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-800 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <MessageRenderer
                key={message.id}
                message={message}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onSizeSelect={handleSizeSelect}
                onColorSelect={handleColorSelect}
                onButtonClick={handleButtonClick}
                onRasaButtonClick={(button) => handleRasaButtonClick(button, message.id)}
                onAddToCartWithVariant={handleAddToCartWithVariant}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-2">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setInputValue('Theo dõi đơn hàng')}
                className="text-xs bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition"
              >
                Theo Dõi Đơn Hàng
              </button>
              <button
                onClick={() => setInputValue('Hiển thị hàng mới về')}
                className="text-xs bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition"
              >
                Hàng Mới Về
              </button>
              <button
                onClick={() => setInputValue('Hỗ trợ đổi trả')}
                className="text-xs bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition"
              >
                Đổi Trả
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
                title="Tải ảnh lên"
              >
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập tin nhắn của bạn..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={handleSend}
                disabled={(!inputValue.trim() && !uploadedImage) || isUploading}
                className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
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
      )}
    </>
  );
}
