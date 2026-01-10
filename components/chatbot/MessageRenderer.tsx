import Image from 'next/image';
import { ChatMessage, RasaButton } from '@/lib/types/chat';
import ProductCarousel from './ProductCarousel';
import ActionButtons from './ActionButtons';
import SizeSelector from './SizeSelector';
import ColorSelector from './ColorSelector';
import OrderTimeline from './OrderTimeline';
import TicketConfirmation from './TicketConfirmation';
import RasaButtons from './RasaButtons';
import ProductActionsCard from './ProductActionsCard';
import ImageSearchResults from './ImageSearchResults';
import { useState, useEffect } from 'react';

interface MessageRendererProps {
    message: ChatMessage;
    onAddToCart: (productId: number) => void;
    onAddToWishlist: (productId: number) => void;
    onSizeSelect: (size: string) => void;
    onColorSelect: (color: string) => void;
    onButtonClick: (action: string, payload?: any) => void;
    onRasaButtonClick: (button: RasaButton) => void;
    onAddToCartWithVariant?: (productId: number, colorId: number, sizeId: number) => void;
}

const STICKERS = [
    '/sticker/elegant.png',
    '/sticker/sale.png',
    '/sticker/shipper.png',
    '/sticker/shopping.png',
    '/sticker/shopping2.png',
    '/sticker/shopping3.png',
    '/sticker/shopping4.png',
    '/sticker/use my money.png',
];

const getRandomSticker = () => {
    const shouldShowSticker = Math.random() < 0.3; // 30% chance
    if (!shouldShowSticker) return null;
    return STICKERS[Math.floor(Math.random() * STICKERS.length)];
};

