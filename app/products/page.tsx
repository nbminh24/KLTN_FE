'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { ChevronRight, SlidersHorizontal, ChevronDown, Loader2 } from 'lucide-react';
import productService, { Product } from '@/lib/services/productService';
import filterService, { Color, Size, Category } from '@/lib/services/filterService';

const ITEMS_PER_PAGE = 20;

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState([0, 12500]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // API state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter options from API
  const [availableColors, setAvailableColors] = useState<Color[]>([]);
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [filtersLoading, setFiltersLoading] = useState(true);

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategories, selectedSizes, selectedColors, priceRange, selectedRatings, sortBy]);

  const fetchFilterOptions = async () => {
    try {
      setFiltersLoading(true);
      const results = await Promise.allSettled([
        filterService.getAllColors(),
        filterService.getAllSizes(),
        filterService.getAllCategories(),
      ]);

      if (results[0].status === 'fulfilled') {
        setAvailableColors(results[0].value.data);
      } else {
        console.error('Failed to fetch colors:', results[0].reason);
      }

      if (results[1].status === 'fulfilled') {
        setAvailableSizes(results[1].value.data);
      } else {
        console.error('Failed to fetch sizes:', results[1].reason);
      }

      if (results[2].status === 'fulfilled') {
        const categoriesData = results[2].value.data;
        setAvailableCategories(categoriesData.categories || categoriesData || []);
      } else {
        console.warn('⚠️ Categories API not available (404) - hiding category filter. Backend team has been notified.');
        setAvailableCategories([]);
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
    } finally {
      setFiltersLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const minRating = selectedRatings.length > 0 ? Math.min(...selectedRatings) : undefined;

      const response = await productService.getProducts({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        category_slug: selectedCategories[0],
        sizes: selectedSizes.length > 0 ? selectedSizes.join(',') : undefined,
        colors: selectedColors.length > 0 ? selectedColors.join(',') : undefined,
        min_price: priceRange[0],
        max_price: priceRange[1],
        min_rating: minRating,
        sort_by: sortBy as 'newest' | 'price_asc' | 'price_desc' | 'rating',
      });

      setProducts(response.data.data);

      // Calculate totalPages if not provided by API
      const pages = response.data.metadata.total_pages ||
        Math.ceil(response.data.metadata.total / ITEMS_PER_PAGE);

      setTotalPages(pages);
      setTotalProducts(response.data.metadata.total);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Không thể tải sản phẩm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

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

  const toggleSize = (sizeId: number) => {
    setSelectedSizes(prev =>
      prev.includes(sizeId) ? prev.filter(s => s !== sizeId) : [...prev, sizeId]
    );
    setCurrentPage(1);
  };

  const toggleColor = (colorId: number) => {
    setSelectedColors(prev =>
      prev.includes(colorId) ? prev.filter(c => c !== colorId) : [...prev, colorId]
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
            <span className="text-gray-500">Trang Chủ</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Cửa Hàng</span>
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="border border-gray-200 rounded-2xl p-5 space-y-5 sticky top-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Bộ Lọc</h3>
                  <SlidersHorizontal className="w-5 h-5 text-gray-400" />
                </div>

                <hr className="border-gray-200" />

                {/* Categories */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm">Danh Mục</h4>
                  {filtersLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    availableCategories.map((category) => (
                      <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.slug)}
                          onChange={() => toggleCategory(category.slug)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm">{category.name}</span>
                      </label>
                    ))
                  )}
                </div>

                <hr className="border-gray-200" />

                {/* Price Range */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">Giá</h4>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-600">Tối thiểu: {priceRange[0].toLocaleString('vi-VN')}k₫</label>
                      <input
                        type="range"
                        min="0"
                        max="12500"
                        step="100"
                        value={priceRange[0]}
                        onChange={(e) => {
                          const newMin = parseInt(e.target.value);
                          if (newMin <= priceRange[1]) {
                            setPriceRange([newMin, priceRange[1]]);
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-600">Tối đa: {priceRange[1].toLocaleString('vi-VN')}k₫</label>
                      <input
                        type="range"
                        min="0"
                        max="12500"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => {
                          const newMax = parseInt(e.target.value);
                          if (newMax >= priceRange[0]) {
                            setPriceRange([priceRange[0], newMax]);
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>{priceRange[0].toLocaleString('vi-VN')}k₫</span>
                      <span>{priceRange[1].toLocaleString('vi-VN')}k₫</span>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Colors */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">Màu Sắc</h4>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  {filtersLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-3">
                      {availableColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => toggleColor(color.id)}
                          style={{ backgroundColor: color.hex_code }}
                          className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${selectedColors.includes(color.id)
                            ? 'border-black ring-2 ring-offset-2 ring-black'
                            : 'border-gray-200'
                            }`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <hr className="border-gray-200" />

                {/* Size */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm">Kích Thước</h4>
                  {filtersLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => toggleSize(size.id)}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all ${selectedSizes.includes(size.id)
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <hr className="border-gray-200" />

                {/* Rating */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm">Đánh Giá</h4>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedRatings.includes(rating)}
                          onChange={() => {
                            setSelectedRatings(prev =>
                              prev.includes(rating)
                                ? prev.filter(r => r !== rating)
                                : [...prev, rating]
                            );
                            setCurrentPage(1);
                          }}
                          className="w-4 h-4 rounded"
                        />
                        <div className="flex items-center gap-1">
                          {[...Array(rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-sm">★</span>
                          ))}
                          <span className="text-sm text-gray-600">Trở Lên</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-200" />

                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedSizes([]);
                    setSelectedColors([]);
                    setPriceRange([0, 12500]);
                    setSelectedRatings([]);
                    setSortBy('newest');
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition"
                >
                  Xóa Tất Cả Bộ Lọc
                </button>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl md:text-2xl font-bold">Tất Cả Sản Phẩm</h1>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-sm hidden md:block">
                    Hiển thị {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)} trong {totalProducts} Sản phẩm
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="newest">Mới Nhất</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao đến Thấp</option>
                    <option value="rating">Đánh Giá Cao</option>
                  </select>
                  <button className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
                    <SlidersHorizontal className="w-6 h-6" />
                  </button>
                </div>
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
                    onClick={() => fetchProducts()}
                    className="mt-2 text-red-600 hover:underline font-medium"
                  >
                    Thử Lại
                  </button>
                </div>
              )}

              {/* Products Grid */}
              {!loading && !error && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
                      variantId={product.variants?.[0]?.id}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
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
