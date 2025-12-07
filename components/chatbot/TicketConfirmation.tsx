import { CheckCircle, Copy, Clock } from 'lucide-react';
import { useState } from 'react';
import { TicketCreatedCustomData } from '@/lib/types/chat';

interface TicketConfirmationProps {
    data: TicketCreatedCustomData;
}

export default function TicketConfirmation({ data }: TicketConfirmationProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(data.ticket_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
            case 'urgent':
                return 'bg-red-100 text-red-700 border-red-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'low':
            default:
                return 'bg-green-100 text-green-700 border-green-300';
        }
    };

    return (
        <div className="my-2 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4">
            {/* Success Icon */}
            <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                    <h4 className="font-bold text-gray-900">Yêu cầu hỗ trợ đã được tạo</h4>
                    <p className="text-xs text-gray-600">Chúng tôi sẽ liên hệ bạn sớm nhất</p>
                </div>
            </div>

            {/* Ticket Code */}
            <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Mã ticket của bạn:</p>
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-mono font-bold text-gray-900">
                        #{data.ticket_code}
                    </p>
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-semibold"
                    >
                        <Copy className="w-4 h-4" />
                        <span>{copied ? 'Đã copy!' : 'Copy'}</span>
                    </button>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Subject */}
                <div className="col-span-2 bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Vấn đề:</p>
                    <p className="text-sm font-semibold text-gray-900">{data.subject}</p>
                </div>

                {/* Priority */}
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Độ ưu tiên:</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold border ${getPriorityColor(data.priority)}`}>
                        {data.priority === 'high' ? 'Cao' : data.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                    </span>
                </div>

                {/* Response Time */}
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Thời gian phản hồi:</p>
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-900">
                            {data.estimated_response_time}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                    💡 <strong>Lưu ý:</strong> Vui lòng giữ mã ticket này. Admin sẽ liên hệ qua email hoặc điện thoại trong thời gian sớm nhất.
                </p>
            </div>
        </div>
    );
}
