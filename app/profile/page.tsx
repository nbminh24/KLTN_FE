'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, User, Package, MapPin, Heart, Settings } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">My Profile</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-integral font-bold mb-8">My Profile</h1>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-2xl p-4 space-y-2 sticky top-6">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'account' ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Account Details</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'addresses' ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span>Addresses</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'wishlist' ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'settings' ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'account' && (
                <div className="border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold mb-6">Account Details</h2>
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+1 234 567 8900"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition"
                    >
                      Save Changes
                    </button>
                  </form>
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
                  <button className="border border-gray-300 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition">
                    + Add New Address
                  </button>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                  <p className="text-gray-600">Your wishlist is empty.</p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold mb-6">Settings</h2>
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
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
