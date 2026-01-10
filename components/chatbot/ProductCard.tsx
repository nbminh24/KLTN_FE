import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { ProductData } from '@/lib/types/chat';

interface ProductCardProps {
    product: ProductData;
}

export default function ProductCard({ product }: ProductCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition w-48 flex-shrink-0">
            {/* Product Image */}
            <Link href={`/products/${product.product_id}`} target="_blank">
                <div className="relative h-48 bg-gray-100">
                    <Image
                        src={product.thumbnail || '/placeholder-product.png'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 192px"
                        className="object-cover hover:scale-105 transition"
                    />
                    {!product.in_stock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                Hết Hàng
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
                <Link href={`/products/${product.product_id}`} target="_blank">
                    <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating - Only show if rating > 0 */}
                {product.rating && product.rating > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold text-gray-700">
                            {product.rating.toFixed(1)}
                        </span>
                        {product.reviews && product.reviews > 0 && (
                            <span className="text-xs text-gray-500">({product.reviews})</span>
                        )}
                    </div>
                )}

                {/* Price */}
                <p className="text-base font-bold text-gray-900">
                    {formatPrice(product.price)}
                </p>
            </div>
        </div>
    );
}
