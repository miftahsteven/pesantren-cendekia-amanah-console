import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Modal } from '../../components/ui/Modal';
import {
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Trophy,
  UserCheck,
  Edit,
  Plus,
  Trash2,
  Save,
  BarChart3,
  Sparkles
} from 'lucide-react';

const iconComponents: Record<string, any> = {
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Trophy,
  UserCheck
};

export function StatisticsPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'HOME_HERO' | 'HOME_INSTITUTION'>('HOME_HERO');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingStat, setEditingStat] = useState<any>(null);

  // Form fields
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [icon, setIcon] = useState('Users');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const { addToast } = useUI();

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/site/statistics');
      if (res?.data) {
        setStats(res.data);
      }
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat data statistik', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const filteredStats = stats.filter((s) => s.sectionCode === activeTab);

  const openEditModal = (stat: any) => {
    setEditingStat(stat);
    setLabel(stat.label || '');
    setValue(stat.value || '');
    setIcon(stat.icon || 'Users');
    setSortOrder(stat.sortOrder || 0);
    setIsActive(stat.isActive !== false);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingStat(null);
    setLabel('');
    setValue('');
    setIcon('Users');
    setSortOrder(filteredStats.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !value) {
      addToast('Nilai angka dan label statistik wajib diisi', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        sectionCode: activeTab,
        label,
        value,
        icon,
        sortOrder: Number(sortOrder) || 0,
        isActive
      };

      if (editingStat) {
        await apiClient.put(`/admin/site/statistics/${editingStat.id}`, payload);
        addToast('Data statistik berhasil diperbarui', 'success');
      } else {
        await apiClient.post('/admin/site/statistics', payload);
        addToast('Data statistik berhasil ditambahkan', 'success');
      }

      setIsModalOpen(false);
      loadStats();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan data statistik', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, statLabel: string) => {
    if (!window.confirm(`Yakin ingin menghapus statistik "${statLabel}"?`)) {
      return;
    }

    try {
      await apiClient.delete(`/admin/site/statistics/${id}`);
      addToast('Data statistik berhasil dihapus', 'success');
      loadStats();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus data statistik', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs items={[{ label: 'Statistik & Infografis' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0B2F6B] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#1F5FD0]" />
            <span>Statistik & Angka Infografis</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Kelola angka pencapaian, jumlah santri, alumni, dan data infografis yang tampil di beranda website.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B2F6B] hover:bg-[#1A4FA0] text-white text-xs font-bold transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Angka Statistik</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#DDE6F1] gap-6">
        <button
          onClick={() => setActiveTab('HOME_HERO')}
          className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'HOME_HERO'
              ? 'border-[#0B2F6B] text-[#0B2F6B]'
              : 'border-transparent text-[#64748B] hover:text-[#0B2F6B]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#D8232A]" />
          <span>Statistik Banner Depan (4 Kotak Biru Hero)</span>
        </button>
        <button
          onClick={() => setActiveTab('HOME_INSTITUTION')}
          className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'HOME_INSTITUTION'
              ? 'border-[#0B2F6B] text-[#0B2F6B]'
              : 'border-transparent text-[#64748B] hover:text-[#0B2F6B]'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#1F5FD0]" />
          <span>Statistik Lembaga (Bagian Bawah)</span>
        </button>
      </div>

      {/* Hero Stats Preview / Cards */}
      {activeTab === 'HOME_HERO' && (
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
          <p className="text-xs font-bold text-[#0B2F6B]">
            📌 Preview Tampilan Banner Depan
          </p>
          <p className="text-[11px] text-[#64748B]">
            Angka-angka di bawah ini tampil tepat di bawah banner selamat datang pada halaman utama website.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#64748B] animate-pulse">
          Memuat data statistik...
        </div>
      ) : filteredStats.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#DDE6F1] text-xs text-[#64748B]">
          Belum ada data statistik pada bagian ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredStats.map((item) => {
            const Icon = iconComponents[item.icon] || Users;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#DDE6F1] p-5 shadow-xs hover:border-[#1F5FD0] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B2F6B] to-[#1A4FA0] text-white flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6 text-[#FCA5A5]" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {item.isActive !== false ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                <div>
                  <div className="text-2xl font-black text-[#0B2F6B] tracking-tight">
                    {item.value}
                  </div>
                  <div className="text-xs font-semibold text-[#64748B] mt-0.5">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-[#94A3B8] mt-1">
                    Urutan #{item.sortOrder || 1} • Icon: {item.icon || 'Users'}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0B2F6B] bg-[#F4F7FB] hover:bg-[#E2E8F0] transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.label)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStat ? 'Edit Angka Statistik' : 'Tambah Angka Statistik'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#0B2F6B] mb-1">
              Bagian Tampilan
            </label>
            <input
              type="text"
              disabled
              value={activeTab === 'HOME_HERO' ? 'Banner Depan (Hero Section)' : 'Statistik Lembaga'}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-[#DDE6F1] rounded-xl text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2F6B] mb-1">
              Nilai / Angka Infografis
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Contoh: 1500+, 500+, 95%, 25"
              required
              className="w-full px-3 py-2 text-xs border border-[#DDE6F1] rounded-xl focus:outline-none focus:border-[#0B2F6B] font-bold text-[#0B2F6B]"
            />
            <p className="text-[11px] text-[#64748B] mt-1">
              Bisa berupa angka dengan simbol seperti tanda tambah (+), persen (%), atau angka bulat.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2F6B] mb-1">
              Label Keterangan
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Contoh: Alumni, Santri Aktif, Lulus PTN, Guru Tahfidz"
              required
              className="w-full px-3 py-2 text-xs border border-[#DDE6F1] rounded-xl focus:outline-none focus:border-[#0B2F6B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0B2F6B] mb-1">
              Icon Simbol
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#DDE6F1] rounded-xl focus:outline-none focus:border-[#0B2F6B]"
            >
              <option value="Users">Users (Orang / Santri / Siswa)</option>
              <option value="GraduationCap">GraduationCap (Topi Wisuda / Kelulusan)</option>
              <option value="Award">Award (Penghargaan / Prestasi)</option>
              <option value="BookOpen">BookOpen (Buku / Tahfidz / Qur'an)</option>
              <option value="Trophy">Trophy (Piala / Juara)</option>
              <option value="UserCheck">UserCheck (Guru / Asatidz)</option>
            </select>
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
                id="isActiveStat"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-[#0B2F6B] border-gray-300 focus:ring-[#0B2F6B]"
              />
              <label htmlFor="isActiveStat" className="text-xs font-medium text-gray-700 cursor-pointer">
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
