'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Search, AlertTriangle, TrendingUp, Package, History, Upload, Loader2 } from 'lucide-react';
import adminInventoryService, { InventoryItem } from '@/lib/services/admin/inventoryService';
import { showToast } from '@/components/Toast';

type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

function InventoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<StockStatus>('low_stock');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total_variants: 0,
    in_stock: 0,
    low_stock: 0,
    out_of_stock: 0,
    total_value: 0
  });

  // Read tab from query parameter on mount
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'out-of-stock') {
      setActiveTab('out_of_stock');
    } else if (tabParam === 'low-stock') {
      setActiveTab('low_stock');
    } else if (tabParam === 'in-stock') {
      setActiveTab('in_stock');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchInventory();
  }, [activeTab, currentPage, searchQuery]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      console.log('📦 Fetching inventory...', { activeTab, page: currentPage, search: searchQuery });

      const params: any = {
        page: currentPage,
        limit: 20,
        search: searchQuery || undefined,
      };

      // Add status filters
      if (activeTab === 'low_stock') {
        params.low_stock = true;
      } else if (activeTab === 'out_of_stock') {
        params.out_of_stock = true;
      }

      const response = await adminInventoryService.getInventory(params);
      console.log('✅ Inventory response:', response.data);

      // Backend returns { items: [], total: ... } or { data: [], meta: {} }
      const inventoryData = response.data.data || response.data.items || response.data;
      const inventoryArray = Array.isArray(inventoryData) ? inventoryData : [];

      console.log('📦 Parsed inventory:', inventoryArray.length, 'items');

      setInventory(inventoryArray);

      const total = response.data.meta?.total || response.data.total || 0;
      const limit = response.data.meta?.limit || response.data.limit || 20;
      setTotalPages(Math.ceil(total / limit));

      // Update stats
      const summary = response.data.summary || response.data.meta?.summary;
      if (summary) {
        setStats({
          total_variants: summary.total_variants || 0,
          in_stock: summary.in_stock || 0,
          low_stock: summary.low_stock_variants || 0,
          out_of_stock: summary.out_of_stock_variants || 0,
          total_value: 0 // Calculate if needed
        });
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch inventory:', error);

      // Handle backend 500 error gracefully
      if (error?.response?.status === 500) {
        console.warn('⚠️ Inventory API unavailable (500). Showing empty list.');
        showToast('Inventory API temporarily unavailable', 'warning');
      } else {
        showToast('Failed to load inventory', 'error');
      }
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (item: InventoryItem): string => {
    if (item.current_stock === 0) return 'Out of Stock';
    if (item.available_stock <= item.reorder_level) return 'Low Stock';
    return 'In Stock';
  };

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

  const getTabLabel = (tab: StockStatus): string => {
    switch (tab) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      default: return tab;
    }
  };

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
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-600">Total Variants</p>
          </div>
          <p className="text-2xl font-bold text-[#202224]">{stats.total_variants}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-500 text-white p-2 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-600">In Stock</p>
          </div>
          <p className="text-2xl font-bold text-[#202224]">{stats.in_stock}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-500 text-white p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-600">Low Stock Items</p>
          </div>
          <p className="text-2xl font-bold text-[#202224]">{stats.low_stock}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-500 text-white p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-600">Out of Stock</p>
          </div>
          <p className="text-2xl font-bold text-[#202224]">{stats.out_of_stock}</p>
        </div>
      </div>

      {/* Stock Alerts */}
      {(stats.low_stock > 0 || stats.out_of_stock > 0) && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Stock Alerts</h2>
          <div className="space-y-3">
            {stats.low_stock > 0 && (
              <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-900">{stats.low_stock} variants are running low on stock</p>
                  <p className="text-xs text-yellow-700">Consider restocking these items soon</p>
                </div>
              </div>
            )}
            {stats.out_of_stock > 0 && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-900">{stats.out_of_stock} variants are out of stock</p>
                  <p className="text-xs text-red-700">These items need immediate attention</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-200">
          {(['in_stock', 'low_stock', 'out_of_stock'] as StockStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => {
                setActiveTab(status);
                setCurrentPage(1);
              }}
              className={`px-6 py-4 font-semibold text-sm transition flex items-center gap-2 ${activeTab === status
                ? 'border-b-2 border-[#4880FF] text-[#4880FF]'
                : 'text-gray-600 hover:text-[#4880FF]'
                }`}
            >
              <Package className="w-4 h-4" />
              {getTabLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name, variant, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#4880FF]" />
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No inventory items found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F1F4F9] border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Product / Variant</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Total Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Reserved</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Available</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Reorder Level</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inventory.map((item, index) => (
                    <tr key={item.variant_id || `inventory-${index}`} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-sm text-[#202224]">{item.product_name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600">{item.size} / {item.color}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs font-mono text-gray-500">SKU: {item.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-sm text-[#202224]">{item.current_stock}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.reserved_stock}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-sm text-[#4880FF]">{item.available_stock}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.reorder_level}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(getStockStatus(item))}`}>
                          {getStockStatus(item)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {inventory.length > 0 ? ((currentPage - 1) * 20 + 1) : 0}-{Math.min(currentPage * 20, stats.total_variants)} of {stats.total_variants}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button className="px-4 py-2 bg-[#4880FF] text-white rounded-lg">{currentPage}</button>
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    {currentPage + 1}
                  </button>
                )}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#4880FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading inventory...</p>
          </div>
        </div>
      </div>
    }>
      <InventoryContent />
    </Suspense>
  );
}
