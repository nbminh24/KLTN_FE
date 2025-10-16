'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { ChevronRight, SlidersHorizontal, ChevronDown } from 'lucide-react';

// Mock data
const allProducts = [
  { id: '1', name: 'Gradient Graphic T-shirt', image: '/bmm32410_black_xl.webp', price: 145, originalPrice: 242, rating: 3.5, discount: 20, category: 'T-shirts', size: ['S', 'M', 'L', 'XL'] },
  { id: '2', name: 'Polo with Tipping Details', image: '/bmm32410_black_xl.webp', price: 180, originalPrice: 242, rating: 4.5, discount: 20, category: 'Shirts', size: ['M', 'L', 'XL'] },
  { id: '3', name: 'Black Striped T-shirt', image: '/bmm32410_black_xl.webp', price: 120, originalPrice: 150, rating: 5.0, discount: 30, category: 'T-shirts', size: ['S', 'M', 'L'] },
  { id: '4', name: 'Skinny Fit Jeans', image: '/bmm32410_black_xl.webp', price: 240, originalPrice: 260, rating: 3.5, discount: 20, category: 'Jeans', size: ['M', 'L', 'XL', 'XXL'] },
  { id: '5', name: 'Checkered Shirt', image: '/bmm32410_black_xl.webp', price: 180, rating: 4.5, category: 'Shirts', size: ['S', 'M', 'L'] },
  { id: '6', name: 'Sleeve Striped T-shirt', image: '/bmm32410_black_xl.webp', price: 130, originalPrice: 160, rating: 4.5, discount: 30, category: 'T-shirts', size: ['XS', 'S', 'M', 'L'] },
  { id: '7', name: 'Vertical Striped Shirt', image: '/bmm32410_black_xl.webp', price: 212, originalPrice: 232, rating: 5.0, discount: 20, category: 'Shirts', size: ['M', 'L', 'XL'] },
  { id: '8', name: 'Courage Graphic T-shirt', image: '/bmm32410_black_xl.webp', price: 145, rating: 4.0, category: 'T-shirts', size: ['S', 'M', 'L', 'XL'] },
  { id: '9', name: 'Loose Fit Bermuda Shorts', image: '/bmm32410_black_xl.webp', price: 80, rating: 3.0, category: 'Shorts', size: ['M', 'L', 'XL'] },
  { id: '10', name: 'Classic Hoodie', image: '/bmm32410_black_xl.webp', price: 195, rating: 4.8, category: 'Hoodie', size: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: '11', name: 'Faded Denim Jeans', image: '/bmm32410_black_xl.webp', price: 220, originalPrice: 250, rating: 4.2, discount: 12, category: 'Jeans', size: ['M', 'L', 'XL'] },
  { id: '12', name: 'Summer Shorts', image: '/bmm32410_black_xl.webp', price: 95, rating: 3.8, category: 'Shorts', size: ['S', 'M', 'L'] },
];

const ITEMS_PER_PAGE = 9;

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesSize = selectedSizes.length === 0 || selectedSizes.some(size => product.size.includes(size));
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesSize && matchesPrice;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <span className="text-gray-500">Home</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Casual</span>
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="border border-gray-200 rounded-2xl p-5 space-y-5 sticky top-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <SlidersHorizontal className="w-5 h-5 text-gray-400" />
                </div>

                <hr className="border-gray-200" />

                {/* Categories */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm">Category</h4>
                  {['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans'].map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>

                <hr className="border-gray-200" />

                {/* Price Range */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">Price</h4>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Colors */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">Colors</h4>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {['bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-orange-500', 'bg-blue-400', 'bg-blue-600', 'bg-purple-500', 'bg-pink-500', 'bg-white', 'bg-black'].map((color, index) => (
                      <button
                        key={index}
                        className={`w-9 h-9 rounded-full border-2 ${color} ${index === 0 ? 'border-black' : 'border-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Size */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 rounded-full text-xs ${
                          selectedSizes.includes(size)
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Dress Style */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">Dress Style</h4>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  {['Casual', 'Formal', 'Party', 'Gym'].map((style) => (
                    <div key={style} className="flex items-center justify-between text-gray-600 cursor-pointer hover:text-black">
                      <span>{style}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedSizes([]);
                    setPriceRange([0, 300]);
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition"
                >
                  Clear All Filters
                </button>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl md:text-2xl font-bold">Casual</h1>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-sm">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} Products
                  </span>
                  <button className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
                    <SlidersHorizontal className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
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
