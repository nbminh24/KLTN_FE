import { ArrowRight } from 'lucide-react';
import { ButtonsCustomData } from '@/lib/types/chat';

interface ActionButtonsProps {
    data: ButtonsCustomData;
    onButtonClick: (action: string, payload?: any) => void;
}

export default function ActionButtons({ data, onButtonClick }: ActionButtonsProps) {
    const getButtonStyle = (variant?: string) => {
        switch (variant) {
            case 'primary':
                return 'bg-black text-white hover:bg-gray-800 border-black';
            case 'secondary':
                return 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600';
            case 'outline':
                return 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300';
        }
    };

    return (
        <div className="my-2 flex flex-wrap gap-2">
            {data.buttons.map((button, index) => (
                <button
                    key={index}
                    onClick={() => onButtonClick(button.action, button.payload)}
                    className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold text-sm transition
            ${getButtonStyle(button.variant)}
          `}
                >
                    <span>{button.text}</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            ))}
        </div>
    );
}
