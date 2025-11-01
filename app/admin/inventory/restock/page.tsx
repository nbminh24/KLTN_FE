'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Upload, Check, AlertCircle } from 'lucide-react';

type RestockTab = 'manual' | 'excel';

// Variant Selection Modal Component
function VariantSelectionModal({
  productName,
  variants,
  onConfirm,
  onCancel,
}: {
  productName: string;
  variants: { sku: string; size: string; color: string; quantity: number }[];
  onConfirm: (selectedSkus: string[]) => void;
  onCancel: () => void;
}) {
  const [selectedSkus, setSelectedSkus] = useState<string[]>(variants.map(v => v.sku));

  const handleToggle = (sku: string) => {
    setSelectedSkus(prev =>
      prev.includes(sku) ? prev.filter(s => s !== sku) : [...prev, sku]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Select Variants - {productName}</h2>
          <p className="text-sm text-gray-600 mt-1">All variants are selected by default. Uncheck variants you don't want to restock.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {variants.map((variant) => (
              <label
                key={variant.sku}
                className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSkus.includes(variant.sku)}
                  onChange={() => handleToggle(variant.sku)}
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    Size {variant.size}, {variant.color}
                  </p>
                  <p className="text-xs text-gray-500">SKU: {variant.sku}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedSkus)}
            disabled={selectedSkus.length === 0}
            className={`px-6 py-2.5 rounded-lg transition font-semibold ${
              selectedSkus.length > 0
                ? 'bg-[#4880FF] text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            OK ({selectedSkus.length} selected)
          </button>
        </div>
      </div>
    </div>
  );
}

interface VariantRestock {
  sku: string;
  size: string;
  color: string;
  quantity: number;
}

interface RestockCard {
  id: string;
  productId: string | null;
  productName: string | null;
  selectedVariants: {
    sku: string;
    size: string;
    color: string;
    quantity: number;
  }[];
}

export default function RestockPage() {
  const [activeTab, setActiveTab] = useState<RestockTab>('manual');
  const [restockCards, setRestockCards] = useState<RestockCard[]>([]);
  const [showVariantModal, setShowVariantModal] = useState<{cardId: string; productId: string; productName: string} | null>(null);
  const [uploadResult, setUploadResult] = useState<{success: number; errors: string[]} | null>(null);

  // Mock available products
  const availableProducts = [
    {
      id: '1',
      name: 'Gradient Graphic T-shirt',
      variants: [
        { sku: 'TSH-001-M-Red', size: 'M', color: 'Red', quantity: 0 },
        { sku: 'TSH-001-L-Blue', size: 'L', color: 'Blue', quantity: 0 },
        { sku: 'TSH-001-XL-Black', size: 'XL', color: 'Black', quantity: 0 },
      ]
    },
    {
      id: '2',
      name: 'Classic Hoodie',
      variants: [
        { sku: 'HOD-002-L-Gray', size: 'L', color: 'Gray', quantity: 0 },
        { sku: 'HOD-002-XL-Black', size: 'XL', color: 'Black', quantity: 0 },
      ]
    },
    {
      id: '3',
      name: 'Skinny Fit Jeans',
      variants: [
        { sku: 'JNS-003-30-Blue', size: '30', color: 'Blue', quantity: 0 },
        { sku: 'JNS-003-32-Black', size: '32', color: 'Black', quantity: 0 },
      ]
    },
  ];

  const handleAddCard = () => {
    const newCard: RestockCard = {
      id: Date.now().toString(),
      productId: null,
      productName: null,
      selectedVariants: [],
    };
    setRestockCards([...restockCards, newCard]);
  };

  const handleRemoveCard = (cardId: string) => {
    setRestockCards(restockCards.filter(c => c.id !== cardId));
  };

  const handleSelectProduct = (cardId: string, productId: string) => {
    const product = availableProducts.find(p => p.id === productId);
    if (!product) return;

    // Update card with product info and open variant modal
    setRestockCards(restockCards.map(c => 
      c.id === cardId ? {...c, productId, productName: product.name} : c
    ));
    
    setShowVariantModal({cardId, productId, productName: product.name});
  };

  const handleConfirmVariants = (selectedSkus: string[]) => {
    if (!showVariantModal) return;
    
    const product = availableProducts.find(p => p.id === showVariantModal.productId);
    if (!product) return;

    const variants = product.variants
      .filter(v => selectedSkus.includes(v.sku))
      .map(v => ({
        sku: v.sku,
        size: v.size,
        color: v.color,
        quantity: 0,
      }));

    setRestockCards(restockCards.map(c => 
      c.id === showVariantModal.cardId ? {...c, selectedVariants: variants} : c
    ));
    
    setShowVariantModal(null);
  };

  const handleQuantityChange = (cardId: string, sku: string, quantity: number) => {
    setRestockCards(restockCards.map(c => {
      if (c.id === cardId) {
        return {
          ...c,
          selectedVariants: c.selectedVariants.map(v => 
            v.sku === sku ? {...v, quantity} : v
          )
        };
      }
      return c;
    }));
  };

  const handleRemoveVariant = (cardId: string, sku: string) => {
    setRestockCards(restockCards.map(c => {
      if (c.id === cardId) {
        return {
          ...c,
          selectedVariants: c.selectedVariants.filter(v => v.sku !== sku)
        };
      }
      return c;
    }));
  };

  const handleSaveManual = () => {
    const totalItems = restockCards.reduce((sum, card) => 
      sum + card.selectedVariants.reduce((vSum, v) => vSum + v.quantity, 0), 0
    );
    
    if (confirm(`Save restock for ${totalItems} items?`)) {
      alert('Restock saved successfully!');
      setRestockCards([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mock CSV parsing and validation
    setTimeout(() => {
      setUploadResult({
        success: 45,
        errors: [
          'TSH-999-M-Red: SKU not found',
          'HOD-001-L-Blue: Invalid quantity',
          'JNS-invalid: Invalid format'
        ]
      });
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/inventory"
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Restock Inventory</h1>
          <p className="text-gray-600 mt-1">Import inventory stock</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-6 py-4 font-semibold text-sm transition ${
              activeTab === 'manual'
                ? 'border-b-2 border-[#4880FF] text-[#4880FF]'
                : 'text-gray-600 hover:text-[#4880FF]'
            }`}
          >
            Manual
          </button>
          <button
            onClick={() => setActiveTab('excel')}
            className={`px-6 py-4 font-semibold text-sm transition ${
              activeTab === 'excel'
                ? 'border-b-2 border-[#4880FF] text-[#4880FF]'
                : 'text-gray-600 hover:text-[#4880FF]'
            }`}
          >
            Import Excel
          </button>
        </div>
      </div>

      {/* Manual Tab */}
      {activeTab === 'manual' && (
        <div className="space-y-6">
          {/* Restock Cards */}
          {restockCards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Product Restock</h3>
                <button
                  onClick={() => handleRemoveCard(card.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Selector Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Product:
                </label>
                <select
                  value={card.productId || ''}
                  onChange={(e) => handleSelectProduct(card.id, e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  disabled={card.productId !== null}
                >
                  <option value="">Search or select product...</option>
                  {availableProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Variants */}
              {card.selectedVariants.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Selected Variants:</p>
                  <div className="space-y-3">
                    {card.selectedVariants.map((variant) => (
                      <div key={variant.sku} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-semibold">
                            Size {variant.size}, {variant.color}
                          </p>
                          <p className="text-xs text-gray-500">SKU: {variant.sku}</p>
                        </div>
                        <div className="w-32">
                          <input
                            type="number"
                            min="0"
                            value={variant.quantity}
                            onChange={(e) => handleQuantityChange(card.id, variant.sku, parseInt(e.target.value) || 0)}
                            placeholder="Quantity"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveVariant(card.id, variant.sku)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {card.productId && card.selectedVariants.length === 0 && (
                <p className="text-sm text-gray-500 italic">Waiting for variant selection...</p>
              )}
            </div>
          ))}

          {/* Add Product Button */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <button
              onClick={handleAddCard}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {/* Action Buttons */}
          {restockCards.length > 0 && restockCards.some(c => c.selectedVariants.length > 0) && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setRestockCards([])}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveManual}
                  className="px-6 py-2.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Variant Selection Modal */}
      {showVariantModal && (
        <VariantSelectionModal
          productName={showVariantModal.productName}
          variants={availableProducts.find(p => p.id === showVariantModal.productId)?.variants || []}
          onConfirm={handleConfirmVariants}
          onCancel={() => setShowVariantModal(null)}
        />
      )}

      {/* Excel Tab */}
      {activeTab === 'excel' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2">Upload CSV File</h3>
            <p className="text-sm text-gray-600 mb-4">
              Format: 2 columns (SKU, Quantity)<br/>
              Example: TSH-001-M-Red, 100
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#4880FF] transition">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Drag & drop or click to upload
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="inline-block px-4 py-2 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition cursor-pointer text-sm font-semibold"
            >
              Select CSV File
            </label>
          </div>

          {/* Upload Result */}
          {uploadResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-sm font-semibold text-green-900">
                  Success: {uploadResult.success} items imported
                </p>
              </div>
              
              {uploadResult.errors.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm font-semibold text-red-900">
                      Errors: {uploadResult.errors.length} items failed
                    </p>
                  </div>
                  <ul className="text-xs text-red-700 space-y-1 ml-7">
                    {uploadResult.errors.map((error, idx) => (
                      <li key={idx}>- {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
