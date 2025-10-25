'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Folder, X, Eye, Package } from 'lucide-react';

export default function CategoriesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const categories = [
    { id: '1', name: 'T-Shirts', slug: 't-shirts', products: 45, status: 'Active', description: 'Casual and graphic t-shirts' },
    { id: '2', name: 'Shirts', slug: 'shirts', products: 32, status: 'Active', description: 'Casual and formal shirts' },
    { id: '3', name: 'Jeans', slug: 'jeans', products: 28, status: 'Active', description: 'Denim jeans and pants' },
    { id: '4', name: 'Hoodies', slug: 'hoodies', products: 21, status: 'Active', description: 'Hoodies and sweatshirts' },
    { id: '5', name: 'Shorts', slug: 'shorts', products: 19, status: 'Active', description: 'Summer shorts' },
    { id: '6', name: 'Jackets', slug: 'jackets', products: 15, status: 'Active', description: 'Jackets and outerwear' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Categories</h1>
          <p className="text-gray-600 mt-1">Manage product categories</p>
        </div>
        <button
          onClick={() => {
            setEditMode(false);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="font-semibold text-sm">Add Category</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Categories</p>
          <p className="text-2xl font-bold text-[#202224]">{categories.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Active Categories</p>
          <p className="text-2xl font-bold text-green-600">{categories.filter(c => c.status === 'Active').length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Products</p>
          <p className="text-2xl font-bold text-blue-600">{categories.reduce((sum, c) => sum + c.products, 0)}</p>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F1F4F9] border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Category</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Slug</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Description</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Products</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Folder className="w-5 h-5 text-[#4880FF]" />
                      <span className="font-semibold text-sm text-[#202224]">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{category.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{category.description}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#202224]">{category.products}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      {category.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="View Products"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => {
                          setEditMode(true);
                          setShowModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#202224]">
                {editMode ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. T-Shirts"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Slug *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. t-shirts"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Parent Category</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]">
                  <option value="">None (Top Level)</option>
                  <option>T-Shirts</option>
                  <option>Shirts</option>
                  <option>Jeans</option>
                  <option>Hoodies</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Category description..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                ></textarea>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="active" defaultChecked className="w-5 h-5" />
                <label htmlFor="active" className="text-sm font-semibold">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(editMode ? 'Category updated!' : 'Category created!');
                    setShowModal(false);
                  }}
                >
                  {editMode ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
