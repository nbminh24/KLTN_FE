import { Check, Package, Truck, Home, Clock } from 'lucide-react';
import Link from 'next/link';
import { OrderStatusCustomData } from '@/lib/types/chat';

interface OrderTimelineProps {
    data: OrderStatusCustomData;
}

export default function OrderTimeline({ data }: OrderTimelineProps) {
    const getStepIcon = (status: string, completed: boolean, current: boolean) => {
        const iconClass = `w-5 h-5 ${completed || current ? 'text-white' : 'text-gray-400'}`;

        switch (status.toLowerCase()) {
            case 'pending':
                return <Clock className={iconClass} />;
            case 'processing':
                return <Package className={iconClass} />;
            case 'shipped':
                return <Truck className={iconClass} />;
            case 'delivered':
                return <Home className={iconClass} />;
            default:
                return <Check className={iconClass} />;
        }
    };

    return (
        <div className="my-2 bg-white border border-gray-200 rounded-lg p-4">
            {/* Header */}
            <div className="mb-4">
                <h4 className="font-bold text-gray-900">Đơn hàng #{data.order_code}</h4>
                {data.tracking_url && (
                    <Link
                        href={data.tracking_url}
                        target="_blank"
                        className="text-xs text-blue-600 hover:underline"
                    >
                        Xem chi tiết →
                    </Link>
                )}
            </div>

            {/* Timeline */}
            <div className="relative">
                {data.steps.map((step, index) => {
                    const isLast = index === data.steps.length - 1;

                    return (
                        <div key={index} className="relative pb-8 last:pb-0">
                            {/* Connector Line */}
                            {!isLast && (
                                <div
                                    className={`absolute left-5 top-11 w-0.5 h-full ${step.completed ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                />
                            )}

                            {/* Step Content */}
                            <div className="flex items-start gap-4">
                                {/* Icon Circle */}
                                <div
                                    className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition ${step.completed
                                            ? 'bg-green-500 border-green-500'
                                            : step.current
                                                ? 'bg-blue-600 border-blue-600 animate-pulse'
                                                : 'bg-gray-200 border-gray-300'
                                        }`}
                                >
                                    {getStepIcon(step.status, step.completed, step.current)}
                                </div>

                                {/* Step Info */}
                                <div className="flex-1 pt-1">
                                    <p
                                        className={`font-semibold text-sm ${step.completed || step.current
                                                ? 'text-gray-900'
                                                : 'text-gray-500'
                                            }`}
                                    >
                                        {step.label}
                                    </p>
                                    {step.date && (
                                        <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                                    )}
                                    {step.current && (
                                        <p className="text-xs text-blue-600 font-semibold mt-1">
                                            ● Đang xử lý
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
