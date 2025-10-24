'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, MapPin, Plus, Edit2, Trash2, Check } from 'lucide-react';

interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      phone: '+1 234 567 8900',
      isDefault: true,
    },
    {
      id: '2',
      name: 'John Doe (Office)',
      address: '456 Business Ave, Suite 200',
      city: 'New York',
      state: 'NY',
      postalCode: '10002',
      phone: '+1 234 567 8900',
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const setDefaultAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
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
            <Link href="/profile" className="text-gray-500">Profile</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Addresses</span>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-integral font-bold mb-2">My Addresses</h1>
              <p className="text-gray-600">{addresses.length} saved {addresses.length === 1 ? 'address' : 'addresses'}</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Address
            </button>
          </div>

          {/* Add Address Form */}
          {showAddForm && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-6">
              <h2 className="text-xl font-bold mb-6">Add New Address</h2>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 234 567 8900"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    placeholder="Street address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      placeholder="New York"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                      type="text"
                      placeholder="NY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Postal Code</label>
                    <input
                      type="text"
                      placeholder="10001"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm">Set as default address</span>
                </label>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 border border-gray-300 py-3 rounded-full font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Address List */}
          {addresses.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">No addresses saved</h2>
              <p className="text-gray-600 mb-6">Add your delivery addresses for faster checkout.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition"
              >
                <Plus className="w-5 h-5" />
                Add Address
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border rounded-2xl p-6 transition hover:shadow-lg ${
                    address.isDefault ? 'border-black bg-gray-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-600" />
                      <h3 className="font-bold">{address.name}</h3>
                    </div>
                    {address.isDefault && (
                      <span className="bg-black text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Default
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p>{address.address}</p>
                    <p>{address.city}, {address.state} {address.postalCode}</p>
                    <p>{address.phone}</p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    {!address.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(address.id)}
                        className="flex-1 border border-gray-300 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                      title="Edit address"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAddress(address.id)}
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
