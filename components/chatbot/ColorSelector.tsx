import { Check } from 'lucide-react';
import { ColorSelectorCustomData } from '@/lib/types/chat';

interface ColorSelectorProps {
    data: ColorSelectorCustomData;
    onSelect: (color: string) => void;
}

export default function ColorSelector({ data, onSelect }: ColorSelectorProps) {
    return (
        <div className="my-2 bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">
                Chọn màu bạn thích:
            </p>

            <div className="flex flex-wrap gap-3">
                {data.options.map((colorOption) => {
                    const isSelected = data.selected === colorOption.name;
                    const isAvailable = colorOption.available;

                    return (
                        <button
                            key={colorOption.name}
                            onClick={() => isAvailable && onSelect(colorOption.name)}
                            disabled={!isAvailable}
                            className={`
                relative flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold text-sm transition
                ${isSelected
                                    ? 'border-black bg-black text-white'
                                    : isAvailable
                                        ? 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
                                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                }
              `}
                            title={!isAvailable ? 'Màu này hiện hết hàng' : ''}
                        >
                            {/* Color Circle */}
                            {colorOption.hex && (
                                <span
                                    className={`w-5 h-5 rounded-full border-2 ${isSelected ? 'border-white' : 'border-gray-300'}`}
                                    style={{ backgroundColor: colorOption.hex }}
                                />
                            )}

                            {/* Color Name */}
                            <span>{colorOption.name}</span>

                            {/* Check Mark for Selected */}
                            {isSelected && (
                                <Check className="w-4 h-4 ml-1" />
                            )}

                            {/* Out of Stock Badge */}
                            {!isAvailable && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                    Hết
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
