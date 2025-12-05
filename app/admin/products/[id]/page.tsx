'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Edit2, Trash2, Package, DollarSign, TrendingUp, Eye, EyeOff, Upload, Search, Warehouse, Loader2 } from 'lucide-react';
import adminProductService from '@/lib/services/admin/productService';
import type { AdminProduct } from '@/lib/services/admin/productService';
import { showToast } from '@/components/Toast';

export default function AdminProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<'overview' | 'variants' | 'analytics'>('overview');
  const [analyticsTab, setAnalyticsTab] = useState<'sales' | 'variants' | 'ratings' | 'reviews'>('sales');
  const [variantSearch, setVariantSearch] = useState('');
  const [variantStockFilter, setVariantStockFilter] = useState('all');
  const [variantSortBy, setVariantSortBy] = useState('sku');
  const [showImageUpload, setShowImageUpload] = useState<string | null>(null);

  // API state
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Analytics state
  const [analytics, setAnalytics] = useState<any>(null);
  const [salesTrend, setSalesTrend] = useState<any>(null);
  const [variantsAnalytics, setVariantsAnalytics] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsMeta, setReviewsMeta] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [salesPeriod, setSalesPeriod] = useState<'7days' | '30days' | '3months' | '1year'>('30days');
  const [reviewsFilter, setReviewsFilter] = useState({ rating: 'all', status: 'approved', page: 1 });

  // Fetch product data
  useEffect(() => {
    fetchProductData();
  }, [id]);

  // Fetch analytics when tab changes
  useEffect(() => {
    if (activeTab === 'analytics' && product && !analytics) {
      fetchAnalytics();
    }
  }, [activeTab, product]);

  // Fetch sales trend when period changes
  useEffect(() => {
    if (analyticsTab === 'sales' && product) {
      fetchSalesTrend();
    }
  }, [analyticsTab, salesPeriod, product]);

  // Fetch variants analytics
  useEffect(() => {
    if (analyticsTab === 'variants' && product && !variantsAnalytics) {
      fetchVariantsAnalytics();
    }
  }, [analyticsTab, product]);

  // Fetch reviews
  useEffect(() => {
    if (analyticsTab === 'reviews' && product) {
      fetchReviews();
    }
  }, [analyticsTab, reviewsFilter, product]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      console.log('📦 Fetching admin product:', id);

      const response = await adminProductService.getProductById(Number(id));
      console.log('📦 Product response:', response.data);
      console.log('📦 Product variants:', response.data.variants);

      // Backend now returns full data with variants
      const productData = response.data.product || response.data;

      console.log('📦 Product data:', productData);
      setProduct(productData as AdminProduct);
    } catch (err: any) {
      console.error('❌ Failed to fetch product:', err);
      console.error('❌ Error response:', err.response?.data);
      setError('Failed to load product details');
      showToast('Failed to load product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      console.log('📊 Fetching analytics...');
      const response = await adminProductService.getProductAnalytics(Number(id));
      console.log('📊 Analytics:', response.data);
      setAnalytics(response.data);
    } catch (err: any) {
      console.error('❌ Failed to fetch analytics:', err);
      showToast('Failed to load analytics', 'error');
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchSalesTrend = async () => {
    try {
      console.log('📈 Fetching sales trend:', salesPeriod);
      const response = await adminProductService.getProductSalesTrend(Number(id), salesPeriod);
      console.log('📈 Sales trend:', response.data);
      setSalesTrend(response.data);
    } catch (err: any) {
      console.error('❌ Failed to fetch sales trend:', err);
    }
  };

  const fetchVariantsAnalytics = async () => {
    try {
      console.log('📦 Fetching variants analytics...');
      const response = await adminProductService.getVariantsAnalytics(Number(id));
      console.log('📦 Variants analytics:', response.data);
      setVariantsAnalytics(response.data);
    } catch (err: any) {
      console.error('❌ Failed to fetch variants analytics:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      console.log('💬 Fetching reviews:', reviewsFilter);
      const response = await adminProductService.getProductReviews(Number(id), {
        page: reviewsFilter.page,
        limit: 10,
        rating: reviewsFilter.rating === 'all' ? undefined : reviewsFilter.rating,
        status: reviewsFilter.status,
        sort: 'created_at',
        order: 'desc'
      });
      console.log('💬 Reviews:', response.data);
      setReviews(response.data.reviews || []);
      setReviewsMeta(response.data.metadata);
    } catch (err: any) {
      console.error('❌ Failed to fetch reviews:', err);
    }
  };

  const totalStock = product?.variants?.reduce((sum, v) => sum + (v.total_stock || 0), 0) || 0;

  // Filter and sort variants
  const filteredVariants = (product?.variants || [])
    .filter((v) => {
      const sizeName = v.size?.name || '';
      const colorName = v.color?.name || '';
      const matchesSearch = v.sku.toLowerCase().includes(variantSearch.toLowerCase()) ||
        sizeName.toLowerCase().includes(variantSearch.toLowerCase()) ||
        colorName.toLowerCase().includes(variantSearch.toLowerCase());
      const stock = v.total_stock || 0;
      const matchesStock = variantStockFilter === 'all' ||
        (variantStockFilter === 'in-stock' && stock > 50) ||
        (variantStockFilter === 'low-stock' && stock > 0 && stock <= 50) ||
        (variantStockFilter === 'out-of-stock' && stock === 0);
      return matchesSearch && matchesStock;
    })
    .sort((a, b) => {
      if (variantSortBy === 'sku') return a.sku.localeCompare(b.sku);
      if (variantSortBy === 'stock-asc') return (a.total_stock || 0) - (b.total_stock || 0);
      if (variantSortBy === 'stock-desc') return (b.total_stock || 0) - (a.total_stock || 0);
      return 0;
    });

  const toggleVariantActive = (variantId: string) => {
    alert(`Toggle variant ${variantId} active status`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading product</p>
          <p className="text-gray-600 mb-4">{error || 'Product not found'}</p>
          <button
            onClick={fetchProductData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#202224]">{product.name}</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/products/${product.slug || product.id}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <Eye className="w-4 h-4" />
            <span className="font-semibold text-sm">View on Store</span>
          </Link>
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Edit2 className="w-4 h-4" />
            <span className="font-semibold text-sm">Edit Product</span>
          </Link>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">
            <Trash2 className="w-4 h-4" />
            <span className="font-semibold text-sm">Delete</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Total Stock</p>
          </div>
          <p className="text-2xl font-bold">{totalStock}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Sold</p>
          </div>
          <p className="text-2xl font-bold">{(product.total_sold || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Base Price</p>
          </div>
          <p className="text-2xl font-bold">{Number(product.selling_price || 0).toLocaleString('vi-VN')} VND</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <p className="text-sm text-gray-600">Status</p>
          </div>
          <p className="text-2xl font-bold">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              {product.status}
            </span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {['overview', 'variants', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-3 capitalize ${activeTab === tab ? 'border-b-2 border-[#4880FF] text-[#4880FF] font-semibold' : 'text-gray-600'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Product Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Product Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Product Name</label>
                <p className="text-base mt-1">{product.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Description</label>
                <p className="text-base mt-1 text-gray-700">{product.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Category</label>
                  <p className="text-base mt-1">{product.category?.name || `Category ID: ${product.category_id}`}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Cost Price</label>
                  <p className="text-base mt-1">{Number(product.cost_price || 0).toLocaleString('vi-VN')} VND</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Selling Price</label>
                  <p className="text-base mt-1 font-semibold">{Number(product.selling_price || 0).toLocaleString('vi-VN')} VND</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Created</label>
                  <p className="text-base mt-1">{product.created_at ? new Date(product.created_at).toLocaleDateString('vi-VN') : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Last Updated</label>
                  <p className="text-base mt-1">{product.updated_at ? new Date(product.updated_at).toLocaleDateString('vi-VN') : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <div>
              <label className="text-sm font-semibold text-gray-600">Detailed Description</label>
              <p className="text-base mt-2 text-gray-700 whitespace-pre-wrap">{product.full_description || product.description || 'No detailed description'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Variants Tab */}
      {activeTab === 'variants' && (
        <div className="space-y-4">
          {/* Filters and Actions */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search variants by SKU, size, or color..."
                  value={variantSearch}
                  onChange={(e) => setVariantSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                />
              </div>
              <select
                value={variantStockFilter}
                onChange={(e) => setVariantStockFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
              >
                <option value="all">All Stock</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
              <select
                value={variantSortBy}
                onChange={(e) => setVariantSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
              >
                <option value="sku">Sort by SKU</option>
                <option value="stock-asc">Stock: Low to High</option>
                <option value="stock-desc">Stock: High to Low</option>
              </select>
              <Link
                href="/admin/inventory"
                className="flex items-center gap-2 px-4 py-2 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition whitespace-nowrap"
              >
                <Warehouse className="w-4 h-4" />
                <span className="font-semibold text-sm">Manage Inventory</span>
              </Link>
            </div>
          </div>

          {/* Variants Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F1F4F9]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Images</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">SKU</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Size</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Color</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredVariants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No variants found</p>
                        <p className="text-xs mt-1">Backend may not return variants data yet</p>
                      </td>
                    </tr>
                  ) : (
                    filteredVariants.map((variant) => {
                      const stock = variant.total_stock || 0;
                      const isActive = variant.status === 'active';
                      const images = variant.images || [];
                      return (
                        <tr key={variant.id} className={`hover:bg-gray-50 ${!isActive ? 'opacity-50' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="flex gap-1 items-center">
                              {images.length > 0 ? (
                                images.slice(0, 2).map((img: any, idx: number) => (
                                  <div key={idx} className="relative w-10 h-10 bg-gray-100 rounded overflow-hidden border border-gray-200">
                                    <Image src={img.image_url || img} alt="" fill className="object-cover" />
                                  </div>
                                ))
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                  <Package className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                              {images.length > 2 && (
                                <span className="text-xs text-gray-500">+{images.length - 2}</span>
                              )}
                              <button
                                onClick={() => setShowImageUpload(String(variant.id))}
                                className="ml-2 p-1.5 hover:bg-gray-100 rounded transition"
                                title="Upload Images"
                              >
                                <Upload className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-mono">{variant.sku}</td>
                          <td className="px-6 py-4 text-sm font-medium">{variant.size?.name || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              {variant.color?.hex_code && (
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: variant.color.hex_code }}
                                />
                              )}
                              <span>{variant.color?.name || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`font-bold ${stock < 20 ? 'text-red-600' : 'text-gray-900'}`}>
                              {stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stock > 50 ? 'bg-green-100 text-green-700' :
                              stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                              {stock > 50 ? 'In Stock' : stock > 0 ? 'Low Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleVariantActive(String(variant.id))}
                              className="p-2 hover:bg-gray-100 rounded-lg transition"
                              title={isActive ? 'Disable variant' : 'Enable variant'}
                            >
                              {isActive ? (
                                <Eye className="w-5 h-5 text-green-600" />
                              ) : (
                                <EyeOff className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Image Upload Modal */}
          {showImageUpload && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowImageUpload(null)}>
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Upload Variant Images</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Main Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#4880FF] transition">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Upload main product image</p>
                      <input type="file" accept="image/*" className="hidden" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Secondary Images</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#4880FF] transition">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Upload additional images</p>
                      <input type="file" accept="image/*" multiple className="hidden" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button className="px-6 py-2 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition">Save</button>
                  <button onClick={() => setShowImageUpload(null)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {loadingAnalytics && !analytics ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {/* Analytics Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(analytics?.sales?.total_revenue || 0).toLocaleString('vi-VN')} VND
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All time revenue</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Units Sold</p>
                  <p className="text-2xl font-bold">
                    {(analytics?.sales?.total_units_sold || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All time sales</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold">
                    {(analytics?.sales?.total_orders || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Avg {(analytics?.sales?.average_order_value || 0).toLocaleString('vi-VN')} VND
                  </p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Avg. Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {(analytics?.ratings?.average_rating || 0).toFixed(1)} / 5
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    From {analytics?.ratings?.total_reviews || 0} reviews
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Analytics Sub-tabs */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="border-b border-gray-200 px-6">
              <div className="flex gap-6">
                {['sales', 'variants', 'ratings', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAnalyticsTab(tab as any)}
                    className={`py-4 capitalize ${analyticsTab === tab ? 'border-b-2 border-[#4880FF] text-[#4880FF] font-semibold' : 'text-gray-600'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Sales Chart Tab */}
              {analyticsTab === 'sales' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Sales Trend</h3>
                    <select
                      value={salesPeriod}
                      onChange={(e) => setSalesPeriod(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                    >
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="3months">Last 3 Months</option>
                      <option value="1year">Last Year</option>
                    </select>
                  </div>
                  {salesTrend?.data?.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                          <p className="text-lg font-bold">{(salesTrend.total_revenue || 0).toLocaleString('vi-VN')} VND</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Total Units</p>
                          <p className="text-lg font-bold">{(salesTrend.total_units_sold || 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Avg. Daily</p>
                          <p className="text-lg font-bold">{Math.round((salesTrend.total_revenue || 0) / (salesTrend.data?.length || 1)).toLocaleString('vi-VN')} VND</p>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-semibold">Date</th>
                              <th className="px-4 py-2 text-right text-xs font-semibold">Revenue</th>
                              <th className="px-4 py-2 text-right text-xs font-semibold">Units</th>
                              <th className="px-4 py-2 text-right text-xs font-semibold">Orders</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {salesTrend.data.map((item: any, idx: number) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm">{new Date(item.date).toLocaleDateString('vi-VN')}</td>
                                <td className="px-4 py-2 text-sm text-right font-semibold">{(item.revenue || 0).toLocaleString('vi-VN')} VND</td>
                                <td className="px-4 py-2 text-sm text-right">{item.units_sold || 0}</td>
                                <td className="px-4 py-2 text-sm text-right">{item.orders || 0}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                      <div className="text-center text-gray-500">
                        <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No sales data available</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Top Selling Variants Tab */}
              {analyticsTab === 'variants' && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Top Selling Variants</h3>
                  {variantsAnalytics?.variants?.length > 0 ? (
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <p className="text-xs text-gray-600">Total Units Sold (All Variants)</p>
                        <p className="text-2xl font-bold">{(variantsAnalytics.total_sold || 0).toLocaleString()}</p>
                      </div>
                      {variantsAnalytics.variants.slice(0, 10).map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="text-sm font-semibold">{item.size} - {item.color}</p>
                              <span className="text-xs text-gray-500 font-mono">{item.sku}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#4880FF] h-3 rounded-full"
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 w-12">{item.percentage}%</span>
                            </div>
                          </div>
                          <div className="ml-4 text-right space-y-1">
                            <p className="text-sm font-bold">{item.total_sold} units</p>
                            <p className="text-xs text-green-600 font-semibold">{(item.revenue || 0).toLocaleString('vi-VN')} VND</p>
                            <p className="text-xs text-gray-500">Stock: {item.current_stock}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                      <div className="text-center text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No sales data available for variants</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Ratings Distribution Tab */}
              {analyticsTab === 'ratings' && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Rating Distribution</h3>
                  {analytics?.ratings?.rating_distribution ? (
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const data = analytics.ratings.rating_distribution[stars] || { count: 0, percentage: 0 };
                        return (
                          <div key={stars} className="flex items-center gap-4">
                            <div className="w-20 text-sm font-semibold text-gray-700">
                              {stars} stars
                            </div>
                            <div className="flex-1 bg-gray-200 h-8 rounded-lg overflow-hidden">
                              <div
                                className="bg-yellow-400 h-8 flex items-center justify-end pr-3 transition-all"
                                style={{ width: `${data.percentage || 0}%` }}
                              >
                                <span className="text-xs font-bold text-gray-700">{data.count}</span>
                              </div>
                            </div>
                            <div className="w-12 text-sm text-gray-600">{data.percentage}%</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No ratings data available</p>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews List Tab */}
              {analyticsTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Customer Reviews</h3>
                    <div className="flex gap-2">
                      <select
                        value={reviewsFilter.rating}
                        onChange={(e) => setReviewsFilter({ ...reviewsFilter, rating: e.target.value, page: 1 })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                      >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                      <select
                        value={reviewsFilter.status}
                        onChange={(e) => setReviewsFilter({ ...reviewsFilter, status: e.target.value, page: 1 })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                      >
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                        <option value="all">All Status</option>
                      </select>
                    </div>
                  </div>
                  {reviews.length > 0 ? (
                    <>
                      <div className="space-y-4">
                        {reviews.map((review: any) => (
                          <div
                            key={review.id}
                            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold text-sm">{review.customer_name}</p>
                                <p className="text-xs text-gray-500">{review.customer_email}</p>
                                <p className="text-xs text-gray-500">Order: {review.order_number || review.order_id}</p>
                                <p className="text-xs text-gray-500">SKU: {review.variant_sku}</p>
                              </div>
                              <div className="text-right">
                                <div className="flex gap-1 mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                                  ))}
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${review.status === 'approved' ? 'bg-green-100 text-green-700' :
                                    review.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-red-100 text-red-700'
                                  }`}>
                                  {review.status}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">{new Date(review.created_at).toLocaleDateString('vi-VN')}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                      {reviewsMeta && reviewsMeta.total_pages > 1 && (
                        <div className="mt-4 flex justify-center gap-2">
                          <button
                            onClick={() => setReviewsFilter({ ...reviewsFilter, page: Math.max(1, reviewsFilter.page - 1) })}
                            disabled={reviewsFilter.page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <span className="px-4 py-2 text-sm text-gray-600">
                            Page {reviewsMeta.page} of {reviewsMeta.total_pages}
                          </span>
                          <button
                            onClick={() => setReviewsFilter({ ...reviewsFilter, page: Math.min(reviewsMeta.total_pages, reviewsFilter.page + 1) })}
                            disabled={reviewsFilter.page >= reviewsMeta.total_pages}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p>No reviews found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
