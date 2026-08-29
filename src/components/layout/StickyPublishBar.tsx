import React from 'react';
import { Save, Globe, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StickyPublishBarProps {
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  onStatusChange: (status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => void;
  onSave: () => void;
  isSaving?: boolean;
  backHref?: string;
}

export function StickyPublishBar({
  status,
  onStatusChange,
  onSave,
  isSaving = false,
  backHref
}: StickyPublishBarProps) {
  const navigate = useNavigate();

  return (
    <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-[#DDE6F1] px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        {backHref && (
          <button
            type="button"
            onClick={() => navigate(backHref)}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0B2F6B] hover:bg-gray-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 bg-[#F4F7FB] p-1 rounded-xl border border-[#DDE6F1]">
          <button
            type="button"
            onClick={() => onStatusChange('DRAFT')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              status === 'DRAFT'
                ? 'bg-[#FEF8E8] text-[#D4A31C] shadow-xs'
                : 'text-[#64748B] hover:text-[#1A293B]'
            }`}
          >
            Draft
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('PUBLISHED')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              status === 'PUBLISHED'
                ? 'bg-[#FDE8E9] text-[#D8232A] shadow-xs'
                : 'text-[#64748B] hover:text-[#1A293B]'
            }`}
          >
            Published
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('ARCHIVED')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              status === 'ARCHIVED'
                ? 'bg-[#FEECEC] text-[#D8232A] shadow-xs'
                : 'text-[#64748B] hover:text-[#1A293B]'
            }`}
          >
            Arsip
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#1F5FD0] hover:bg-[#12377E] disabled:opacity-50 shadow-sm hover:shadow-md transition-all"
        >
          {status === 'PUBLISHED' ? <Globe className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Menyimpan...' : status === 'PUBLISHED' ? 'Terbitkan Sekarang' : 'Simpan Perubahan'}</span>
        </button>
      </div>
    </div>
  );
}
