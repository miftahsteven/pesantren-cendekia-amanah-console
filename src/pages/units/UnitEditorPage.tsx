import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Save, ArrowLeft } from 'lucide-react';

export function UnitEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useUI();

  const [unit, setUnit] = useState<any>(null);
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [badge, setBadge] = useState('');
  const [tagline, setTagline] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [profileTitle, setProfileTitle] = useState('');
  const [profileBodyText, setProfileBodyText] = useState('');
  const [curriculumBodyText, setCurriculumBodyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadUnit() {
      try {
        setIsLoading(true);
        const res: any = await apiClient.get('/admin/units');
        if (res?.data) {
          const found = res.data.find((u: any) => u.id === id);
          if (found) {
            setUnit(found);
            setName(found.name || '');
            setShortName(found.shortName || '');
            setBadge(found.badge || '');
            setTagline(found.tagline || '');
            setHeroImage(found.heroImage || '');
            setProfileTitle(found.profileTitle || '');
            setProfileBodyText(Array.isArray(found.profileBody) ? found.profileBody.join('\n\n') : '');
            setCurriculumBodyText(Array.isArray(found.curriculumBody) ? found.curriculumBody.join('\n') : '');
          }
        }
      } catch (err: any) {
        addToast(err.message || 'Gagal memuat unit', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadUnit();
  }, [id]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const profileBody = profileBodyText.split('\n\n').map((p) => p.trim()).filter(Boolean);
      const curriculumBody = curriculumBodyText.split('\n').map((p) => p.trim()).filter(Boolean);

      await apiClient.put(`/admin/units/${id}`, {
        name,
        shortName,
        badge,
        tagline,
        heroImage,
        profileTitle,
        profileBody,
        curriculumBody
      });

      addToast('Data unit pendidikan berhasil disimpan', 'success');
      navigate('/units');
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan unit', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !unit) {
    return <div className="p-8 text-center animate-pulse">Memuat data unit...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs
        items={[
          { label: 'Unit Pendidikan', href: '/units' },
          { label: `Edit ${unit.name}` }
        ]}
      />

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/units')}
          className="text-xs font-semibold text-[#64748B] hover:text-[#0B2F6B] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Unit</span>
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left General Info */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white p-6 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0B2F6B] uppercase tracking-wider border-b border-[#DDE6F1] pb-2.5">
              Informasi Umum & Identitas Jenjang
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1A293B]">Nama Lengkap Unit</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1A293B]">Nama Singkat / Subtitle</label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1A293B]">Badge Jenjang</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Contoh: Boarding Pesantren / Fullday"
                  className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1A293B]">Tagline Singkat</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">
                Deskripsi Profil <span className="text-[10px] text-[#64748B]">(Pisahkan antar paragraf dengan 2 kali enter)</span>
              </label>
              <textarea
                value={profileBodyText}
                onChange={(e) => setProfileBodyText(e.target.value)}
                rows={5}
                className="w-full p-3 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">
                Poin-Poin Kurikulum Unggulan <span className="text-[10px] text-[#64748B]">(1 baris per poin)</span>
              </label>
              <textarea
                value={curriculumBodyText}
                onChange={(e) => setCurriculumBodyText(e.target.value)}
                rows={5}
                placeholder="Tahfidz Al-Qur’an Bersanad&#10;Bahasa Arab & Kitab Kuning&#10;Leadership & Karakter Mandiri"
                className="w-full p-3 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>
        </div>

        {/* Right Hero Image Box */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white p-6 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#0B2F6B] uppercase tracking-wider border-b border-[#DDE6F1] pb-2.5">
              Foto Hero Banner Unit
            </h3>
            <ImageUploader
              value={heroImage}
              onChange={setHeroImage}
              category="gallery"
              label=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