export default function MessageRenderer({
    message,
    onAddToCart,
    onAddToWishlist,
    onSizeSelect,
    onColorSelect,
    onButtonClick,
    onRasaButtonClick,
    onAddToCartWithVariant,
}: MessageRendererProps) {
    const [randomSticker, setRandomSticker] = useState<string | null>(null);

    useEffect(() => {
        if (message.sender === 'bot') {
            setRandomSticker(getRandomSticker());
        }
    }, [message.id, message.sender]);
    // Render based on message type
    const renderContent = () => {
        // If message has custom data, render rich content
        if (message.custom) {
            switch (message.custom.type) {
                case 'products':
                case 'product_list':  // Backend uses "product_list"
                    return (
                        <>
                            {message.text && (
                                <p className="text-sm mb-2">{message.text}</p>
                            )}
                            <ProductCarousel
                                data={message.custom}
                            />
                        </>
                    );

                case 'buttons':
                    return (
                        <>
                            {message.text && (
                                <p className="text-sm mb-2">{message.text}</p>
                            )}
                            <ActionButtons
                                data={message.custom}
                                onButtonClick={onButtonClick}
                            />
                        </>
                    );

                case 'size_selector':
                    return (
                        <>
                            {message.text && (
                                <p className="text-sm mb-2">{message.text}</p>
                            )}
                            <SizeSelector
                                data={message.custom}
                                onSelect={onSizeSelect}
                            />
                        </>
                    );

                case 'color_selector':
                    return (
                        <>
                            {message.text && (
                                <p className="text-sm mb-2">{message.text}</p>
                            )}
                            <ColorSelector
                                data={message.custom}
                                onSelect={onColorSelect}
                            />
                        </>
                    );

                case 'order_status':
                    return (
                        <>
                            {message.text && (
                                <p className="text-sm mb-2">{message.text}</p>
                            )}
                            <OrderTimeline data={message.custom} />
                        </>
                    );

                case 'ticket_created':
                    return (
                        <>
                            {message.text && (
                                <p className="text-sm mb-2">{message.text}</p>
                            )}
                            <TicketConfirmation data={message.custom} />
                        </>
                    );

                case 'image':
                    return (
                        <>
                            {message.text && (
                                <p className="text-sm mb-2">{message.text}</p>
                            )}
                            <div className="relative w-full h-64 rounded-lg overflow-hidden mt-2">
                                <Image
                                    src={message.custom.url}
                                    alt={message.custom.alt || 'Image'}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            {message.custom.caption && (
                                <p className="text-xs text-gray-500 mt-2 italic">
                                    {message.custom.caption}
                                </p>
                            )}
                        </>
                    );

                case 'product_actions':
                    return (
                        <>
                            {message.text && (
                                <p className="text-sm mb-2">{message.text}</p>
                            )}
                            <ProductActionsCard
                                data={message.custom}
                                onAddToCart={(productId, colorId, sizeId) => {
                                    if (onAddToCartWithVariant) {
                                        onAddToCartWithVariant(productId, colorId, sizeId);
                                    }
                                }}
                            />
                        </>
                    );

                case 'image_search_results':
                    return (
                        <>
                            {/* Don't render backend text - ImageSearchResults has its own friendly header */}
                            <ImageSearchResults data={message.custom} />
                        </>
                    );

                case 'cart_summary':
                    return (
                        <>
                            {message.text && (
                                <p className="text-sm mb-2">{message.text}</p>
                            )}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 my-2 text-sm">
                                {message.custom.items && message.custom.items.length > 0 ? (
                                    <>
                                        {message.custom.items.map((item: any, index: number) => (
                                            <div key={index} className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{item.product_name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {item.size && item.color && `${item.color} • ${item.size} • `}
                                                        SL: {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-semibold text-gray-900">{(item.price / 1000).toFixed(0)}k đ</p>
                                            </div>
                                        ))}
                                        <div className="mt-3 pt-2 border-t border-gray-300">
                                            <div className="flex justify-between items-center">
                                                <p className="font-bold text-gray-900">Tổng:</p>
                                                <p className="font-bold text-lg text-black">{(message.custom.total / 1000).toFixed(0)}k đ</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-gray-500 text-center py-2">Giỏ hàng trống</p>
                                )}
                            </div>
                        </>
                    );

                default:
                    // Fallback to text if available
                    if (message.text) {
                        return <p className="text-sm whitespace-pre-line">{message.text}</p>;
                    }
                    return null;
            }
        }

        // User uploaded image
        if (message.image && message.sender === 'user') {
            return (
                <>
                    <div className="relative w-full h-48 mb-2 rounded-lg overflow-hidden">
                        <Image
                            src={message.image}
                            alt="Uploaded"
                            fill
                            className="object-cover"
                        />
                    </div>
                    {message.text && (
                        <p className="text-sm">{message.text}</p>
                    )}
                </>
            );
        }

        // Default: text only (if text exists)
        if (message.text) {
            return <p className="text-sm whitespace-pre-line">{message.text}</p>;
        }

        // No content to render
        return null;
    };

    return (
        <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[80%] rounded-2xl ${message.sender === 'user'
                    ? 'bg-black text-white px-4 py-2'
                    : 'bg-gray-100 text-black px-4 py-3'
                    }`}
            >
                {/* Render Content */}
                {renderContent()}

                {/* Rasa Buttons (only for bot messages) */}
                {message.sender === 'bot' && message.buttons && message.buttons.length > 0 && (
                    <RasaButtons
                        buttons={message.buttons}
                        disabled={message.buttons_disabled}
                        onButtonClick={onRasaButtonClick}
                    />
                )}

                {/* Random Sticker (only for bot messages) */}
                {message.sender === 'bot' && randomSticker && (
                    <div className="mt-2 flex justify-center">
                        <div className="relative w-20 h-20">
                            <Image
                                src={randomSticker}
                                alt="sticker"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                )}

                {/* Timestamp */}
                <p
                    className={`text-xs mt-2 ${message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'
                        }`}
                >
                    {message.timestamp.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>
        </div>
    );
}
