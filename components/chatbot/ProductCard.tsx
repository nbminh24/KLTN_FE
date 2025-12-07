import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { ProductData } from '@/lib/types/chat';

interface ProductCardProps {
    product: ProductData;
    onAddToCart?: (productId: number) => void;
    onAddToWishlist?: (productId: number) => void;
}

export default function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition w-48 flex-shrink-0">
            {/* Product Image */}
            <Link href={`/products/${product.slug}`} target="_blank">
                <div className="relative h-48 bg-gray-100">
                    <Image
                        src={product.thumbnail || '/placeholder-product.png'}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition"
                    />
                    {!product.in_stock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                Hết hàng
                            </span>
                        </div>
                    )}
                </div>
            </Link>

            {/* Product Info */}
            <div className="p-3">
                {/* Category */}
                {product.category && (
                    <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                )}

                {/* Product Name */}
                <Link href={`/products/${product.slug}`} target="_blank">
                    <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                {product.rating && product.rating > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold text-gray-700">
                            {product.rating.toFixed(1)}
                        </span>
                        {product.reviews && (
                            <span className="text-xs text-gray-500">({product.reviews})</span>
                        )}
                    </div>
                )}

                {/* Price */}
                <p className="text-base font-bold text-gray-900 mb-3">
                    {formatPrice(product.price)}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onAddToCart?.(product.product_id)}
                        disabled={!product.in_stock}
                        className="flex-1 flex items-center justify-center gap-1 bg-black text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                        title={product.in_stock ? 'Thêm vào giỏ' : 'Hết hàng'}
                    >
                        <ShoppingCart className="w-3 h-3" />
                        <span>Thêm giỏ</span>
                    </button>
                    <button
                        onClick={() => onAddToWishlist?.(product.product_id)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        title="Thêm vào yêu thích"
                    >
                        <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
}
