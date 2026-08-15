import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Plus, Edit, Trash2, Quote } from 'lucide-react';
import { getUploadUrl } from '../../lib/uploads';

export function TestimonialListPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState('Orang Tua Santri');
  const [content, setContent] = useState('');
  const [avatar, setAvatar] = useState('/uploads/guru/guru5.png');
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useUI();

  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/testimonials');
      if (res?.data) setTestimonials(res.data);
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat testimoni', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setAuthor('');
    setRole('');
    setCategory('Orang Tua Santri');
    setContent('');
    setAvatar('/uploads/guru/guru5.png');
    setModalOpen(true);
  };

  const handleOpenEdit = (t: any) => {
    setEditId(t.id);
    setAuthor(t.author);
    setRole(t.role);
    setCategory(t.category || 'Orang Tua Santri');
    setContent(t.content);
    setAvatar(t.avatar || '/uploads/guru/guru5.png');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = { author, role, category, content, avatar };
      if (editId) {
        await apiClient.put(`/admin/testimonials/${editId}`, payload);
        addToast('Testimoni berhasil diperbarui', 'success');
      } else {
        await apiClient.post('/admin/testimonials', payload);
        addToast('Testimoni baru berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      loadTestimonials();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan testimoni', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Hapus testimoni dari "${name}"?`)) return;
    try {
      await apiClient.delete(`/admin/testimonials/${id}`);
      addToast('Testimoni berhasil dihapus', 'success');
      loadTestimonials();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus testimoni', 'error');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Tokoh / Orang Tua',
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-[#DDE6F1]">
            <img src={getUploadUrl(t.avatar)} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-bold text-[#0B2F6B]">{t.author}</h4>
            <p className="text-xs text-[#64748B]">{t.role}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Isi Testimoni',
      render: (t) => <p className="text-xs text-[#1A293B] line-clamp-2 italic">"{t.content}"</p>
    },
    {
      header: 'Kategori',
      accessor: 'category',
      className: 'text-[#64748B]'
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (t) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(t)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B2F6B] hover:bg-gray-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(t.id, t.author)}
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
      <Breadcrumbs items={[{ label: 'Testimoni' }]} />

      <DataTable
        title="Testimoni Tokoh & Wali Santri"
        description="Kelola ulasan dan apresiasi dari tokoh masyarakat, ulama, dan para orang tua santri."
        columns={columns}
        data={testimonials}
        isLoading={isLoading}
        actionButton={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Testimoni</span>
          </button>
        }
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Nama Lengkap</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                placeholder="Prof. Dr. Ir. H. ..."
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Profesi / Status</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                placeholder="Wali Santri SMP Cendekia Amanah"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Isi Testimoni</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
              placeholder="Tuliskan pengalaman atau apresiasi terhadap Pesantren Cendekia Amanah..."
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <ImageUploader
            value={avatar}
            onChange={setAvatar}
            category="guru"
            label="Foto Profil / Avatar"
            aspectRatio="aspect-square w-24 h-24"
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
              {isSaving ? 'Menyimpan...' : 'Simpan Testimoni'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
