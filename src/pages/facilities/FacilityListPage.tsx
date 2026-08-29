import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { getUploadUrl } from '../../lib/uploads';
import {
  Plus,
  Edit,
  Trash2,
  Building2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Layers,
  Sparkles
} from 'lucide-react';

interface Facility {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  unitId: string;
  unitName?: string;
  unitShortName?: string;
  unitSlug?: string;
  unitBadge?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EducationUnitOption {
  id: string;
  slug: string;
  name: string;
  shortName: string;
}

export function FacilityListPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [units, setUnits] = useState<EducationUnitOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/uploads/gallery/pesantren1.png');
  const [unitId, setUnitId] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useUI();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [facRes, unitRes]: [any, any] = await Promise.all([
        apiClient.get('/admin/facilities'),
        apiClient.get('/admin/units')
      ]);

      if (facRes?.data) setFacilities(facRes.data);
      if (unitRes?.data) {
        setUnits(
          unitRes.data.map((u: any) => ({
            id: u.id,
            slug: u.slug,
            name: u.name,
            shortName: u.shortName || u.name
          }))
        );
        if (!unitId && unitRes.data.length > 0) {
          setUnitId(unitRes.data[0].id);
        }
      }
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat data fasilitas', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setName('');
    setDescription('');
    setImageUrl('/uploads/gallery/pesantren1.png');
    if (units.length > 0) setUnitId(units[0].id);
    setSortOrder(facilities.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (fac: Facility) => {
    setEditId(fac.id);
    setName(fac.name);
    setDescription(fac.description || '');
    setImageUrl(fac.imageUrl || '/uploads/gallery/pesantren1.png');
    setUnitId(fac.unitId || (units[0]?.id ?? ''));
    setSortOrder(fac.sortOrder || 0);
    setIsActive(fac.isActive);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Nama fasilitas wajib diisi', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        name,
        description,
        imageUrl,
        unitId,
        sortOrder: Number(sortOrder),
        isActive
      };

      if (editId) {
        await apiClient.put(`/admin/facilities/${editId}`, payload);
        addToast('Fasilitas berhasil diperbarui', 'success');
      } else {
        await apiClient.post('/admin/facilities', payload);
        addToast('Fasilitas baru berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan fasilitas', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, facName: string) => {
    if (!window.confirm(`Yakin ingin menghapus fasilitas "${facName}"?`)) return;
    try {
      await apiClient.delete(`/admin/facilities/${id}`);
      addToast('Fasilitas berhasil dihapus', 'success');
      loadData();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus fasilitas', 'error');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await apiClient.patch(`/admin/facilities/${id}/toggle`, {});
      addToast('Status aktif fasilitas berhasil diubah', 'success');
      loadData();
    } catch (err: any) {
      addToast(err.message || 'Gagal mengubah status fasilitas', 'error');
    }
  };

  // Filtered facilities
  const filteredFacilities = facilities.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesUnit =
      selectedUnitFilter === 'ALL' || f.unitSlug === selectedUnitFilter || f.unitId === selectedUnitFilter;
    return matchesSearch && matchesUnit;
  });

  // Statistics
  const totalCount = facilities.length;
  const activeCount = facilities.filter((f) => f.isActive).length;
  const unitsCount = new Set(facilities.map((f) => f.unitId)).size;

