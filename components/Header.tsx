import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';

export default function Header() {
  return (
    <>
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-2 text-sm">
        <p>
          Sign up and get 20% off to your first order.{' '}
          <Link href="/signup" className="underline font-medium">
            Sign Up Now
          </Link>
        </p>
      </div>

      {/* Main Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link href="/" className="text-2xl md:text-3xl font-integral font-bold">
              LeCas
            </Link>

            {/* Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/products" className="hover:text-gray-600 transition">
                Shop
              </Link>
              <Link href="/sale" className="hover:text-gray-600 transition">
                On Sale
              </Link>
              <Link href="/new-arrivals" className="hover:text-gray-600 transition">
                New Arrivals
              </Link>
              <Link href="/brands" className="hover:text-gray-600 transition">
                Brands
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              <button className="md:hidden">
                <Search className="w-6 h-6" />
              </button>
              <Link href="/cart" className="hover:text-gray-600 transition">
                <ShoppingCart className="w-6 h-6" />
              </Link>
              <Link href="/profile" className="hover:text-gray-600 transition">
                <User className="w-6 h-6" />
              </Link>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
