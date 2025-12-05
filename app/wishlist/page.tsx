'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showToast } from '@/components/Toast';
import { ChevronRight, Heart, ShoppingCart, Trash2, Star, Loader2, AlertCircle } from 'lucide-react';
import wishlistService, { WishlistItem } from '@/lib/services/wishlistService';
import cartService from '@/lib/services/cartService';
import axios from 'axios';

export default function WishlistPage() {
    const router = useRouter();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsAuthenticated(!!token);

        if (token) {
            fetchWishlist();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('❤️ Fetching wishlist...');
            console.log('❤️ Token:', localStorage.getItem('access_token') ? 'exists' : 'missing');

            const response = await wishlistService.getWishlist();
            console.log('❤️ Wishlist API Response:', response);
            console.log('❤️ Response data:', response.data);
            console.log('❤️ Response status:', response.status);

            // Backend returns: { data: WishlistItem[], count: number }
            const wishlistData = response.data.data || [];
            console.log('❤️ Wishlist Data:', wishlistData);
            console.log('❤️ Wishlist Count:', response.data.count || wishlistData.length);

            setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
        } catch (err: any) {
            console.error('❌ Error fetching wishlist:', err);
            if (axios.isAxiosError(err)) {
                console.error('❌ Error status:', err.response?.status);
                console.error('❌ Error statusText:', err.response?.statusText);
                console.error('❌ Error data:', err.response?.data);
                console.error('❌ Error headers:', err.response?.headers);
                console.error('❌ Request URL:', err.config?.url);
                console.error('❌ Request method:', err.config?.method);
                console.error('❌ Full error:', JSON.stringify(err.response?.data, null, 2));

                if (err.response?.status === 401) {
                    setError('Session expired. Please login again.');
                    setIsAuthenticated(false);
                } else if (err.response?.status === 500) {
                    setError('Server error. Backend may have issues with database or entity mapping.');
                } else {
                    setError('Failed to load wishlist. Please try again.');
                }
            } else {
                setError('Failed to load wishlist. Please try again.');
            }
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (variantId: number) => {
        if (!confirm('Remove this item from wishlist?')) return;

        try {
            await wishlistService.removeFromWishlist(variantId);
            await fetchWishlist();
            showToast('Removed from wishlist', 'info');
        } catch (err) {
            showToast('Failed to remove item', 'error');
        }
    };

    const handleMoveToCart = async (item: WishlistItem) => {
        try {
            // Add to cart
            await cartService.addToCart({
                variant_id: item.variant_id,
                quantity: 1,
            });

            // Remove from wishlist
            await wishlistService.removeFromWishlist(item.variant_id);
            await fetchWishlist();

            showToast('Moved to cart!', 'success');
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                showToast(err.response?.data?.message || 'Failed to move to cart', 'error');
            } else {
                showToast('Failed to move to cart', 'error');
            }
        }
    };

    const handleClearAll = async () => {
        if (!confirm('Are you sure you want to clear all items from your wishlist?')) return;

        try {
            await wishlistService.clearWishlist();
            await fetchWishlist();
            showToast('Wishlist cleared', 'info');
        } catch (err) {
            showToast('Failed to clear wishlist', 'error');
        }
    };

    // Not logged in
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center py-20">
                    <div className="text-center max-w-md">
                        <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h2 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
                        <p className="text-gray-600 mb-6">Please login to view your wishlist</p>
                        <Link href="/login?redirect=/wishlist" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                            Login to Continue
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Loading
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

    // Error
    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center py-20">
                    <div className="text-center max-w-md">
                        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                        <h2 className="text-2xl font-bold mb-2">Error Loading Wishlist</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button onClick={fetchWishlist} className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                            Try Again
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Empty wishlist
    if (!wishlist || wishlist.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center py-20">
                    <div className="text-center max-w-md">
                        <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h2 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
                        <p className="text-gray-600 mb-6">Save your favorite items to wishlist!</p>
                        <Link href="/products" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                            Continue Shopping
                        </Link>
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
                        <span className="font-medium">Wishlist</span>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl md:text-3xl font-integral font-bold">
                            My Wishlist <span className="text-gray-500">({wishlist?.length || 0})</span>
                        </h1>
                        <button
                            onClick={handleClearAll}
                            className="text-red-500 hover:text-red-700 transition flex items-center gap-2"
                        >
                            <Trash2 className="w-5 h-5" />
                            Clear All
                        </button>
                    </div>

                    {/* Wishlist Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                        {wishlist?.map((item) => (
                            <div key={item.id} className="group relative">
                                <div className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition">
                                    {/* Product Image */}
                                    <Link href={`/products/${item.product.id}`} className="relative aspect-square bg-gray-100 block">
                                        <Image
                                            src={item.product.thumbnail_url}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                        {!item.variant.in_stock && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}
                                    </Link>

                                    {/* Product Info */}
                                    <div className="p-4 space-y-2">
                                        <Link href={`/products/${item.product.id}`} className="font-bold text-sm line-clamp-2 hover:underline">
                                            {item.product.name}
                                        </Link>

                                        {/* Variant Info */}
                                        <div className="text-xs text-gray-600 space-y-1">
                                            <p>
                                                <span className="font-medium">Size:</span>{' '}
                                                {typeof item.variant.size === 'object' && item.variant.size?.name
                                                    ? item.variant.size.name
                                                    : item.variant.size || 'N/A'}
                                            </p>
                                            <p>
                                                <span className="font-medium">Color:</span>{' '}
                                                {typeof item.variant.color === 'object' && item.variant.color?.name
                                                    ? item.variant.color.name
                                                    : item.variant.color || 'N/A'}
                                            </p>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3.5 h-3.5 ${i < Math.round(Number(item.product.average_rating) || 0)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                            <span className="text-xs text-gray-600 ml-1">
                                                {Number(item.product.average_rating || 0).toFixed(1)}
                                            </span>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-bold text-lg">
                                                {Number(item.product.selling_price || 0).toLocaleString('vi-VN')}₫
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => handleMoveToCart(item)}
                                                disabled={!item.variant.in_stock}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium transition ${item.variant.in_stock
                                                    ? 'bg-black text-white hover:bg-gray-800'
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={() => handleRemoveItem(item.variant_id)}
                                                className="p-2.5 border border-gray-300 rounded-full hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition"
                                                title="Remove from wishlist"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Stock info */}
                                        {item.variant.in_stock && (
                                            <p className="text-xs text-gray-500 text-center mt-2">
                                                {item.variant.available_stock} in stock
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Remove icon (top-right) */}
                                <button
                                    onClick={() => handleRemoveItem(item.variant_id)}
                                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-50 hover:text-red-500"
                                    title="Remove from wishlist"
                                >
                                    <Heart className="w-4 h-4 fill-current" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Continue Shopping */}
                    <div className="text-center">
                        <Link
                            href="/products"
                            className="inline-block bg-gray-100 text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
