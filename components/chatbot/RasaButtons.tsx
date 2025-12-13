import { RasaButton } from '@/lib/types/chat';

interface RasaButtonsProps {
    buttons: RasaButton[];
    disabled?: boolean;
    onButtonClick: (button: RasaButton) => void;
}

export default function RasaButtons({ buttons, disabled, onButtonClick }: RasaButtonsProps) {
    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {buttons.map((button, index) => (
                <button
                    key={index}
                    onClick={() => onButtonClick(button)}
                    disabled={disabled}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300"
                >
                    {button.title}
                </button>
            ))}
        </div>
    );
}
