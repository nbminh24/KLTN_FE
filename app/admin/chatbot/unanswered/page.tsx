'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, AlertCircle, CheckCircle, Plus, X, Save } from 'lucide-react';

export default function UnansweredQuestionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showTrainModal, setShowTrainModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const fallbackQuestions = [
    {
      id: '1',
      question: 'Can I return after 45 days?',
      count: 12,
      firstAsked: '2024-01-10',
      lastAsked: '2024-01-15',
      users: ['User #1234', 'User #1245', 'User #1290'],
      category: 'Returns',
      status: 'Pending',
    },
    {
      id: '2',
      question: 'Do you ship to Vietnam?',
      count: 8,
      firstAsked: '2024-01-12',
      lastAsked: '2024-01-15',
      users: ['User #1256', 'User #1267'],
      category: 'Shipping',
      status: 'Pending',
    },
    {
      id: '3',
      question: 'What about wholesale pricing?',
      count: 6,
      firstAsked: '2024-01-13',
      lastAsked: '2024-01-14',
      users: ['User #1278', 'User #1289'],
      category: 'Pricing',
      status: 'Pending',
    },
    {
      id: '4',
      question: 'Can I change my order after placing?',
      count: 5,
      firstAsked: '2024-01-14',
      lastAsked: '2024-01-14',
      users: ['User #1290'],
      category: 'Orders',
      status: 'In Progress',
    },
  ];

  const stats = [
    { label: 'Total Unanswered', value: '34', color: 'text-yellow-600' },
    { label: 'High Priority', value: '12', color: 'text-red-600' },
    { label: 'In Progress', value: '8', color: 'text-blue-600' },
    { label: 'Resolved', value: '156', color: 'text-green-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/chatbot" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#202224]">Unanswered Questions</h1>
            <p className="text-gray-600 mt-1">Questions that triggered fallback (nlu_fallback)</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition">
          <Plus className="w-4 h-4" />
          <span className="font-semibold text-sm">Train Bot</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 mb-2">How to improve chatbot responses</h3>
            <p className="text-sm text-blue-800 mb-3">
              These questions couldn't be answered by the chatbot. Review them and add appropriate responses to improve the AI's understanding.
            </p>
            <button className="text-sm font-semibold text-blue-700 hover:underline">
              Learn more about training
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search unanswered questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]">
            <option>All Categories</option>
            <option>Returns</option>
            <option>Shipping</option>
            <option>Pricing</option>
            <option>Orders</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]">
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {fallbackQuestions.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#202224] mb-1">{item.question}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                        {item.category}
                      </span>
                      <span>Asked {item.count} times</span>
                      <span>•</span>
                      <span>Last: {item.lastAsked}</span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : item.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Asked by:</p>
                  <div className="flex items-center gap-2">
                    {item.users.slice(0, 3).map((user, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                        {user}
                      </span>
                    ))}
                    {item.users.length > 3 && (
                      <span className="text-xs text-gray-600">+{item.users.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedQuestion(item);
                      setShowTrainModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-semibold"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Train Bot
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-semibold">
                    View Conversations
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-semibold">
                    Ignore
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Training Suggestion */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500 rounded-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-purple-900 mb-2">Bulk Train Chatbot</h3>
            <p className="text-sm text-purple-800 mb-4">
              You have 12 high-priority questions that need attention. Train your chatbot to handle these questions automatically.
            </p>
            <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold">
              Start Bulk Training
            </button>
          </div>
        </div>
      </div>

      {/* Training Modal */}
      {showTrainModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#202224]">Train Bot with Question</h2>
                <button onClick={() => setShowTrainModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form className="p-6 space-y-6">
              {/* Question */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Unanswered Question:</p>
                <p className="font-bold text-lg text-[#202224]">{selectedQuestion.question}</p>
                <p className="text-xs text-gray-600 mt-2">Asked {selectedQuestion.count} times</p>
              </div>

              {/* Training Options */}
              <div>
                <label className="block text-sm font-semibold mb-3">Choose Training Method:</label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#4880FF] transition">
                    <input type="radio" name="training-method" defaultChecked className="mt-1" />
                    <div>
                      <p className="font-semibold text-sm">Add to Existing Intent</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Add this question as a training example to an existing intent
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#4880FF] transition">
                    <input type="radio" name="training-method" className="mt-1" />
                    <div>
                      <p className="font-semibold text-sm">Create New Intent</p>
                      <p className="text-xs text-gray-600 mt-1">Create a new intent from this question</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Select Existing Intent */}
              <div>
                <label className="block text-sm font-semibold mb-2">Select Intent</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]">
                  <option>ask_return_policy</option>
                  <option>ask_shipping_policy</option>
                  <option>ask_payment_methods</option>
                  <option>ask_size_guide</option>
                  <option>Create New...</option>
                </select>
              </div>

              {/* Bot Response */}
              <div>
                <label className="block text-sm font-semibold mb-2">Bot Response *</label>
                <p className="text-xs text-gray-600 mb-3">
                  Write the response that the bot should give for this question
                </p>
                <textarea
                  rows={5}
                  required
                  placeholder="Our return policy allows returns within 30 days of purchase..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                ></textarea>
              </div>

              {/* Additional Training Examples */}
              <div>
                <label className="block text-sm font-semibold mb-2">Add Similar Questions (Optional)</label>
                <p className="text-xs text-gray-600 mb-3">Add more ways users might ask this question</p>
                <textarea
                  rows={4}
                  placeholder="Can I return items after 45 days?&#10;What's the return timeframe?&#10;How long do I have to return?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] font-mono text-sm"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Question added to training data! Bot will be retrained.');
                    setShowTrainModal(false);
                  }}
                >
                  <Save className="w-5 h-5" />
                  Save & Retrain Bot
                </button>
                <button
                  type="button"
                  onClick={() => setShowTrainModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
