import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { getUploadUrl } from '../../lib/uploads';
import { Sparkles, Save, CheckCircle2, ArrowRight, ShieldCheck, Eye } from 'lucide-react';

export function PPDBBannerPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [badge, setBadge] = useState('Kuota Terbatas — Gelombang II');
  const [title, setTitle] = useState('PENERIMAAN PESERTA DIDIK BARU');
  const [academicYear, setAcademicYear] = useState('Tahun Ajaran 2027/2028 (Pesantren, SMP, SMA, Diniyah)');
  const [description, setDescription] = useState(
    'Bergabunglah bersama keluarga besar Pesantren Cendekia Amanah. Dapatkan bimbingan tahfidz bersanad, kurikulum terpadu nasional, serta pembinaan kepemimpinan islami sejak dini.'
  );

  const [feature1, setFeature1] = useState('Sistem Pendaftaran Online 3 Langkah');
  const [feature2, setFeature2] = useState('Tersedia Beasiswa Tahfidz & Prestasi');
  const [feature3, setFeature3] = useState('Pilihan Program Boarding / Fullday');
  const [feature4, setFeature4] = useState('Konfirmasi Cepat via WhatsApp 24 Jam');

  const [primaryCtaText, setPrimaryCtaText] = useState('DAFTAR SEKARANG');
  const [primaryCtaUrl, setPrimaryCtaUrl] = useState('/ppdb');
  const [secondaryCtaText, setSecondaryCtaText] = useState('Alur & Panduan Pendaftaran');
  const [secondaryCtaUrl, setSecondaryCtaUrl] = useState('/kontak');

  const [imageUrl, setImageUrl] = useState('/images/galery/sma8.png');
  const [captionTitle, setCaptionTitle] = useState('Cendekia Amanah');
  const [captionSubtitle, setCaptionSubtitle] = useState('Generasi Qurani & Berprestasi');
  const [isActive, setIsActive] = useState(true);

  const { addToast } = useUI();

  useEffect(() => {
    async function loadBannerData() {
      try {
        setIsLoading(true);
        const res: any = await apiClient.get('/admin/site/ppdb-banner');
        if (res?.data) {
          const b = res.data;
          setBadge(b.badge || 'Kuota Terbatas — Gelombang II');
          setTitle(b.title || 'PENERIMAAN PESERTA DIDIK BARU');
          setAcademicYear(b.academicYear || 'Tahun Ajaran 2027/2028 (Pesantren, SMP, SMA, Diniyah)');
          setDescription(b.description || '');

          const feats = Array.isArray(b.features) ? b.features : [];
          setFeature1(feats[0] || 'Sistem Pendaftaran Online 3 Langkah');
          setFeature2(feats[1] || 'Tersedia Beasiswa Tahfidz & Prestasi');
          setFeature3(feats[2] || 'Pilihan Program Boarding / Fullday');
          setFeature4(feats[3] || 'Konfirmasi Cepat via WhatsApp 24 Jam');

          setPrimaryCtaText(b.primaryCtaText || 'DAFTAR SEKARANG');
          setPrimaryCtaUrl(b.primaryCtaUrl || '/ppdb');
          setSecondaryCtaText(b.secondaryCtaText || 'Alur & Panduan Pendaftaran');
          setSecondaryCtaUrl(b.secondaryCtaUrl || '/kontak');

          setImageUrl(b.imageUrl || '/images/galery/sma8.png');
          setCaptionTitle(b.captionTitle || 'Cendekia Amanah');
          setCaptionSubtitle(b.captionSubtitle || 'Generasi Qurani & Berprestasi');
          setIsActive(b.isActive !== undefined ? b.isActive : true);
        }
      } catch (err: any) {
        addToast(err.message || 'Gagal memuat data banner PPDB', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadBannerData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = {
        badge,
        title,
        academicYear,
        description,
        features: [feature1, feature2, feature3, feature4].filter(Boolean),
        primaryCtaText,
        primaryCtaUrl,
        secondaryCtaText,
        secondaryCtaUrl,
        imageUrl,
        captionTitle,
        captionSubtitle,
        isActive
      };

      await apiClient.put('/admin/site/ppdb-banner', payload);
      addToast('Banner PPDB beranda berhasil diperbarui!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan perubahan banner PPDB', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-3 border-[#0B2F6B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Breadcrumbs items={[{ label: 'Pengaturan Web' }, { label: 'Banner PPDB (Beranda)' }]} />

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
      </div>

      {/* Live Preview Box */}
      <div className="bg-white rounded-2xl border border-[#DDE6F1] p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0B2F6B]">
          <Eye className="w-4 h-4 text-[#1F5FD0]" />
          <span>Pratinjau Banner Beranda (Tampilan Publik)</span>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-[#0B2F6B] via-[#1A4FA0] to-[#0B2F6B] border border-[#12377E] text-white p-6 sm:p-8">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8232A] text-white text-[11px] font-black tracking-wider uppercase shadow-xs">
                <Sparkles className="w-3 h-3" />
                <span>{badge || 'Badge Kosong'}</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                  {title || 'Judul PPDB'}
                </h3>
                <p className="text-sm font-bold text-[#F0BD28]">
                  {academicYear || 'Tahun Ajaran'}
                </p>
              </div>

              <p className="text-xs text-white/85 max-w-xl leading-relaxed">
                {description || 'Deskripsi singkat PPDB...'}
              </p>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-w-lg mx-auto lg:mx-0 text-left">
                {[feature1, feature2, feature3, feature4].filter(Boolean).map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-semibold text-white/95">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FCA5A5] shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs text-[#0B2F6B] bg-[#F0BD28] shadow-md">
                  <span>{primaryCtaText || 'DAFTAR SEKARANG'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full font-bold text-xs text-white bg-white/15 border border-white/30 backdrop-blur-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FCA5A5]" />
                  <span>{secondaryCtaText || 'Panduan'}</span>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="lg:col-span-4 hidden lg:flex justify-center">
              <div className="relative w-48 h-56 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-white/10">
                <img
                  src={getUploadUrl(imageUrl)}
                  alt="Ilustrasi"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2F6B]/90 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-center p-2 rounded-xl bg-white/95 backdrop-blur-md text-[#0B2F6B] shadow-xs">
                  <span className="text-[11px] font-black block">{captionTitle}</span>
                  <span className="text-[9px] text-[#D8232A] font-bold block">{captionSubtitle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Teks Utama */}
        <div className="bg-white rounded-2xl border border-[#DDE6F1] p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0B2F6B] border-b border-[#F4F7FB] pb-2">
            1. Konten Teks Banner
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Badge / Label Atas</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                required
                placeholder="Kuota Terbatas — Gelombang II"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Tahun Ajaran / Sub-judul Kuning</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                required
                placeholder="Tahun Ajaran 2027/2028 (Pesantren, SMP, SMA, Diniyah)"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Judul Utama</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="PENERIMAAN PESERTA DIDIK BARU"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Deskripsi Singkat</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              placeholder="Tuliskan ajakan dan keunggulan pesantren..."
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>
        </div>

        {/* Card 2: 4 Poin Checklist */}
        <div className="bg-white rounded-2xl border border-[#DDE6F1] p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0B2F6B] border-b border-[#F4F7FB] pb-2">
            2. Poin Keunggulan / Checklist (4 Poin)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Poin 1</label>
              <input
                type="text"
                value={feature1}
                onChange={(e) => setFeature1(e.target.value)}
                placeholder="Sistem Pendaftaran Online 3 Langkah"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Poin 2</label>
              <input
                type="text"
                value={feature2}
                onChange={(e) => setFeature2(e.target.value)}
                placeholder="Tersedia Beasiswa Tahfidz & Prestasi"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Poin 3</label>
              <input
                type="text"
                value={feature3}
                onChange={(e) => setFeature3(e.target.value)}
                placeholder="Pilihan Program Boarding / Fullday"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Poin 4</label>
              <input
                type="text"
                value={feature4}
                onChange={(e) => setFeature4(e.target.value)}
                placeholder="Konfirmasi Cepat via WhatsApp 24 Jam"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Tombol Aksi (CTA) */}
        <div className="bg-white rounded-2xl border border-[#DDE6F1] p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0B2F6B] border-b border-[#F4F7FB] pb-2">
            3. Tombol Aksi (CTA)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Teks Tombol Utama (Kuning)</label>
              <input
                type="text"
                value={primaryCtaText}
                onChange={(e) => setPrimaryCtaText(e.target.value)}
                placeholder="DAFTAR SEKARANG"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Link / URL Tombol Utama</label>
              <input
                type="text"
                value={primaryCtaUrl}
                onChange={(e) => setPrimaryCtaUrl(e.target.value)}
                placeholder="/ppdb"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Teks Tombol Sekunder (Transparan)</label>
              <input
                type="text"
                value={secondaryCtaText}
                onChange={(e) => setSecondaryCtaText(e.target.value)}
                placeholder="Alur & Panduan Pendaftaran"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Link / URL Tombol Sekunder</label>
              <input
                type="text"
                value={secondaryCtaUrl}
                onChange={(e) => setSecondaryCtaUrl(e.target.value)}
                placeholder="/kontak"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Gambar & Caption Kanan */}
        <div className="bg-white rounded-2xl border border-[#DDE6F1] p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0B2F6B] border-b border-[#F4F7FB] pb-2">
            4. Foto Ilustrasi & Caption (Sisi Kanan)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Judul Caption Foto</label>
              <input
                type="text"
                value={captionTitle}
                onChange={(e) => setCaptionTitle(e.target.value)}
                placeholder="Cendekia Amanah"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Sub-judul Caption Foto (Merah)</label>
              <input
                type="text"
                value={captionSubtitle}
                onChange={(e) => setCaptionSubtitle(e.target.value)}
                placeholder="Generasi Qurani & Berprestasi"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            category="gallery"
            label="Foto Ilustrasi Santri / Kelas"
            aspectRatio="aspect-[4/5] w-36 h-44"
          />
        </div>

        {/* Bottom Save Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan Perubahan...' : 'Simpan Pengaturan Banner PPDB'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
export default PPDBBannerPage;
