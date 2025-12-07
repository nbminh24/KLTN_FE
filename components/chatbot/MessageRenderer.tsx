import Image from 'next/image';
import { ChatMessage } from '@/lib/types/chat';
import ProductCarousel from './ProductCarousel';
import ActionButtons from './ActionButtons';
import SizeSelector from './SizeSelector';
import ColorSelector from './ColorSelector';
import OrderTimeline from './OrderTimeline';
import TicketConfirmation from './TicketConfirmation';

interface MessageRendererProps {
    message: ChatMessage;
    onAddToCart: (productId: number) => void;
    onAddToWishlist: (productId: number) => void;
    onSizeSelect: (size: string) => void;
    onColorSelect: (color: string) => void;
    onButtonClick: (action: string, payload?: any) => void;
}

export default function MessageRenderer({
    message,
    onAddToCart,
    onAddToWishlist,
    onSizeSelect,
    onColorSelect,
    onButtonClick,
}: MessageRendererProps) {
    // Render based on message type
    const renderContent = () => {
        // If message has custom data, render rich content
        if (message.custom) {
            switch (message.custom.type) {
                case 'products':
                    return (
                        <>
                            {message.text && (
                                <p className="text-sm mb-2">{message.text}</p>
                            )}
                            <ProductCarousel
                                data={message.custom}
                                onAddToCart={onAddToCart}
                                onAddToWishlist={onAddToWishlist}
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

                default:
                    // Fallback to text
                    return <p className="text-sm whitespace-pre-line">{message.text}</p>;
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

        // Default: text only
        return <p className="text-sm whitespace-pre-line">{message.text}</p>;
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
