import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Plus, Edit, Trash2, Trophy, Award, Filter, Star } from 'lucide-react';
import { getUploadUrl } from '../../lib/uploads';

const unitBadgeStyles: Record<string, { bg: string; text: string; label: string }> = {
  pesantren: { bg: 'bg-[#EBF3FF]', text: 'text-[#1F5FD0]', label: 'Pesantren' },
  smp: { bg: 'bg-[#E0F2FE]', text: 'text-[#0284C7]', label: 'SMP' },
  sma: { bg: 'bg-[#EEF2FF]', text: 'text-[#4F46E5]', label: 'SMA' },
  diniyah: { bg: 'bg-[#EAF7EF]', text: 'text-[#17804A]', label: 'Diniyah' }
};

export function AchievementListPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Filter
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('ALL');

  // Form State
  const [title, setTitle] = useState('');
  const [winner, setWinner] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('2026');
  const [badge, setBadge] = useState('Juara 1');
  const [imageUrl, setImageUrl] = useState('/uploads/units/juara1.jpg');
  const [unitId, setUnitId] = useState<string>('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useUI();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [achRes, unitsRes]: any = await Promise.all([
        apiClient.get('/admin/achievements'),
        apiClient.get('/admin/units').catch(() => ({ data: [] }))
      ]);

      if (achRes?.data) setAchievements(achRes.data);
      if (unitsRes?.data) setUnits(unitsRes.data);
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat data prestasi', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setTitle('');
    setWinner('');
    setCategory('Olimpiade Sains Nasional');
    setYear('2026');
    setBadge('Juara 1');
    setImageUrl('/uploads/units/juara1.jpg');
    // Pre-select unit if filtered
    if (selectedUnitFilter !== 'ALL' && selectedUnitFilter !== 'global') {
      const matchUnit = units.find((u) => u.code === selectedUnitFilter);
      setUnitId(matchUnit?.id || '');
    } else {
      setUnitId(units[0]?.id || '');
    }
    setIsFeatured(true);
    setSortOrder(achievements.length + 1);
    setModalOpen(true);
  };

  const handleOpenEdit = (ach: any) => {
    setEditId(ach.id);
    setTitle(ach.title || '');
    setWinner(ach.winner || '');
    setCategory(ach.category || '');
    setYear(ach.year || '2026');
    setBadge(ach.badge || 'Juara 1');
    setImageUrl(ach.imageUrl || '/uploads/units/juara1.jpg');
    setUnitId(ach.unitId || ach.unit?.id || '');
    setIsFeatured(Boolean(ach.isFeatured));
    setSortOrder(ach.sortOrder || 0);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = {
        title,
        winner,
        category,
        year,
        badge,
        imageUrl,
        unitId: unitId || null,
        isFeatured,
        sortOrder: Number(sortOrder) || 0
      };

      if (editId) {
        await apiClient.put(`/admin/achievements/${editId}`, payload);
        addToast('Prestasi berhasil diperbarui', 'success');
      } else {
        await apiClient.post('/admin/achievements', payload);
        addToast('Prestasi baru berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      loadData();
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
      loadData();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus prestasi', 'error');
    }
  };

  // Filtered Achievements
  const filteredAchievements = achievements.filter((ach) => {
    if (selectedUnitFilter === 'ALL') return true;
    if (selectedUnitFilter === 'global') return !ach.unitId && !ach.unit;
    return (
      ach.unit?.code === selectedUnitFilter ||
      ach.unitId === units.find((u) => u.code === selectedUnitFilter)?.id
    );
  });

  const columns: Column<any>[] = [
    {
      header: 'Prestasi & Kejuaraan',
      render: (ach) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-[#DDE6F1]">
            <img src={getUploadUrl(ach.imageUrl)} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF8E8] text-[#D4A31C] uppercase">
                {ach.badge}
              </span>
              {ach.isFeatured && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#EAF7EF] text-[#17804A]">
                  <Star className="w-2.5 h-2.5 fill-[#17804A]" />
                  Beranda
                </span>
              )}
            </div>
            <h4 className="font-bold text-[#0B2F6B] line-clamp-1">{ach.title}</h4>
            <p className="text-xs text-[#64748B]">Peraih: {ach.winner}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Unit Pendidikan',
      render: (ach) => {
        const unitCode = ach.unit?.code || 'global';
        const style = unitBadgeStyles[unitCode] || {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          label: ach.unit?.name || 'Umum / Global'
        };

        return (
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}
          >
            {ach.unit?.name || style.label}
          </span>
        );
      }
    },
    {
      header: 'Kategori / Lomba',
      accessor: 'category',
      className: 'text-xs text-[#64748B]'
    },
    {
      header: 'Tahun',
      accessor: 'year',
      className: 'font-bold text-[#0B2F6B] text-xs'
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (ach) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(ach)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B2F6B] hover:bg-gray-100 transition-colors"
            title="Edit Prestasi"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(ach.id, ach.title)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Prestasi"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-5">
      <Breadcrumbs items={[{ label: 'Prestasi Santri' }]} />

      {/* Unit Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-[#DDE6F1] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1 text-xs font-bold text-[#64748B] mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Unit:</span>
          </div>

          {[
            { key: 'ALL', label: 'Semua Unit' },
            { key: 'pesantren', label: 'Pesantren' },
            { key: 'smp', label: 'SMP' },
            { key: 'sma', label: 'SMA' },
            { key: 'diniyah', label: 'Madrasah Diniyah' },
            { key: 'global', label: 'Umum' }
          ].map((tab) => {
            const isActive = selectedUnitFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedUnitFilter(tab.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#0B2F6B] text-white shadow-xs'
                    : 'bg-[#F4F7FB] text-[#64748B] hover:bg-[#EBF3FF] hover:text-[#0B2F6B]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Prestasi</span>
        </button>
      </div>

      <DataTable
        title="Prestasi Santri & Siswa"
        description="Kelola rekam jejak juara olimpiade, MTQ, pidato bahasa asing, dan sains santri per unit pendidikan."
        columns={columns}
        data={filteredAchievements}
        isLoading={isLoading}
      />

      {/* Modal Tambah / Edit Prestasi */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Prestasi Santri' : 'Tambah Prestasi Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {/* Unit Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">
              Unit Pendidikan <span className="text-red-500">*</span>
            </label>
            <select
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              required
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] font-medium"
            >
              <option value="">-- Pilih Unit Pendidikan --</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">
              Nama Kejuaraan / Prestasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Contoh: Medali Emas Olimpiade Sains Nasional 2026"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">
                Badge Juara <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                required
                placeholder="Contoh: Juara 1 / Medali Emas"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">
                Peraih / Nama Santri <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={winner}
                onChange={(e) => setWinner(e.target.value)}
                required
                placeholder="Contoh: Muhammad Al-Fatih / Tim Robotik"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">
                Kategori / Nama Lomba <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                placeholder="Contoh: Olimpiade Sains Nasional Bidang Kimia"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">
                Tahun Perolehan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                placeholder="2026"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Urutan Tampil (Sort Order)</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0B2F6B] focus:ring-[#0B2F6B] border-[#CBD5E1]"
                />
                <span className="text-xs font-semibold text-[#1A293B]">
                  Tampilkan di Beranda (Featured)
                </span>
              </label>
            </div>
          </div>

          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            category="units"
            label="Foto Dokumentasi / Piala Penghargaan"
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
