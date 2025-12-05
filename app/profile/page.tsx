'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, User, Package, MapPin, Heart, Settings, LogOut, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/Toast';
import accountService, { UserProfile } from '@/lib/services/accountService';
import axios from 'axios';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('account');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '', confirm_password: '' });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login?redirect=/profile');
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await accountService.getProfile();
      console.log('👤 Profile API Response:', response.data);

      // Backend returns: {data: {id, name, email, ...}}
      const profileData = response.data.data || response.data;
      console.log('👤 Profile Data:', profileData);

      setProfile(profileData);
    } catch (err) {
      console.error('❌ Profile fetch error:', err);
      if (axios.isAxiosError(err)) {
        console.error('❌ Profile error response:', err.response?.data);
        if (err.response?.status === 401) {
          router.push('/login?redirect=/profile');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      showToast('Passwords do not match', 'error');
      return;
    }
    try {
      setUpdating(true);
      await accountService.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      showToast('Password changed successfully', 'success');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      showToast(axios.isAxiosError(err) ? err.response?.data?.message || 'Failed to change password' : 'Failed to change password', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('guest_cart_session');
      showToast('Logged out successfully', 'success');
      router.push('/login');
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">My Profile</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-integral font-bold mb-6">My Profile</h1>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-2xl p-4 space-y-2 sticky top-6">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'account' ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                >
                  <User className="w-5 h-5" />
                  <span>Account Details</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                >
                  <Package className="w-5 h-5" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'addresses' ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span>Addresses</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'wishlist' ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'settings' ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <hr className="border-gray-200 my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'account' && (
                <div className="border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-6">Account Details</h2>
                  <div className="space-y-5">
                    {/* Full Name */}
                    <div className="pb-4 border-b border-gray-100">
                      <label className="block text-sm font-medium text-gray-500 mb-2">Full Name</label>
                      <p className="text-base font-medium text-gray-900">{profile?.name || 'N/A'}</p>
                    </div>

                    {/* Email */}
                    <div className="pb-4 border-b border-gray-100">
                      <label className="block text-sm font-medium text-gray-500 mb-2">Email</label>
                      <p className="text-base font-medium text-gray-900">{profile?.email || 'N/A'}</p>
                    </div>

                    {/* Info Note */}
                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Note:</span> Account information cannot be modified. Please contact support if you need to update your details.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold mb-6">My Orders</h2>
                  <p className="text-gray-600">
                    View your order history.{' '}
                    <Link href="/orders" className="text-black font-medium underline">
                      Go to Orders
                    </Link>
                  </p>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>
                  <p className="text-gray-600 mb-4">
                    Manage your delivery addresses.{' '}
                    <Link href="/addresses" className="text-black font-medium underline">
                      View All Addresses
                    </Link>
                  </p>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                  <p className="text-gray-600 mb-4">
                    View and manage your saved items.{' '}
                    <Link href="/wishlist" className="text-black font-medium underline">
                      Go to Wishlist
                    </Link>
                  </p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <Lock className="w-5 h-5" />
                      <h2 className="text-xl font-bold">Change Password</h2>
                    </div>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Current Password</label>
                        <input
                          type="password"
                          required
                          value={passwordData.old_password || ''}
                          onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                          placeholder="Enter current password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          value={passwordData.new_password || ''}
                          onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                          placeholder="Enter new password (min 8 characters)"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          required
                          value={passwordData.confirm_password || ''}
                          onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                          placeholder="Confirm new password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={updating}
                        className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50"
                      >
                        {updating ? 'Updating...' : 'Update Password'}
                      </button>
                    </form>
                  </div>

                  {/* Notification Settings */}
                  <div className="border border-gray-200 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-5">Notification Preferences</h2>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <span className="font-medium">Email Notifications</span>
                        <input type="checkbox" className="w-5 h-5" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="font-medium">SMS Notifications</span>
                        <input type="checkbox" className="w-5 h-5" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="font-medium">Newsletter</span>
                        <input type="checkbox" className="w-5 h-5" defaultChecked />
                      </label>
                    </div>
                  </div>
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
