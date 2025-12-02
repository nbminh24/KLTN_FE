'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import adminSizeService, { Size } from '@/lib/services/admin/sizeService';
import adminColorService, { Color } from '@/lib/services/admin/colorService';
import adminProductService from '@/lib/services/admin/productService';
import adminCategoryService, { AdminCategory } from '@/lib/services/admin/categoryService';
import { showToast } from '@/components/Toast';

interface Variant {
  size_id: number;
  color_id: number;
  name: string;
  sku: string;
  total_stock: number;
  reserved_stock: number;
  reorder_point: number;
  status: 'active' | 'inactive';
  // UI only
  mainImage: string | null;
  secondaryImages: string[];
}

export default function AddProductPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showImageUpload, setShowImageUpload] = useState<string | null>(null);

  // Load from API
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  // Step 1 data
  const [productName, setProductName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [selectedSizeIds, setSelectedSizeIds] = useState<number[]>([]);
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Step 2 data
  const [variants, setVariants] = useState<Variant[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingData(true);
      const [sizesRes, colorsRes, categoriesRes] = await Promise.all([
        adminSizeService.getSizes(),
        adminColorService.getColors(),
        adminCategoryService.getCategories()
      ]);
      setSizes(Array.isArray(sizesRes.data) ? sizesRes.data : []);
      setColors(Array.isArray(colorsRes.data) ? colorsRes.data : []);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
    } catch (error) {
      console.error('Failed to load data:', error);
      showToast('Failed to load sizes, colors, and categories', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const generateSKU = (sizeId: number, colorId: number) => {
    const size = sizes.find(s => s.id === sizeId);
    const color = colors.find(c => c.id === colorId);
    const productPrefix = productName.substring(0, 3).toUpperCase() || 'PRD';
    return `${productPrefix}-${size?.name || 'SIZE'}-${color?.name.substring(0, 3).toUpperCase() || 'COL'}`;
  };

  const handleStep1Next = () => {
    if (!productName || !categoryId || !costPrice || !sellingPrice || selectedSizeIds.length === 0 || selectedColorIds.length === 0) {
      showToast('Please fill all required fields and select at least one size and color', 'error');
      return;
    }

    // Generate variants matrix
    const newVariants: Variant[] = [];
    selectedSizeIds.forEach((sizeId) => {
      selectedColorIds.forEach((colorId) => {
        const size = sizes.find(s => s.id === sizeId);
        const color = colors.find(c => c.id === colorId);

        newVariants.push({
          size_id: sizeId,
          color_id: colorId,
          name: `${size?.name} - ${color?.name}`,
          sku: generateSKU(sizeId, colorId),
          total_stock: 0,
          reserved_stock: 0,
          reorder_point: 10,
          status: 'active',
          mainImage: null,
          secondaryImages: [],
        });
      });
    });
    setVariants(newVariants);
    setStep(2);
  };

  const toggleVariantStatus = (sizeId: number, colorId: number) => {
    setVariants(variants.map(v =>
      v.size_id === sizeId && v.color_id === colorId
        ? { ...v, status: v.status === 'active' ? 'inactive' : 'active' }
        : v
    ));
  };

  const updateVariantStock = (sizeId: number, colorId: number, field: 'total_stock' | 'reorder_point', value: number) => {
    setVariants(variants.map(v =>
      v.size_id === sizeId && v.color_id === colorId
        ? { ...v, [field]: value }
        : v
    ));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const productData = {
        name: productName,
        slug: slug || generateSlug(productName),
        description,
        full_description: fullDescription,
        category_id: categoryId,
        cost_price: parseFloat(costPrice),
        selling_price: parseFloat(sellingPrice),
        thumbnail_url: thumbnailUrl,
        status,
        variants: variants
          .filter(v => v.status === 'active')
          .map(v => ({
            size_id: v.size_id,
            color_id: v.color_id,
            name: v.name,
            sku: v.sku,
            total_stock: v.total_stock,
            reserved_stock: v.reserved_stock,
            reorder_point: v.reorder_point,
            status: v.status
          }))
      };

      await adminProductService.createProduct(productData);
      showToast('Product created successfully!', 'success');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Failed to create product:', error);
      showToast(error.response?.data?.message || 'Failed to create product', 'error');
    } finally {
      setLoading(false);
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
                <label className="block text-sm font-semibold mb-2">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] bg-gray-50"
                  placeholder="auto-generated from product name"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Full Description</label>
                <textarea
                  rows={5}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
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
            {loadingData ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading categories...
              </div>
            ) : (
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
              >
                <option value={0}>Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Variants */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Variants *</h2>
            {loadingData ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading sizes and colors...
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-3">Select Sizes *</label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <label
                        key={size.id}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition ${selectedSizeIds.includes(size.id)
                          ? 'border-[#4880FF] bg-blue-50'
                          : 'border-gray-300 hover:border-[#4880FF] hover:bg-blue-50'
                          }`}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedSizeIds.includes(size.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSizeIds([...selectedSizeIds, size.id]);
                            } else {
                              setSelectedSizeIds(selectedSizeIds.filter(id => id !== size.id));
                            }
                          }}
                        />
                        <span className="text-sm font-semibold">{size.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-3">Select Colors *</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <label
                        key={color.id}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition ${selectedColorIds.includes(color.id)
                          ? 'border-[#4880FF] bg-blue-50'
                          : 'border-gray-300 hover:border-[#4880FF] hover:bg-blue-50'
                          }`}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedColorIds.includes(color.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedColorIds([...selectedColorIds, color.id]);
                            } else {
                              setSelectedColorIds(selectedColorIds.filter(id => id !== color.id));
                            }
                          }}
                        />
                        <div
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex_code }}
                        ></div>
                        <span className="text-sm font-semibold">{color.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Product Status</h2>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                checked={status === 'active'}
                onChange={(e) => setStatus(e.target.checked ? 'active' : 'inactive')}
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
                <p className="text-sm text-gray-600 mt-1">{variants.filter(v => v.status === 'active').length} active variants</p>
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
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Variant</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">SKU</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Reorder Point</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {variants.map((variant) => (
                    <tr key={`${variant.size_id}-${variant.color_id}`} className={`${variant.status === 'inactive' ? 'opacity-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold">{variant.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono">{variant.sku}</td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={variant.total_stock}
                          onChange={(e) => updateVariantStock(variant.size_id, variant.color_id, 'total_stock', parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={variant.reorder_point}
                          onChange={(e) => updateVariantStock(variant.size_id, variant.color_id, 'reorder_point', parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleVariantStatus(variant.size_id, variant.color_id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          {variant.status === 'active' ? (
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
