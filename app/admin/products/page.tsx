'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Plus, Edit2, Trash2, Download, Upload, Sparkles, Eye, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import adminProductService, { AdminProduct } from '@/lib/services/admin/productService';
import { showToast } from '@/components/Toast';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, selectedStockStatus]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('📦 Fetching products...');
      const response = await adminProductService.getProducts({
        page: currentPage,
        limit: 20,
        category_id: selectedCategory !== 'all' ? parseInt(selectedCategory) : undefined,
        status: selectedStockStatus === 'all' ? undefined : (selectedStockStatus as 'active' | 'inactive'),
      });
      console.log('📦 Products response:', response.data);

      // Backend returns: { data: [...], metadata: { total_pages: ... } }
      const backendData: any = response.data;
      const productsList = backendData.data || backendData.products || [];
      const pages = backendData.metadata?.total_pages || backendData.total_pages || 1;

      console.log('📦 Products list:', productsList.length, 'items');
      console.log('📦 Total pages:', pages);

      setProducts(productsList);
      setTotalPages(pages);
    } catch (err: any) {
      console.error('❌ Failed to load products:', err);
      console.error('❌ Error response:', err.response?.data);
      showToast('Không thể tải danh sách sản phẩm', 'error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await adminProductService.deleteProduct(id);
      showToast('Đã xóa sản phẩm thành công', 'success');
      fetchProducts();
    } catch (err) {
      showToast('Không thể xóa sản phẩm', 'error');
    }
  };

  const filteredProducts = (products || []).filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectedProducts(checked ? (products || []).map((p) => p.id) : []);
  };

  const handleSelectProduct = (id: number, checked: boolean) => {
    setSelectedProducts((prev) =>
      checked ? [...prev, id] : prev.filter((pid) => pid !== id)
    );
  };

  const handleDeleteSelected = () => {
    if (confirm(`Xóa ${selectedProducts.length} sản phẩm đã chọn?`)) {
      alert('Đã xóa sản phẩm thành công!');
      setSelectedProducts([]);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Sản Phẩm</h1>
          <p className="text-gray-600 mt-1">Quản lý kho sản phẩm của bạn</p>
        </div>
        <div className="flex gap-3">
          {selectedProducts.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span className="font-semibold text-sm">Xóa Đã Chọn ({selectedProducts.length})</span>
            </button>
          )}
          <Link
            href="/admin/products/add"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" />
            <span className="font-semibold text-sm">Thêm Sản Phẩm</span>
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
              placeholder="Tìm sản phẩm theo tên hoặc SKU..."
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
            <option value="all">Tất Cả Danh Mục</option>
            <option value="T-Shirts">T-Shirts</option>
            <option value="Shirts">Shirts</option>
            <option value="Jeans">Jeans</option>
            <option value="Hoodies">Hoodies</option>
          </select>
          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          >
            <option value="all">Tất Cả Trạng Thái</option>
            <option value="in-stock">Còn Hàng</option>
            <option value="low-stock">Sắp Hết</option>
            <option value="out-of-stock">Hết Hàng</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          >
            <option value="name">Sắp Xếp Theo Tên</option>
            <option value="price-asc">Giá: Thấp Đến Cao</option>
            <option value="price-desc">Giá: Cao Đến Thấp</option>
            <option value="stock-asc">Tồn Kho: Thấp Đến Cao</option>
            <option value="stock-desc">Tồn Kho: Cao Đến Thấp</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F1F4F9] border-b border-gray-200">
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Sản Phẩm</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Danh Mục</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Giá</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Tồn Kho</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Trạng Thái</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={(e) => {
                    // Don't navigate if clicking on checkbox or action buttons
                    if ((e.target as HTMLElement).closest('input, button, a')) return;
                    router.push(`/admin/products/${product.id}`);
                  }}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.thumbnail_url && (
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                          <Image src={product.thumbnail_url} alt={product.name} fill className="object-cover" />
                        </div>
                      )}
                      <span className="font-semibold text-sm text-[#202224]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#202224]">{product.selling_price.toLocaleString('vi-VN')}₫</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${product.total_stock > 50 ? 'text-green-600' : product.total_stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {product.total_stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${product.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Hiển thị 1-3 trong tổng số 300</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Trước
            </button>
            <button className="px-4 py-2 bg-[#4880FF] text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Tiếp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
