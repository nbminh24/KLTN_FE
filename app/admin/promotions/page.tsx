'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, Tag, Calendar, X } from 'lucide-react';

export default function PromotionsPage() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'vouchers' | 'campaigns'>('vouchers');

  const vouchers = [
    {
      id: '1',
      code: 'SUMMER20',
      discount: '20%',
      type: 'Percentage',
      minOrder: 100,
      usage: 45,
      limit: 100,
      expiry: '2024-06-30',
      status: 'Active',
    },
    {
      id: '2',
      code: 'NEWUSER',
      discount: '$15',
      type: 'Fixed',
      minOrder: 50,
      usage: 123,
      limit: 500,
      expiry: '2024-12-31',
      status: 'Active',
    },
    {
      id: '3',
      code: 'FLASH50',
      discount: '50%',
      type: 'Percentage',
      minOrder: 200,
      usage: 89,
      limit: 100,
      expiry: '2024-02-01',
      status: 'Expired',
    },
  ];

  const campaigns = [
    { id: '1', name: 'Summer Sale 2024', discount: '30%', products: 45, start: '2024-06-01', end: '2024-06-30', status: 'Scheduled' },
    { id: '2', name: 'New Year Flash Sale', discount: '50%', products: 23, start: '2024-01-01', end: '2024-01-07', status: 'Active' },
    { id: '3', name: 'Black Friday', discount: '40%', products: 120, start: '2023-11-24', end: '2023-11-27', status: 'Ended' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Promotions</h1>
          <p className="text-gray-600 mt-1">Manage vouchers and campaigns</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="font-semibold text-sm">Create {activeTab === 'vouchers' ? 'Voucher' : 'Campaign'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('vouchers')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'vouchers'
                ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Voucher Codes
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'campaigns'
                ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Flash Sale Campaigns
          </button>
        </div>

        {/* Vouchers Tab */}
        {activeTab === 'vouchers' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F1F4F9]">
                    <th className="px-4 py-3 text-left text-sm font-bold">Code</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Discount</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Min Order</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Usage</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Expiry</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vouchers.map((voucher) => (
                    <tr key={voucher.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[#4880FF]" />
                          <span className="font-bold text-sm">{voucher.code}</span>
                          <button className="p-1 hover:bg-gray-100 rounded" title="Copy code">
                            <Copy className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-green-600">{voucher.discount}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">${voucher.minOrder}</td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                            <div
                              className="bg-[#4880FF] h-2 rounded-full"
                              style={{ width: `${(voucher.usage / voucher.limit) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{voucher.usage}/{voucher.limit}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{voucher.expiry}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            voucher.status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {voucher.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition">
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
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F1F4F9]">
                    <th className="px-4 py-3 text-left text-sm font-bold">Campaign Name</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Discount</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Products</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Start Date</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">End Date</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#4880FF]" />
                          <span className="font-semibold text-sm">{campaign.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-red-600">{campaign.discount}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{campaign.products} items</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{campaign.start}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{campaign.end}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            campaign.status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : campaign.status === 'Scheduled'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition">
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
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#202224]">
                Create New {activeTab === 'vouchers' ? 'Voucher' : 'Campaign'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeTab === 'vouchers' ? (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Voucher Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUMMER20"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Discount Type *</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]">
                      <option>Percentage</option>
                      <option>Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Discount Value *</label>
                    <input
                      type="number"
                      required
                      placeholder="20"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Min Order Value</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Usage Limit</label>
                    <input
                      type="number"
                      placeholder="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="active-voucher" defaultChecked className="w-5 h-5" />
                  <label htmlFor="active-voucher" className="text-sm font-semibold">
                    Active
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Voucher created!');
                      setShowModal(false);
                    }}
                  >
                    Create Voucher
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
            ) : (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Campaign Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Summer Sale 2024"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Discount *</label>
                  <input
                    type="number"
                    required
                    placeholder="30"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Start Date *</label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">End Date *</label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Select Products</label>
                  <p className="text-xs text-gray-600 mb-2">Choose which products to include in this campaign</p>
                  <button
                    type="button"
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4880FF] transition text-sm font-semibold text-gray-600"
                  >
                    Select Products
                  </button>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Campaign created!');
                      setShowModal(false);
                    }}
                  >
                    Create Campaign
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
