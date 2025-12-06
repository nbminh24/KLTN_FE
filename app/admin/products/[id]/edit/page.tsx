'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, X, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import adminProductService from '@/lib/services/admin/productService';
import adminSizeService, { Size } from '@/lib/services/admin/sizeService';
import adminColorService, { Color } from '@/lib/services/admin/colorService';
import adminCategoryService, { AdminCategory } from '@/lib/services/admin/categoryService';

interface Variant {
  id: string;
  dbId?: number; // Database ID for existing variants
  sizeId: number;
  colorId: number;
  size: string;
  color: string;
  sku: string;
  stock: number;
  enabled: boolean;
  mainImage: string | null;
  secondaryImages: string[];
  existsInDb: boolean; // Track if variant was previously saved
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showImageUpload, setShowImageUpload] = useState<string | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Master data
  const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
  const [availableColors, setAvailableColors] = useState<Color[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  // Product data
  const [productData, setProductData] = useState<any>(null);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [selectedSizeIds, setSelectedSizeIds] = useState<string[]>([]);
  const [selectedColorIds, setSelectedColorIds] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  // Step 2 data
  const [variants, setVariants] = useState<Variant[]>([]);

  // Fetch master data and product details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('📦 Fetching product edit data for ID:', id);

        // Fetch all data in parallel
        const [sizesRes, colorsRes, categoriesRes, productRes] = await Promise.all([
          adminSizeService.getSizes(),
          adminColorService.getColors(),
          adminCategoryService.getCategories(),
          adminProductService.getProductById(Number(id)),
        ]);

        console.log('✅ Sizes:', sizesRes.data);
        console.log('✅ Colors:', colorsRes.data);
        console.log('✅ Categories:', categoriesRes.data);
        console.log('✅ Product:', productRes.data);

        const sizesData: any = sizesRes.data;
        const colorsData: any = colorsRes.data;
        const categoriesData: any = categoriesRes.data;

        setAvailableSizes(sizesData.data || sizesData.sizes || []);
        setAvailableColors(colorsData.data || colorsData.colors || []);
        setCategories(categoriesData.data || categoriesData.categories || []);

        const product: any = productRes.data;
        setProductData(product);
        setProductName(product.name || '');
        setDescription(product.description || '');
        setDetailedDescription(product.full_description || '');
        setCategoryId(product.category_id?.toString() || '');
        setCostPrice(product.cost_price?.toString() || '');
        setSellingPrice(product.selling_price?.toString() || '');
        setIsActive(product.status === 'active');

        // Set selected size and color IDs from product
        setSelectedSizeIds(product.selected_size_ids?.map((id: any) => id.toString()) || []);
        setSelectedColorIds(product.selected_color_ids?.map((id: any) => id.toString()) || []);

        setLoading(false);
      } catch (err: any) {
        console.error('❌ Failed to fetch product data:', err);
        setError(err.response?.data?.message || 'Failed to load product data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const generateSKU = (sizeName: string, colorName: string) => {
    const productPrefix = productName.substring(0, 3).toUpperCase() || 'PRD';
    return `${productPrefix}-${sizeName}-${colorName.substring(0, 3).toUpperCase()}`;
  };

  const handleStep1Next = () => {
    if (!productName || !categoryId || !costPrice || !sellingPrice || selectedSizeIds.length === 0 || selectedColorIds.length === 0) {
      alert('Please fill all required fields and select at least one size and color');
      return;
    }

    // Generate variants matrix
    const newVariants: Variant[] = [];
    const existingVariants = productData?.variants || [];

    selectedSizeIds.forEach((sizeId) => {
      selectedColorIds.forEach((colorId) => {
        const size = availableSizes.find(s => s.id.toString() === sizeId);
        const color = availableColors.find(c => c.id.toString() === colorId);

        if (!size || !color) return;

        const variantId = `${sizeId}-${colorId}`;
        const existingVariant = existingVariants.find(
          (v: any) => v.size_id?.toString() === sizeId && v.color_id?.toString() === colorId
        );

        newVariants.push({
          id: variantId,
          dbId: existingVariant?.id,
          sizeId: Number(sizeId),
          colorId: Number(colorId),
          size: size.name,
          color: color.name,
          sku: existingVariant?.sku || generateSKU(size.name, color.name),
          stock: existingVariant?.total_stock || 0,
          enabled: true,
          mainImage: existingVariant?.images?.[0] || null,
          secondaryImages: existingVariant?.images?.slice(1) || [],
          existsInDb: !!existingVariant,
        });
      });
    });

    // Add disabled variants for previously existing combinations that were unchecked
    existingVariants.forEach((variant: any) => {
      const variantId = `${variant.size_id}-${variant.color_id}`;
      if (!newVariants.find(v => v.id === variantId)) {
        const size = availableSizes.find(s => s.id === variant.size_id);
        const color = availableColors.find(c => c.id === variant.color_id);

        if (size && color) {
          newVariants.push({
            id: variantId,
            dbId: variant.id,
            sizeId: variant.size_id,
            colorId: variant.color_id,
            size: size.name,
            color: color.name,
            sku: variant.sku,
            stock: variant.total_stock || 0,
            enabled: false,
            mainImage: variant.images?.[0] || null,
            secondaryImages: variant.images?.slice(1) || [],
            existsInDb: true,
          });
        }
      }
    });

    setVariants(newVariants);
    setStep(2);
  };

  const toggleVariantEnabled = (id: string) => {
    setVariants(variants.map(v => v.id === id ? { ...v, enabled: !v.enabled } : v));
  };

  const updateVariantStock = (id: string, stock: number) => {
    setVariants(variants.map(v => v.id === id ? { ...v, stock } : v));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      console.log('💾 Updating product and variants...');

      // Step 1: Update product basic info
      await adminProductService.updateProduct(Number(id), {
        name: productName,
        description: description,
        full_description: detailedDescription,
        category_id: Number(categoryId),
        cost_price: Number(costPrice),
        selling_price: Number(sellingPrice),
        status: isActive ? 'active' : 'inactive',
      });
      console.log('✅ Product updated');

      // Step 2: Handle variants (both update existing and create new)
      const productId = Number(id);
      const variantPromises = [];
      let updateErrors: { sku: string; error: string }[] = [];

      for (const variant of variants) {
        if (variant.existsInDb && variant.dbId) {
          // Update existing variant (status and stock)
          console.log(`📝 Updating variant ${variant.sku}...`);
          variantPromises.push(
            adminProductService.updateVariant(productId, variant.dbId, {
              total_stock: variant.stock,
              status: variant.enabled ? 'active' : 'inactive',
            }).catch((err: any) => {
              updateErrors.push({ sku: variant.sku, error: err.message });
              return null;
            })
          );
        } else if (variant.enabled) {
          // Create new variant
          console.log(`➕ Creating variant ${variant.sku}...`);
          variantPromises.push(
            adminProductService.createVariant(productId, {
              size_id: variant.sizeId,
              color_id: variant.colorId,
              sku: variant.sku,
              total_stock: variant.stock,
              status: 'active',
            }).catch((err: any) => {
              updateErrors.push({ sku: variant.sku, error: err.message });
              return null;
            })
          );
        }
      }

      // Execute all variant operations in parallel
      await Promise.all(variantPromises);

      if (updateErrors.length > 0) {
        console.error('❌ Variant update errors:', updateErrors);
        console.error('📋 See BACKEND_BUG_VARIANT_UPDATE_404.md for details');
        alert(`Product updated successfully!\n\n⚠️ Warning: ${updateErrors.length} variant(s) failed to update.\nBackend API issue - see console for details.`);
      } else {
        console.log('✅ All variants updated');
        alert('Product and variants updated successfully!');
      }

      router.push('/admin/products');
    } catch (err: any) {
      console.error('❌ Failed to update:', err);
      alert(err.response?.data?.message || 'Failed to update product');
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      setSubmitting(true);
      console.log('🗑️ Deleting product...');

      await adminProductService.deleteProduct(Number(id));

      console.log('✅ Product deleted successfully');
      alert('Product deleted successfully!');
      router.push('/admin/products');
    } catch (err: any) {
      console.error('❌ Failed to delete product:', err);
      alert(err.response?.data?.message || 'Failed to delete product');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#4880FF]" />
        <p className="ml-3 text-gray-600">Loading product data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/admin/products" className="text-[#4880FF] hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#202224]">Edit Product</h1>
            <p className="text-sm text-gray-600 mt-1">Product ID: {id} • Step {step} of 2</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={submitting}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          <span className="font-semibold text-sm">Delete Product</span>
        </button>
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
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Variants *</h2>
            <p className="text-sm text-gray-600 mb-4">Note: Unchecking existing variants will disable them (not delete)</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-3">Select Sizes *</label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <label
                      key={size.id}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition ${selectedSizeIds.includes(size.id.toString())
                        ? 'border-[#4880FF] bg-blue-50'
                        : 'border-gray-300 hover:border-[#4880FF] hover:bg-blue-50'
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selectedSizeIds.includes(size.id.toString())}
                        onChange={(e) => {
                          const sizeId = size.id.toString();
                          if (e.target.checked) {
                            setSelectedSizeIds([...selectedSizeIds, sizeId]);
                          } else {
                            setSelectedSizeIds(selectedSizeIds.filter(s => s !== sizeId));
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
                  {availableColors.map((color) => (
                    <label
                      key={color.id}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition ${selectedColorIds.includes(color.id.toString())
                        ? 'border-[#4880FF] bg-blue-50'
                        : 'border-gray-300 hover:border-[#4880FF] hover:bg-blue-50'
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selectedColorIds.includes(color.id.toString())}
                        onChange={(e) => {
                          const colorId = color.id.toString();
                          if (e.target.checked) {
                            setSelectedColorIds([...selectedColorIds, colorId]);
                          } else {
                            setSelectedColorIds(selectedColorIds.filter(c => c !== colorId));
                          }
                        }}
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.hex_code || '#ccc' }}
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
                <p className="text-sm text-gray-600 mt-1">
                  {variants.filter(v => v.enabled).length} active • {variants.filter(v => !v.enabled && v.existsInDb).length} disabled
                </p>
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
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Images</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {variants.map((variant) => (
                    <tr key={variant.id} className={`${!variant.enabled ? 'opacity-50 bg-gray-50' : ''}`}>
                      <td className="px-6 py-4 text-sm font-mono">{variant.sku}</td>
                      <td className="px-6 py-4 text-sm font-semibold">{variant.size}</td>
                      <td className="px-6 py-4 text-sm">{variant.color}</td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          value={variant.stock}
                          onChange={(e) => updateVariantStock(variant.id, Number(e.target.value))}
                          disabled={!variant.enabled}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4880FF] disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setShowImageUpload(variant.id)}
                          disabled={!variant.enabled}
                          className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Upload className="w-4 h-4" />
                          {variant.mainImage ? 'Change' : 'Upload'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {variant.existsInDb ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">Existing</span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">New</span>
                        )}
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
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Product
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
