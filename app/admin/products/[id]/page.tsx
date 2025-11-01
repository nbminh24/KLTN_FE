'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Edit2, Trash2, Package, DollarSign, TrendingUp, Eye, EyeOff, Upload, Search, Warehouse } from 'lucide-react';

export default function AdminProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<'overview' | 'variants' | 'analytics'>('overview');
  const [analyticsTab, setAnalyticsTab] = useState<'sales' | 'variants' | 'ratings' | 'reviews'>('sales');
  const [variantSearch, setVariantSearch] = useState('');
  const [variantStockFilter, setVariantStockFilter] = useState('all');
  const [variantSortBy, setVariantSortBy] = useState('sku');
  const [showImageUpload, setShowImageUpload] = useState<string | null>(null);

  // Mock product data
  const product = {
    id: id,
    name: 'Gradient Graphic T-shirt',
    sku: 'TSH-001',
    description: 'This t-shirt features a unique gradient design with high-quality fabric.',
    detailedDescription: 'Premium cotton blend fabric with gradient print. Machine washable. Imported. Regular fit.',
    category: 'T-Shirts',
    basePrice: 145,
    costPrice: 80,
    status: 'Active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    
    // Variants with individual stock and images
    variants: [
      { id: '1', size: 'Small', color: 'Black', stock: 50, sku: 'TSH-001-S-BLK', active: true, images: ['/bmm32410_black_xl.webp', '/bmm32410_black_xl.webp'] },
      { id: '2', size: 'Small', color: 'White', stock: 30, sku: 'TSH-001-S-WHT', active: true, images: ['/bmm32410_black_xl.webp'] },
      { id: '3', size: 'Medium', color: 'Black', stock: 75, sku: 'TSH-001-M-BLK', active: true, images: ['/bmm32410_black_xl.webp', '/bmm32410_black_xl.webp'] },
      { id: '4', size: 'Medium', color: 'White', stock: 45, sku: 'TSH-001-M-WHT', active: true, images: ['/bmm32410_black_xl.webp'] },
      { id: '5', size: 'Large', color: 'Black', stock: 100, sku: 'TSH-001-L-BLK', active: true, images: ['/bmm32410_black_xl.webp', '/bmm32410_black_xl.webp', '/bmm32410_black_xl.webp'] },
      { id: '6', size: 'Large', color: 'White', stock: 60, sku: 'TSH-001-L-WHT', active: false, images: ['/bmm32410_black_xl.webp'] },
      { id: '7', size: 'X-Large', color: 'Black', stock: 20, sku: 'TSH-001-XL-BLK', active: true, images: ['/bmm32410_black_xl.webp'] },
      { id: '8', size: 'X-Large', color: 'White', stock: 15, sku: 'TSH-001-XL-WHT', active: true, images: ['/bmm32410_black_xl.webp', '/bmm32410_black_xl.webp'] },
    ],
    
    totalStock: 395,
    soldCount: 234,
  };

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  // Filter and sort variants
  const filteredVariants = product.variants
    .filter((v) => {
      const matchesSearch = v.sku.toLowerCase().includes(variantSearch.toLowerCase()) ||
                           v.size.toLowerCase().includes(variantSearch.toLowerCase()) ||
                           v.color.toLowerCase().includes(variantSearch.toLowerCase());
      const matchesStock = variantStockFilter === 'all' ||
                          (variantStockFilter === 'in-stock' && v.stock > 50) ||
                          (variantStockFilter === 'low-stock' && v.stock > 0 && v.stock <= 50) ||
                          (variantStockFilter === 'out-of-stock' && v.stock === 0);
      return matchesSearch && matchesStock;
    })
    .sort((a, b) => {
      if (variantSortBy === 'sku') return a.sku.localeCompare(b.sku);
      if (variantSortBy === 'stock-asc') return a.stock - b.stock;
      if (variantSortBy === 'stock-desc') return b.stock - a.stock;
      return 0;
    });

  const toggleVariantActive = (variantId: string) => {
    alert(`Toggle variant ${variantId} active status`);
  };

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
            <p className="text-gray-600 mt-1">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/products/${product.id}`}
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
          <p className="text-2xl font-bold">{product.soldCount}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Base Price</p>
          </div>
          <p className="text-2xl font-bold">${product.basePrice}</p>
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
              className={`pb-3 capitalize ${
                activeTab === tab ? 'border-b-2 border-[#4880FF] text-[#4880FF] font-semibold' : 'text-gray-600'
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Product Name</label>
                  <p className="text-base mt-1">{product.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">SKU</label>
                  <p className="text-base mt-1 font-mono">{product.sku}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Description</label>
                <p className="text-base mt-1 text-gray-700">{product.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Category</label>
                  <p className="text-base mt-1">{product.category}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Cost Price</label>
                  <p className="text-base mt-1">${product.costPrice}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Selling Price</label>
                  <p className="text-base mt-1 font-semibold">${product.basePrice}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Created</label>
                  <p className="text-base mt-1">{product.createdAt}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Last Updated</label>
                  <p className="text-base mt-1">{product.updatedAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <div>
              <label className="text-sm font-semibold text-gray-600">Detailed Description</label>
              <p className="text-base mt-2 text-gray-700 whitespace-pre-wrap">{product.detailedDescription}</p>
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
                  {filteredVariants.map((variant) => (
                    <tr key={variant.id} className={`hover:bg-gray-50 ${!variant.active ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 items-center">
                          {variant.images.slice(0, 2).map((img, idx) => (
                            <div key={idx} className="relative w-10 h-10 bg-gray-100 rounded overflow-hidden border border-gray-200">
                              <Image src={img} alt="" fill className="object-cover" />
                            </div>
                          ))}
                          {variant.images.length > 2 && (
                            <span className="text-xs text-gray-500">+{variant.images.length - 2}</span>
                          )}
                          <button
                            onClick={() => setShowImageUpload(variant.id)}
                            className="ml-2 p-1.5 hover:bg-gray-100 rounded transition"
                            title="Upload Images"
                          >
                            <Upload className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono">{variant.sku}</td>
                      <td className="px-6 py-4 text-sm font-medium">{variant.size}</td>
                      <td className="px-6 py-4 text-sm">{variant.color}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`font-bold ${variant.stock < 20 ? 'text-red-600' : 'text-gray-900'}`}>
                          {variant.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          variant.stock > 50 ? 'bg-green-100 text-green-700' :
                          variant.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {variant.stock > 50 ? 'In Stock' : variant.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleVariantActive(variant.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          title={variant.active ? 'Disable variant' : 'Enable variant'}
                        >
                          {variant.active ? (
                            <Eye className="w-5 h-5 text-green-600" />
                          ) : (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
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
          {/* Analytics Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">$34,150</p>
              <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Units Sold</p>
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-xs text-gray-500 mt-1">+8% from last month</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold">856</p>
              <p className="text-xs text-gray-500 mt-1">From 742 customers</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Avg. Rating</p>
              <p className="text-2xl font-bold text-yellow-600">4.7 / 5</p>
              <p className="text-xs text-gray-500 mt-1">From 156 reviews</p>
            </div>
          </div>

          {/* Analytics Sub-tabs */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="border-b border-gray-200 px-6">
              <div className="flex gap-6">
                {['sales', 'variants', 'ratings', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAnalyticsTab(tab as any)}
                    className={`py-4 capitalize ${
                      analyticsTab === tab ? 'border-b-2 border-[#4880FF] text-[#4880FF] font-semibold' : 'text-gray-600'
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
                  <h3 className="text-lg font-bold mb-4">Sales Trend (Last 30 Days)</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                    <div className="text-center text-gray-500">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Line chart showing daily sales</p>
                      <p className="text-xs mt-1">(Mock data - integrate chart library)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Selling Variants Tab */}
              {analyticsTab === 'variants' && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Top Selling Variants</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                      <div className="text-center text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Donut chart showing variant distribution</p>
                        <p className="text-xs mt-1">(Mock data - integrate chart library)</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-gray-600">Top Variants by Sales</h4>
                      {[
                        { variant: 'Large - Black', sales: 340, percentage: 28 },
                        { variant: 'Medium - Black', sales: 298, percentage: 24 },
                        { variant: 'Large - White', sales: 245, percentage: 20 },
                        { variant: 'Medium - White', sales: 186, percentage: 15 },
                        { variant: 'X-Large - Black', sales: 165, percentage: 13 },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{item.variant}</p>
                            <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                              <div 
                                className="bg-[#4880FF] h-2 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="ml-4 text-right">
                            <p className="text-sm font-bold">{item.sales}</p>
                            <p className="text-xs text-gray-500">{item.percentage}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Ratings Distribution Tab */}
              {analyticsTab === 'ratings' && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Rating Distribution</h3>
                  <div className="space-y-3">
                    {[
                      { stars: 5, count: 98, percentage: 63 },
                      { stars: 4, count: 42, percentage: 27 },
                      { stars: 3, count: 12, percentage: 8 },
                      { stars: 2, count: 3, percentage: 2 },
                      { stars: 1, count: 1, percentage: 1 },
                    ].map((item) => (
                      <div key={item.stars} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-semibold text-gray-700">
                          {item.stars} stars
                        </div>
                        <div className="flex-1 bg-gray-200 h-8 rounded-lg overflow-hidden">
                          <div 
                            className="bg-yellow-400 h-8 flex items-center justify-end pr-3"
                            style={{ width: `${item.percentage}%` }}
                          >
                            <span className="text-xs font-bold text-gray-700">{item.count}</span>
                          </div>
                        </div>
                        <div className="w-12 text-sm text-gray-600">{item.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews List Tab */}
              {analyticsTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Customer Reviews</h3>
                    <div className="flex gap-2">
                      <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4880FF]">
                        <option>All Ratings</option>
                        <option>5 Stars</option>
                        <option>4 Stars</option>
                        <option>3 Stars</option>
                        <option>2 Stars</option>
                        <option>1 Star</option>
                      </select>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4880FF]">
                        <option>Most Recent</option>
                        <option>Highest Rating</option>
                        <option>Lowest Rating</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { 
                        id: 1, 
                        user: 'John Smith', 
                        rating: 5, 
                        date: '2024-01-18',
                        comment: 'Great quality t-shirt! The fabric is soft and the fit is perfect.',
                        orderId: 'ORD-12345'
                      },
                      { 
                        id: 2, 
                        user: 'Sarah Johnson', 
                        rating: 4, 
                        date: '2024-01-16',
                        comment: 'Nice design, but sizing runs a bit large. Overall satisfied.',
                        orderId: 'ORD-12340'
                      },
                      { 
                        id: 3, 
                        user: 'Mike Davis', 
                        rating: 5, 
                        date: '2024-01-15',
                        comment: 'Exactly as described. Fast shipping and excellent quality!',
                        orderId: 'ORD-12338'
                      },
                    ].map((review) => (
                      <div key={review.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-sm">{review.user}</p>
                            <p className="text-xs text-gray-500">Order: {review.orderId}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                      Load More Reviews
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
