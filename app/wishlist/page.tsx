'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showToast } from '@/components/Toast';
import { getWishlist, removeFromWishlist, WishlistItem } from '@/lib/wishlist';
import { addToCart } from '@/lib/cart';
import { ChevronRight, Heart, ShoppingCart, Trash2, Star } from 'lucide-react';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage
  useEffect(() => {
    setWishlistItems(getWishlist());

    const handleWishlistUpdate = () => {
      setWishlistItems(getWishlist());
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, []);

  const handleRemoveItem = (id: string) => {
    removeFromWishlist(id);
    showToast('Removed from wishlist', 'info');
  };

  const handleMoveToCart = (item: WishlistItem) => {
    const success = addToCart(
      {
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        originalPrice: item.originalPrice,
        maxStock: 50, // Default stock
      },
      1
    );

    if (success) {
      removeFromWishlist(item.id);
      showToast('Moved to cart!', 'success');
    } else {
      showToast('Failed to add to cart', 'error');
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
            <span className="font-medium">Wishlist</span>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-integral font-bold mb-2">My Wishlist</h1>
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>

          {/* Wishlist Items */}
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">
                Save your favorite items to your wishlist to easily find them later.
              </p>
              <Link
                href="/products"
                className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition group">
                  {/* Image */}
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100">
                    <Link href={`/products/${item.id}`}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition group/btn"
                    >
                      <Heart className="w-5 h-5 fill-red-500 text-red-500 group-hover/btn:scale-110 transition-transform" />
                    </button>

                    {/* Discount Badge */}
                    {item.discount && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        -{item.discount}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <Link href={`/products/${item.id}`}>
                    <h3 className="font-bold text-base mb-2 line-clamp-2 hover:text-gray-600 transition">
                      {item.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  {item.rating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(item.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{item.rating}/5</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold">${item.price}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">${item.originalPrice}</span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full py-3 rounded-full font-medium transition flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          {wishlistItems.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">You might also like</h2>
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-2xl">
                <p className="text-gray-600">
                  <Link href="/products" className="font-medium text-black underline hover:no-underline">
                    Browse more products
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
