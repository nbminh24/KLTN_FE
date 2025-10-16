'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';

// Mock sale products
const saleProducts = [
  { id: '1', name: 'Gradient Graphic T-shirt', image: '/bmm32410_black_xl.webp', price: 145, originalPrice: 242, rating: 3.5, discount: 20 },
  { id: '2', name: 'Polo with Tipping Details', image: '/bmm32410_black_xl.webp', price: 180, originalPrice: 242, rating: 4.5, discount: 20 },
  { id: '3', name: 'Black Striped T-shirt', image: '/bmm32410_black_xl.webp', price: 120, originalPrice: 150, rating: 5.0, discount: 30 },
  { id: '4', name: 'Skinny Fit Jeans', image: '/bmm32410_black_xl.webp', price: 240, originalPrice: 260, rating: 3.5, discount: 20 },
  { id: '6', name: 'Sleeve Striped T-shirt', image: '/bmm32410_black_xl.webp', price: 130, originalPrice: 160, rating: 4.5, discount: 30 },
  { id: '7', name: 'Vertical Striped Shirt', image: '/bmm32410_black_xl.webp', price: 212, originalPrice: 232, rating: 5.0, discount: 20 },
  { id: '11', name: 'Faded Denim Jeans', image: '/bmm32410_black_xl.webp', price: 220, originalPrice: 250, rating: 4.2, discount: 12 },
  { id: '12', name: 'Summer Jacket', image: '/bmm32410_black_xl.webp', price: 180, originalPrice: 220, rating: 4.5, discount: 18 },
  { id: '13', name: 'Classic Hoodie', image: '/bmm32410_black_xl.webp', price: 160, originalPrice: 200, rating: 4.8, discount: 20 },
];

const ITEMS_PER_PAGE = 9;

export default function SalePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDiscount, setSelectedDiscount] = useState<string[]>([]);

  const filteredProducts = saleProducts.filter((product) => {
    if (selectedDiscount.length === 0) return true;
    return selectedDiscount.some(range => {
      if (range === '10-20') return product.discount >= 10 && product.discount <= 20;
      if (range === '20-30') return product.discount >= 20 && product.discount <= 30;
      if (range === '30+') return product.discount >= 30;
      return false;
    });
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
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
            <span className="font-medium">On Sale</span>
          </div>

          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-3xl p-8 md:p-12 mb-8">
            <h1 className="text-3xl md:text-5xl font-integral font-bold mb-4">
              FLASH SALE
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-2xl">
              Up to 50% OFF on selected items. Limited time only!
            </p>
            <div className="inline-block bg-white text-black px-6 py-2 rounded-full font-bold">
              Ends in 2 days
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filter Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="border border-gray-200 rounded-2xl p-5 space-y-5 sticky top-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <SlidersHorizontal className="w-5 h-5 text-gray-400" />
                </div>

                <hr className="border-gray-200" />

                {/* Discount Range */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm">Discount</h4>
                  {[
                    { label: '10% - 20%', value: '10-20' },
                    { label: '20% - 30%', value: '20-30' },
                    { label: '30% and above', value: '30+' },
                  ].map((range) => (
                    <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDiscount.includes(range.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDiscount([...selectedDiscount, range.value]);
                          } else {
                            setSelectedDiscount(selectedDiscount.filter((d) => d !== range.value));
                          }
                          setCurrentPage(1);
                        }}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedDiscount([]);
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition"
                >
                  Clear Filters
                </button>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold">
                  {filteredProducts.length} Products on Sale
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
