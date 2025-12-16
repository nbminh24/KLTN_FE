import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { ProductsCustomData, ProductListCustomData } from '@/lib/types/chat';

interface ProductCarouselProps {
    data: ProductsCustomData | ProductListCustomData;
}

export default function ProductCarousel({ data }: ProductCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    if (!data.products || data.products.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">No products found.</p>
            </div>
        );
    }

    return (
        <div className="my-2">
            {/* Header */}
            {data.total && data.total > 0 && (
                <div className="mb-2">
                    <p className="text-xs text-gray-600">
                        Found <span className="font-bold">{data.total}</span> products
                    </p>
                </div>
            )}

            {/* Carousel Container */}
            <div className="relative group">
                {/* Left Arrow */}
                {data.products.length > 1 && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition hover:bg-gray-100"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                )}

                {/* Products Scroll */}
                <div
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {data.products.map((product) => (
                        <ProductCard
                            key={product.product_id}
                            product={product}
                        />
                    ))}
                </div>

                {/* Right Arrow */}
                {data.products.length > 1 && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition hover:bg-gray-100"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                )}
            </div>

            {/* View All Link (if more than shown) */}
            {data.total && data.total > data.products.length && (
                <div className="mt-3 text-center">
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
                        View all {data.total} products →
                    </button>
                </div>
            )}

            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    );
}
