'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, X, Camera, Heart } from 'lucide-react';
import { getCartCount } from '@/lib/cart';
import { getWishlistCount } from '@/lib/wishlist';

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Update cart and wishlist count on mount and when they change
  useEffect(() => {
    const updateCounts = () => {
      setCartCount(getCartCount());
      setWishlistCount(getWishlistCount());
    };

    updateCounts(); // Initial count
    window.addEventListener('cart-updated', updateCounts);
    window.addEventListener('wishlist-updated', updateCounts);

    return () => {
      window.removeEventListener('cart-updated', updateCounts);
      window.removeEventListener('wishlist-updated', updateCounts);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&mode=text`);
      setSearchQuery('');
    }
  };

  const handleImageSearch = () => {
    router.push('/search?mode=image');
  };
  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white text-center py-2.5 text-xs md:text-sm">
        <p>
          Đăng ký và nhận giảm 20% cho đơn hàng đầu tiên.{' '}
          <Link href="/signup" className="underline font-medium hover:text-gray-300 transition">
            Đăng Ký Ngay
          </Link>
        </p>
      </div>

      {/* Main Header - Sticky */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo with Image */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src="/lecas_logo.png"
                  alt="LeCas Logo"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
              <span className="text-xl md:text-2xl font-integral font-bold group-hover:text-gray-700 transition">
                LeCas
              </span>
            </Link>

            {/* Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center gap-8 font-medium" style={{ fontSize: '17px' }}>
              <Link href="/products" className="hover:text-gray-700 transition-colors duration-200">
                Cửa Hàng
              </Link>
              <Link href="/sale" className="hover:text-gray-700 transition-colors duration-200">
                Giảm Giá
              </Link>
              <Link href="/new-arrivals" className="hover:text-gray-700 transition-colors duration-200">
                Hàng Mới
              </Link>
              <Link href="/chat" className="hover:text-gray-700 transition-colors duration-200">
                Trợ Lý LeCas
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <form onSubmit={handleSearch} className="relative w-full flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-12 pr-4 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleImageSearch}
                  className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                  title="Tìm kiếm bằng hình ảnh"
                >
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </form>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4 md:gap-5">
              <button className="md:hidden hover:text-gray-700 transition">
                <Search className="w-7 h-7" />
              </button>
              <Link href="/wishlist" className="relative hover:text-gray-700 transition-colors duration-200" title="Yêu thích">
                <Heart className="w-7 h-7" />
              </Link>
              <Link href="/cart" className="relative hover:text-gray-700 transition-colors duration-200" title="Giỏ hàng">
                <ShoppingCart className="w-7 h-7" />
              </Link>
              <Link href="/profile" className="hover:text-gray-700 transition-colors duration-200" title="Tài khoản">
                <User className="w-7 h-7" />
              </Link>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4 px-0">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <button
                type="button"
                onClick={handleImageSearch}
                className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                title="Search by image"
              >
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
            </form>
          </div>
        </div>
      </header>
    </>
  );
}
