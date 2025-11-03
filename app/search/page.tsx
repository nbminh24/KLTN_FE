'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import ImageUpload from '@/components/ImageUpload';
import { ChevronRight, SlidersHorizontal, Camera, Search as SearchIcon } from 'lucide-react';

// Mock products data
const allProducts = [
  { id: '1', name: 'Gradient Graphic T-shirt', image: '/bmm32410_black_xl.webp', price: 145, originalPrice: 242, rating: 3.5, discount: 20, category: 't-shirts' },
  { id: '2', name: 'Polo with Tipping Details', image: '/bmm32410_black_xl.webp', price: 180, originalPrice: 242, rating: 4.5, discount: 20, category: 'polo' },
  { id: '3', name: 'Black Striped T-shirt', image: '/bmm32410_black_xl.webp', price: 120, originalPrice: 150, rating: 5.0, discount: 30, category: 't-shirts' },
  { id: '4', name: 'Skinny Fit Jeans', image: '/bmm32410_black_xl.webp', price: 240, originalPrice: 260, rating: 3.5, discount: 20, category: 'jeans' },
  { id: '5', name: 'Checkered Shirt', image: '/bmm32410_black_xl.webp', price: 180, rating: 4.5, category: 'shirts' },
  { id: '6', name: 'Sleeve Striped T-shirt', image: '/bmm32410_black_xl.webp', price: 130, originalPrice: 160, rating: 4.5, discount: 30, category: 't-shirts' },
  { id: '7', name: 'Vertical Striped Shirt', image: '/bmm32410_black_xl.webp', price: 212, originalPrice: 232, rating: 5.0, discount: 20, category: 'shirts' },
  { id: '8', name: 'Courage Graphic T-shirt', image: '/bmm32410_black_xl.webp', price: 145, rating: 4.0, category: 't-shirts' },
  { id: '9', name: 'Loose Fit Bermuda Shorts', image: '/bmm32410_black_xl.webp', price: 80, rating: 3.0, category: 'shorts' },
  { id: '10', name: 'Faded Skinny Jeans', image: '/bmm32410_black_xl.webp', price: 210, rating: 4.5, category: 'jeans' },
  { id: '11', name: 'Classic White T-shirt', image: '/bmm32410_black_xl.webp', price: 95, rating: 4.0, category: 't-shirts' },
  { id: '12', name: 'Denim Jacket', image: '/bmm32410_black_xl.webp', price: 320, originalPrice: 380, rating: 4.8, discount: 15, category: 'jackets' },
];

const ITEMS_PER_PAGE = 9;

function SearchPageContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q');
  const modeParam = searchParams.get('mode'); // 'text' or 'image'

  const [searchMode, setSearchMode] = useState<'text' | 'image'>(modeParam === 'image' ? 'image' : 'text');
  const [searchQuery, setSearchQuery] = useState(queryParam || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery.length > 0 && searchMode === 'text') {
      const matchingProducts = allProducts
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(p => p.name)
        .slice(0, 5);
      setSuggestions(matchingProducts);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, searchMode]);

  // Filter and sort products based on search query and filters
  const filteredProducts = allProducts
    .filter((product) => {
      const matchesSearch = searchMode === 'text' 
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true; // For image search, show all matching products (mock)
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(product.category);
      
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'rating-asc') return a.rating - b.rating;
      return 0; // relevance (default)
    });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleImageUpload = (file: File, preview: string) => {
    setUploadedImage(preview);
    setSearchMode('image');
    // Mock: In real app, send image to API for search
    console.log('Image uploaded for search:', file.name);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setCurrentPage(1);
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
            <span className="font-medium">Search Results</span>
          </div>

          {/* Search Mode Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setSearchMode('text')}
              className={`pb-3 px-4 border-b-2 transition font-medium ${
                searchMode === 'text'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <SearchIcon className="w-4 h-4" />
                Text Search
              </div>
            </button>
            <button
              onClick={() => setSearchMode('image')}
              className={`pb-3 px-4 border-b-2 transition font-medium ${
                searchMode === 'image'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Image Search
              </div>
            </button>
          </div>

          {/* Search Input / Image Upload */}
          <div className="mb-8">
            {searchMode === 'text' ? (
              <div className="max-w-2xl relative">
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                      setCurrentPage(1);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                
                {/* Search Suggestions */}
                {showSuggestions && suggestions.length > 0 && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 overflow-hidden">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3"
                      >
                        <SearchIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-2xl">
                <h3 className="text-lg font-bold mb-4">Upload an image to find similar products</h3>
                <ImageUpload
                  onImageSelect={handleImageUpload}
                  buttonText="Choose Image from Library"
                  showPreview={true}
                />
                {uploadedImage && (
                  <p className="text-sm text-gray-600 mt-4">
                    Showing products similar to your uploaded image
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar */}
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
                  {['t-shirts', 'shorts', 'shirts', 'jeans', 'jackets'].map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category]);
                          } else {
                            setSelectedCategories(selectedCategories.filter((c) => c !== category));
                          }
                          setCurrentPage(1);
                        }}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm capitalize">{category}</span>
                    </label>
                  ))}
                </div>

                <hr className="border-gray-200" />

                {/* Price Range */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm">Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) => {
                        setPriceRange([0, parseInt(e.target.value)]);
                        setCurrentPage(1);
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 500]);
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition"
                >
                  Clear Filters
                </button>
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl md:text-2xl font-bold">
                  {searchMode === 'text' 
                    ? `Results for "${searchQuery}"` 
                    : 'Similar Products'}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-sm hidden md:block">
                    Showing {paginatedProducts.length} of {filteredProducts.length} products
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Rating: High to Low</option>
                    <option value="rating-asc">Rating: Low to High</option>
                  </select>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No products found</h3>
                  <p className="text-gray-600">
                    {searchMode === 'text' 
                      ? 'Try different keywords or adjust filters'
                      : 'Try uploading a different image'}
                  </p>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
