'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Product added successfully!');
    router.push('/admin/products');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-[#202224]">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Product Name *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                placeholder="e.g. Gradient Graphic T-shirt"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">SKU *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                placeholder="e.g. TSH-001"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                placeholder="Product description..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Product Images</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#4880FF] transition">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">Drag & drop images or click to upload</p>
            <p className="text-xs text-gray-500 mb-4">PNG, JPG, WEBP up to 5MB</p>
            <input type="file" multiple accept="image/*" className="hidden" id="image-upload" />
            <label
              htmlFor="image-upload"
              className="inline-block px-6 py-2 text-sm text-[#4880FF] font-semibold border border-[#4880FF] rounded-lg hover:bg-blue-50 transition cursor-pointer"
            >
              Browse Files
            </label>
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img} alt="" className="w-full h-32 object-cover rounded-lg" />
                  <button className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Pricing & Stock</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Price *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  required
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Sale Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Stock Quantity *</label>
              <input
                type="number"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Category</h2>
          <select
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          >
            <option value="">Select Category</option>
            <option>T-Shirts</option>
            <option>Shirts</option>
            <option>Jeans</option>
            <option>Hoodies</option>
            <option>Shorts</option>
          </select>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Variants</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-3">Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'].map((size) => (
                  <label
                    key={size}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-[#4880FF] hover:bg-blue-50 transition"
                  >
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm font-semibold">{size}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3">Available Colors</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Black', hex: '#000000' },
                  { name: 'White', hex: '#FFFFFF' },
                  { name: 'Red', hex: '#EF4444' },
                  { name: 'Blue', hex: '#3B82F6' },
                  { name: 'Green', hex: '#10B981' },
                  { name: 'Yellow', hex: '#F59E0B' },
                  { name: 'Pink', hex: '#EC4899' },
                  { name: 'Purple', hex: '#8B5CF6' },
                ].map((color) => (
                  <label
                    key={color.name}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-[#4880FF] hover:bg-blue-50 transition"
                  >
                    <input type="checkbox" className="w-4 h-4" />
                    <div
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <span className="text-sm font-semibold">{color.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Product Status</h2>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="active" defaultChecked className="w-5 h-5" />
            <label htmlFor="active" className="text-sm font-semibold">
              Active (Product will be visible to customers)
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-8 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Add Product
          </button>
          <button
            type="button"
            className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Save as Draft
          </button>
          <Link
            href="/admin/products"
            className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
