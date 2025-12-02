'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
      <div className="bg-black text-white text-center py-2 text-xs md:text-sm">
        <p>
          Sign up and get 20% off to your first order.{' '}
          <Link href="/signup" className="underline font-medium">
            Sign Up Now
          </Link>
        </p>
      </div>

      {/* Main Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="text-xl md:text-2xl font-integral font-bold">
              LeCas
            </Link>

            {/* Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/products" className="hover:text-gray-600 transition">
                Shop
              </Link>
              <Link href="/sale" className="hover:text-gray-600 transition">
                On Sale
              </Link>
              <Link href="/new-arrivals" className="hover:text-gray-600 transition">
                New Arrivals
              </Link>
              <Link href="/chat" className="hover:text-gray-600 transition">
                LeCas Assistant
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
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-4 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleImageSearch}
                  className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                  title="Search by image"
                >
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </form>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              <button className="md:hidden">
                <Search className="w-6 h-6" />
              </button>
              <Link href="/wishlist" className="relative hover:text-gray-600 transition" title="Wishlist">
                <Heart className="w-6 h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative hover:text-gray-600 transition" title="Shopping Cart">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/profile" className="hover:text-gray-600 transition" title="Profile">
                <User className="w-6 h-6" />
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
