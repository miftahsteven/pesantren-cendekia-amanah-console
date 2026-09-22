import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Save, User, MapPin, Globe, Sparkles, Video } from 'lucide-react';
import { SiteSetting } from '../../types';

export function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [siteName, setSiteName] = useState('');
  const [siteTagline, setSiteTagline] = useState('');
  const [subTagline, setSubTagline] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [motto, setMotto] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderRole, setLeaderRole] = useState('');
  const [leaderTitle, setLeaderTitle] = useState('');
  const [leaderPhotoUrl, setLeaderPhotoUrl] = useState('');
  const [leaderQuotesText, setLeaderQuotesText] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [addressText, setAddressText] = useState('');
  const [mapsLink, setMapsLink] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [virtualTourUrl, setVirtualTourUrl] = useState('');

  const { addToast } = useUI();

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const res: any = await apiClient.get('/admin/site/settings');
        if (res?.data) {
          const s = res.data;
          setSettings(s);
          setSiteName(s.siteName || '');
          setSiteTagline(s.siteTagline || '');
          setSubTagline(s.subTagline || '');
          setSiteDescription(s.siteDescription || '');
          setMotto(s.motto || '');
          setLeaderName(s.leaderName || '');
          setLeaderRole(s.leaderRole || '');
          setLeaderTitle(s.leaderTitle || '');
          setLeaderPhotoUrl(s.leaderPhotoUrl || '');
          setLeaderQuotesText(Array.isArray(s.leaderQuotes) ? s.leaderQuotes.join('\n\n') : '');
          setPhone(s.phone || '');
          setWhatsapp(s.whatsapp || '');
          setEmail(s.email || '');
          setAddressText(s.addressText || '');
          setMapsLink(s.mapsLink || '');
          setLogoUrl(s.logoUrl || '');
          setVirtualTourUrl(s.virtualTourUrl || '');
        }
      } catch (err: any) {
        addToast(err.message || 'Gagal memuat pengaturan website', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const leaderQuotes = leaderQuotesText.split('\n\n').map((q) => q.trim()).filter(Boolean);

      await apiClient.put('/admin/site/settings', {
        siteName,
        siteTagline,
        subTagline,
        siteDescription,
        motto,
        leaderName,
        leaderRole,
        leaderTitle,
        leaderPhotoUrl,
        leaderQuotes,
        phone,
        whatsapp,
        email,
        addressText,
        mapsLink,
        virtualTourUrl,
        logoUrl
      });

      addToast('Pengaturan website berhasil disimpan dan diperbarui di website publik', 'success');
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan pengaturan', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return <div className="p-8 text-center animate-pulse">Memuat pengaturan...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-12">
      <Breadcrumbs items={[{ label: 'Pengaturan Website' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0B2F6B]">Pengaturan Utama Website</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Konfigurasi profil pengasuh KH. Cholil Nafis, kontak resmi, alamat sekretariat, dan identitas pesantren.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pengasuh & Sambutan */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0B2F6B] uppercase tracking-wider flex items-center gap-2 border-b border-[#DDE6F1] pb-2.5">
              <User className="w-4 h-4 text-[#1F5FD0]" />
              <span>Profil Pengasuh Pesantren</span>
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Nama Lengkap Pengasuh</label>
              <input
                type="text"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] font-bold text-[#0B2F6B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Jabatan / Peran di Pesantren</label>
              <input
                type="text"
                value={leaderRole}
                onChange={(e) => setLeaderRole(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Gelar & Amanah Nasional</label>
              <input
                type="text"
                value={leaderTitle}
                onChange={(e) => setLeaderTitle(e.target.value)}
                placeholder="Ketua MUI Bidang Dakwah & Ukhuwah / Dosen Pascasarjana UI"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <ImageUploader
              value={leaderPhotoUrl}
              onChange={setLeaderPhotoUrl}
              category="guru"
              label="Foto Pengasuh Pesantren (KH. Cholil Nafis)"
              aspectRatio="aspect-3/4 max-w-[220px]"
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">
                Kutipan / Sambutan Pengasuh <span className="text-[10px] text-[#64748B]">(Pisahkan antar paragraf dengan 2 enter)</span>
              </label>
              <textarea
                value={leaderQuotesText}
                onChange={(e) => setLeaderQuotesText(e.target.value)}
                rows={5}
                className="w-full p-3 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Kontak & Identitas */}
        <div className="lg:col-span-6 space-y-6">
          {/* Identitas Website */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0B2F6B] uppercase tracking-wider flex items-center gap-2 border-b border-[#DDE6F1] pb-2.5">
              <Sparkles className="w-4 h-4 text-[#F0BD28]" />
              <span>Identitas Lembaga</span>
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Nama Lembaga</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Tagline Utama</label>
              <input
                type="text"
                value={siteTagline}
                onChange={(e) => setSiteTagline(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Motto Pesantren</label>
              <input
                type="text"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          {/* Kontak & Sekretariat */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0B2F6B] uppercase tracking-wider flex items-center gap-2 border-b border-[#DDE6F1] pb-2.5">
              <MapPin className="w-4 h-4 text-[#D8232A]" />
              <span>Kontak & Lokasi Sekretariat</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1A293B]">No. WhatsApp Resmi</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="6285776446468"
                  className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1A293B]">Email Sekretariat</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Alamat Lengkap Kampus</label>
              <textarea
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Tautan Google Maps</label>
              <input
                type="url"
                value={mapsLink}
                onChange={(e) => setMapsLink(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          {/* Media & Virtual Tour */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0B2F6B] uppercase tracking-wider flex items-center gap-2 border-b border-[#DDE6F1] pb-2.5">
              <Video className="w-4 h-4 text-[#D8232A]" />
              <span>Video Virtual Tour & Profil Kampus</span>
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">
                URL Video YouTube (Virtual Tour / Profil Pesantren)
              </label>
              <input
                type="url"
                value={virtualTourUrl}
                onChange={(e) => setVirtualTourUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=iv-QsaLtvb8"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
              <p className="text-[11px] text-[#64748B]">
                Tautan video YouTube ini akan otomatis diputar pada modal interaktif ketika pengunjung mengklik tombol <strong>&quot;VIRTUAL TOUR&quot;</strong> atau <strong>&quot;Video Profil&quot;</strong> di landing page website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
