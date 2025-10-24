'use client';

import { Search, Bell, ChevronDown, Globe } from 'lucide-react';
import Image from 'next/image';

export default function AdminTopBar() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-11 pr-4 py-2 bg-[#F5F6FA] border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition">
          <Globe className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-semibold text-gray-600">English</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-50 transition">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#F93C65] rounded-full"></span>
          <span className="absolute top-0 right-0 bg-[#F93C65] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            6
          </span>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800">Admin User</p>
            <p className="text-xs text-gray-600">Administrator</p>
          </div>
          <div className="relative w-11 h-11 bg-gray-300 rounded-full overflow-hidden">
            <Image
              src="/bmm32410_black_xl.webp"
              alt="Admin"
              fill
              className="object-cover"
            />
          </div>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>
      </div>
    </div>
  );
}
