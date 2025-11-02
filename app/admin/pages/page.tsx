'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Edit2, Eye, Globe, Clock } from 'lucide-react';

interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft';
  lastModified: string;
  modifiedBy: string;
}

export default function PagesManagementPage() {
  const pages: Page[] = [
    {
      id: '1',
      title: 'About Us',
      slug: 'about',
      status: 'published',
      lastModified: '2024-01-15',
      modifiedBy: 'Admin User',
    },
    {
      id: '2',
      title: 'Contact',
      slug: 'contact',
      status: 'published',
      lastModified: '2024-01-14',
      modifiedBy: 'Admin User',
    },
    {
      id: '3',
      title: 'FAQ',
      slug: 'faq',
      status: 'published',
      lastModified: '2024-01-13',
      modifiedBy: 'Admin User',
    },
    {
      id: '4',
      title: 'Privacy Policy',
      slug: 'privacy',
      status: 'published',
      lastModified: '2024-01-12',
      modifiedBy: 'Admin User',
    },
    {
      id: '5',
      title: 'Terms & Conditions',
      slug: 'terms',
      status: 'published',
      lastModified: '2024-01-11',
      modifiedBy: 'Admin User',
    },
    {
      id: '6',
      title: 'Return Policy',
      slug: 'return-policy',
      status: 'published',
      lastModified: '2024-01-10',
      modifiedBy: 'Admin User',
    },
    {
      id: '7',
      title: 'Shipping Policy',
      slug: 'shipping-policy',
      status: 'published',
      lastModified: '2024-01-09',
      modifiedBy: 'Admin User',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#202224]">Pages Management (CMS)</h1>
        <p className="text-gray-600 mt-1">Manage static pages content without touching code</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Pages</p>
          <p className="text-2xl font-bold text-blue-600">{pages.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Published</p>
          <p className="text-2xl font-bold text-green-600">{pages.filter((p) => p.status === 'published').length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Drafts</p>
          <p className="text-2xl font-bold text-yellow-600">{pages.filter((p) => p.status === 'draft').length}</p>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F1F4F9]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Page</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Last Modified
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Modified By
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#202224]">{page.title}</p>
                      <p className="text-xs text-gray-600">/{page.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">/{page.slug}</code>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      page.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {page.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {page.lastModified}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{page.modifiedBy}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/${page.slug}`}
                      target="_blank"
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/pages/edit/${page.slug}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
