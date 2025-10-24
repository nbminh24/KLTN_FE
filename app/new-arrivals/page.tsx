'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { ChevronRight, Sparkles } from 'lucide-react';

// Mock new arrival products
const newArrivals = [
  { id: '1', name: 'T-SHIRT WITH TAPE DETAILS', image: '/bmm32410_black_xl.webp', price: 120, rating: 4.5 },
  { id: '2', name: 'SKINNY FIT JEANS', image: '/bmm32410_black_xl.webp', price: 240, originalPrice: 260, rating: 3.5, discount: 20 },
  { id: '3', name: 'CHECKERED SHIRT', image: '/bmm32410_black_xl.webp', price: 180, rating: 4.5 },
  { id: '4', name: 'SLEEVE STRIPED T-SHIRT', image: '/bmm32410_black_xl.webp', price: 130, originalPrice: 160, rating: 4.5, discount: 30 },
  { id: '5', name: 'VERTICAL STRIPED SHIRT', image: '/bmm32410_black_xl.webp', price: 212, originalPrice: 232, rating: 5.0, discount: 20 },
  { id: '6', name: 'COURAGE GRAPHIC T-SHIRT', image: '/bmm32410_black_xl.webp', price: 145, rating: 4.0 },
  { id: '7', name: 'LOOSE FIT BERMUDA SHORTS', image: '/bmm32410_black_xl.webp', price: 80, rating: 3.0 },
  { id: '8', name: 'FADED SKINNY JEANS', image: '/bmm32410_black_xl.webp', price: 210, rating: 4.5 },
  { id: '9', name: 'CLASSIC WHITE HOODIE', image: '/bmm32410_black_xl.webp', price: 195, rating: 4.8 },
  { id: '10', name: 'SUMMER POLO SHIRT', image: '/bmm32410_black_xl.webp', price: 155, rating: 4.3 },
  { id: '11', name: 'CASUAL CARGO PANTS', image: '/bmm32410_black_xl.webp', price: 185, rating: 4.6 },
  { id: '12', name: 'GRAPHIC PRINT TEE', image: '/bmm32410_black_xl.webp', price: 95, rating: 4.2 },
];

const ITEMS_PER_PAGE = 12;

export default function NewArrivalsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(newArrivals.length / ITEMS_PER_PAGE);
  const paginatedProducts = newArrivals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">New Arrivals</span>
          </div>

          {/* Hero Section */}
          <div className="bg-black text-white rounded-3xl p-8 md:p-12 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl md:text-5xl font-integral font-bold">
                NEW ARRIVALS
              </h1>
            </div>
            <p className="text-lg md:text-xl max-w-2xl">
              Discover our latest collection of trendy styles. Fresh designs just landed!
            </p>
          </div>

          {/* Products Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold">
                {newArrivals.length} New Products
              </h2>
              <span className="text-sm text-gray-600">Updated daily</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
