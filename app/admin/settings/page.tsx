'use client';

import { useState } from 'react';
import { Save, Upload, Globe, Mail, CreditCard, Truck, Bell, Shield, Users } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'shipping' | 'payment' | 'notifications' | 'team'>('general');

  const tabs = [
    { id: 'general' as const, name: 'General', icon: <Globe className="w-4 h-4" /> },
    { id: 'shipping' as const, name: 'Shipping', icon: <Truck className="w-4 h-4" /> },
    { id: 'payment' as const, name: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'notifications' as const, name: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'team' as const, name: 'Team', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#202224]">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your store settings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Store Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Store Name *</label>
                  <input
                    type="text"
                    defaultValue="LeCas Shop"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      defaultValue="contact@lecas.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone *</label>
                    <input
                      type="tel"
                      defaultValue="+1 234 567 8900"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Store Address</label>
                  <textarea
                    rows={3}
                    defaultValue="123 Fashion Street, New York, NY 10001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  ></textarea>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Store Logo</h2>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-xl text-gray-500">Logo</span>
                </div>
                <div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-semibold">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </button>
                  <p className="text-xs text-gray-600 mt-2">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Currency & Region</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Currency</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>VND (₫)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Timezone</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]">
                    <option>UTC-5 (EST)</option>
                    <option>UTC-8 (PST)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+7 (ICT)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Settings */}
        {activeTab === 'shipping' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Shipping Methods</h2>
              <div className="space-y-3">
                {[
                  { name: 'Standard Shipping', fee: 5, time: '5-7 days' },
                  { name: 'Express Shipping', fee: 15, time: '2-3 days' },
                  { name: 'Next Day Delivery', fee: 25, time: '1 day' },
                ].map((method, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-semibold">{method.name}</p>
                      <p className="text-sm text-gray-600">Delivery: {method.time}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">${method.fee}</span>
                      <label className="relative inline-block w-12 h-6">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#4880FF] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4880FF]"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Free Shipping</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="free-shipping" defaultChecked className="w-5 h-5" />
                  <label htmlFor="free-shipping" className="text-sm font-semibold">
                    Enable free shipping on orders above minimum amount
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Minimum Order Value</label>
                  <input
                    type="number"
                    defaultValue="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payment' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
              <div className="space-y-3">
                {[
                  { name: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" />, enabled: true },
                  { name: 'PayPal', icon: <Globe className="w-5 h-5" />, enabled: true },
                  { name: 'Cash on Delivery', icon: <Truck className="w-5 h-5" />, enabled: false },
                  { name: 'Bank Transfer', icon: <CreditCard className="w-5 h-5" />, enabled: false },
                ].map((method, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">{method.icon}</div>
                      <span className="font-semibold">{method.name}</span>
                    </div>
                    <label className="relative inline-block w-12 h-6">
                      <input type="checkbox" defaultChecked={method.enabled} className="sr-only peer" />
                      <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#4880FF] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4880FF]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Email Notifications</h2>
              <div className="space-y-3">
                {[
                  'New order received',
                  'Order status updates',
                  'Low stock alerts',
                  'New customer registration',
                  'Return requests',
                  'Weekly sales report',
                ].map((notification, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <span className="text-sm font-semibold">{notification}</span>
                    <label className="relative inline-block w-12 h-6">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#4880FF] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4880FF]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Settings */}
        {activeTab === 'team' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Team Members</h2>
              <button className="px-4 py-2 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition text-sm font-semibold">
                Invite Member
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Admin User', email: 'admin@lecas.com', role: 'Owner', active: true },
                { name: 'John Smith', email: 'john@lecas.com', role: 'Admin', active: true },
                { name: 'Sarah Johnson', email: 'sarah@lecas.com', role: 'Manager', active: false },
              ].map((member, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                      {member.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold">
                      {member.role}
                    </span>
                    {member.active && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="px-6 pb-6">
          <button className="flex items-center gap-2 px-8 py-3 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition font-semibold">
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
