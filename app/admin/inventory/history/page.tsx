'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, Loader2 } from 'lucide-react';
import adminInventoryService from '@/lib/services/admin/inventoryService';
import { showToast } from '@/components/Toast';

interface RestockBatch {
  id: number;
  admin_id: number;
  type: string;
  created_at: string;
  items_count: number;
  admin_name?: string;
}

export default function RestockHistoryPage() {
  const [selectedBatches, setSelectedBatches] = useState<number[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<RestockBatch | null>(null);
  const [restockBatches, setRestockBatches] = useState<RestockBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchRestockHistory();
  }, [page]);

  const fetchRestockHistory = async () => {
    try {
      setLoading(true);
      console.log('📦 Fetching restock history...', { page });

      const response = await adminInventoryService.getRestockHistory({
        page,
        limit: 20,
      });
      console.log('✅ Restock history response:', response.data);

      const batchesData = response.data.batches || response.data.data || response.data;
      const batchesArray = Array.isArray(batchesData) ? batchesData : [];

      console.log('📦 Parsed restock batches:', batchesArray.length, 'items');

      setRestockBatches(batchesArray);
      setTotal(response.data.total || 0);
      setTotalPages(Math.ceil((response.data.total || 0) / (response.data.limit || 20)));
    } catch (error: any) {
      console.error('❌ Failed to fetch restock history:', error);

      // Handle backend errors gracefully
      if (error?.response?.status === 404) {
        console.warn('⚠️ Restock history API not found (404). Endpoint not implemented yet.');
        showToast('Restock history feature not available yet', 'warning');
      } else if (error?.response?.status === 500) {
        console.warn('⚠️ Restock history API unavailable (500). Showing empty list.');
        showToast('Restock history temporarily unavailable', 'warning');
      } else {
        showToast('Failed to load restock history', 'error');
      }
      setRestockBatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedBatches.length === restockBatches.length) {
      setSelectedBatches([]);
    } else {
      setSelectedBatches(restockBatches.map(b => b.id));
    }
  };

  const handleSelectBatch = (batchId: number) => {
    setSelectedBatches(prev =>
      prev.includes(batchId)
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    );
  };

  const handleDownloadPDF = (batch: RestockBatch) => {
    // Mock PDF download
    alert(`Downloading PDF for Batch #${batch.id}...`);
  };

  const handleDownloadSelected = () => {
    // Mock batch download - download text file with codes
    const selectedIds = restockBatches
      .filter(b => selectedBatches.includes(b.id))
      .map(b => `Batch #${b.id}`)
      .join(', ');

    alert(`Downloading selected batches: ${selectedIds}`);
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition ${selectedBatches.length > 0
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#4880FF] animate-spin" />
          </div>
        ) : restockBatches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No restock history found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F1F4F9] border-b border-gray-200">
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedBatches.length === restockBatches.length && restockBatches.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Batch ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Created At</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Admin</th>
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
                          #{batch.id}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(batch.created_at).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {batch.admin_name || `Admin #${batch.admin_id}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${batch.type === 'Manual'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                          }`}>
                          {batch.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#202224]">
                        {batch.items_count} items
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing page {page} of {totalPages} ({total} total batches)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDetail(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-[#202224]">Restock Batch: #{selectedDetail.id}</h2>
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>Created: {new Date(selectedDetail.created_at).toLocaleString('vi-VN')}</span>
                <span>•</span>
                <span>Admin: {selectedDetail.admin_name || `#${selectedDetail.admin_id}`}</span>
                <span>•</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${selectedDetail.type === 'Manual'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
                  }`}>
                  {selectedDetail.type}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">Batch contains {selectedDetail.items_count} items</p>
                <p className="text-sm">Detailed item list requires additional API endpoint</p>
              </div>
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