  const columns: Column<Facility>[] = [
    {
      header: 'Fasilitas & Prasarana',
      render: (fac) => (
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-[#DDE6F1]">
            <img
              src={getUploadUrl(fac.imageUrl)}
              alt={fac.name}
              className="w-full h-full object-cover"
              onError={(e: any) => {
                e.target.src = '/uploads/gallery/pesantren1.png';
              }}
            />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-[#0B2F6B] text-sm leading-snug">{fac.name}</h4>
            <p className="text-xs text-[#64748B] line-clamp-1 max-w-md">{fac.description || 'Tidak ada deskripsi'}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Unit Terkait',
      render: (fac) => (
        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EBF3FF] text-[#1A4FA0] border border-[#DDE6F1]">
          {fac.unitName || fac.unitShortName || 'Pesantren'}
        </span>
      )
    },
    {
      header: 'Urutan',
      render: (fac) => (
        <span className="font-mono text-xs font-bold text-[#1A293B] bg-gray-100 px-2 py-0.5 rounded-md">
          #{fac.sortOrder}
        </span>
      )
    },
    {
      header: 'Status',
      render: (fac) => (
        <button
          onClick={() => handleToggleStatus(fac.id)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            fac.isActive
              ? 'bg-[#FDE8E9] text-[#D8232A] hover:bg-red-200'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
          title="Klik untuk mengubah status aktif"
        >
          {fac.isActive ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Aktif</span>
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5" />
              <span>Non-Aktif</span>
            </>
          )}
        </button>
      )
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (fac) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(fac)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit Fasilitas"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(fac.id, fac.name)}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Fasilitas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: 'Fasilitas Pesantren' }]} />
          <h1 className="text-xl sm:text-2xl font-black text-[#0B2F6B] tracking-tight mt-1">
            Manajemen Fasilitas Kampus Terpadu
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Kelola sarana dan prasarana kampus terpadu Pesantren Cendekia Amanah yang tampil di halaman Tentang Kami.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F5FD0] text-white text-xs sm:text-sm font-bold hover:bg-[#1A4FA0] shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Fasilitas</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#DDE6F1] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#EBF3FF] text-[#1F5FD0] flex items-center justify-center font-black">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Total Fasilitas</p>
            <p className="text-xl font-black text-[#0B2F6B]">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#DDE6F1] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FDE8E9] text-[#D8232A] flex items-center justify-center font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Fasilitas Aktif</p>
            <p className="text-xl font-black text-[#D8232A]">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#DDE6F1] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FFF8E6] text-[#F0BD28] flex items-center justify-center font-black">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Unit Terakreditasi</p>
            <p className="text-xl font-black text-[#0B2F6B]">{unitsCount} Unit</p>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DDE6F1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama atau deskripsi fasilitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#DDE6F1] focus:outline-none focus:border-[#1F5FD0] bg-[#F4F7FB]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#64748B] shrink-0" />
          <select
            value={selectedUnitFilter}
            onChange={(e) => setSelectedUnitFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#DDE6F1] bg-[#F4F7FB] focus:outline-none focus:border-[#1F5FD0] w-full sm:w-auto cursor-pointer"
          >
            <option value="ALL">Semua Unit Pendidikan</option>
            {units.map((u) => (
              <option key={u.id} value={u.slug}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={filteredFacilities}
        isLoading={isLoading}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Fasilitas Pesantren' : 'Tambah Fasilitas Baru'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1A293B] mb-1">
              Nama Fasilitas <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Masjid Jami & Aula Ibadah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDE6F1] focus:outline-none focus:border-[#1F5FD0]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A293B] mb-1">
              Unit Pendidikan Penanggung Jawab / Lokasi
            </label>
            <select
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDE6F1] focus:outline-none focus:border-[#1F5FD0] bg-white cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.shortName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A293B] mb-1">
              Deskripsi Fasilitas
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan spesifikasi, fungsi, kapasitas, dan keunggulan fasilitas ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDE6F1] focus:outline-none focus:border-[#1F5FD0]"
            />
          </div>

          <ImageUploader
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            category="gallery"
            label="Foto / Gambar Fasilitas"
            aspectRatio="aspect-video"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#1A293B] mb-1">
                Urutan Tampil (Sort Order)
              </label>
              <input
                type="number"
                min="0"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDE6F1] focus:outline-none focus:border-[#1F5FD0]"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D8232A]"></div>
              </label>
              <span className="text-xs font-bold text-[#1A293B]">
                {isActive ? 'Aktif (Tampil di Website)' : 'Non-Aktif (Disembunyikan)'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#DDE6F1]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-[#1F5FD0] text-white text-xs font-bold hover:bg-[#1A4FA0] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? 'Menyimpan...' : editId ? 'Simpan Perubahan' : 'Tambah Fasilitas'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default FacilityListPage;
