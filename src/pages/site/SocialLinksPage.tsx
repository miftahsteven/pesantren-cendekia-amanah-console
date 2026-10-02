import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Modal } from '../../components/ui/Modal';
import { Share2, ExternalLink, Edit, Plus, Trash2, Save } from 'lucide-react';

export function SocialLinksPage() {
  const [socials, setSocials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSocial, setEditingSocial] = useState<any>(null);

  // Form states
  const [platform, setPlatform] = useState('INSTAGRAM');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [handle, setHandle] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const { addToast } = useUI();

  const loadSocials = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/site/socials');
      if (res?.data) setSocials(res.data);
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat media sosial', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSocials();
  }, []);

  const openCreateModal = () => {
    setEditingSocial(null);
    setPlatform('INSTAGRAM');
    setName('Instagram');
    setUrl('');
    setHandle('');
    setIsActive(true);
    setSortOrder(socials.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (social: any) => {
    setEditingSocial(social);
    setPlatform(social.platform || 'OTHER');
    setName(social.name || '');
    setUrl(social.url || '');
    setHandle(social.handle || '');
    setIsActive(social.isActive !== false);
    setSortOrder(social.sortOrder || 0);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) {
      addToast('Nama platform dan URL wajib diisi', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        platform,
        name,
        url,
        handle,
        isActive,
        sortOrder: Number(sortOrder) || 0
      };

      if (editingSocial) {
        await apiClient.put(`/admin/site/socials/${editingSocial.id}`, payload);
        addToast('Media sosial berhasil diperbarui', 'success');
      } else {
        await apiClient.post('/admin/site/socials', payload);
        addToast('Media sosial berhasil ditambahkan', 'success');
      }

      setIsModalOpen(false);
      loadSocials();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan media sosial', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, socialName: string) => {
    if (!window.confirm(`Yakin ingin menghapus tautan media sosial "${socialName}"?`)) {
      return;
    }

    try {
      await apiClient.delete(`/admin/site/socials/${id}`);
      addToast('Media sosial berhasil dihapus', 'success');
      loadSocials();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus media sosial', 'error');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Platform',
      render: (s) => (
        <div className="flex items-center gap-2 font-bold text-[#0B2F6B]">
          <Share2 className="w-4 h-4 text-[#1F5FD0]" />
          <div>
            <span>{s.name || s.platform}</span>
            {s.handle && (
              <span className="block text-[11px] font-normal text-[#64748B]">{s.handle}</span>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Tautan URL',
      render: (s) => (
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#1F5FD0] hover:underline flex items-center gap-1 max-w-xs truncate"
        >
          <span className="truncate">{s.url}</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        </a>
      )
    },
    {
      header: 'Status',
      render: (s) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            s.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {s.isActive !== false ? 'Aktif' : 'Nonaktif'}
        </span>
      )
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openEditModal(s)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B2F6B] hover:bg-gray-100 transition-colors"
            title="Edit Media Sosial"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(s.id, s.name || s.platform)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Media Sosial"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Media Sosial' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0B2F6B]">Tautan Media Sosial</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Kelola tautan akun media sosial resmi pesantren yang tampil pada header dan footer website.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B2F6B] hover:bg-[#1A4FA0] text-white text-xs font-bold transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Media Sosial</span>
        </button>
      </div>

      <DataTable
        title="Daftar Akun Media Sosial"
        columns={columns}
        data={socials}
        isLoading={isLoading}
      />

      {/* Edit / Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSocial ? 'Edit Media Sosial' : 'Tambah Media Sosial'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0B2F6B] mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => {
                setPlatform(e.target.value);
                if (!name || name === 'Instagram' || name === 'Facebook' || name === 'YouTube' || name === 'TikTok' || name === 'Twitter / X' || name === 'LinkedIn') {
                  const names: Record<string, string> = {
                    INSTAGRAM: 'Instagram',
                    FACEBOOK: 'Facebook',
                    YOUTUBE: 'YouTube',
                    TIKTOK: 'TikTok',
                    TWITTER: 'Twitter / X',
                    LINKEDIN: 'LinkedIn',
                    OTHER: 'Media Sosial Lainnya'
                  };
                  setName(names[e.target.value] || e.target.value);
                }
              }}
              className="w-full px-3 py-2 text-xs border border-[#DDE6F1] rounded-xl focus:outline-none focus:border-[#0B2F6B]"
            >
              <option value="INSTAGRAM">Instagram</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="YOUTUBE">YouTube</option>
              <option value="TIKTOK">TikTok</option>
              <option value="TWITTER">Twitter / X</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="OTHER">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2F6B] mb-1">Nama Tampilan</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Instagram Resmi"
              required
              className="w-full px-3 py-2 text-xs border border-[#DDE6F1] rounded-xl focus:outline-none focus:border-[#0B2F6B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2F6B] mb-1">Tautan URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://instagram.com/username"
              required
              className="w-full px-3 py-2 text-xs border border-[#DDE6F1] rounded-xl focus:outline-none focus:border-[#0B2F6B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2F6B] mb-1">Username / Handle (Opsional)</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@pesantren.cendikia.amanah"
              className="w-full px-3 py-2 text-xs border border-[#DDE6F1] rounded-xl focus:outline-none focus:border-[#0B2F6B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0B2F6B] mb-1">Urutan Tampil</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-[#DDE6F1] rounded-xl focus:outline-none focus:border-[#0B2F6B]"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-[#0B2F6B] border-gray-300 focus:ring-[#0B2F6B]"
              />
              <label htmlFor="isActive" className="text-xs font-medium text-gray-700 cursor-pointer">
                Aktifkan di Website
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B2F6B] hover:bg-[#1A4FA0] text-white text-xs font-bold transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
