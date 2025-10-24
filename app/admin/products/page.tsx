'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Plus, Edit2, Trash2, Download, Upload } from 'lucide-react';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    {
      id: '1',
      name: 'Gradient Graphic T-shirt',
      sku: 'TSH-001',
      category: 'T-Shirts',
      price: 145,
      stock: 245,
      status: 'Active',
      image: '/bmm32410_black_xl.webp',
    },
    {
      id: '2',
      name: 'Checkered Shirt',
      sku: 'SHT-002',
      category: 'Shirts',
      price: 180,
      stock: 89,
      status: 'Active',
      image: '/bmm32410_black_xl.webp',
    },
    {
      id: '3',
      name: 'Skinny Fit Jeans',
      sku: 'JNS-003',
      category: 'Jeans',
      price: 240,
      stock: 0,
      status: 'Out of Stock',
      image: '/bmm32410_black_xl.webp',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products/import"
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <Upload className="w-4 h-4" />
            <span className="font-semibold text-sm">Import CSV</span>
          </Link>
          <Link
            href="/admin/products/add"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" />
            <span className="font-semibold text-sm">Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          >
            <option value="all">All Categories</option>
            <option value="tshirts">T-Shirts</option>
            <option value="shirts">Shirts</option>
            <option value="jeans">Jeans</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Filter className="w-4 h-4" />
            <span className="font-semibold text-sm">Filters</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F1F4F9] border-b border-gray-200">
                <th className="px-6 py-4 text-left">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Product</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Category</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Price</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-sm text-[#202224]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#202224]">${product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </Link>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing 1-3 of 300</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Previous
            </button>
            <button className="px-4 py-2 bg-[#4880FF] text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
