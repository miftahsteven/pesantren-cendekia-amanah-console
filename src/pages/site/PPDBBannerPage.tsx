import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { getUploadUrl } from '../../lib/uploads';
import {
  Save,
  Eye,
  ExternalLink,
  Link as LinkIcon,
  Info,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export function PPDBBannerPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [imageUrl, setImageUrl] = useState('/uploads/gallery/spmb-banner-2027-2028.jpg');
  const [primaryCtaUrl, setPrimaryCtaUrl] = useState('https://forms.gle/VTSESWSS3CzPFf7C6');
  const [title, setTitle] = useState(
    'SPMB SMP Pesantren Cendekia Amanah Tahun Ajaran 2027/2028'
  );
  const [isActive, setIsActive] = useState(true);

  const { addToast } = useUI();

  useEffect(() => {
    async function loadBannerData() {
      try {
        setIsLoading(true);
        const res: any = await apiClient.get('/admin/site/ppdb-banner');
        if (res?.data) {
          const b = res.data;
          setImageUrl(b.imageUrl || '/uploads/gallery/spmb-banner-2027-2028.jpg');
          setPrimaryCtaUrl(b.primaryCtaUrl || 'https://forms.gle/VTSESWSS3CzPFf7C6');
          setTitle(b.title || 'SPMB SMP Pesantren Cendekia Amanah Tahun Ajaran 2027/2028');
          setIsActive(b.isActive !== undefined ? Boolean(b.isActive) : true);
        }
      } catch (err: any) {
        addToast(err.message || 'Gagal memuat data banner SPMB', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadBannerData();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!imageUrl) {
      addToast('File gambar banner wajib diunggah', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        imageUrl,
        primaryCtaUrl: primaryCtaUrl.trim() || '/ppdb',
        title: title.trim() || 'SPMB Pesantren Cendekia Amanah',
        isActive
      };

      await apiClient.put('/admin/site/ppdb-banner', payload);
      addToast('Banner SPMB beranda berhasil diperbarui!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan perubahan banner SPMB', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const quickPresets = [
    { label: 'SMP PCA Form (Google Form)', url: 'https://forms.gle/VTSESWSS3CzPFf7C6' },
    { label: 'SMA PCA Form (Bitly)', url: 'https://bit.ly/SPMB_SMAPCA_27-28' },
    { label: 'MDTA Form (Google Form)', url: 'https://forms.gle/mBt9EyWuqf76ifsj9' },
    { label: 'Modal Popup Pilihan Unit', url: '#ppdb-modal' },
    { label: 'Halaman Detail PPDB (/ppdb)', url: '/ppdb' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <div className="w-8 h-8 border-3 border-[#0B2F6B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Breadcrumbs items={[{ label: 'Pengaturan Web' }, { label: 'Banner SPMB (Beranda)' }]} />

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
      </div>

      {/* Standar Ukuran Banner Card */}
      <div className="bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/60 rounded-2xl border border-blue-100 p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#0B2F6B] text-white shrink-0 shadow-xs">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-xs text-gray-700">
            <h3 className="font-bold text-sm text-[#0B2F6B]">
              Standar Ukuran Banner Yayasan: 1024 × 256 Piksel (Rasio 4:1)
            </h3>
            <p className="leading-relaxed text-gray-600">
              Sesuai instruksi yayasan, format section SPMB di bagian bawah beranda menggunakan <strong>gambar banner penuh (single banner image)</strong>. 
              Pastikan gambar yang diunggah memiliki proporsi lanskap <strong>4:1</strong> (contoh: <code>1024 × 256 px</code>, <code>1536 × 384 px</code>, atau <code>2048 × 512 px</code>) agar tampil proporsional, tajam, dan tidak terpotong.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#0B2F6B] font-semibold">
              <span className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-blue-100">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Rasio: 4:1
              </span>
              <span className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-blue-100">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Resolusi Standar: 1024 × 256 px
              </span>
              <span className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-blue-100">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Format: JPG / PNG / WebP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="bg-white rounded-2xl border border-[#DDE6F1] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F4F7FB] pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B2F6B]">
            <Eye className="w-4 h-4 text-[#1F5FD0]" />
            <span>Pratinjau Banner di Halaman Beranda (Tampilan Publik)</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {isActive ? 'Aktif di Beranda' : 'Disembunyikan'}
            </span>
          </div>
        </div>

        {/* Live Banner Container matching 4:1 Aspect Ratio */}
        <div className="space-y-3">
          <div className="relative w-full aspect-[4/1] rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-slate-900 group">
            {imageUrl ? (
              <img
                src={getUploadUrl(imageUrl)}
                alt={title || 'Pratinjau Banner SPMB'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                <Sparkles className="w-8 h-8 text-gray-300 mb-2" />
                <span className="text-xs font-medium">Belum ada gambar banner yang diunggah</span>
              </div>
            )}

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />

            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#0B2F6B] text-[11px] font-bold shadow-md pointer-events-none">
              <span>Buka Formulir</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs text-gray-500">
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-gray-700">Tautan Tujuan:</span>
              <code className="bg-gray-100 text-blue-700 px-2 py-0.5 rounded-md text-[11px] font-mono truncate max-w-[320px] sm:max-w-[450px]">
                {primaryCtaUrl || '/ppdb'}
              </code>
            </div>

            {primaryCtaUrl && (
              <a
                href={primaryCtaUrl.startsWith('#') ? '#' : primaryCtaUrl}
                target={primaryCtaUrl.startsWith('http') ? '_blank' : undefined}
                rel={primaryCtaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1F5FD0] hover:underline shrink-0"
              >
                <span>Uji Buka Form / Tautan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-[#DDE6F1] p-5 sm:p-6 shadow-xs space-y-6">
          <div className="border-b border-[#F4F7FB] pb-3">
            <h3 className="text-sm font-bold text-[#0B2F6B]">
              Form Pengaturan Banner SPMB
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Upload banner dan tentukan link formulir PPDB terbaru untuk diarahkan saat pengunjung mengklik banner.
            </p>
          </div>

          {/* 1. Upload Banner Image */}
          <div className="space-y-2">
            <ImageUploader
              value={imageUrl}
              onChange={setImageUrl}
              category="gallery"
              label="1. File Gambar Banner (Rasio 4:1 / Standar Yayasan 1024 × 256 px)"
              aspectRatio="aspect-[4/1] max-w-2xl"
            />
            <p className="text-[11px] text-gray-500">
              Format yang didukung: JPG, PNG, WebP. Banner akan tampil secara penuh pada lebar layar beranda.
            </p>
          </div>

          {/* 2. Target URL */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1A293B]">
                2. Tautan Formulir PPDB Saat Banner Diklik (URL Tujuan)
              </label>
              <p className="text-[11px] text-gray-500">
                Masukkan tautan formulir pendaftaran PPDB (Google Form, Bitly, atau internal). Pengunjung yang mengklik banner di beranda akan langsung membuka tautan ini.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={primaryCtaUrl}
                onChange={(e) => setPrimaryCtaUrl(e.target.value)}
                required
                placeholder="https://forms.gle/... atau https://bit.ly/..."
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] font-mono"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-gray-600 block">
                Pilihan Cepat (Klik untuk menerapkan):
              </span>
              <div className="flex flex-wrap gap-2">
                {quickPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrimaryCtaUrl(preset.url)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border cursor-pointer ${
                      primaryCtaUrl === preset.url
                        ? 'bg-[#0B2F6B] text-white border-[#0B2F6B]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Title (Alt Text) */}
          <div className="space-y-1.5 pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-[#1A293B]">
              3. Judul Banner / Keterangan Alt (Untuk SEO & Aksesibilitas)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="SPMB SMP Pesantren Cendekia Amanah Tahun Ajaran 2027/2028"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
            <p className="text-[11px] text-gray-500">
              Digunakan sebagai judul tooltip dan deskripsi gambar bagi mesin pencari (Google).
            </p>
          </div>

          {/* 4. Active Status Toggle */}
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-[#0B2F6B] rounded-sm focus:ring-[#0B2F6B]"
              />
              <div>
                <span className="text-xs font-bold text-[#1A293B] block">
                  Tampilkan Banner SPMB di Halaman Beranda
                </span>
                <span className="text-[11px] text-gray-500 block">
                  Jika dinonaktifkan, section banner ini tidak akan muncul pada halaman beranda website.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan Perubahan...' : 'Simpan Pengaturan Banner SPMB'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default PPDBBannerPage;
