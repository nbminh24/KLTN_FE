'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ReviewForm from '@/components/ReviewForm';
import { showToast } from '@/components/Toast';
import { addToCart } from '@/lib/cart';
import { ChevronRight, Minus, Plus, Star, Check, X, Share2, Facebook, Twitter, Link as LinkIcon, Instagram } from 'lucide-react';

// Mock data
const relatedProducts = [
  { id: '5', name: 'Polo with Contrast Trims', image: '/bmm32410_black_xl.webp', price: 212, originalPrice: 242, rating: 4.0, discount: 20 },
  { id: '6', name: 'Gradient Graphic T-shirt', image: '/bmm32410_black_xl.webp', price: 145, rating: 3.5 },
  { id: '7', name: 'Polo with Tipping Details', image: '/bmm32410_black_xl.webp', price: 180, rating: 4.5 },
  { id: '8', name: 'Black Striped T-shirt', image: '/bmm32410_black_xl.webp', price: 120, originalPrice: 150, rating: 5.0, discount: 30 },
];

export default function ProductDetailPage() {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState('Large');
  const [selectedColor, setSelectedColor] = useState('olive');
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('reviews');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState('/bmm32410_black_xl.webp');

  // Mock product data (would come from API/props)
  const product = {
    id: '1',
    name: 'ONE LIFE GRAPHIC T-SHIRT',
    price: 260,
    originalPrice: 300,
    rating: 4.5,
    image: '/bmm32410_black_xl.webp',
    stock: 50,
  };

  const handleAddToCart = () => {
    // Validate size selection
    if (!selectedSize) {
      showToast('Please select a size', 'warning');
      return;
    }

    const success = addToCart(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        size: selectedSize,
        color: selectedColor,
        maxStock: product.stock,
      },
      quantity
    );

    if (success) {
      showToast(`Added ${quantity} item(s) to cart!`, 'success');
      // Optional: redirect to cart after 1 second
      // setTimeout(() => router.push('/cart'), 1000);
    } else {
      showToast('Cannot add more than available stock', 'error');
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      showToast('Please select a size', 'warning');
      return;
    }

    const success = addToCart(
      {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        size: selectedSize,
        color: selectedColor,
        maxStock: product.stock,
      },
      quantity
    );

    if (success) {
      router.push('/checkout');
    } else {
      showToast('Cannot add more than available stock', 'error');
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${product.name}!`;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'instagram':
        showToast('Copy link to share on Instagram!', 'info');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        showToast('Link copied to clipboard!', 'success');
        break;
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
            <Link href="/products" className="text-gray-500">Shop</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <Link href="/products?category=men" className="text-gray-500">Men</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">T-shirts</span>
          </div>

          {/* Product Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div 
                className="relative aspect-square rounded-2xl overflow-hidden cursor-zoom-in group" 
                style={{ backgroundColor: '#dadee3' }}
                onClick={() => setZoomedImage(selectedImage)}
              >
                <Image
                  src={selectedImage}
                  alt="Product"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to zoom
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['/bmm32410_black_xl.webp', '/bmm32410_black_xl.webp', '/bmm32410_black_xl.webp'].map((img, i) => (
                  <div 
                    key={i} 
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition ${selectedImage === img ? 'border-black' : 'border-transparent hover:border-gray-400'}`} 
                    style={{ backgroundColor: '#dadee3' }}
                    onClick={() => setSelectedImage(img)}
                  >
                    <Image
                      src={img}
                      alt={`Product ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl md:text-3xl font-integral font-bold mb-4">
                  One Life Graphic T-shirt
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">
                    <span className="font-medium">4.5</span>
                    <span className="text-gray-500">/5</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">$260</span>
                  <span className="text-2xl font-bold text-gray-400 line-through">$300</span>
                  <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    -40%
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm">
                This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
              </p>

              <hr className="border-gray-200" />

              {/* Color Selection */}
              <div>
                <p className="text-gray-600 mb-3 text-sm">Select Colors</p>
                <div className="flex gap-3">
                  {[
                    { name: 'olive', color: 'bg-[#4F4631]' },
                    { name: 'forest', color: 'bg-[#314F4A]' },
                    { name: 'navy', color: 'bg-[#31344F]' },
                  ].map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full ${color.color} flex items-center justify-center ${
                        selectedColor === color.name ? 'ring-2 ring-black ring-offset-2' : ''
                      }`}
                    >
                      {selectedColor === color.name && <Check className="w-5 h-5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Size Selection */}
              <div>
                <p className="text-gray-600 mb-3 text-sm">Choose Size</p>
                <div className="flex flex-wrap gap-2">
                  {['Small', 'Medium', 'Large', 'X-Large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2.5 rounded-full text-sm ${
                        selectedSize === size
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Add to Cart & Buy Now */}
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex items-center bg-gray-100 rounded-full px-5">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-6 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition"
                  >
                    Add to Cart
                  </button>
                </div>
                <button 
                  onClick={handleBuyNow}
                  className="w-full border-2 border-black text-black py-4 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  Buy Now
                </button>
              </div>

              <hr className="border-gray-200" />

              {/* Share Product */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="w-5 h-5 text-gray-600" />
                  <p className="text-gray-600 text-sm font-medium">Share this product</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center justify-center w-10 h-10 bg-[#1877F2] text-white rounded-full hover:opacity-90 transition"
                    title="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5 fill-current" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center justify-center w-10 h-10 bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition"
                    title="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5 fill-current" />
                  </button>
                  <button
                    onClick={() => handleShare('instagram')}
                    className="flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] text-white rounded-full hover:opacity-90 transition"
                    title="Share on Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
                    title="Copy link"
                  >
                    <LinkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex gap-8">
              <button
                onClick={() => setSelectedTab('details')}
                className={`pb-4 ${selectedTab === 'details' ? 'border-b-2 border-black font-medium' : 'text-gray-600'}`}
              >
                Product Details
              </button>
              <button
                onClick={() => setSelectedTab('reviews')}
                className={`pb-4 ${selectedTab === 'reviews' ? 'border-b-2 border-black font-medium' : 'text-gray-600'}`}
              >
                Rating & Reviews
              </button>
              <button
                onClick={() => setSelectedTab('faqs')}
                className={`pb-4 ${selectedTab === 'faqs' ? 'border-b-2 border-black font-medium' : 'text-gray-600'}`}
              >
                FAQs
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          {selectedTab === 'reviews' && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">All Reviews <span className="text-gray-600">(451)</span></h3>
                <button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition"
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-8 border border-gray-200 rounded-2xl p-6 bg-gray-50">
                  <ReviewForm 
                    productId={product.id}
                    onSubmit={(review) => {
                      console.log('Review submitted:', review);
                      setShowReviewForm(false);
                    }}
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: 'Samantha D.', rating: 5, date: 'August 14, 2023', review: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt." },
                  { name: 'Alex M.', rating: 4, date: 'August 15, 2023', review: "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me." },
                  { name: 'Ethan R.', rating: 5, date: 'August 16, 2023', review: "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect." },
                  { name: 'Olivia P.', rating: 4, date: 'August 17, 2023', review: "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear." },
                ].map((review, index) => (
                  <div key={index} className="border border-gray-200 rounded-2xl p-6 space-y-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{review.name}</p>
                      <span className="text-green-500">✓</span>
                    </div>
                    <p className="text-gray-600">{review.review}</p>
                    <p className="text-sm text-gray-500">Posted on {review.date}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <button className="border border-gray-300 px-12 py-3 rounded-full font-medium hover:bg-gray-50 transition">
                  Load More Reviews
                </button>
              </div>
            </div>
          )}

          {/* You Might Also Like */}
          <section>
            <h2 className="text-2xl md:text-3xl font-integral font-bold text-center mb-10">
              You might also like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-4xl aspect-square">
            <Image
              src={zoomedImage}
              alt="Zoomed product"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
