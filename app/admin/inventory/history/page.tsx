'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FileText } from 'lucide-react';

interface RestockBatch {
  id: string;
  code: string;
  timestamp: string;
  user: string;
  type: 'Manual' | 'Excel';
  items: {sku: string; quantity: number}[];
}

export default function RestockHistoryPage() {
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<RestockBatch | null>(null);

  // Mock restock history
  const restockBatches: RestockBatch[] = [
    {
      id: '1',
      code: 'RCT-001',
      timestamp: '2024-01-15 14:30',
      user: 'Admin Team',
      type: 'Manual',
      items: [
        { sku: 'TSH-001-M-Red', quantity: 100 },
        { sku: 'HOD-002-L-Black', quantity: 50 },
        { sku: 'JNS-003-XL-Blue', quantity: 75 },
      ]
    },
    {
      id: '2',
      code: 'RCT-002',
      timestamp: '2024-01-14 10:15',
      user: 'Admin Team',
      type: 'Excel',
      items: [
        { sku: 'TSH-001-L-Blue', quantity: 200 },
        { sku: 'TSH-001-XL-Black', quantity: 150 },
        { sku: 'HOD-002-XL-Gray', quantity: 100 },
        { sku: 'JNS-003-30-Black', quantity: 80 },
      ]
    },
    {
      id: '3',
      code: 'RCT-003',
      timestamp: '2024-01-13 16:45',
      user: 'John Doe',
      type: 'Manual',
      items: [
        { sku: 'TSH-001-M-Red', quantity: 50 },
        { sku: 'JNS-003-32-Blue', quantity: 40 },
      ]
    },
    {
      id: '4',
      code: 'RCT-004',
      timestamp: '2024-01-12 09:20',
      user: 'Admin Team',
      type: 'Excel',
      items: [
        { sku: 'HOD-002-L-Black', quantity: 120 },
        { sku: 'HOD-002-XL-Black', quantity: 90 },
      ]
    },
    {
      id: '5',
      code: 'RCT-005',
      timestamp: '2024-01-10 11:00',
      user: 'Jane Smith',
      type: 'Manual',
      items: [
        { sku: 'TSH-001-XL-Black', quantity: 60 },
        { sku: 'JNS-003-XL-Blue', quantity: 45 },
      ]
    },
  ];

  const handleSelectAll = () => {
    if (selectedBatches.length === restockBatches.length) {
      setSelectedBatches([]);
    } else {
      setSelectedBatches(restockBatches.map(b => b.id));
    }
  };

  const handleSelectBatch = (batchId: string) => {
    setSelectedBatches(prev =>
      prev.includes(batchId)
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    );
  };

  const handleDownloadPDF = (batch: RestockBatch) => {
    // Mock PDF download
    alert(`Downloading PDF for ${batch.code}...`);
  };

  const handleDownloadSelected = () => {
    // Mock batch download - download text file with codes
    const selectedCodes = restockBatches
      .filter(b => selectedBatches.includes(b.id))
      .map(b => b.code)
      .join(', ');
    
    alert(`Downloading selected batches: ${selectedCodes}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/inventory"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#202224]">Restock History</h1>
            <p className="text-gray-600 mt-1">View restock history and download records</p>
          </div>
        </div>
        <button
          onClick={handleDownloadSelected}
          disabled={selectedBatches.length === 0}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition ${
            selectedBatches.length > 0
              ? 'bg-[#4880FF] text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Download className="w-4 h-4" />
          Download Selected ({selectedBatches.length})
        </button>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F1F4F9] border-b border-gray-200">
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedBatches.length === restockBatches.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Batch Code</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">User</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Type</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {restockBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedBatches.includes(batch.id)}
                      onChange={() => handleSelectBatch(batch.id)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedDetail(batch)}
                      className="font-mono text-sm font-semibold text-[#4880FF] hover:underline"
                    >
                      {batch.code}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{batch.timestamp}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{batch.user}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      batch.type === 'Manual'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {batch.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#202224]">
                    {batch.items.length} items
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDetail(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-[#202224]">Restock Batch: {selectedDetail.code}</h2>
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>Timestamp: {selectedDetail.timestamp}</span>
                <span>•</span>
                <span>User: {selectedDetail.user}</span>
                <span>•</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  selectedDetail.type === 'Manual'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {selectedDetail.type}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">SKU</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedDetail.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-sm font-mono">{item.sku}</td>
                      <td className="px-4 py-3 text-sm font-semibold">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedDetail(null)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadPDF(selectedDetail)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                <FileText className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
