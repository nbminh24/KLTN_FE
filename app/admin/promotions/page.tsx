'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Copy, Tag, Calendar, X, Loader2, Search } from 'lucide-react';
import adminPromotionService, { AdminPromotion } from '@/lib/services/admin/promotionService';
import adminProductService, { AdminProduct } from '@/lib/services/admin/productService';
import { showToast } from '@/components/Toast';

export default function PromotionsPage() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'expired'>('active');
  const [promotions, setPromotions] = useState<AdminPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<AdminPromotion | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'voucher' as 'voucher' | 'flash_sale',
    discount_value: 0,
    discount_type: 'percentage' as 'percentage' | 'fixed_amount',
    number_limited: 0,
    start_date: '',
    end_date: '',
  });
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Filtered products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  useEffect(() => {
    fetchPromotions();
  }, [activeTab]);

  useEffect(() => {
    if (showModal) {
      fetchProducts();
    }
  }, [showModal]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await adminPromotionService.getPromotions({ status: activeTab });
      const promotionsList = response.data.promotions || [];
      setPromotions(promotionsList);
    } catch (error: any) {
      showToast('Không thể tải danh sách khuyến mãi', 'error');
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await adminProductService.getProducts({ limit: 100, status: 'active' });
      const backendData: any = response.data;
      const productsList = backendData.data || backendData.products || [];
      setProducts(productsList);
    } catch (error: any) {
      showToast('Không thể tải danh sách sản phẩm', 'error');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode && selectedPromotion) {
        // Include status for updates
        const updateData = {
          ...formData,
          status: selectedPromotion.status,
          product_ids: selectedProductIds.length > 0 ? selectedProductIds : undefined
        };
        await adminPromotionService.updatePromotion(selectedPromotion.id, updateData);
        showToast('Đã cập nhật khuyến mãi thành công', 'success');
      } else {
        // Don't send status field when creating
        const createData = {
          name: formData.name,
          type: formData.type,
          discount_value: formData.discount_value,
          discount_type: formData.discount_type,
          number_limited: formData.number_limited,
          start_date: formData.start_date,
          end_date: formData.end_date,
          product_ids: selectedProductIds.length > 0 ? selectedProductIds : undefined
        };
        await adminPromotionService.createPromotion(createData);
        showToast('Đã tạo khuyến mãi thành công', 'success');
      }
      setShowModal(false);
      resetForm();
      fetchPromotions();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Không thể lưu khuyến mãi';
      showToast(errorMsg, 'error');
    }
  };

  const handleEdit = (promotion: AdminPromotion) => {
    setSelectedPromotion(promotion);
    setFormData({
      name: promotion.name,
      type: promotion.type,
      discount_value: promotion.discount_value,
      discount_type: promotion.discount_type,
      number_limited: promotion.number_limited || 0,
      start_date: promotion.start_date.split('T')[0],
      end_date: promotion.end_date.split('T')[0],
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa khuyến mãi này?')) return;
    try {
      await adminPromotionService.deletePromotion(id);
      showToast('Đã xóa khuyến mãi thành công', 'success');
      fetchPromotions();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Không thể xóa khuyến mãi';
      showToast(errorMsg, 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'voucher',
      discount_value: 0,
      discount_type: 'percentage',
      number_limited: 0,
      start_date: '',
      end_date: '',
    });
    setSelectedProductIds([]);
    setProductSearch('');
    setEditMode(false);
    setSelectedPromotion(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Promotions</h1>
          <p className="text-gray-600 mt-1">Manage vouchers and campaigns</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="font-semibold text-sm">Create Promotion</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Promotions</p>
          <p className="text-2xl font-bold text-[#202224]">{promotions.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600">{promotions.filter(p => p.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Expired</p>
          <p className="text-2xl font-bold text-red-600">{promotions.filter(p => p.status === 'expired').length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 px-6 py-4 font-semibold transition ${activeTab === 'active'
              ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Active Promotions
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`flex-1 px-6 py-4 font-semibold transition ${activeTab === 'expired'
              ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Expired Promotions
          </button>
        </div>

        {/* Promotions Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F1F4F9]">
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Discount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Usage</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Period</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                    </td>
                  </tr>
                ) : promotions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No promotions found
                    </td>
                  </tr>
                ) : (
                  promotions.map((promotion) => (
                    <tr key={promotion.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[#4880FF]" />
                          <span className="font-semibold text-sm text-[#202224]">{promotion.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${promotion.type === 'voucher'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-orange-100 text-orange-700'
                          }`}>
                          {promotion.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">
                          {promotion.discount_type === 'percentage'
                            ? `${promotion.discount_value}%`
                            : `${promotion.discount_value.toLocaleString('vi-VN')} VND`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {promotion.number_limited ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">
                              {promotion.used_count || 0}/{promotion.number_limited}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Unlimited</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(promotion.start_date).toLocaleDateString('vi-VN')}</span>
                          <span>-</span>
                          <span>{new Date(promotion.end_date).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${promotion.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : promotion.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                          }`}>
                          {promotion.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(promotion)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(promotion.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#202224]">
                {editMode ? 'Edit Promotion' : 'Create Promotion'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Promotion Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Summer Sale 2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Type *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'voucher' | 'flash_sale' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                >
                  <option value="voucher">Voucher</option>
                  <option value="flash_sale">Flash Sale</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Discount Type *</label>
                  <select
                    required
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed_amount' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount (VND)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={formData.discount_value || ''}
                    onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                    placeholder="20"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Usage Limit</label>
                <input
                  type="number"
                  value={formData.number_limited || ''}
                  onChange={(e) => setFormData({ ...formData, number_limited: parseInt(e.target.value) || 0 })}
                  placeholder="0 = unlimited"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                />
                <p className="text-xs text-gray-500 mt-1">Leave 0 for unlimited uses</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {loading ? 'Đang lưu...' : (editMode ? 'Cập nhật' : 'Tạo mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
