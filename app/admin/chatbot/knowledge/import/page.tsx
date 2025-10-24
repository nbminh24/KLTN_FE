'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Download, FileText, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

export default function KnowledgeImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Simulate AI analysis
      setTimeout(() => {
        setAnalysisResult({
          detectedIntents: 5,
          trainingExamples: 23,
          responses: 15,
          confidence: 0.87,
        });
      }, 1000);
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
        <Link href="/admin/chatbot/knowledge" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Import Knowledge Base</h1>
          <p className="text-gray-600 mt-1">Bulk import FAQs, policies, and knowledge from documents</p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Instructions */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold text-purple-900 mb-3">AI-Powered Knowledge Import</h2>
              <p className="text-sm text-purple-800 mb-3">
                Our AI will automatically analyze your document and extract:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-purple-800">
                <li>Question patterns (for training examples)</li>
                <li>Answer content (for responses)</li>
                <li>Intent categories (automatic classification)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Supported Formats */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Supported Formats</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { format: 'TXT', icon: <FileText className="w-8 h-8" />, desc: 'Plain text Q&A' },
              { format: 'CSV', icon: <FileText className="w-8 h-8" />, desc: 'Question, Answer' },
              { format: 'DOCX', icon: <FileText className="w-8 h-8" />, desc: 'Word documents' },
            ].map((item, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg text-center">
                <div className="flex justify-center text-[#4880FF] mb-2">{item.icon}</div>
                <p className="font-bold text-sm mb-1">{item.format}</p>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Download Templates */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Download Templates</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <p className="font-semibold text-sm">FAQ Template (CSV)</p>
                  <p className="text-xs text-gray-600">Question, Answer, Category format</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">Download</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Policy Template (TXT)</p>
                  <p className="text-xs text-gray-600">Shipping, return, privacy policies</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">Download</span>
            </button>
          </div>
        </div>

        {/* Upload */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Upload Document</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#4880FF] transition">
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-semibold mb-2">Drag & drop your file here</p>
            <p className="text-sm text-gray-600 mb-4">or click to browse</p>
            <input
              type="file"
              accept=".txt,.csv,.docx"
              className="hidden"
              id="knowledge-upload"
              onChange={handleFileChange}
            />
            <label
              htmlFor="knowledge-upload"
              className="inline-block px-6 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition cursor-pointer"
            >
              Choose File
            </label>
          </div>

          {file && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">{file.name}</p>
                    <p className="text-sm text-blue-700">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="text-red-600 hover:text-red-700">
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Analysis Result */}
        {analysisResult && file && !success && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">AI Analysis Complete</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Detected Intents</p>
                <p className="text-2xl font-bold text-blue-600">{analysisResult.detectedIntents}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Training Examples</p>
                <p className="text-2xl font-bold text-green-600">{analysisResult.trainingExamples}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Responses</p>
                <p className="text-2xl font-bold text-purple-600">{analysisResult.responses}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Confidence</p>
                <p className="text-2xl font-bold text-yellow-600">{(analysisResult.confidence * 100).toFixed(0)}%</p>
              </div>
            </div>

            {/* Preview */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">Preview Extracted Intents:</h3>
              <div className="space-y-2">
                {['ask_shipping_time', 'ask_return_window', 'ask_payment_methods'].map((intent, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-sm text-[#202224] mb-1">{intent}</p>
                    <p className="text-xs text-gray-600">
                      {i + 4} training examples • {i + 2} responses
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleImport}
              disabled={importing}
              className="w-full px-6 py-4 bg-[#4880FF] text-white rounded-lg font-bold text-lg hover:bg-blue-600 transition disabled:bg-gray-300"
            >
              {importing ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Importing & Training Bot...
                </span>
              ) : (
                `Import ${analysisResult.detectedIntents} Intents`
              )}
            </button>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-white rounded-xl p-8 border-2 border-green-500">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#202224] mb-2">Knowledge Imported!</h3>
              <p className="text-gray-600 mb-2">
                Successfully imported {analysisResult.detectedIntents} intents with {analysisResult.trainingExamples}{' '}
                training examples.
              </p>
              <p className="text-sm text-gray-600 mb-6">Bot has been retrained and is ready to use.</p>
              <div className="flex gap-3 justify-center">
                <Link
                  href="/admin/chatbot/knowledge"
                  className="px-6 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  View Knowledge Base
                </Link>
                <button
                  onClick={() => {
                    setFile(null);
                    setAnalysisResult(null);
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

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-bold text-yellow-900 mb-3">💡 Tips for best results:</h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• Use clear, concise question-answer pairs</li>
            <li>• Include multiple ways of asking the same question</li>
            <li>• Keep responses under 200 words for better UX</li>
            <li>• Review and edit AI-detected intents before final approval</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
