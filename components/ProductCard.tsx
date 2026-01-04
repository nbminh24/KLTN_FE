'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import wishlistService from '@/lib/services/wishlistService';
import { showToast } from './Toast';
import axios from 'axios';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  discount?: number;
  variantId?: number; // Add variant_id prop for API
}

export default function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  discount,
  variantId,
}: ProductCardProps) {
  const [isWished, setIsWished] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Check if in wishlist on mount
  useEffect(() => {
    checkWishlistStatus();
  }, [id]);

  const checkWishlistStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await wishlistService.getWishlist();
      // Backend returns: { data: WishlistItem[], count: number }
      const wishlistData = response.data.data || [];

      // Check if this product's variant is in wishlist
      const inWishlist = wishlistData.some((item: any) =>
        item.product?.id === Number(id) || item.variant_id === variantId
      );
      setIsWished(inWishlist);
    } catch (err) {
      // Silent fail for wishlist check
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('access_token');
    if (!token) {
      showToast('Vui lòng đăng nhập để thêm vào danh sách yêu thích', 'error');
      return;
    }

    // Option 2: If no variantId, redirect to product detail page
    if (!variantId) {
      showToast('Chọn kích thước và màu sắc trên trang sản phẩm', 'info');
      window.location.href = `/products/${id}`;
      return;
    }

    setWishlistLoading(true);

    try {
      if (isWished) {
        // Remove from wishlist
        await wishlistService.removeFromWishlist(variantId);
        setIsWished(false);
        showToast('Đã xóa khỏi danh sách yêu thích', 'info');
      } else {
        // Add to wishlist
        await wishlistService.addToWishlist(variantId);
        setIsWished(true);
        showToast('Đã thêm vào danh sách yêu thích!', 'success');
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        showToast('Vui lòng đăng nhập để thêm vào danh sách yêu thích', 'error');
      } else {
        showToast('Không thể cập nhật danh sách yêu thích', 'error');
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Add to cart logic (will integrate with cart context later)
    showToast('Đã thêm vào giỏ hàng!', 'success');
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
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${isWished
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            title={isWished ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
          >
            <Heart className={`w-5 h-5 ${isWished ? 'fill-current' : ''}`} />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 bg-black text-white px-4 py-2 rounded-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-800 text-sm font-medium"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Thêm Vào Giỏ</span>
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
                  className={`w-3 h-3 md:w-4 md:h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
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
            <span className="text-lg md:text-xl font-bold">{(price * 25000).toLocaleString('vi-VN')}₫</span>
            {originalPrice && originalPrice > price && (
              <>
                <span className="text-lg md:text-xl font-bold text-gray-400 line-through">
                  {(originalPrice * 25000).toLocaleString('vi-VN')}₫
                </span>
                {discount && discount > 0 && (
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
