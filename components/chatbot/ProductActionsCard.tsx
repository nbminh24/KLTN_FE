'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Check } from 'lucide-react';
import { ProductActionsCustomData, ColorOptionWithId, SizeOptionWithId } from '@/lib/types/chat';

interface ProductActionsCardProps {
    data: ProductActionsCustomData;
    onAddToCart: (productId: number, colorId: number, sizeId: number) => void;
}

export default function ProductActionsCard({ data, onAddToCart }: ProductActionsCardProps) {
    const [selectedColor, setSelectedColor] = useState<ColorOptionWithId | null>(null);
    const [selectedSize, setSelectedSize] = useState<SizeOptionWithId | null>(null);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) {
            return;
        }
        onAddToCart(data.product_id, selectedColor.id, selectedSize.id);
    };

    const canAddToCart = selectedColor !== null && selectedSize !== null;

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden my-2">
            <div className="flex gap-3 p-3">
                {data.product_thumbnail && (
                    <Link href={`/products/${data.product_id}`} target="_blank">
                        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                                src={data.product_thumbnail}
                                alt={data.product_name}
                                fill
                                className="object-cover hover:scale-105 transition"
                            />
                        </div>
                    </Link>
                )}

                <div className="flex-1 min-w-0">
                    <Link href={`/products/${data.product_id}`} target="_blank">
                        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition">
                            {data.product_name}
                        </h3>
                    </Link>
                    {data.product_price && (
                        <p className="text-base font-bold text-gray-900 mb-2">
                            {formatPrice(data.product_price)}
                        </p>
                    )}
                </div>
            </div>

            <div className="px-3 pb-3 space-y-3">
                {data.available_colors.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                            Chọn màu sắc:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {data.available_colors.map((color) => {
                                const isSelected = selectedColor?.id === color.id;
                                return (
                                    <button
                                        key={color.id}
                                        onClick={() => setSelectedColor(color)}
                                        className={`
                                            relative flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-xs font-semibold transition
                                            ${isSelected
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
                                            }
                                        `}
                                    >
                                        {color.hex && (
                                            <span
                                                className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'border-white' : 'border-gray-300'}`}
                                                style={{ backgroundColor: color.hex }}
                                            />
                                        )}
                                        <span>{color.name}</span>
                                        {isSelected && <Check className="w-3 h-3 ml-1" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {data.available_sizes.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                            Chọn kích thước:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {data.available_sizes.map((size) => {
                                const isSelected = selectedSize?.id === size.id;
                                return (
                                    <button
                                        key={size.id}
                                        onClick={() => setSelectedSize(size)}
                                        className={`
                                            relative px-3 py-1.5 rounded-lg border-2 text-xs font-semibold transition
                                            ${isSelected
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
                                            }
                                        `}
                                    >
                                        {size.name}
                                        {isSelected && (
                                            <Check className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 text-white rounded-full p-0.5" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <button
                    onClick={handleAddToCart}
                    disabled={!canAddToCart}
                    className={`
                        w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition
                        ${canAddToCart
                            ? 'bg-black text-white hover:bg-gray-800'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                    `}
                    title={!canAddToCart ? 'Vui lòng chọn màu sắc và kích thước' : 'Thêm vào giỏ hàng'}
                >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Thêm vào giỏ hàng</span>
                </button>

                {!canAddToCart && (
                    <p className="text-xs text-gray-500 text-center">
                        ⚠️ Vui lòng chọn màu sắc và kích thước
                    </p>
                )}
            </div>
        </div>
    );
}
