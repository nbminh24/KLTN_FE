'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AddressForm, { AddressFormData } from '@/components/AddressForm';
import { showToast } from '@/components/Toast';
import { ChevronRight, MapPin, Plus, Edit2, Trash2, Check, Loader2, AlertCircle } from 'lucide-react';
import accountService, { Address } from '@/lib/services/accountService';
import axios from 'axios';

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingAddress, setEditingAddress] = useState<Partial<AddressFormData> | undefined>();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login?redirect=/addresses');
      return;
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await accountService.getAddresses();
      console.log('📍 Addresses API Response:', response.data);

      // Backend returns: { data: Address[] } NOT { addresses: Address[] }
      const addressList = response.data.data || response.data.addresses || response.data || [];
      console.log('📍 Address List:', addressList);
      console.log('📍 Address Count:', addressList.length);

      setAddresses(Array.isArray(addressList) ? addressList : []);
    } catch (err) {
      console.error('❌ Error fetching addresses:', err);
      if (axios.isAxiosError(err)) {
        console.error('❌ Response:', err.response?.data);
        if (err.response?.status === 401) {
          router.push('/login?redirect=/addresses');
        } else {
          setError('Không thể tải địa chỉ');
        }
      }
      setAddresses([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: AddressFormData) => {
    try {
      console.log('💾 Saving address:', data);
      console.log('💾 Editing ID:', editingId);

      const payload: Partial<Address> = {
        province: data.province,
        ward: data.ward,
        street_address: data.street_address,
        phone_number: data.phone_number,
        latitude: data.latitude,
        longitude: data.longitude,
        address_source: data.address_source,
        address_type: data.address_type,
        is_default: data.is_default,
      };
      console.log('📤 Payload to send:', payload);

      if (editingId) {
        await accountService.updateAddress(editingId, payload as Address);
        showToast('Cập nhật địa chỉ thành công', 'success');
      } else {
        await accountService.addAddress(payload as Address);
        showToast('Thêm địa chỉ thành công', 'success');
      }

      setShowAddForm(false);
      setEditingId(null);
      setEditingAddress(undefined);
      await fetchAddresses();
    } catch (err: any) {
      console.error('❌ Save error:', err);
      if (axios.isAxiosError(err)) {
        console.error('❌ Error:', err.response?.data);
      }
      showToast(axios.isAxiosError(err) ? err.response?.data?.message || 'Lỗi khi lưu địa chỉ' : 'Lỗi khi lưu địa chỉ', 'error');
    }
  };

  const handleEdit = (addr: Address) => {
    setEditingAddress({
      province: addr.province || '',
      ward: addr.ward || '',
      street_address: addr.street_address || addr.detailed_address || '',
      phone_number: addr.phone_number || '',
      address_source: addr.address_source || 'manual',
      address_type: addr.address_type || 'Home',
      is_default: addr.is_default || false,
      latitude: addr.latitude,
      longitude: addr.longitude,
    });
    setEditingId(addr.id || null);
    setShowAddForm(true);
    console.log('✏️ Editing address ID:', addr.id);
  };

  const deleteAddress = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    try {
      await accountService.deleteAddress(id);
      showToast('Đã xóa địa chỉ', 'info');
      await fetchAddresses();
    } catch (err) {
      showToast('Không thể xóa địa chỉ', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-gray-600" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Lỗi</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={fetchAddresses} className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              Thử Lại
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Trang Chủ</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <Link href="/profile" className="text-gray-500">Hồ Sơ</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Địa Chỉ</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-integral font-bold mb-2">Địa Chỉ Của Tôi</h1>
            <p className="text-gray-600">{addresses?.length || 0} địa chỉ đã lưu</p>
          </div>

          {/* 2 Column Layout */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left: Address Form */}
            <div className="lg:col-span-2">
              {showAddForm || editingId ? (
                <AddressForm
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setEditingAddress(undefined);
                  }}
                  initialData={editingAddress}
                  isEditing={!!editingId}
                />
              ) : (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-gray-400 hover:bg-gray-50 transition flex flex-col items-center justify-center gap-3 text-gray-600"
                >
                  <Plus className="w-8 h-8" />
                  <span className="font-medium">Thêm Địa Chỉ Mới</span>
                </button>
              )}
            </div>

            {/* Right: Address List */}
            <div className="lg:col-span-3">
              {!addresses || addresses.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                    <MapPin className="w-10 h-10 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Chưa có địa chỉ nào</h2>
                  <p className="text-gray-600">Thêm địa chỉ giao hàng để thanh toán nhanh hơn.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {addresses?.map((address) => (
                    <div
                      key={address.id}
                      className={`border rounded-2xl p-6 transition hover:shadow-lg ${address.is_default ? 'border-black bg-gray-50' : 'border-gray-200'
                        }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-gray-600" />
                          <h3 className="font-bold">{address.address_type || 'Home'}</h3>
                        </div>
                        {address.is_default && (
                          <span className="bg-black text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Mặc Định
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 space-y-2 mb-4">
                        {address.province && address.ward ? (
                          <>
                            <p className="leading-relaxed">
                              {address.street_address}
                            </p>
                            <p className="text-xs text-gray-500">
                              {address.ward}, {address.province}
                            </p>
                          </>
                        ) : (
                          <p className="leading-relaxed">{address.detailed_address}</p>
                        )}
                        <p className="font-medium text-gray-900">📞 {address.phone_number}</p>
                        {address.latitude && address.longitude && typeof address.latitude === 'number' && typeof address.longitude === 'number' && (
                          <p className="text-xs text-blue-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            GPS: {address.latitude.toFixed(4)}, {address.longitude.toFixed(4)}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleEdit(address)}
                          className="flex-1 border border-gray-300 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Chỉnh Sửa
                        </button>
                        <button
                          onClick={() => address.id && deleteAddress(address.id)}
                          className="p-2 border border-red-200 text-red-500 rounded-full hover:bg-red-50 transition"
                          title="Xóa địa chỉ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
