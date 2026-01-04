'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ReviewForm from '@/components/ReviewForm';
import { showToast } from '@/components/Toast';
import cartService from '@/lib/services/cartService';
import { ChevronRight, Minus, Plus, Star, Check, X, Share2, Facebook, Twitter, Link as LinkIcon, Instagram, Loader2, Heart } from 'lucide-react';
import productService from '@/lib/services/productService';
import wishlistService from '@/lib/services/wishlistService';
import type { Product, ProductVariant } from '@/lib/types/backend';
import axios from 'axios';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('reviews');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [allProductImages, setAllProductImages] = useState<string[]>([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Fetch product data
  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError('');

      const [productRes, relatedRes] = await Promise.all([
        productService.getProductById(Number(productId)),
        productService.getRelatedProducts(Number(productId), 4),
      ]);

      const productData = productRes.data.product;
      console.log('🛍️ Product Detail Response:', productRes.data);
      console.log('🛍️ Product Data:', productData);
      console.log('🛍️ Product Variants:', productData.variants);

      setProduct(productData);
      setRelatedProducts(relatedRes.data.products);

      // Collect all images from variants
      const allImages: string[] = [];
      if (productData.variants && productData.variants.length > 0) {
        productData.variants.forEach((variant: any) => {
          if (variant.images && Array.isArray(variant.images)) {
            variant.images.forEach((img: any) => {
              if (img.image_url && !allImages.includes(img.image_url)) {
                allImages.push(img.image_url);
              }
            });
          }
        });
      }

      // Add thumbnail if not already included
      if (productData.thumbnail_url && !allImages.includes(productData.thumbnail_url)) {
        allImages.unshift(productData.thumbnail_url);
      }

      console.log('📸 All collected images:', allImages);
      setAllProductImages(allImages);
      setSelectedImage(allImages[0] || productData.thumbnail_url || '/bmm32410_black_xl.webp');

      // Try to fetch reviews
      try {
        const reviewsRes = await productService.getProductReviews(Number(productId), {
          page: 1,
          limit: 10,
          sort: 'created_at',
          order: 'desc',
        });
        setReviews(reviewsRes.data.reviews || []);
      } catch (err) {
        console.log('Reviews not available');
      }
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError('Không thể tải sản phẩm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Handle variant selection
  useEffect(() => {
    if (product?.variants && selectedSize && selectedColor) {
      const variant = product.variants.find((v) => {
        const sizeName = v.size_name || v.size?.name;
        const colorName = v.color_name || v.color?.name;
        return sizeName === selectedSize && colorName === selectedColor;
      });
      setSelectedVariant(variant || null);
      console.log('🎯 Selected Variant:', variant);

      // Check if this variant is in wishlist
      if (variant) {
        checkWishlistStatus(variant.id);
      }
    }
  }, [selectedSize, selectedColor, product]);

  // Check if variant is in wishlist
  const checkWishlistStatus = async (variantId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      console.log('🔍 Checking wishlist status for variant:', variantId);
      const response = await wishlistService.getWishlist();
      console.log('🔍 Wishlist API Response:', response.data);

      // Backend returns: { data: WishlistItem[], count: number }
      const wishlistData = response.data.data || [];
      console.log('🔍 Wishlist Data:', wishlistData);

      const inWishlist = wishlistData.some((item: any) => item.variant_id === variantId);
      console.log('🔍 Variant in wishlist?', inWishlist);
      setIsInWishlist(inWishlist);
    } catch (err) {
      console.error('❌ Check wishlist status error:', err);
      if (axios.isAxiosError(err)) {
        console.error('❌ Status:', err.response?.status);
        console.error('❌ Response data:', err.response?.data);
      }
      // Silent fail - don't break the page
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (!selectedVariant) {
      showToast('Please select size and color', 'warning');
      return;
    }

    if (!selectedVariant.available_stock || selectedVariant.available_stock < quantity) {
      showToast('Không đủ hàng trong kho', 'error');
      return;
    }

    try {
      await cartService.addToCart({
        variant_id: selectedVariant.id,
        quantity: quantity
      });
      showToast(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`, 'success');
    } catch (err: any) {
      if (err.response?.status === 401) {
        showToast('Vui lòng đăng nhập để thêm vào giỏ hàng', 'warning');
      } else if (err.response?.data?.message) {
        showToast(err.response.data.message, 'error');
      } else {
        showToast('Failed to add to cart', 'error');
      }
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    if (!selectedVariant) {
      showToast('Vui lòng chọn kích thước và màu sắc', 'warning');
      return;
    }

    if (!selectedVariant.available_stock || selectedVariant.available_stock < quantity) {
      showToast('Không đủ hàng trong kho', 'error');
      return;
    }

    try {
      await cartService.addToCart({
        variant_id: selectedVariant.id,
        quantity: quantity
      });
      router.push('/cart');
    } catch (err: any) {
      if (err.response?.status === 401) {
        showToast('Vui lòng đăng nhập để tiếp tục', 'warning');
        router.push('/login?redirect=/cart');
      } else if (err.response?.data?.message) {
        showToast(err.response.data.message, 'error');
      } else {
        showToast('Failed to add to cart', 'error');
      }
    }
  };

  const handleWishlistToggle = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      showToast('Vui lòng đăng nhập để thêm vào yêu thích', 'error');
      router.push('/login?redirect=/products/' + productId);
      return;
    }

    if (!selectedVariant) {
      showToast('Vui lòng chọn kích thước và màu sắc trước', 'warning');
      return;
    }

    setWishlistLoading(true);

    try {
      console.log('❤️ Toggle Wishlist - Variant ID:', selectedVariant.id);
      console.log('❤️ Current Status:', isInWishlist ? 'In Wishlist' : 'Not in Wishlist');

      if (isInWishlist) {
        // Remove from wishlist
        console.log('❤️ Removing from wishlist...');
        await wishlistService.removeFromWishlist(selectedVariant.id);
        setIsInWishlist(false);
        showToast('Đã xóa khỏi yêu thích', 'info');
      } else {
        // Add to wishlist
        console.log('❤️ Adding to wishlist...');
        await wishlistService.addToWishlist(selectedVariant.id);
        setIsInWishlist(true);
        showToast('Đã thêm vào yêu thích!', 'success');
      }
    } catch (err: any) {
      console.error('❌ Wishlist error:', err);
      if (axios.isAxiosError(err)) {
        console.error('❌ Error status:', err.response?.status);
        console.error('❌ Error data:', err.response?.data);
        console.error('❌ Request URL:', err.config?.url);
        console.error('❌ Request method:', err.config?.method);
        console.error('❌ Request data:', err.config?.data);

        if (err.response?.status === 401) {
          showToast('Vui lòng đăng nhập để thêm vào yêu thích', 'error');
          router.push('/login?redirect=/products/' + productId);
        } else if (err.response?.status === 404) {
          showToast('Không tìm thấy tính năng yêu thích. Vui lòng liên hệ hỗ trợ.', 'error');
        } else {
          showToast(err.response?.data?.message || 'Không thể cập nhật danh sách yêu thích', 'error');
        }
      } else {
        showToast('Không thể cập nhật danh sách yêu thích', 'error');
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${product?.name}!`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'instagram':
        showToast('Sao chép link để chia sẻ trên Instagram!', 'info');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        showToast('Đã sao chép link!', 'success');
        break;
    }
  };

  // Calculate discount percentage
  const discountPercentage = product && product.cost_price > product.selling_price
    ? Math.round(((product.cost_price - product.selling_price) / product.cost_price) * 100)
    : 0;

  // Get unique sizes and colors from variants
  const availableSizes = product?.variants
    ? [...new Set(product.variants.map((v) => v.size_name || v.size?.name).filter(Boolean))]
    : [];

  const availableColors = product?.variants
    ? Array.from(
      new Map(
        product.variants
          .map((v) => {
            const name = v.color_name || v.color?.name;
            const hex = v.color_hex || v.color?.hex_code;
            return name ? [name, hex] as [string, string | undefined] : null;
          })
          .filter((item): item is [string, string | undefined] => item !== null)
      ).entries()
    ).map(([name, hex]) => ({ name, hex }))
    : [];

  console.log('🎨 Available Colors:', availableColors);
  console.log('📏 Available Sizes:', availableSizes);

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

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Không Tìm Thấy Sản Phẩm</h2>
            <p className="text-gray-600 mb-6">{error || 'Sản phẩm bạn đang tìm không tồn tại.'}</p>
            <Link href="/products" className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              Quay Lại Sản Phẩm
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
            <Link href="/" className="text-gray-500">Trang Chủ</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <Link href="/products" className="text-gray-500">Cửa Hàng</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{product.name}</span>
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
                  Nhấn để phóng to
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {(allProductImages.length > 0 ? allProductImages : [product.thumbnail_url || '/bmm32410_black_xl.webp']).map((img, i) => (
                  <div
                    key={i}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition ${selectedImage === img ? 'border-black' : 'border-transparent hover:border-gray-400'}`}
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
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(Number(product.average_rating)) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">
                    <span className="font-medium">{Number(product.average_rating).toFixed(1)}</span>
                    <span className="text-gray-500">/5</span>
                  </span>
                  <span className="text-sm text-gray-500">({product.total_reviews || 0} đánh giá)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{(Number(product.selling_price) * 25000).toLocaleString('vi-VN')}₫</span>
                  {discountPercentage > 0 && (
                    <>
                      <span className="text-2xl font-bold text-gray-400 line-through">{(Number(product.cost_price) * 25000).toLocaleString('vi-VN')}₫</span>
                      <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full">
                        -{discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Variants Not Available Warning */}
              {(!product.variants || product.variants.length === 0) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">⚠️ Lựa chọn kích thước/màu sắc tạm thời không khả dụng.</span>
                    <br />
                    Dữ liệu biến thể sản phẩm không được tải từ máy chủ. Vui lòng liên hệ hỗ trợ.
                  </p>
                </div>
              )}

              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div>
                  <p className="text-gray-600 mb-3 text-sm">Chọn Màu Sắc</p>
                  <div className="flex gap-3">
                    {availableColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name || '')}
                        style={{ backgroundColor: color.hex || '#000' }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedColor === color.name ? 'ring-2 ring-black ring-offset-2' : ''
                          }`}
                        title={color.name || ''}
                      >
                        {selectedColor === color.name && <Check className="w-5 h-5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <hr className="border-gray-200" />

              {/* Size Selection */}
              {availableSizes.length > 0 && (
                <div>
                  <p className="text-gray-600 mb-3 text-sm">Chọn Kích Thước</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size || '')}
                        className={`px-5 py-2.5 rounded-full text-sm ${selectedSize === size
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {selectedVariant && (
                    <p className="text-sm text-gray-600 mt-2">
                      Kho: {selectedVariant.available_stock || 0} có sẵn
                    </p>
                  )}
                </div>
              )}

              <hr className="border-gray-200" />

              {/* Add to Cart & Buy Now */}
              <div className="space-y-3">
                <div className="flex gap-3">
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
                    Thêm Vào Giỏ
                  </button>
                  {/* Wishlist Button */}
                  <button
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                    className={`p-4 rounded-full border-2 transition ${isInWishlist
                      ? 'bg-red-50 border-red-500 text-red-500 hover:bg-red-100'
                      : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                      } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <button
                  onClick={handleBuyNow}
                  className="w-full border-2 border-black text-black py-4 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  Mua Ngay
                </button>
              </div>

              <hr className="border-gray-200" />

              {/* Share Product */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="w-5 h-5 text-gray-600" />
                  <p className="text-gray-600 text-sm font-medium">Chia sẻ sản phẩm</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center justify-center w-10 h-10 bg-[#1877F2] text-white rounded-full hover:opacity-90 transition"
                    title="Chia sẻ trên Facebook"
                  >
                    <Facebook className="w-5 h-5 fill-current" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center justify-center w-10 h-10 bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition"
                    title="Chia sẻ trên Twitter"
                  >
                    <Twitter className="w-5 h-5 fill-current" />
                  </button>
                  <button
                    onClick={() => handleShare('instagram')}
                    className="flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] text-white rounded-full hover:opacity-90 transition"
                    title="Chia sẻ trên Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
                    title="Sao chép link"
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
                Chi Tiết Sản Phẩm
              </button>
              <button
                onClick={() => setSelectedTab('reviews')}
                className={`pb-4 ${selectedTab === 'reviews' ? 'border-b-2 border-black font-medium' : 'text-gray-600'}`}
              >
                Đánh Giá & Nhận Xét
              </button>
              <button
                onClick={() => setSelectedTab('sizeguide')}
                className={`pb-4 ${selectedTab === 'sizeguide' ? 'border-b-2 border-black font-medium' : 'text-gray-600'}`}
              >
                Hướng Dẫn Kích Thước
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          {selectedTab === 'details' && (
            <div className="mb-12">
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold mb-4">Mô Tả Sản Phẩm</h3>
                <div className="text-gray-600 whitespace-pre-line">
                  {product.full_description || product.description || 'Không có mô tả chi tiết.'}
                </div>
              </div>
            </div>
          )}

          {/* Size Guide Section */}
          {selectedTab === 'sizeguide' && (
            <div className="mb-12">
              <h3 className="text-xl font-bold mb-6">Hướng Dẫn Kích Thước</h3>
              <div className="max-w-4xl mx-auto">
                <Image
                  src="/size_chart.jpg"
                  alt="Size Chart"
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-xl border border-gray-200"
                />
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {selectedTab === 'reviews' && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Tất Cả Đánh Giá <span className="text-gray-600">({reviews.length})</span></h3>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition"
                >
                  {showReviewForm ? 'Hủy' : 'Viết Đánh Giá'}
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

              {reviews.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {reviews.map((review, index) => (
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
                        <p className="font-bold">{review.customer_name || 'Anonymous'}</p>
                        <span className="text-green-500">✓</span>
                      </div>
                      <p className="text-gray-600">{review.comment || 'Không có bình luận.'}</p>
                      <p className="text-sm text-gray-500">Đăng vào {new Date(review.created_at).toLocaleDateString('vi-VN')}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Chưa có đánh giá. Hãy là người đầu tiên đánh giá!</p>
                </div>
              )}

              {reviews.length > 0 && (
                <div className="flex justify-center mt-8">
                  <button className="border border-gray-300 px-12 py-3 rounded-full font-medium hover:bg-gray-50 transition">
                    Tải Thêm Đánh Giá
                  </button>
                </div>
              )}
            </div>
          )}

          {/* You Might Also Like */}
          <section>
            <h2 className="text-2xl md:text-3xl font-integral font-bold text-center mb-10">
              Bạn Có Thể Thích
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id.toString()}
                  name={relatedProduct.name}
                  image={relatedProduct.thumbnail_url || '/bmm32410_black_xl.webp'}
                  price={relatedProduct.selling_price}
                  originalPrice={relatedProduct.cost_price}
                  rating={relatedProduct.average_rating || 0}
                  discount={relatedProduct.cost_price > relatedProduct.selling_price ? Math.round(((relatedProduct.cost_price - relatedProduct.selling_price) / relatedProduct.cost_price) * 100) : undefined}
                />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link
                href="/products"
                className="border border-black bg-white text-black px-12 py-3 rounded-full font-medium hover:bg-gray-50 transition"
              >
                Xem Thêm
              </Link>
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
