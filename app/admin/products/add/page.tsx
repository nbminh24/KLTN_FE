'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Variant {
  id: string;
  size: string;
  color: string;
  sku: string;
  enabled: boolean;
  mainImage: string | null;
  secondaryImages: string[];
}

export default function AddProductPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showImageUpload, setShowImageUpload] = useState<string | null>(null);
  
  // Step 1 data
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [category, setCategory] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  
  // Step 2 data
  const [variants, setVariants] = useState<Variant[]>([]);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
  const availableColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Yellow', hex: '#F59E0B' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Purple', hex: '#8B5CF6' },
  ];

  const generateSKU = (size: string, color: string) => {
    const productPrefix = productName.substring(0, 3).toUpperCase() || 'PRD';
    return `${productPrefix}-${size}-${color.substring(0, 3).toUpperCase()}`;
  };

  const handleStep1Next = () => {
    if (!productName || !category || !costPrice || !sellingPrice || selectedSizes.length === 0 || selectedColors.length === 0) {
      alert('Please fill all required fields and select at least one size and color');
      return;
    }
    
    // Generate variants matrix
    const newVariants: Variant[] = [];
    selectedSizes.forEach((size) => {
      selectedColors.forEach((color) => {
        newVariants.push({
          id: `${size}-${color}`,
          size,
          color,
          sku: generateSKU(size, color),
          enabled: true,
          mainImage: null,
          secondaryImages: [],
        });
      });
    });
    setVariants(newVariants);
    setStep(2);
  };

  const toggleVariantEnabled = (id: string) => {
    setVariants(variants.map(v => v.id === id ? { ...v, enabled: !v.enabled } : v));
  };

  const handleSubmit = () => {
    alert('Product created successfully with ' + variants.filter(v => v.enabled).length + ' variants!');
    router.push('/admin/products');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#202224]">Add New Product</h1>
            <p className="text-sm text-gray-600 mt-1">Step {step} of 2</p>
          </div>
        </div>
      </div>

      {step === 1 ? (
        <div className="max-w-4xl space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  placeholder="e.g. Gradient Graphic T-shirt"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  placeholder="Short product description..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Detailed Description</label>
                <textarea
                  rows={5}
                  value={detailedDescription}
                  onChange={(e) => setDetailedDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  placeholder="Detailed information: fabric, care instructions, etc..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Cost Price *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Selling Price *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Category</h2>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
            <h2 className="text-xl font-bold mb-4">Variants *</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-3">Select Sizes *</label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <label
                      key={size}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition ${
                        selectedSizes.includes(size) 
                          ? 'border-[#4880FF] bg-blue-50' 
                          : 'border-gray-300 hover:border-[#4880FF] hover:bg-blue-50'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        className="w-4 h-4"
                        checked={selectedSizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSizes([...selectedSizes, size]);
                          } else {
                            setSelectedSizes(selectedSizes.filter(s => s !== size));
                          }
                        }}
                      />
                      <span className="text-sm font-semibold">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3">Select Colors *</label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <label
                      key={color.name}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition ${
                        selectedColors.includes(color.name)
                          ? 'border-[#4880FF] bg-blue-50'
                          : 'border-gray-300 hover:border-[#4880FF] hover:bg-blue-50'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        className="w-4 h-4"
                        checked={selectedColors.includes(color.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedColors([...selectedColors, color.name]);
                          } else {
                            setSelectedColors(selectedColors.filter(c => c !== color.name));
                          }
                        }}
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
              <input 
                type="checkbox" 
                id="active" 
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5" 
              />
              <label htmlFor="active" className="text-sm font-semibold">
                Active (Product will be visible on store)
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleStep1Next}
              className="px-8 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Next: Configure Variants
            </button>
            <Link
              href="/admin/products"
              className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl space-y-6">
          {/* Variants Matrix */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Variants Matrix</h2>
                <p className="text-sm text-gray-600 mt-1">{variants.filter(v => v.enabled).length} active variants</p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-semibold"
              >
                Back to Step 1
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F1F4F9]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">SKU</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Size</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Color</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Images</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Enabled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {variants.map((variant) => (
                    <tr key={variant.id} className={`${!variant.enabled ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4 text-sm font-mono">{variant.sku}</td>
                      <td className="px-6 py-4 text-sm font-semibold">{variant.size}</td>
                      <td className="px-6 py-4 text-sm">{variant.color}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setShowImageUpload(variant.id)}
                          className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                        >
                          <Upload className="w-4 h-4" />
                          {variant.mainImage ? 'Change Images' : 'Upload Images'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleVariantEnabled(variant.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          {variant.enabled ? (
                            <Eye className="w-5 h-5 text-green-600" />
                          ) : (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Image Upload Modal */}
          {showImageUpload && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowImageUpload(null)}>
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Upload Variant Images</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Main Image *</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#4880FF] transition cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Upload main product image</p>
                      <input type="file" accept="image/*" className="hidden" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Secondary Images</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#4880FF] transition cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Upload additional images</p>
                      <input type="file" accept="image/*" multiple className="hidden" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button className="px-6 py-2 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition">Save</button>
                  <button onClick={() => setShowImageUpload(null)} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Final Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Create Product
            </button>
            <button
              onClick={() => setStep(1)}
              className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Back
            </button>
            <Link
              href="/admin/products"
              className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
