'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Search, AlertTriangle, TrendingUp, Package, History, Upload } from 'lucide-react';

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export default function InventoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<StockStatus>('Low Stock');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Read tab from query parameter on mount
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'out-of-stock') {
      setActiveTab('Out of Stock');
    } else if (tabParam === 'low-stock') {
      setActiveTab('Low Stock');
    } else if (tabParam === 'in-stock') {
      setActiveTab('In Stock');
    }
  }, [searchParams]);

  const products = [
    {
      id: '1',
      name: 'Gradient Graphic T-shirt',
      category: 'T-Shirts',
      image: '/bmm32410_black_xl.webp',
      stock: 245,
      reserved: 12,
      available: 233,
      reorderPoint: 50,
      lastRestocked: '2024-01-10',
      status: 'In Stock' as StockStatus,
    },
    {
      id: '2',
      name: 'Checkered Shirt',
      category: 'Shirts',
      image: '/bmm32410_black_xl.webp',
      stock: 45,
      reserved: 8,
      available: 37,
      reorderPoint: 50,
      lastRestocked: '2024-01-08',
      status: 'Low Stock' as StockStatus,
    },
    {
      id: '3',
      name: 'Skinny Fit Jeans',
      category: 'Jeans',
      image: '/bmm32410_black_xl.webp',
      stock: 0,
      reserved: 0,
      available: 0,
      reorderPoint: 30,
      lastRestocked: '2023-12-20',
      status: 'Out of Stock' as StockStatus,
    },
    {
      id: '4',
      name: 'Classic Hoodie',
      category: 'Hoodies',
      image: '/bmm32410_black_xl.webp',
      stock: 189,
      reserved: 15,
      available: 174,
      reorderPoint: 40,
      lastRestocked: '2024-01-12',
      status: 'In Stock' as StockStatus,
    },
    {
      id: '5',
      name: 'Striped Polo',
      category: 'Polo',
      image: '/bmm32410_black_xl.webp',
      stock: 28,
      reserved: 5,
      available: 23,
      reorderPoint: 30,
      lastRestocked: '2024-01-05',
      status: 'Low Stock' as StockStatus,
    },
    {
      id: '6',
      name: 'Denim Jacket',
      category: 'Jackets',
      image: '/bmm32410_black_xl.webp',
      stock: 0,
      reserved: 0,
      available: 0,
      reorderPoint: 20,
      lastRestocked: '2023-11-28',
      status: 'Out of Stock' as StockStatus,
    },
  ];

  const stats = [
    { label: 'Total Products', value: '300', icon: <Package className="w-6 h-6" />, color: 'bg-blue-500' },
    { label: 'Low Stock Items', value: '23', icon: <AlertTriangle className="w-6 h-6" />, color: 'bg-yellow-500' },
    { label: 'Out of Stock', value: '8', icon: <AlertTriangle className="w-6 h-6" />, color: 'bg-red-500' },
    { label: 'Total Stock Value', value: '$45,670', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-green-500' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-700';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-700';
      case 'Out of Stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Filter by active tab (status)
      if (product.status !== activeTab) return false;
      
      // Category filter
      if (categoryFilter !== 'all' && product.category !== categoryFilter) return false;
      
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => {
      // Auto sort by (Available - Reorder Point), smaller first
      const scoreA = a.available - a.reorderPoint;
      const scoreB = b.available - b.reorderPoint;
      return scoreA - scoreB;
    });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track and manage product stock levels</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => router.push('/admin/inventory/history')}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <History className="w-4 h-4" />
            <span className="font-semibold text-sm">Restock History</span>
          </button>
          <button 
            onClick={() => router.push('/admin/inventory/restock')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Upload className="w-4 h-4" />
            <span className="font-semibold text-sm">Restock</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className={`${stat.color} text-white p-2 rounded-lg`}>
                {stat.icon}
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-[#202224]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Stock Alerts */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Stock Alerts</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-900">23 products are running low on stock</p>
              <p className="text-xs text-yellow-700">Consider restocking these items soon</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">8 products are out of stock</p>
              <p className="text-xs text-red-700">These items need immediate attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-200">
          {(['In Stock', 'Low Stock', 'Out of Stock'] as StockStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-6 py-4 font-semibold text-sm transition flex items-center gap-2 ${
                activeTab === status
                  ? 'border-b-2 border-[#4880FF] text-[#4880FF]'
                  : 'text-gray-600 hover:text-[#4880FF]'
              }`}
            >
              <Package className="w-4 h-4" />
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
            />
          </div>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F1F4F9] border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Product</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Category</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Total Stock</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Reserved</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Available</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Reorder Point</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Last Restocked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <span className="font-semibold text-sm text-[#202224]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-sm text-[#202224]">{product.stock}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.reserved}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-sm text-[#4880FF]">{product.available}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.reorderPoint}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.lastRestocked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing 1-4 of 300</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Previous
            </button>
            <button className="px-4 py-2 bg-[#4880FF] text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
