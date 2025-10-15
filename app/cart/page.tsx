'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Minus, Plus, Trash2, Tag, ArrowRight } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  image: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Gradient Graphic T-shirt',
      image: 'https://placehold.co/125x187',
      size: 'Large',
      color: 'White',
      price: 145,
      quantity: 1,
    },
    {
      id: '2',
      name: 'Checkered Shirt',
      image: 'https://placehold.co/125x187',
      size: 'Medium',
      color: 'Red',
      price: 180,
      quantity: 1,
    },
    {
      id: '3',
      name: 'Skinny Fit Jeans',
      image: 'https://placehold.co/102x153',
      size: 'Large',
      color: 'Blue',
      price: 240,
      quantity: 1,
    },
  ]);

  const [promoCode, setPromoCode] = useState('');

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * 0.2; // 20% discount
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Cart</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-integral font-bold mb-8">Your cart</h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="border border-gray-200 rounded-2xl divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 md:p-6 flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <div className="text-sm space-y-1">
                          <p>
                            <span className="font-medium">Size:</span>{' '}
                            <span className="text-gray-600">{item.size}</span>
                          </p>
                          <p>
                            <span className="font-medium">Color:</span>{' '}
                            <span className="text-gray-600">{item.color}</span>
                          </p>
                        </div>
                        <p className="text-2xl font-bold">${item.price}</p>
                      </div>

                      <div className="flex md:flex-col items-end justify-between md:justify-start gap-4">
                        {/* Delete Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        {/* Quantity Controls */}
                        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-2xl p-6 space-y-6 sticky top-6">
                <h2 className="text-2xl font-bold">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold">${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount (-20%)</span>
                    <span className="font-bold text-red-500">-${discount.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-bold">${deliveryFee}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">${total.toFixed(0)}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Add promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                    Apply
                  </button>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 group"
                >
                  Go to Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
