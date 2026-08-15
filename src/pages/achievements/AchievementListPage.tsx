import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Plus, Edit, Trash2, Trophy, Award } from 'lucide-react';
import { getUploadUrl } from '../../lib/uploads';

export function AchievementListPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [winner, setWinner] = useState('');
  const [category, setCategory] = useState('Tingkat Nasional');
  const [year, setYear] = useState('2026');
  const [badge, setBadge] = useState('Juara 1');
  const [imageUrl, setImageUrl] = useState('/uploads/units/juara1.jpg');
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useUI();

  const loadAchievements = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/achievements');
      if (res?.data) setAchievements(res.data);
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat prestasi', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setTitle('');
    setWinner('');
    setCategory('Tingkat Nasional');
    setYear('2026');
    setBadge('Juara 1');
    setImageUrl('/uploads/units/juara1.jpg');
    setModalOpen(true);
  };

  const handleOpenEdit = (ach: any) => {
    setEditId(ach.id);
    setTitle(ach.title);
    setWinner(ach.winner);
    setCategory(ach.category);
    setYear(ach.year);
    setBadge(ach.badge);
    setImageUrl(ach.imageUrl || '/uploads/units/juara1.jpg');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = { title, winner, category, year, badge, imageUrl };
      if (editId) {
        await apiClient.put(`/admin/achievements/${editId}`, payload);
        addToast('Prestasi berhasil diperbarui', 'success');
      } else {
        await apiClient.post('/admin/achievements', payload);
        addToast('Prestasi baru berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      loadAchievements();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan prestasi', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus prestasi "${title}"?`)) return;
    try {
      await apiClient.delete(`/admin/achievements/${id}`);
      addToast('Prestasi berhasil dihapus', 'success');
      loadAchievements();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus prestasi', 'error');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Prestasi & Kejuaraan',
      render: (ach) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-[#DDE6F1]">
            <img src={getUploadUrl(ach.imageUrl)} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF8E8] text-[#D4A31C] uppercase mb-0.5">
              {ach.badge}
            </span>
            <h4 className="font-bold text-[#0B2F6B] line-clamp-1">{ach.title}</h4>
            <p className="text-xs text-[#64748B]">Peraih: {ach.winner}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Kategori Lomba',
      accessor: 'category',
      className: 'text-[#64748B]'
    },
    {
      header: 'Tahun',
      accessor: 'year',
      className: 'font-bold text-[#0B2F6B]'
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (ach) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(ach)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B2F6B] hover:bg-gray-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(ach.id, ach.title)}
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
      <Breadcrumbs items={[{ label: 'Prestasi Santri' }]} />

      <DataTable
        title="Prestasi Santri & Siswa"
        description="Kelola rekam jejak juara olimpiade, MTQ, pidato bahasa asing, dan sains santri Cendekia Amanah."
        columns={columns}
        data={achievements}
        isLoading={isLoading}
        actionButton={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Prestasi</span>
          </button>
        }
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Prestasi' : 'Tambah Prestasi Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Nama Kejuaraan / Kompetisi</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Contoh: Juara 1 Olimpiade Bahasa Arab Nasional"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Peraih / Nama Santri</label>
              <input
                type="text"
                value={winner}
                onChange={(e) => setWinner(e.target.value)}
                required
                placeholder="Muhammad Al-Fatih & Tim"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Badge Juara</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Juara 1 / Gold Medal"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Kategori / Tingkat</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Tingkat Nasional / Provinsi"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Tahun Perolehan</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2026"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            category="units"
            label="Foto Piala / Dokumentasi Penghargaan"
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
              {isSaving ? 'Menyimpan...' : 'Simpan Prestasi'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
