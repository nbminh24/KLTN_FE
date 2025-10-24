'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, MessageSquare, X, Save } from 'lucide-react';

interface Intent {
  id: string;
  name: string;
  examples: string[];
  responses: string[];
  category: string;
  status: 'active' | 'draft';
}

export default function ChatbotKnowledgePage() {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);

  const intents: Intent[] = [
    {
      id: '1',
      name: 'greet',
      examples: ['hi', 'hello', 'hey there', 'good morning', 'chào bạn'],
      responses: ['Hello! How can I help you today?', 'Hi there! What can I do for you?'],
      category: 'Greetings',
      status: 'active',
    },
    {
      id: '2',
      name: 'ask_shipping_policy',
      examples: [
        'what is your shipping policy?',
        'do you have free shipping?',
        'how much does shipping cost?',
        'shop có free ship ko?',
      ],
      responses: [
        'We offer free shipping on orders over $100. Standard shipping is $5 for orders under $100.',
        'Free shipping is available for orders above $100. Otherwise, standard shipping costs $5.',
      ],
      category: 'Shipping',
      status: 'active',
    },
    {
      id: '3',
      name: 'ask_return_policy',
      examples: ['what is the return policy?', 'can i return my order?', 'how do returns work?'],
      responses: ['You can return items within 30 days of purchase. The item must be unused and in original packaging.'],
      category: 'Returns',
      status: 'active',
    },
    {
      id: '4',
      name: 'ask_size_guide',
      examples: ['size guide', 'what size should i order?', 'sizing information', 'bảng size'],
      responses: ['Please check our size guide on each product page. If you need help, let me know your measurements!'],
      category: 'Products',
      status: 'active',
    },
  ];

  const stats = [
    { label: 'Total Intents', value: intents.length.toString(), color: 'text-blue-600' },
    { label: 'Active', value: intents.filter((i) => i.status === 'active').length.toString(), color: 'text-green-600' },
    { label: 'Training Examples', value: intents.reduce((sum, i) => sum + i.examples.length, 0).toString(), color: 'text-purple-600' },
    { label: 'Responses', value: intents.reduce((sum, i) => sum + i.responses.length, 0).toString(), color: 'text-yellow-600' },
  ];

  const handleEdit = (intent: Intent) => {
    setSelectedIntent(intent);
    setEditMode(true);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedIntent(null);
    setEditMode(false);
    setShowModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Chatbot Knowledge Base</h1>
          <p className="text-gray-600 mt-1">Manage intents, training examples, and responses</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="font-semibold text-sm">Add Intent</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Intents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {intents.map((intent) => (
          <div key={intent.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#4880FF]" />
                <h3 className="font-bold text-lg text-[#202224]">{intent.name}</h3>
              </div>
              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-700">
                {intent.category}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Training Examples ({intent.examples.length})</p>
                <div className="space-y-1">
                  {intent.examples.slice(0, 2).map((ex, i) => (
                    <p key={i} className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                      "{ex}"
                    </p>
                  ))}
                  {intent.examples.length > 2 && (
                    <p className="text-xs text-gray-500">+{intent.examples.length - 2} more...</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Responses ({intent.responses.length})</p>
                <div className="space-y-1">
                  {intent.responses.slice(0, 1).map((res, i) => (
                    <p key={i} className="text-sm text-gray-700 bg-blue-50 px-2 py-1 rounded line-clamp-2">
                      {res}
                    </p>
                  ))}
                  {intent.responses.length > 1 && (
                    <p className="text-xs text-gray-500">+{intent.responses.length - 1} more...</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => handleEdit(intent)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-semibold"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#202224]">
                  {editMode ? 'Edit Intent' : 'Create New Intent'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form className="p-6 space-y-6">
              {/* Intent Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">Intent Name *</label>
                <input
                  type="text"
                  required
                  defaultValue={selectedIntent?.name || ''}
                  placeholder="e.g. ask_shipping_policy"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                />
                <p className="text-xs text-gray-600 mt-1">Use lowercase with underscores (snake_case)</p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  defaultValue={selectedIntent?.category || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                >
                  <option>Greetings</option>
                  <option>Products</option>
                  <option>Shipping</option>
                  <option>Returns</option>
                  <option>Orders</option>
                  <option>Payment</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Training Examples */}
              <div>
                <label className="block text-sm font-semibold mb-2">Training Examples *</label>
                <p className="text-xs text-gray-600 mb-3">
                  Add example phrases that users might say to trigger this intent (one per line)
                </p>
                <textarea
                  rows={6}
                  required
                  defaultValue={selectedIntent?.examples.join('\n') || ''}
                  placeholder="what is your shipping policy?&#10;do you have free shipping?&#10;how much does shipping cost?&#10;shop có free ship ko?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] font-mono text-sm"
                ></textarea>
              </div>

              {/* Responses */}
              <div>
                <label className="block text-sm font-semibold mb-2">Bot Responses *</label>
                <p className="text-xs text-gray-600 mb-3">
                  Add responses that the bot can use (one per line). Bot will randomly pick one.
                </p>
                <textarea
                  rows={6}
                  required
                  defaultValue={selectedIntent?.responses.join('\n') || ''}
                  placeholder="We offer free shipping on orders over $100.&#10;Free shipping is available for orders above $100."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(editMode ? 'Intent updated! Re-training bot...' : 'Intent created! Re-training bot...');
                    setShowModal(false);
                  }}
                >
                  <Save className="w-5 h-5" />
                  {editMode ? 'Update & Retrain Bot' : 'Create & Train Bot'}
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
