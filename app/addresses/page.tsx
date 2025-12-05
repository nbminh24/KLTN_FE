'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  const [formData, setFormData] = useState<Partial<Address>>({
    address_type: 'Home',
    detailed_address: '',
    phone_number: '',
    is_default: false,
  });

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
          setError('Failed to load addresses');
        }
      }
      setAddresses([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('💾 Saving address:', formData);
      console.log('💾 Editing ID:', editingId);

      // Only send fields that backend accepts
      const payload = {
        address_type: formData.address_type || 'Home',
        detailed_address: formData.detailed_address,
        phone_number: formData.phone_number,
        is_default: formData.is_default || false
      };
      console.log('📤 Payload to send:', payload);

      if (editingId) {
        const response = await accountService.updateAddress(editingId, payload as Address);
        console.log('✅ Update response:', response.data);
        showToast('Address updated successfully', 'success');
      } else {
        const response = await accountService.addAddress(payload as Address);
        console.log('✅ Add response:', response.data);
        showToast('Address added successfully', 'success');
      }

      setShowAddForm(false);
      setEditingId(null);
      setFormData({ address_type: 'Home', detailed_address: '', phone_number: '', is_default: false });

      console.log('🔄 Refetching addresses...');
      await fetchAddresses();
    } catch (err: any) {
      console.error('❌ Save error:', err);
      if (axios.isAxiosError(err)) {
        console.error('❌ Error status:', err.response?.status);
        console.error('❌ Error data:', JSON.stringify(err.response?.data, null, 2));
        console.error('❌ Error message:', err.response?.data?.message);
      }
      showToast(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to save address' : 'Failed to save address', 'error');
    }
  };

  const handleEdit = (addr: Address) => {
    // Only copy fields that can be edited, exclude 'id' and other read-only fields
    setFormData({
      address_type: addr.address_type || 'Home',
      detailed_address: addr.detailed_address || '',
      phone_number: addr.phone_number || '',
      is_default: addr.is_default || false
    });
    setEditingId(addr.id || null);
    setShowAddForm(true);
    console.log('✏️ Editing address ID:', addr.id);
  };

  const deleteAddress = async (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await accountService.deleteAddress(id);
      showToast('Address deleted', 'info');
      await fetchAddresses();
    } catch (err) {
      showToast('Failed to delete address', 'error');
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
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={fetchAddresses} className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              Try Again
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
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <Link href="/profile" className="text-gray-500">Profile</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Addresses</span>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-integral font-bold mb-2">My Addresses</h1>
              <p className="text-gray-600">{addresses?.length || 0} saved {addresses?.length === 1 ? 'address' : 'addresses'}</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Address
            </button>
          </div>

          {/* Add/Edit Address Form */}
          {showAddForm && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-6">
              <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Address Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Address Type *</label>
                  <select
                    value={formData.address_type || 'Home'}
                    onChange={(e) => setFormData({ ...formData, address_type: e.target.value as 'Home' | 'Office' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                  </select>
                </div>

                {/* Detailed Address */}
                <div>
                  <label className="block text-sm font-medium mb-2">Detailed Address *</label>
                  <textarea
                    required
                    value={formData.detailed_address || ''}
                    onChange={(e) => setFormData({ ...formData, detailed_address: e.target.value })}
                    placeholder="123 Nguyễn Trãi, Phường 1, Quận 5, TP. Hồ Chí Minh"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone_number || ''}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="0901234567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* Is Default */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_default || false}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Set as default address</span>
                </label>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition"
                  >
                    {editingId ? 'Update Address' : 'Save Address'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingId(null);
                      setFormData({ address_type: 'Home', detailed_address: '', phone_number: '', is_default: false });
                    }}
                    className="flex-1 border border-gray-300 py-3 rounded-full font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Address List */}
          {!addresses || addresses.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">No addresses saved</h2>
              <p className="text-gray-600">Add your delivery addresses for faster checkout.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
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
                        Default
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 space-y-2 mb-4">
                    <p className="leading-relaxed">{address.detailed_address}</p>
                    <p className="font-medium text-gray-900">📞 {address.phone_number}</p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(address)}
                      className="flex-1 border border-gray-300 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => address.id && deleteAddress(address.id)}
                      className="p-2 border border-red-200 text-red-500 rounded-full hover:bg-red-50 transition"
                      title="Delete address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
