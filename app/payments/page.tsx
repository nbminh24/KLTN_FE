'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, CreditCard, Plus, Check, Trash2 } from 'lucide-react';

export default function PaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'Visa',
      lastFour: '4242',
      expiry: '12/25',
      name: 'John Doe',
      isDefault: true,
    },
    {
      id: '2',
      type: 'MasterCard',
      lastFour: '5555',
      expiry: '08/26',
      name: 'John Doe',
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const setDefaultPayment = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    })));
  };

  const deletePayment = (id: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
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
            <span className="font-medium">Payment Methods</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-integral font-bold mb-2">
                PAYMENT METHODS
              </h1>
              <p className="text-gray-600">Manage your saved payment methods</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition"
            >
              <Plus className="w-5 h-5" />
              Add New
            </button>
          </div>

          {/* Add Payment Form */}
          {showAddForm && (
            <div className="border border-gray-200 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Add New Card</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Name on card"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition"
                  >
                    Save Card
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

          {/* Payment Methods List */}
          <div className="grid md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`border rounded-2xl p-6 relative ${
                  method.isDefault ? 'border-black border-2' : 'border-gray-200'
                }`}
              >
                {method.isDefault && (
                  <div className="absolute top-4 right-4 bg-black text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Default
                  </div>
                )}
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold">{method.type}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">•••• {method.lastFour}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p>Name: {method.name}</p>
                  <p>Expires: {method.expiry}</p>
                </div>
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => setDefaultPayment(method.id)}
                      className="flex-1 border border-gray-300 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => deletePayment(method.id)}
                    className="p-2 border border-red-200 text-red-600 rounded-full hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Security Note */}
          <div className="mt-8 bg-gray-100 rounded-2xl p-6 text-center">
            <CreditCard className="w-8 h-8 mx-auto mb-3 text-gray-600" />
            <h3 className="font-bold mb-2">Your payment information is secure</h3>
            <p className="text-gray-600 text-sm">
              All payment data is encrypted and stored securely. We never store your full card details.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
