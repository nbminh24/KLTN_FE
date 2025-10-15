'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { ChevronRight, SlidersHorizontal, ChevronDown } from 'lucide-react';

// Mock data
const products = [
  { id: '1', name: 'Gradient Graphic T-shirt', image: '/product.avif', price: 145, originalPrice: 242, rating: 3.5, discount: 20 },
  { id: '2', name: 'Polo with Tipping Details', image: '/product.avif', price: 180, originalPrice: 242, rating: 4.5, discount: 20 },
  { id: '3', name: 'Black Striped T-shirt', image: '/product.avif', price: 120, originalPrice: 150, rating: 5.0, discount: 30 },
  { id: '4', name: 'Skinny Fit Jeans', image: '/product.avif', price: 240, originalPrice: 260, rating: 3.5, discount: 20 },
  { id: '5', name: 'Checkered Shirt', image: '/product.avif', price: 180, rating: 4.5 },
  { id: '6', name: 'Sleeve Striped T-shirt', image: '/product.avif', price: 130, originalPrice: 160, rating: 4.5, discount: 30 },
  { id: '7', name: 'Vertical Striped Shirt', image: '/product.avif', price: 212, originalPrice: 232, rating: 5.0, discount: 20 },
  { id: '8', name: 'Courage Graphic T-shirt', image: '/product.avif', price: 145, rating: 4.0 },
  { id: '9', name: 'Loose Fit Bermuda Shorts', image: '/product.avif', price: 80, rating: 3.0 },
];

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSize, setSelectedSize] = useState('Large');
  const [priceRange, setPriceRange] = useState([50, 200]);

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
                <div className="space-y-2">
                  {['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans'].map((category) => (
                    <div key={category} className="flex items-center justify-between text-gray-600 cursor-pointer hover:text-black text-sm">
                      <span>{category}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
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
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm">Size</h4>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-full text-xs ${
                          selectedSize === size
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

                <button className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition">
                  Apply Filter
                </button>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl md:text-2xl font-bold">Casual</h1>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-sm">Showing 1-{products.length} of 100 Products</span>
                  <button className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
                    <SlidersHorizontal className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-12">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-4 py-2 bg-black text-white rounded-lg">1</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">...</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">9</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">10</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
