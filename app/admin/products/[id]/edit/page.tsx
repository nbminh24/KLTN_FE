'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [images, setImages] = useState(['/bmm32410_black_xl.webp', '/bmm32410_black_xl.webp']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Product updated successfully!');
    router.push('/admin/products');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product?')) {
      alert('Product deleted!');
      router.push('/admin/products');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#202224]">Edit Product</h1>
            <p className="text-gray-600 mt-1">Product ID: {id}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          <Trash2 className="w-4 h-4" />
          <span className="font-semibold text-sm">Delete Product</span>
        </button>
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
                defaultValue="Gradient Graphic T-shirt"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">SKU *</label>
              <input
                type="text"
                required
                defaultValue="TSH-001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                rows={5}
                defaultValue="This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Product Images</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
                <button
                  type="button"
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-[#4880FF] transition">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-xs text-gray-600">Add Image</span>
              <input type="file" multiple accept="image/*" className="hidden" />
            </label>
          </div>
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
                  defaultValue="145"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
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
                  defaultValue="120"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Stock Quantity *</label>
              <input
                type="number"
                required
                defaultValue="245"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
              />
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Category</h2>
          <select
            required
            defaultValue="T-Shirts"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          >
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
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      defaultChecked={['S', 'M', 'L', 'XL'].includes(size)}
                    />
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
                ].map((color) => (
                  <label
                    key={color.name}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-[#4880FF] hover:bg-blue-50 transition"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      defaultChecked={['Black', 'White'].includes(color.name)}
                    />
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
            Update Product
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
