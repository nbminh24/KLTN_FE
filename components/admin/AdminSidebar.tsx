'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  PackageSearch,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  Folder,
  FileText,
} from 'lucide-react';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Products', path: '/admin/products', icon: <Package className="w-5 h-5" /> },
    { name: 'Categories', path: '/admin/categories', icon: <Folder className="w-5 h-5" /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users className="w-5 h-5" /> },
  ];

  const pagesItems: MenuItem[] = [
    { name: 'Promotions', path: '/admin/promotions', icon: <Tag className="w-5 h-5" /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <PackageSearch className="w-5 h-5" /> },
    { name: 'Chatbot', path: '/admin/chatbot', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Support Inbox', path: '/admin/support-inbox', icon: <Mail className="w-5 h-5" /> },
    { name: 'Pages (CMS)', path: '/admin/pages', icon: <FileText className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="w-60 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link href="/admin" className="font-bold text-lg">
          <span className="text-[#4880FF]">LeCas</span>
          <span className="text-[#202224]">BackOffice</span>
        </Link>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-[#4880FF] text-white'
                  : 'text-[#202224] hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="text-sm font-semibold">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Pages Section */}
        <div className="px-6 mb-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pages</p>
        </div>
        <nav className="space-y-1 px-3">
          {pagesItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-[#4880FF] text-white'
                  : 'text-[#202224] hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="text-sm font-semibold">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-200">
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-6 py-3 transition-all ${
            isActive('/admin/settings')
              ? 'bg-[#4880FF] text-white'
              : 'text-[#202224] hover:bg-gray-50'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-semibold">Settings</span>
        </Link>
        <button
          onClick={() => {
            // Mock logout
            alert('Logout functionality');
          }}
          className="w-full flex items-center gap-3 px-6 py-3 text-[#202224] hover:bg-gray-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
}
