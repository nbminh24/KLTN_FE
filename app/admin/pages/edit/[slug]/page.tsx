'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Bold, Italic, List, ListOrdered, Link2, Image, Heading1, Heading2 } from 'lucide-react';

export default function EditPageContent({ params }: { params: { slug: string } }) {
  const [content, setContent] = useState(`
<h1>About Us</h1>

<p>Welcome to LeCas - your premium fashion destination. We've been serving style-conscious customers since 2020.</p>

<h2>Our Mission</h2>
<p>To provide high-quality fashion at affordable prices, delivered with exceptional customer service.</p>

<h2>What We Offer</h2>
<ul>
  <li>Premium quality clothing and accessories</li>
  <li>Curated collections from top designers</li>
  <li>Fast and reliable shipping</li>
  <li>Hassle-free returns within 30 days</li>
</ul>

<h2>Our Values</h2>
<p>Quality, sustainability, and customer satisfaction are at the heart of everything we do.</p>

<h2>Contact Us</h2>
<p>Have questions? Reach out to our customer service team at <a href="mailto:support@lecas.com">support@lecas.com</a></p>
  `);

  const [showPreview, setShowPreview] = useState(false);

  const pageData = {
    title: 'About Us',
    slug: params.slug,
    lastModified: '2024-01-15',
  };

  const insertFormatting = (tag: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = '';
    switch (tag) {
      case 'h1':
        newText = `<h1>${selectedText || 'Heading 1'}</h1>`;
        break;
      case 'h2':
        newText = `<h2>${selectedText || 'Heading 2'}</h2>`;
        break;
      case 'b':
        newText = `<strong>${selectedText || 'bold text'}</strong>`;
        break;
      case 'i':
        newText = `<em>${selectedText || 'italic text'}</em>`;
        break;
      case 'ul':
        newText = `<ul>\n  <li>${selectedText || 'List item'}</li>\n</ul>`;
        break;
      case 'ol':
        newText = `<ol>\n  <li>${selectedText || 'List item'}</li>\n</ol>`;
        break;
      case 'a':
        newText = `<a href="https://example.com">${selectedText || 'link text'}</a>`;
        break;
      case 'img':
        newText = `<img src="/path/to/image.jpg" alt="${selectedText || 'image description'}" />`;
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#202224]">Edit Page: {pageData.title}</h1>
            <p className="text-gray-600 mt-1">Last modified: {pageData.lastModified}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-sm">
            Save as Draft
          </button>
          <button
            onClick={() => alert('Page published!')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition font-semibold text-sm"
          >
            <Save className="w-4 h-4" />
            Publish Changes
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => insertFormatting('h1')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Heading 1"
                >
                  <Heading1 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => insertFormatting('h2')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Heading 2"
                >
                  <Heading2 className="w-5 h-5" />
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button
                  onClick={() => insertFormatting('b')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Bold"
                >
                  <Bold className="w-5 h-5" />
                </button>
                <button
                  onClick={() => insertFormatting('i')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Italic"
                >
                  <Italic className="w-5 h-5" />
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button
                  onClick={() => insertFormatting('ul')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Bullet List"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => insertFormatting('ol')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Numbered List"
                >
                  <ListOrdered className="w-5 h-5" />
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button
                  onClick={() => insertFormatting('a')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Insert Link"
                >
                  <Link2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => insertFormatting('img')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Insert Image"
                >
                  <Image className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Editor */}
            <textarea
              id="content-editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-6 min-h-[600px] font-mono text-sm focus:outline-none resize-none"
              placeholder="Start typing your content..."
            ></textarea>
          </div>

          {/* Meta Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
            <h3 className="font-bold text-lg">Page Settings</h3>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Page Title</label>
              <input
                type="text"
                defaultValue={pageData.title}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">/</span>
                <input
                  type="text"
                  defaultValue={pageData.slug}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Meta Description (SEO)</label>
              <textarea
                rows={3}
                placeholder="Brief description for search engines..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <h3 className="font-bold text-lg">Live Preview</h3>
              </div>
              <div
                className="p-6 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-900 mb-3">💡 Editor Tips:</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Use the toolbar buttons to format your content</li>
          <li>• Select text before clicking formatting buttons to apply styles</li>
          <li>• Save as Draft to preview changes before publishing</li>
          <li>• HTML knowledge is helpful but not required - use the visual tools</li>
        </ul>
      </div>
    </div>
  );
}
