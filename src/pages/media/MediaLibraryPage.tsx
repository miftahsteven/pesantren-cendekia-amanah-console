import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Modal } from '../../components/ui/Modal';
import {
  UploadCloud,
  Copy,
  Trash2,
  Check,
  Search,
  FileText,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { getUploadUrl } from '../../lib/uploads';

export function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTargetCategory, setUploadTargetCategory] = useState<any>('news');
  const [tempUploadedUrl, setTempUploadedUrl] = useState('');

  const { addToast } = useUI();

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);
      if (search) params.append('q', search);

      const res: any = await apiClient.get(`/admin/media?${params.toString()}`);
      if (res?.data) setMediaList(res.data);
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat media library', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [selectedCategory, search]);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    addToast('URL berhasil disalin ke clipboard', 'success');
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDelete = async (url: string, filename: string) => {
    if (!window.confirm(`Hapus permanen file "${filename}"?`)) return;
    try {
      await apiClient.delete(`/admin/media?url=${encodeURIComponent(url)}`);
      addToast('File berhasil dihapus dari storage', 'success');
      loadMedia();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus file', 'error');
    }
  };

  const handleFinishUpload = () => {
    setUploadModalOpen(false);
    setTempUploadedUrl('');
    loadMedia();
  };

  const categories = [
    { key: 'ALL', label: 'Semua Folder' },
    { key: 'news', label: 'Berita (news)' },
    { key: 'gallery', label: 'Galeri (gallery)' },
    { key: 'units', label: 'Unit (units)' },
    { key: 'partners', label: 'Mitra (partners)' },
    { key: 'guru', label: 'Asatidz (guru)' },
    { key: 'logo', label: 'Logo (logo)' },
    { key: 'brochures', label: 'Brosur (brochures)' }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Media Assets Library' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0B2F6B]">Media Assets Library</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Penyimpanan terpusat seluruh aset gambar, foto pimpinan, logo mitra, dan dokumen PDF.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === c.key
                  ? 'bg-[#0B2F6B] text-white shadow-xs'
                  : 'bg-white text-[#64748B] border border-[#DDE6F1] hover:bg-gray-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama file..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
          />
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-36 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      ) : mediaList.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#DDE6F1] text-center text-[#64748B] space-y-2">
          <ImageIcon className="w-10 h-10 mx-auto text-gray-300" />
          <p className="text-sm font-bold text-[#0B2F6B]">Tidak ada file ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaList.map((m) => {
            const isPdf = m.mimeType === 'application/pdf' || m.filename.endsWith('.pdf');
            return (
              <div
                key={m.id}
                className="bg-white rounded-xl border border-[#DDE6F1] overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div className="relative h-28 w-full bg-[#F8FAFC] flex items-center justify-center overflow-hidden">
                  {isPdf ? (
                    <FileText className="w-10 h-10 text-red-500" />
                  ) : (
                    <img
                      src={getUploadUrl(m.url)}
                      alt={m.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Hover Overlay Controls */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                    <button
                      onClick={() => handleCopyUrl(m.url)}
                      className="p-1.5 rounded-lg bg-white text-[#0B2F6B] hover:bg-gray-100 transition-colors"
                      title="Salin URL Gambar"
                    >
                      {copiedUrl === m.url ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={getUploadUrl(m.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white text-[#0B2F6B] hover:bg-gray-100 transition-colors"
                      title="Buka File"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDelete(m.url, m.filename)}
                      className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                      title="Hapus File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-2 space-y-0.5 bg-white">
                  <p className="text-[11px] font-bold text-[#0B2F6B] truncate" title={m.filename}>
                    {m.filename}
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-[#94A3B8]">
                    <span className="uppercase">{m.category}</span>
                    <span>{(m.sizeBytes / 1024).toFixed(0)} KB</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Media Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Aset Baru ke Media Library"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Folder Kategori</label>
            <select
              value={uploadTargetCategory}
              onChange={(e) => setUploadTargetCategory(e.target.value)}
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            >
              <option value="news">news (Foto Berita)</option>
              <option value="gallery">gallery (Galeri Santri & Lingkungan)</option>
              <option value="units">units (Unit Pendidikan & Prestasi)</option>
              <option value="partners">partners (Logo Mitra)</option>
              <option value="guru">guru (Foto Asatidz & Pimpinan)</option>
              <option value="logo">logo (Logo Resmi)</option>
              <option value="common">common (Aset Umum)</option>
            </select>
          </div>

          <ImageUploader
            value={tempUploadedUrl}
            onChange={setTempUploadedUrl}
            category={uploadTargetCategory}
            label="Pilih File Gambar"
          />

          <div className="pt-3 border-t border-[#DDE6F1] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-gray-100"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleFinishUpload}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0]"
            >
              Selesai
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
