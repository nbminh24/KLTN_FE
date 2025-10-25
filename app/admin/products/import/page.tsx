'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export default function ImportProductsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(true);
    }
  };

  const handleImport = () => {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setSuccess(true);
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Import Products</h1>
          <p className="text-gray-600 mt-1">Bulk import products from CSV file</p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Download Template (Optional) */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold mb-2">Download Template (Optional)</h2>
              <p className="text-sm text-gray-600">
                Use our template if you need a reference for the CSV format
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-200 transition">
            <Download className="w-5 h-5" />
            Download CSV Template
          </button>
        </div>

        {/* Upload File */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Upload CSV File</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#4880FF] transition">
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-semibold mb-2">Drag & drop your CSV file here</p>
            <p className="text-sm text-gray-600 mb-4">or click to browse</p>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              id="csv-upload"
              onChange={handleFileChange}
            />
            <label
              htmlFor="csv-upload"
              className="inline-block px-6 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition cursor-pointer"
            >
              Choose File
            </label>
          </div>

          {file && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">{file.name}</p>
                  <p className="text-sm text-blue-700">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPreview(false);
                }}
                className="text-red-600 hover:text-red-700"
              >
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Preview Data */}
        {preview && file && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Preview Data</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F1F4F9]">
                    <th className="px-4 py-3 text-left font-bold">Name</th>
                    <th className="px-4 py-3 text-left font-bold">SKU</th>
                    <th className="px-4 py-3 text-left font-bold">Price</th>
                    <th className="px-4 py-3 text-left font-bold">Stock</th>
                    <th className="px-4 py-3 text-left font-bold">Category</th>
                    <th className="px-4 py-3 text-left font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">Gradient T-shirt {i + 1}</td>
                      <td className="px-4 py-3">TSH-00{i + 1}</td>
                      <td className="px-4 py-3">${145 + i * 10}</td>
                      <td className="px-4 py-3">{100 + i * 50}</td>
                      <td className="px-4 py-3">T-Shirts</td>
                      <td className="px-4 py-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900">
                    300 products ready to import
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    All required fields are valid. No errors detected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Import Button */}
        {preview && file && !success && (
          <button
            onClick={handleImport}
            disabled={importing}
            className="w-full px-6 py-4 bg-[#4880FF] text-white rounded-lg font-bold text-lg hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {importing ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Importing Products... (300 items)
              </span>
            ) : (
              'Start Import'
            )}
          </button>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-white rounded-xl p-8 border-2 border-green-500">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#202224] mb-2">Import Successful!</h3>
              <p className="text-gray-600 mb-6">
                300 products have been imported successfully to your catalog.
              </p>
              <div className="flex gap-3 justify-center">
                <Link
                  href="/admin/products"
                  className="px-6 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  View Products
                </Link>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(false);
                    setSuccess(false);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Import More
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
