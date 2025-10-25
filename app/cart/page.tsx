'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showToast } from '@/components/Toast';
import { getCart, updateCartItemQuantity, removeFromCart, getCartSubtotal, getCartDiscount, CartItem } from '@/lib/cart';
import { validatePromoCode } from '@/lib/pricing';
import { ChevronRight, Minus, Plus, Trash2, Tag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    setCartItems(getCart());
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      setCartItems(getCart());
    };
    
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const updateQuantity = (id: string, size: string | undefined, color: string | undefined, delta: number) => {
    const item = cartItems.find(i => i.id === id && i.size === size && i.color === color);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        handleRemoveItem(id, size, color);
        return;
      }
      
      const success = updateCartItemQuantity(id, newQuantity, size, color);
      if (!success) {
        showToast('Cannot exceed available stock', 'error');
      }
    }
  };

  const handleRemoveItem = (id: string, size?: string, color?: string) => {
    removeFromCart(id, size, color);
    showToast('Item removed from cart', 'info');
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      showToast('Please enter a promo code', 'warning');
      return;
    }

    const result = validatePromoCode(promoCode, subtotal);
    
    if (result.valid) {
      setPromoDiscount(result.discount);
      showToast(result.message, 'success');
    } else {
      setPromoDiscount(0);
      showToast(result.message, 'error');
    }
  };

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const total = Math.max(0, subtotal - discount - promoDiscount + deliveryFee);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Cart</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-integral font-bold mb-6">Your cart</h1>

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
                        <h3 className="font-bold text-base">{item.name}</h3>
                        <div className="text-xs space-y-1">
                          <p>
                            <span className="font-medium">Size:</span>{' '}
                            <span className="text-gray-600">{item.size}</span>
                          </p>
                          <p>
                            <span className="font-medium">Color:</span>{' '}
                            <span className="text-gray-600">{item.color}</span>
                          </p>
                        </div>
                        <p className="text-xl font-bold">${item.price}</p>
                      </div>

                      <div className="flex md:flex-col items-end justify-between md:justify-start gap-4">
                        {/* Delete Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        {/* Quantity Controls */}
                        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.color, -1)}
                            className="p-1"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.color, 1)}
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
              <div className="border border-gray-200 rounded-2xl p-5 space-y-5 sticky top-6">
                <h2 className="text-xl font-bold">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold">${subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-bold text-red-500">-${discount.toFixed(0)}</span>
                    </div>
                  )}
                  {promoDiscount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Promo Code</span>
                      <span className="font-bold text-green-500">-${promoDiscount}</span>
                    </div>
                  )}
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
                  <button 
                    onClick={handleApplyPromo}
                    className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition"
                  >
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
