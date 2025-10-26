'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Edit2, Trash2, Package, DollarSign, TrendingUp, Eye } from 'lucide-react';

export default function AdminProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<'overview' | 'variants' | 'analytics'>('overview');

  // Mock product data
  const product = {
    id: id,
    name: 'Gradient Graphic T-shirt',
    sku: 'TSH-001',
    description: 'This t-shirt features a unique gradient design with high-quality fabric.',
    category: 'T-Shirts',
    basePrice: 145,
    status: 'Active',
    images: ['/bmm32410_black_xl.webp', '/bmm32410_black_xl.webp', '/bmm32410_black_xl.webp'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    
    // Variants with individual stock
    variants: [
      { size: 'Small', color: 'Black', stock: 50, sku: 'TSH-001-S-BLK' },
      { size: 'Small', color: 'White', stock: 30, sku: 'TSH-001-S-WHT' },
      { size: 'Medium', color: 'Black', stock: 75, sku: 'TSH-001-M-BLK' },
      { size: 'Medium', color: 'White', stock: 45, sku: 'TSH-001-M-WHT' },
      { size: 'Large', color: 'Black', stock: 100, sku: 'TSH-001-L-BLK' },
      { size: 'Large', color: 'White', stock: 60, sku: 'TSH-001-L-WHT' },
      { size: 'X-Large', color: 'Black', stock: 20, sku: 'TSH-001-XL-BLK' },
      { size: 'X-Large', color: 'White', stock: 15, sku: 'TSH-001-XL-WHT' },
    ],
    
    totalStock: 395,
    soldCount: 234,
  };

  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

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
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Product Info */}
          <div className="lg:col-span-2 space-y-6">
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Category</label>
                    <p className="text-base mt-1">{product.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">SKU</label>
                    <p className="text-base mt-1 font-mono">{product.sku}</p>
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
          </div>

          {/* Product Images */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Product Images</h2>
              <div className="space-y-3">
                {product.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image src={img} alt={`Product ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Variants Tab */}
      {activeTab === 'variants' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Product Variants</h2>
            <p className="text-sm text-gray-600 mt-1">Each size and color combination has individual stock</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F1F4F9]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">SKU</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Size</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Color</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {product.variants.map((variant, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
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
                        variant.stock > 20 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {variant.stock > 50 ? 'In Stock' : variant.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-[#4880FF] hover:underline font-semibold">
                        Edit Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Product Analytics</h2>
          <div className="text-center py-12 text-gray-500">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Analytics data coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
}
