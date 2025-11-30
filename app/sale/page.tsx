'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { ChevronRight, Loader2 } from 'lucide-react';
import productService, { Product } from '@/lib/services/productService';

const ITEMS_PER_PAGE = 20;

export default function SalePage() {
  const [currentPage, setCurrentPage] = useState(1);

  // API state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch on-sale products from API
  useEffect(() => {
    fetchOnSale();
  }, [currentPage]);

  const fetchOnSale = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await productService.getOnSale(currentPage, ITEMS_PER_PAGE);

      setProducts(response.data.data);
      setTotalPages(response.data.metadata.total_pages);
      setTotalProducts(response.data.metadata.total);
    } catch (err: any) {
      console.error('Error fetching on-sale products:', err);
      setError('Failed to load sale products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <div className="bg-black text-white rounded-3xl p-8 md:p-12 mb-8">
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

          {/* Products Count */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold">
              {totalProducts} Products on Sale
            </h2>
            <span className="text-sm text-gray-600">Limited time offer</span>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => fetchOnSale()}
                className="mt-2 text-red-600 hover:underline font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id.toString()}
                  name={product.name}
                  image={product.thumbnail_url || '/bmm32410_black_xl.webp'}
                  price={product.selling_price}
                  originalPrice={product.original_price}
                  rating={product.average_rating || 0}
                  discount={product.discount_percentage}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
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
