'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, MapPin, Plus, Edit2, Trash2, Check } from 'lucide-react';

export default function ManageDeliveriesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      name: 'Home',
      fullName: 'John Doe',
      address: '123 Main St, Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      phone: '+1 (555) 123-4567',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Office',
      fullName: 'John Doe',
      address: '456 Business Ave, Suite 200',
      city: 'New York',
      state: 'NY',
      zip: '10002',
      phone: '+1 (555) 987-6543',
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const setDefaultAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  const deleteAddress = (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <Link href="/profile" className="text-gray-500">Account</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Manage Deliveries</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-integral font-bold mb-2">
                DELIVERY ADDRESSES
              </h1>
              <p className="text-gray-600">Manage your shipping addresses</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition"
            >
              <Plus className="w-5 h-5" />
              Add New
            </button>
          </div>

          {/* Add Address Form */}
          {showAddForm && (
            <div className="border border-gray-200 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Add New Address</h3>
              <form className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Label (e.g., Home, Office)"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  placeholder="City"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  placeholder="State"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-8 border border-gray-300 py-3 rounded-full font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Address List */}
          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`border rounded-2xl p-6 relative ${
                  address.isDefault ? 'border-black border-2' : 'border-gray-200'
                }`}
              >
                {address.isDefault && (
                  <div className="absolute top-4 right-4 bg-black text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Default
                  </div>
                )}
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{address.name}</h3>
                    <p className="text-gray-900 font-medium">{address.fullName}</p>
                  </div>
                </div>
                <div className="text-gray-600 text-sm space-y-1 mb-4">
                  <p>{address.address}</p>
                  <p>{address.city}, {address.state} {address.zip}</p>
                  <p>{address.phone}</p>
                </div>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(address.id)}
                      className="flex-1 border border-gray-300 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition"
                    >
                      Set as Default
                    </button>
                  )}
                  <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAddress(address.id)}
                    className="p-2 border border-red-200 text-red-600 rounded-full hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
