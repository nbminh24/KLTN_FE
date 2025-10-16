'use client';

import { useRef, useState } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  onClose?: () => void;
  buttonText?: string;
  showPreview?: boolean;
}

export default function ImageUpload({ 
  onImageSelect, 
  onClose,
  buttonText = 'Upload Image',
  showPreview = true
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setPreview(previewUrl);
        onImageSelect(file, previewUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!preview ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-full hover:bg-gray-200 transition text-sm font-medium"
        >
          <Camera className="w-5 h-5" />
          {buttonText}
        </button>
      ) : (
        showPreview && (
          <div className="relative rounded-2xl overflow-hidden border border-gray-200">
            <div className="relative w-full h-48">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <button
              onClick={handleClearPreview}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      )}
    </div>
  );
}
