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
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Award,
  IdCard,
  Briefcase,
  Layers,
  Crown
} from 'lucide-react';

interface OrganizationMember {
  id: string;
  name: string;
  position: string;
  category?: string;
  level?: number;
  photoUrl: string;
  nip?: string;
  education?: string;
  bio?: string;
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

const CATEGORY_OPTIONS = [
  'Pimpinan & Manajemen',
  'Wali Kelas & Kesiswaan',
  'Dewan Guru & Pengajar',
  'Tenaga Kependidikan & Tata Usaha'
];

const LEVEL_OPTIONS = [
  { value: 1, label: 'Level 1: Pimpinan Utama (Kepala Sekolah)' },
  { value: 2, label: 'Level 2: Wakil Kepala / Koordinator Bidang' },
  { value: 3, label: 'Level 3: Guru, Wali Kelas & Tenaga Pendidik' }
];

export function OrganizationListPage() {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [units, setUnits] = useState<EducationUnitOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Modal Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [category, setCategory] = useState('Pimpinan & Manajemen');
  const [level, setLevel] = useState(1);
  const [photoUrl, setPhotoUrl] = useState('/uploads/gallery/guru1.png');
  const [nip, setNip] = useState('');
  const [education, setEducation] = useState('');
  const [bio, setBio] = useState('');
  const [unitId, setUnitId] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useUI();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [orgRes, unitRes]: [any, any] = await Promise.all([
        apiClient.get('/admin/organizations'),
        apiClient.get('/admin/units')
      ]);

      if (orgRes?.data) setMembers(orgRes.data);
      if (unitRes?.data) {
        const unitOpts = unitRes.data.map((u: any) => ({
          id: u.id,
          slug: u.slug,
          name: u.name,
          shortName: u.shortName || u.name
        }));
        setUnits(unitOpts);
        if (!unitId && unitOpts.length > 0) {
          // Default to SMP if exists, else first
          const smp = unitOpts.find((u: any) => u.slug === 'smp');
          setUnitId(smp ? smp.id : unitOpts[0].id);
        }
      }
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat data struktur organisasi', 'error');
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
    setPosition('');
    setCategory('Pimpinan & Manajemen');
    setLevel(1);
    setPhotoUrl('/uploads/gallery/guru1.png');
    setNip('');
    setEducation('');
    setBio('');
    if (selectedUnitFilter !== 'ALL') {
      const match = units.find((u) => u.slug === selectedUnitFilter || u.id === selectedUnitFilter);
      if (match) setUnitId(match.id);
    } else if (units.length > 0) {
      const smp = units.find((u) => u.slug === 'smp');
      setUnitId(smp ? smp.id : units[0].id);
    }
    setSortOrder(members.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (m: OrganizationMember) => {
    setEditId(m.id);
    setName(m.name);
    setPosition(m.position);
    setCategory(m.category || 'Pimpinan & Manajemen');
    setLevel(m.level || 1);
    setPhotoUrl(m.photoUrl || '/uploads/gallery/guru1.png');
    setNip(m.nip || '');
    setEducation(m.education || '');
    setBio(m.bio || '');
    setUnitId(m.unitId || (units[0]?.id ?? ''));
    setSortOrder(m.sortOrder || 0);
    setIsActive(m.isActive);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !position.trim() || !unitId) {
      addToast('Nama, Jabatan, dan Unit Pendidikan wajib diisi', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        name,
        position,
        category,
        level: Number(level),
        photoUrl,
        nip,
        education,
        bio,
        unitId,
        sortOrder: Number(sortOrder),
        isActive
      };

      if (editId) {
        await apiClient.put(`/admin/organizations/${editId}`, payload);
        addToast('Data struktur organisasi berhasil diperbarui', 'success');
      } else {
        await apiClient.post('/admin/organizations', payload);
        addToast('Anggota organisasi baru berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan data', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (!window.confirm(`Yakin ingin menghapus "${memberName}" dari struktur organisasi?`)) return;
    try {
      await apiClient.delete(`/admin/organizations/${id}`);
      addToast('Data anggota organisasi berhasil dihapus', 'success');
      loadData();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus data', 'error');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await apiClient.patch(`/admin/organizations/${id}/toggle`, {});
      addToast('Status aktif berhasil diubah', 'success');
      loadData();
    } catch (err: any) {
      addToast(err.message || 'Gagal mengubah status', 'error');
    }
  };

  // Filtered members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.education && m.education.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.nip && m.nip.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesUnit =
      selectedUnitFilter === 'ALL' || m.unitSlug === selectedUnitFilter || m.unitId === selectedUnitFilter;
    const matchesCategory =
      selectedCategoryFilter === 'ALL' || m.category === selectedCategoryFilter;
    return matchesSearch && matchesUnit && matchesCategory;
  });

  // Statistics
  const totalCount = members.length;
  const activeCount = members.filter((m) => m.isActive).length;
  const pimpinanCount = members.filter((m) => m.level === 1 || m.category?.includes('Pimpinan')).length;
  const guruCount = members.filter((m) => m.level === 3 || m.category?.includes('Guru')).length;

  const columns: Column<OrganizationMember>[] = [
    {
      header: 'Profil Pendidik / Pengurus',
      render: (m) => (
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-[#DDE6F1]">
            <img
              src={getUploadUrl(m.photoUrl)}
              alt={m.name}
              className="w-full h-full object-cover"
              onError={(e: any) => {
                e.target.src = '/uploads/gallery/guru1.png';
              }}
            />
          </div>
          <div className="space-y-0.5 min-w-0">
            <h4 className="font-bold text-[#0B2F6B] text-sm leading-snug truncate">{m.name}</h4>
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              {m.nip ? (
                <span className="font-mono text-[11px]">{m.nip}</span>
              ) : (
                <span>{m.education || 'Tenaga Pendidik'}</span>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Jabatan & Amanah',
      render: (m) => (
        <div className="space-y-1">
          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#EBF3FF] text-[#1A4FA0]">
            {m.position}
          </span>
          {m.education && (
            <p className="text-[11px] text-[#64748B] line-clamp-1">{m.education}</p>
          )}
        </div>
      )
    },
    {
      header: 'Unit Pendidikan',
      render: (m) => (
        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-[#0B2F6B] border border-[#DDE6F1]">
          {m.unitShortName || m.unitName || 'Unit'}
        </span>
      )
    },
    {
      header: 'Hirarki Level',
      render: (m) => {
        if (m.level === 1) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDE8E9] text-[#D8232A] border border-[#FCA5A5]/40">
              <Crown className="w-3 h-3" />
              Level 1 (Pimpinan)
            </span>
          );
        }
        if (m.level === 2) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3FF] text-[#1A4FA0]">
              <Briefcase className="w-3 h-3" />
              Level 2 (Wakil/Koor)
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-[#64748B]">
            Level 3 (Guru/Staff)
          </span>
        );
      }
    },
    {
      header: 'Urutan',
      render: (m) => (
        <span className="font-mono text-xs font-bold text-[#1A293B] bg-gray-100 px-2 py-0.5 rounded-md">
          #{m.sortOrder}
        </span>
      )
    },
    {
      header: 'Status',
      render: (m) => (
        <button
          onClick={() => handleToggleStatus(m.id)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            m.isActive
              ? 'bg-[#FDE8E9] text-[#D8232A] hover:bg-red-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          title="Klik untuk mengubah status aktif"
        >
          {m.isActive ? (
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
      render: (m) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(m)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            title="Edit Data Anggota"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(m.id, m.name)}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Hapus Anggota"
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
          <Breadcrumbs items={[{ label: 'Struktur Organisasi' }]} />
          <h1 className="text-xl sm:text-2xl font-black text-[#0B2F6B] tracking-tight mt-1">
            Manajemen Struktur Organisasi Unit
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Kelola data pimpinan, wakil kepala sekolah, dewan guru, dan tenaga kependidikan untuk Unit SMP & SMA.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F5FD0] text-white text-xs sm:text-sm font-bold hover:bg-[#1A4FA0] shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Anggota</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#DDE6F1] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#EBF3FF] text-[#1F5FD0] flex items-center justify-center font-black">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Total Formasi</p>
            <p className="text-xl font-black text-[#0B2F6B]">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#DDE6F1] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FDE8E9] text-[#D8232A] flex items-center justify-center font-black">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Pimpinan</p>
            <p className="text-xl font-black text-[#D8232A]">{pimpinanCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#DDE6F1] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FFF8E6] text-[#F0BD28] flex items-center justify-center font-black">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Dewan Guru</p>
            <p className="text-xl font-black text-[#0B2F6B]">{guruCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#DDE6F1] shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#EAF7EF] text-[#17804A] flex items-center justify-center font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Status Aktif</p>
            <p className="text-xl font-black text-[#17804A]">{activeCount}</p>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DDE6F1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, jabatan, NIP, pendidikan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#DDE6F1] focus:outline-none focus:border-[#1F5FD0] bg-[#F4F7FB]"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
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

          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#DDE6F1] bg-[#F4F7FB] focus:outline-none focus:border-[#1F5FD0] w-full sm:w-auto cursor-pointer"
          >
            <option value="ALL">Semua Kategori Formasi</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={filteredMembers}
        isLoading={isLoading}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Anggota Struktur Organisasi' : 'Tambah Anggota Struktur Organisasi'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A293B] mb-1">
                Nama Lengkap & Gelar <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Ust. Ahmad Fauzi, S.Pd.I., M.Pd."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDE6F1] focus:outline-none focus:border-[#1F5FD0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A293B] mb-1">
                Jabatan / Amanah Struktural <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Kepala Sekolah / Waka Kurikulum"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDE6F1] focus:outline-none focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A293B] mb-1">
                Unit Pendidikan <span className="text-red-500">*</span>
              </label>
              <select
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDE6F1] focus:outline-none focus:border-[#1F5FD0] bg-white cursor-pointer"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.shortName || u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A293B] mb-1">
                Kategori Formasi
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDE6F1] focus:outline-none focus:border-[#1F5FD0] bg-white cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A293B] mb-1">
                Tingkat Hirarki
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDE6F1] focus:outline-none focus:border-[#1F5FD0] bg-white cursor-pointer"
              >
                {LEVEL_OPTIONS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A293B] mb-1">
                NIP / NUPTK / NIY (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: NIY. 20180901001"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDE6F1] focus:outline-none focus:border-[#1F5FD0]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A293B] mb-1">
                Riwayat Pendidikan / Almamater
              </label>
              <input
                type="text"
                placeholder="Contoh: S2 Manajemen Pendidikan - UIN Syahid"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDE6F1] focus:outline-none focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A293B] mb-1">
              Profil Singkat / Pengantar
            </label>
            <textarea
              rows={2}
              placeholder="Pengalaman mengajar, bidang keahlian, atau pesan singkat pimpinan..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDE6F1] focus:outline-none focus:border-[#1F5FD0]"
            />
          </div>

          <ImageUploader
            value={photoUrl}
            onChange={(url) => setPhotoUrl(url)}
            category="gallery"
            label="Foto Profil Pendidik"
            aspectRatio="aspect-square"
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
              {isSaving ? 'Menyimpan...' : editId ? 'Simpan Perubahan' : 'Tambah Anggota'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default OrganizationListPage;
