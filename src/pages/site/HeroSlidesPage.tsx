import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Plus, Edit, Trash2, Tv } from 'lucide-react';
import { getUploadUrl } from '../../lib/uploads';

export function HeroSlidesPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [badge, setBadge] = useState('Unit Pendidikan');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('/uploads/gallery/pesantren6.png');
  const [href, setHref] = useState('/pesantren');
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useUI();

  const loadSlides = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/site/slides');
      if (res?.data) setSlides(res.data);
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat slides banner', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setBadge('Unit Pendidikan');
    setTitle('');
    setSubtitle('');
    setImageUrl('/uploads/gallery/pesantren6.png');
    setHref('/pesantren');
    setModalOpen(true);
  };

  const handleOpenEdit = (s: any) => {
    setEditId(s.id);
    setBadge(s.badge || 'Unit Pendidikan');
    setTitle(s.title);
    setSubtitle(s.subtitle || '');
    setImageUrl(s.imageUrl || '/uploads/gallery/pesantren6.png');
    setHref(s.href || '/pesantren');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = { badge, title, subtitle, imageUrl, href };
      if (editId) {
        await apiClient.put(`/admin/site/slides/${editId}`, payload);
        addToast('Slide banner berhasil diperbarui', 'success');
      } else {
        await apiClient.post('/admin/site/slides', payload);
        addToast('Slide banner baru berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      loadSlides();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan slide', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus slide "${title}"?`)) return;
    try {
      await apiClient.delete(`/admin/site/slides/${id}`);
      addToast('Slide berhasil dihapus', 'success');
      loadSlides();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus slide', 'error');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Banner Hero',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-20 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-[#DDE6F1]">
            <img src={getUploadUrl(s.imageUrl)} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D8232A] uppercase tracking-wider">
              {s.badge}
            </span>
            <h4 className="font-bold text-[#0B2F6B] text-xs">{s.title}</h4>
            <p className="text-[11px] text-[#64748B] line-clamp-1">{s.subtitle}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Tautan Tujuan',
      accessor: 'href',
      className: 'font-mono text-xs text-[#1F5FD0]'
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(s)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B2F6B] hover:bg-gray-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(s.id, s.title)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Hero Slides Banner' }]} />

      <DataTable
        title="Slider Banner Beranda"
        description="Kelola gambar dan teks banner utama yang berputar di halaman depan website."
        columns={columns}
        data={slides}
        isLoading={isLoading}
        actionButton={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Slide</span>
          </button>
        }
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Slide Banner' : 'Tambah Slide Banner Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Badge Teks</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Unit Pendidikan / PPDB"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Link Tujuan (URL)</label>
              <input
                type="text"
                value={href}
                onChange={(e) => setHref(e.target.value)}
                placeholder="/pesantren atau /ppdb"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Judul Utama Slide</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Pesantren Cendekia Amanah"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Sub-judul / Deskripsi Singkat</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Mencetak Generasi Qurani, Berprestasi, Berjiwa Pemimpin"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            category="gallery"
            label="Foto Background Banner (Rasio Landscape Lebar)"
          />

          <div className="pt-3 border-t border-[#DDE6F1] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0]"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Slide'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
