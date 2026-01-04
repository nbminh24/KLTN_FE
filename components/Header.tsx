'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Heart, Settings, Package, LogOut } from 'lucide-react';
import { getCartCount } from '@/lib/cart';
import { getWishlistCount } from '@/lib/wishlist';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-updated', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-updated', checkAuth);
    };
  }, []);

  return (
    <>
      {/* Top Banner */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white text-center py-2.5 text-xs md:text-sm">
          <p>
            Tham gia cộng đồng LeCas để trải nghiệm phong cách thanh lịch.{' '}
            <Link href="/login" className="underline font-medium hover:text-gray-300 transition">
              Đăng Nhập
            </Link>
            {' / '}
            <Link href="/signup" className="underline font-medium hover:text-gray-300 transition">
              Đăng Ký Ngay
            </Link>
          </p>
        </div>
      )}

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
                Khuyến Mãi
              </Link>
              <Link href="/new-arrivals" className="hover:text-gray-700 transition-colors duration-200">
                Hàng Mới
              </Link>
              <Link href="/chat" className="hover:text-gray-700 transition-colors duration-200">
                Trợ Lý LeCas
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4 md:gap-5">
              <Link href="/wishlist" className="relative hover:text-gray-700 transition-colors duration-200" title="Danh sách yêu thích">
                <Heart className="w-7 h-7" />
              </Link>
              <Link href="/cart" className="relative hover:text-gray-700 transition-colors duration-200" title="Giỏ hàng">
                <ShoppingCart className="w-7 h-7" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:text-gray-700 transition-colors duration-200" title="Tài khoản">
                    <User className="w-7 h-7" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Tài Khoản Của Tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="w-4 h-4" />
                        Hồ Sơ
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer">
                        <Package className="w-4 h-4" />
                        Đơn Hàng
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/addresses" className="cursor-pointer">
                        <Settings className="w-4 h-4" />
                        Cài Đặt
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    Đăng Xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
