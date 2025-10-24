import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Home, Search, Package, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 py-12">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 Illustration */}
            <div className="mb-8">
              <h1 className="text-[120px] md:text-[180px] font-integral font-bold leading-none text-gray-200">
                404
              </h1>
              <div className="relative -mt-20">
                <Package className="w-24 h-24 text-gray-400 mx-auto" />
              </div>
            </div>

            {/* Error Message */}
            <h2 className="text-3xl md:text-4xl font-integral font-bold mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track!
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <form className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:border-black transition"
                />
              </form>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Link
                href="/"
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-black transition group"
              >
                <Home className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-sm">Home</p>
              </Link>
              <Link
                href="/products"
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-black transition group"
              >
                <ShoppingBag className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-sm">Shop</p>
              </Link>
              <Link
                href="/sale"
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-black transition group"
              >
                <Package className="w-8 h-8 mx-auto mb-3 text-red-500 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-sm">Sale</p>
              </Link>
              <Link
                href="/orders"
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-black transition group"
              >
                <Package className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-sm">Orders</p>
              </Link>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition inline-flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
              <Link
                href="/support"
                className="border border-gray-300 text-black px-8 py-4 rounded-full font-medium hover:bg-gray-50 transition inline-flex items-center justify-center gap-2"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
