'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Heart, ShoppingCart, Trash2, Share2 } from 'lucide-react';

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  inStock: boolean;
  rating: number;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: '1',
      name: 'Gradient Graphic T-shirt',
      image: '/bmm32410_black_xl.webp',
      price: 145,
      originalPrice: 242,
      discount: 20,
      inStock: true,
      rating: 3.5,
    },
    {
      id: '2',
      name: 'Checkered Shirt',
      image: '/bmm32410_black_xl.webp',
      price: 180,
      inStock: true,
      rating: 4.5,
    },
    {
      id: '3',
      name: 'Skinny Fit Jeans',
      image: '/bmm32410_black_xl.webp',
      price: 240,
      originalPrice: 260,
      discount: 20,
      inStock: false,
      rating: 3.5,
    },
    {
      id: '4',
      name: 'Classic Hoodie',
      image: '/bmm32410_black_xl.webp',
      price: 195,
      inStock: true,
      rating: 4.8,
    },
  ]);

  const removeFromWishlist = (id: string) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const addToCart = (item: WishlistItem) => {
    // Mock add to cart functionality
    alert(`${item.name} added to cart!`);
  };

  const addAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.inStock);
    if (inStockItems.length > 0) {
      alert(`${inStockItems.length} items added to cart!`);
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
            {wishlistItems.length > 0 && (
              <div className="flex gap-3">
                <button className="border border-gray-300 px-6 py-2.5 rounded-full font-medium hover:bg-gray-50 transition flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Wishlist
                </button>
                <button 
                  onClick={addAllToCart}
                  className="bg-black text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition"
                >
                  Add All to Cart
                </button>
              </div>
            )}
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

                    {/* Out of Stock Overlay */}
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm">
                          Out of Stock
                        </span>
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
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{item.rating}/5</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold">${item.price}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">${item.originalPrice}</span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.inStock}
                    className={`w-full py-3 rounded-full font-medium transition flex items-center justify-center gap-2 ${
                      item.inStock
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
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
