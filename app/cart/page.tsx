'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showToast } from '@/components/Toast';
import { ChevronRight, Minus, Plus, Trash2, Tag, ArrowRight, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import cartService from '@/lib/services/cartService';
import type { CartResponse } from '@/lib/types/backend';
import axios from 'axios';

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication and load cart
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsAuthenticated(!!token);

        if (token) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError('');

            const token = localStorage.getItem('access_token');
            console.log('🛒 Fetching cart...');
            console.log('🛒 Token exists:', !!token);

            const response = await cartService.getCart();
            console.log('🛒 Cart API Response:', response);
            console.log('🛒 Response data:', response.data);
            console.log('🛒 Cart items:', response.data?.items);

            // Backend returns: { items, subtotal, totalItems }
            // Frontend expects: { items, summary, unavailable_items }
            // Backend has nested product object in variant
            const transformedItems = (response.data?.items || []).map((item: any) => {
                const variant = item.variant || {};
                const product = variant.product || {};

                return {
                    ...item,
                    product: {
                        id: product.id || variant.product_id || 0,
                        name: product.name || 'Product',
                        thumbnail_url: product.thumbnail_url || variant.image_url || '/bmm32410_black_xl.webp',
                        selling_price: Number(product.selling_price || 0)
                    },
                    variant: {
                        ...variant,
                        price: Number(product.selling_price || variant.price || 0)
                    }
                };
            });

            const cartData = {
                items: transformedItems,
                summary: {
                    subtotal: response.data?.subtotal || 0,
                    items_count: response.data?.totalItems || 0,
                    discount: response.data?.discount || 0,
                    shipping_fee: response.data?.shipping_fee || 0,
                    total: response.data?.total || response.data?.subtotal || 0
                },
                unavailable_items: response.data?.unavailable_items || 0
            };

            console.log('🛒 Transformed cart data:', cartData);
            setCart(cartData as any);
        } catch (err: any) {
            console.error('❌ Error fetching cart:', err);
            if (axios.isAxiosError(err)) {
                console.error('❌ Error status:', err.response?.status);
                console.error('❌ Error data:', err.response?.data);
                console.error('❌ Request headers:', err.config?.headers);

                if (err.response?.status === 401) {
                    console.error('❌ 401 Unauthorized - Token expired or invalid');
                    setError('Session expired. Please login again.');
                    setIsAuthenticated(false);
                    // Clear invalid token
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                } else {
                    setError('Failed to load cart. Please try again.');
                }
            } else {
                setError('Failed to load cart. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartItemId: number, delta: number, currentQuantity: number, maxStock: number) => {
        const newQuantity = currentQuantity + delta;

        if (newQuantity <= 0) {
            handleRemoveItem(cartItemId);
            return;
        }

        if (newQuantity > maxStock) {
            showToast(`Only ${maxStock} items available in stock`, 'error');
            return;
        }

        try {
            await cartService.updateCartItem(cartItemId, { quantity: newQuantity });
            await fetchCart();
            showToast('Cart updated', 'success');
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response?.status === 400) {
                showToast(err.response.data.message || 'Cannot exceed available stock', 'error');
            } else {
                showToast('Failed to update cart', 'error');
            }
        }
    };

    const handleRemoveItem = async (cartItemId: number) => {
        if (!confirm('Remove this item from cart?')) return;

        try {
            await cartService.removeCartItem(cartItemId);
            await fetchCart();
            showToast('Item removed from cart', 'info');
        } catch (err) {
            showToast('Failed to remove item', 'error');
        }
    };

    const handleClearCart = async () => {
        if (!confirm('Clear all items from cart?')) return;

        try {
            await cartService.clearCart();
            await fetchCart();
            showToast('Cart cleared', 'info');
        } catch (err) {
            showToast('Failed to clear cart', 'error');
        }
    };

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) {
            showToast('Please enter a promo code', 'warning');
            return;
        }

        try {
            await cartService.applyCoupon({ code: promoCode });
            await fetchCart();
            showToast('Promo code applied!', 'success');
            setPromoCode('');
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                showToast(err.response?.data?.message || 'Invalid promo code', 'error');
            } else {
                showToast('Failed to apply promo code', 'error');
            }
        }
    };

    // Not logged in state
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center py-20">
                    <div className="text-center max-w-md">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
                        <p className="text-gray-600 mb-6">Please login to view your cart</p>
                        <Link href="/login?redirect=/cart" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                            Login to Continue
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Loading state
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

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center py-20">
                    <div className="text-center max-w-md">
                        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                        <h2 className="text-2xl font-bold mb-2">Error Loading Cart</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button onClick={fetchCart} className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                            Try Again
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Empty cart state
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center py-20">
                    <div className="text-center max-w-md">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
                        <p className="text-gray-600 mb-6">Start shopping to add items to your cart!</p>
                        <Link href="/products" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                            Continue Shopping
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const { summary } = cart;

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

                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl md:text-3xl font-integral font-bold">Your Cart</h1>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleClearCart}
                                className="text-sm text-gray-600 hover:text-red-500 transition"
                            >
                                Clear All
                            </button>
                            <Link
                                href="/products"
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Unavailable items warning */}
                    {(cart.unavailable_items || 0) > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-yellow-800">
                                <strong>{cart.unavailable_items || 0}</strong> item(s) in your cart are currently unavailable or out of stock.
                            </p>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="border border-gray-200 rounded-2xl divide-y">
                                {cart.items?.map((item) => (
                                    <div key={item.id} className={`p-4 md:p-6 flex gap-4 ${!item.is_available ? 'bg-gray-50' : ''}`}>
                                        {/* Product Image */}
                                        <Link href={`/products/${item.product?.id || '#'}`} className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.variant?.image_url || item.product?.thumbnail_url || '/bmm32410_black_xl.webp'}
                                                alt={item.product?.name || 'Product'}
                                                fill
                                                className="object-cover"
                                            />
                                        </Link>

                                        {/* Product Info */}
                                        <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                                            <div className="space-y-2">
                                                <Link href={`/products/${item.product?.id || '#'}`} className="font-bold text-base hover:underline">
                                                    {item.product?.name || 'Product'}
                                                </Link>
                                                <div className="text-xs space-y-1">
                                                    <p>
                                                        <span className="font-medium">Size:</span>{' '}
                                                        <span className="text-gray-600">
                                                            {typeof item.variant?.size === 'object' && item.variant?.size?.name
                                                                ? item.variant.size.name
                                                                : item.variant?.size || 'N/A'}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">Color:</span>{' '}
                                                        <span className="text-gray-600">
                                                            {typeof item.variant?.color === 'object' && item.variant?.color?.name
                                                                ? item.variant.color.name
                                                                : item.variant?.color || 'N/A'}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <span className="font-medium">SKU:</span>{' '}
                                                        <span className="text-gray-600">{item.variant?.sku || 'N/A'}</span>
                                                    </p>
                                                </div>
                                                <p className="text-xl font-bold">{Number(item.variant?.price || 0).toLocaleString('vi-VN')}₫</p>

                                                {/* Stock message */}
                                                {!item.is_available && item.stock_message && (
                                                    <p className="text-sm text-red-500 font-medium">{item.stock_message}</p>
                                                )}
                                            </div>

                                            <div className="flex md:flex-col items-end justify-between md:justify-start gap-4">
                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1, item.quantity || 1, item.variant?.available_stock || 0)}
                                                        className="p-1 hover:bg-gray-200 rounded-full transition"
                                                        disabled={!item.is_available}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-4 font-medium min-w-[40px] text-center">{item.quantity || 1}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1, item.quantity || 1, item.variant?.available_stock || 0)}
                                                        className="p-1 hover:bg-gray-200 rounded-full transition"
                                                        disabled={!item.is_available}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Stock info */}
                                                {item.is_available && (
                                                    <p className="text-xs text-gray-500">
                                                        {item.variant?.available_stock || 0} in stock
                                                    </p>
                                                )}
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
                                        <span className="text-gray-600">Subtotal ({summary?.items_count || 0} items)</span>
                                        <span className="font-bold">{Number(summary?.subtotal || 0).toLocaleString('vi-VN')}₫</span>
                                    </div>

                                    {Number(summary?.discount || 0) > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Discount</span>
                                            <span className="font-bold text-green-600">-{Number(summary?.discount || 0).toLocaleString('vi-VN')}₫</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping Fee</span>
                                        <span className="font-bold">{Number(summary?.shipping_fee || 0).toLocaleString('vi-VN')}₫</span>
                                    </div>

                                    <hr className="border-gray-200" />

                                    <div className="flex justify-between text-lg">
                                        <span className="font-medium">Total</span>
                                        <span className="font-bold">{Number(summary?.total || 0).toLocaleString('vi-VN')}₫</span>
                                    </div>
                                </div>

                                {/* Promo Code */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Have a promo code?</label>
                                    <div className="flex gap-3">
                                        <div className="flex-1 relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                placeholder="Enter code"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
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
                                </div>

                                {/* Checkout Button */}
                                <Link
                                    href="/checkout"
                                    className={`w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 group ${(cart.unavailable_items || 0) > 0 ? 'opacity-50 pointer-events-none' : ''}`}
                                    onClick={(e) => {
                                        if ((cart.unavailable_items || 0) > 0) {
                                            e.preventDefault();
                                            showToast('Please remove unavailable items before checkout', 'warning');
                                        }
                                    }}
                                >
                                    Go to Checkout
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                {(cart.unavailable_items || 0) > 0 && (
                                    <p className="text-xs text-center text-red-500">
                                        Remove unavailable items to proceed
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
