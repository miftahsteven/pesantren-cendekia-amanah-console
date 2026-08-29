import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Plus, Edit, Trash2, Sparkles, BookOpen, Heart, Globe, Users } from 'lucide-react';

const iconOptions = ['BookOpen', 'Heart', 'Globe', 'Users', 'Sparkles', 'Award'];

export function ProgramListPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('BookOpen');
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useUI();

  const loadPrograms = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/featured-programs');
      if (res?.data) setPrograms(res.data);
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat program', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setTitle('');
    setDesc('');
    setIcon('BookOpen');
    setModalOpen(true);
  };

  const handleOpenEdit = (prog: any) => {
    setEditId(prog.id);
    setTitle(prog.title);
    setDesc(prog.desc || '');
    setIcon(prog.icon || 'BookOpen');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (editId) {
        await apiClient.put(`/admin/featured-programs/${editId}`, { title, desc, icon });
        addToast('Program unggulan berhasil diperbarui', 'success');
      } else {
        await apiClient.post('/admin/featured-programs', { title, desc, icon });
        addToast('Program unggulan baru berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      loadPrograms();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan program', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus program "${title}"?`)) return;
    try {
      await apiClient.delete(`/admin/featured-programs/${id}`);
      addToast('Program berhasil dihapus', 'success');
      loadPrograms();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus program', 'error');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Program Unggulan',
      render: (prog) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FDE8E9] text-[#D8232A] flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[#0B2F6B]">{prog.title}</h4>
            <p className="text-xs text-[#64748B] line-clamp-1">{prog.desc}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Icon',
      accessor: 'icon',
      className: 'font-mono text-xs text-[#64748B]'
    },
    {
      header: 'Status',
      render: (prog) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FDE8E9] text-[#D8232A]">
          Aktif
        </span>
      )
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (prog) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(prog)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B2F6B] hover:bg-gray-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(prog.id, prog.title)}
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
      <Breadcrumbs items={[{ label: 'Program Unggulan' }]} />

      <DataTable
        title="Program Unggulan Pesantren"
        description="Kelola 4 pilar program kurikulum utama yang ditampilkan di beranda website."
        columns={columns}
        data={programs}
        isLoading={isLoading}
        actionButton={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Program</span>
          </button>
        }
      />

      {/* Program Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Program Unggulan' : 'Tambah Program Unggulan Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Judul Program</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Contoh: Tahfidz Al-Qur'an Bersanad"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Deskripsi Singkat</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              required
              placeholder="Deskripsi keunggulan program..."
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Icon Simbol</label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            >
              {iconOptions.map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
                </option>
              ))}
            </select>
          </div>

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
              {isSaving ? 'Menyimpan...' : 'Simpan Program'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
