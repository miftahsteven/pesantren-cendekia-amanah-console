import React, { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { apiClient } from '../../lib/api-client';
import { getUploadUrl } from '../../lib/uploads';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  category?: 'news' | 'gallery' | 'units' | 'partners' | 'guru' | 'common' | 'bisnis' | 'avatars' | 'logo';
  label?: string;
  aspectRatio?: string;
}

export function ImageUploader({
  value,
  onChange,
  category = 'news',
  label = 'Foto / Gambar Utama',
  aspectRatio = 'aspect-video'
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res: any = await apiClient.post(`/upload/image?category=${category}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res && res.data?.url) {
        onChange(res.data.url);
      }
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah file gambar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-[#1A293B]">{label}</label>}

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
      />

      {value ? (
        <div className="relative rounded-xl border border-[#DDE6F1] overflow-hidden bg-gray-50 group">
          <div className={`w-full ${aspectRatio} relative`}>
            <img
              src={getUploadUrl(value)}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[#0B2F6B] hover:bg-gray-100 shadow-md transition-colors"
            >
              Ganti Foto
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md transition-colors"
              title="Hapus Foto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-[#1F5FD0] bg-[#EBF3FF]'
              : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#1F5FD0] hover:bg-white'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-[#EBF3FF] text-[#1F5FD0] flex items-center justify-center mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-[#0B2F6B]">
            {isUploading ? 'Sedang mengunggah...' : 'Klik atau seret foto ke sini'}
          </p>
          <p className="text-[10px] text-[#64748B] mt-0.5">PNG, JPG, WEBP atau SVG (Maks. 10 MB)</p>
        </div>
      )}
    </div>
  );
}
