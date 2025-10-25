'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart } from 'lucide-react';
import { toggleWishlist, isInWishlist } from '@/lib/wishlist';
import { showToast } from './Toast';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  discount?: number;
}

export default function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  discount,
}: ProductCardProps) {
  const [isWished, setIsWished] = useState(false);

  useEffect(() => {
    setIsWished(isInWishlist(id));
  }, [id]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();

    const added = toggleWishlist({
      id,
      name,
      image,
      price,
      originalPrice,
      rating,
      discount,
    });

    setIsWished(added);
    showToast(
      added ? 'Added to wishlist!' : 'Removed from wishlist',
      added ? 'success' : 'info'
    );
  };

  return (
    <Link href={`/products/${id}`} className="group">
      <div className="space-y-3">
        {/* Product Image */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group" style={{ backgroundColor: '#dadee3' }}>
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isWished
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            title={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-5 h-5 ${isWished ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm md:text-base line-clamp-1">{name}</h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 md:w-4 md:h-4 ${
                    i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs md:text-sm">
              <span className="font-medium">{rating}</span>
              <span className="text-gray-500">/5</span>
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg md:text-xl font-bold">${price}</span>
            {originalPrice && (
              <>
                <span className="text-lg md:text-xl font-bold text-gray-400 line-through">
                  ${originalPrice}
                </span>
                {discount && (
                  <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    -{discount}%
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
