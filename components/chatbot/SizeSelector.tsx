import { Check } from 'lucide-react';
import { SizeSelectorCustomData } from '@/lib/types/chat';

interface SizeSelectorProps {
    data: SizeSelectorCustomData;
    onSelect: (size: string) => void;
}

export default function SizeSelector({ data, onSelect }: SizeSelectorProps) {
    return (
        <div className="my-2 bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">
                Chọn size bạn muốn:
            </p>

            <div className="flex flex-wrap gap-2">
                {data.options.map((size) => {
                    const isSelected = data.selected === size;

                    return (
                        <button
                            key={size}
                            onClick={() => onSelect(size)}
                            className={`
                relative px-4 py-2 rounded-lg border-2 font-semibold text-sm transition
                ${isSelected
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
                                }
              `}
                        >
                            {size}
                            {isSelected && (
                                <Check className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white rounded-full p-0.5" />
                            )}
                        </button>
                    );
                })}
            </div>

            <p className="text-xs text-gray-500 mt-3">
                💡 Bạn có thể <button className="text-blue-600 hover:underline font-semibold">xem bảng size</button> để chọn chính xác hơn.
            </p>
        </div>
    );
}
