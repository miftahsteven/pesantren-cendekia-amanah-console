import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Award,
  Laptop,
  Languages,
  Scroll,
  GraduationCap,
  Microscope,
  Sparkles,
  Cpu,
  HeartHandshake,
  ShieldCheck,
  Globe,
  Briefcase,
  CheckCircle2,
  X,
  School
} from 'lucide-react';

const ICON_OPTIONS = [
  { name: 'BookOpen', label: 'Buku / Akademik', icon: BookOpen },
  { name: 'Award', label: 'Tahfidz / Prestasi', icon: Award },
  { name: 'Laptop', label: 'Digital / Komputer', icon: Laptop },
  { name: 'Languages', label: 'Bahasa Asing / Komunikasi', icon: Languages },
  { name: 'Scroll', label: 'Kitab Kuning / Turats', icon: Scroll },
  { name: 'GraduationCap', label: 'Toga / PTN / Beasiswa', icon: GraduationCap },
  { name: 'Microscope', label: 'Riset / Sains / KIR', icon: Microscope },
  { name: 'Cpu', label: 'AI & Robotika', icon: Cpu },
  { name: 'HeartHandshake', label: 'Adab & Karakter', icon: HeartHandshake },
  { name: 'ShieldCheck', label: 'Aqidah & Disiplin', icon: ShieldCheck },
  { name: 'Globe', label: 'Wawasan Global', icon: Globe },
  { name: 'Briefcase', label: 'Karir & Kepemimpinan', icon: Briefcase },
  { name: 'Sparkles', label: 'Inovasi / Unggulan', icon: Sparkles }
];

const ICON_MAP: Record<string, any> = {
  BookOpen,
  Award,
  Laptop,
  Languages,
  Scroll,
  GraduationCap,
  Microscope,
  Cpu,
  HeartHandshake,
  ShieldCheck,
  Globe,
  Briefcase,
  Sparkles
};

const COLOR_OPTIONS = [
  { id: 'blue', label: 'Biru (Akademik / Standar)', bgClass: 'bg-blue-50 text-blue-700 border-blue-200', dotClass: 'bg-blue-600' },
  { id: 'amber', label: 'Kuning-Emas (Tahfidz / Keagamaan)', bgClass: 'bg-amber-50 text-amber-700 border-amber-200', dotClass: 'bg-amber-600' },
  { id: 'emerald', label: 'Hijau (Teknologi / Lingkungan)', bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200', dotClass: 'bg-emerald-600' },
  { id: 'rose', label: 'Merah (Bahasa / Karakter)', bgClass: 'bg-rose-50 text-rose-700 border-rose-200', dotClass: 'bg-rose-600' },
  { id: 'indigo', label: 'Indigo (Riset / Akselerasi)', bgClass: 'bg-indigo-50 text-indigo-700 border-indigo-200', dotClass: 'bg-indigo-600' },
  { id: 'purple', label: 'Ungu (Inovasi & Global)', bgClass: 'bg-purple-50 text-purple-700 border-purple-200', dotClass: 'bg-purple-600' }
];

export function CurriculumListPage() {
  const [curriculums, setCurriculums] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [unitId, setUnitId] = useState('');
  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('');
  const [color, setColor] = useState('blue');
  const [icon, setIcon] = useState('BookOpen');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useUI();

  const loadUnits = async () => {
    try {
      const res: any = await apiClient.get('/admin/units');
      if (res?.data) {
        setUnits(res.data);
      }
    } catch {
      // ignore
    }
  };

  const loadCurriculums = async () => {
    try {
      setIsLoading(true);
      const url =
        selectedUnitFilter && selectedUnitFilter !== 'all'
          ? `/admin/curriculums?unitId=${selectedUnitFilter}`
          : '/admin/curriculums';
      const res: any = await apiClient.get(url);
      if (res?.data) {
        setCurriculums(res.data);
      }
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat data kurikulum', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, []);

  useEffect(() => {
    loadCurriculums();
  }, [selectedUnitFilter]);

  const handleOpenCreate = () => {
    setEditId(null);
    if (selectedUnitFilter !== 'all') {
      setUnitId(selectedUnitFilter);
    } else if (units.length > 0) {
      setUnitId(units[0].id);
    } else {
      setUnitId('');
    }
    setTitle('');
    setBadge('');
    setColor('blue');
    setIcon('BookOpen');
    setDescription('');
    setHighlights(['', '', '']);
    setSortOrder(curriculums.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (curr: any) => {
    setEditId(curr.id);
    setUnitId(curr.unitId || curr.unit?.id || '');
    setTitle(curr.title || '');
    setBadge(curr.badge || '');
    setColor(curr.color || 'blue');
    setIcon(curr.icon || 'BookOpen');
    setDescription(curr.description || '');
    setHighlights(
      Array.isArray(curr.highlights) && curr.highlights.length > 0
        ? curr.highlights
        : ['']
    );
    setSortOrder(curr.sortOrder ?? 1);
    setIsActive(curr.isActive !== undefined ? Boolean(curr.isActive) : true);
    setModalOpen(true);
  };

  const handleAddHighlight = () => {
    setHighlights([...highlights, '']);
  };

  const handleRemoveHighlight = (index: number) => {
    if (highlights.length <= 1) {
      setHighlights(['']);
      return;
    }
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleHighlightChange = (val: string, index: number) => {
    const updated = [...highlights];
    updated[index] = val;
    setHighlights(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitId) {
      addToast('Unit pendidikan wajib dipilih', 'error');
      return;
    }
    if (!title.trim()) {
      addToast('Judul pilar kurikulum wajib diisi', 'error');
      return;
    }
    if (!description.trim()) {
      addToast('Deskripsi pilar kurikulum wajib diisi', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const cleanHighlights = highlights.map((h) => h.trim()).filter(Boolean);

      const payload = {
        unitId,
        title: title.trim(),
        badge: badge.trim() || null,
        color,
        icon,
        description: description.trim(),
        highlights: cleanHighlights,
        sortOrder: Number(sortOrder) || 0,
        isActive
      };

      if (editId) {
        await apiClient.put(`/admin/curriculums/${editId}`, payload);
        addToast('Kurikulum berhasil diperbarui', 'success');
      } else {
        await apiClient.post('/admin/curriculums', payload);
        addToast('Kurikulum baru berhasil ditambahkan', 'success');
      }

      setModalOpen(false);
      loadCurriculums();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan data kurikulum', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, currTitle: string) => {
    if (!window.confirm(`Hapus pilar kurikulum "${currTitle}"?`)) return;
    try {
      await apiClient.delete(`/admin/curriculums/${id}`);
      addToast('Kurikulum berhasil dihapus', 'success');
      loadCurriculums();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus kurikulum', 'error');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await apiClient.patch(`/admin/curriculums/${id}/toggle`, {});
      addToast('Status kurikulum berhasil diperbarui', 'success');
      loadCurriculums();
    } catch (err: any) {
      addToast(err.message || 'Gagal mengubah status', 'error');
    }
  };

  // Helper for unit badge styling
  const getUnitBadge = (unit: any) => {
    const code = (unit?.code || '').toLowerCase();
    const name = unit?.shortName || unit?.name || 'Unit';

    if (code.includes('sma')) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          SMA
        </span>
      );
    }
    if (code.includes('smp')) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          SMP
        </span>
      );
    }
    if (code.includes('pesantren')) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Pesantren
        </span>
      );
    }
    if (code.includes('diniyah') || code.includes('mdta')) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          MDTA
        </span>
      );
    }

    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">
        {name}
      </span>
    );
  };

  const getColorBadge = (colorKey: string) => {
    const found = COLOR_OPTIONS.find((c) => c.id === colorKey) || COLOR_OPTIONS[0];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${found.bgClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${found.dotClass}`} />
        {found.id}
      </span>
    );
  };

  const selectedUnitObj = units.find((u) => u.id === selectedUnitFilter);

  const getPageTitle = () => {
    if (selectedUnitObj) return `Kurikulum ${selectedUnitObj.name} (#kurikulum)`;
    return 'Semua Kurikulum Unit Pendidikan (#kurikulum)';
  };

  const getPageDescription = () => {
    if (selectedUnitObj) {
      return `Kelola pilar dan rincian capaian kurikulum untuk ${selectedUnitObj.name} yang tampil di halaman unit (#kurikulum).`;
    }
    return 'Kelola pilar kurikulum terpisah per unit pendidikan (Pesantren, SMP, SMA, MDTA).';
  };

  const columns: Column<any>[] = [
    {
      header: 'Pilar Kurikulum',
      render: (curr) => {
        const IconComponent = ICON_MAP[curr.icon] || BookOpen;
        const colorOption = COLOR_OPTIONS.find((c) => c.id === curr.color) || COLOR_OPTIONS[0];

        return (
          <div className="flex items-start gap-3 py-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5 border ${colorOption.bgClass}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-[#0B2F6B] text-sm">{curr.title}</h4>
                {curr.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0BD28]/15 text-[#855B00] border border-[#F0BD28]/30">
                    {curr.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5C6B7D] line-clamp-2 max-w-lg">
                {curr.description}
              </p>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Unit',
      className: 'w-28',
      render: (curr) => getUnitBadge(curr.unit)
    },
    {
      header: 'Warna & Ikon',
      className: 'w-36',
      render: (curr) => (
        <div className="space-y-1">
          <div>{getColorBadge(curr.color || 'blue')}</div>
          <div className="text-[11px] text-[#64748B] flex items-center gap-1">
            <span>Ikon:</span>
            <span className="font-mono font-medium text-slate-800">{curr.icon || 'BookOpen'}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Capaian & Keunggulan',
      className: 'w-48',
      render: (curr) => {
        const count = Array.isArray(curr.highlights) ? curr.highlights.length : 0;
        return (
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
              {count} poin capaian
            </span>
            {count > 0 && (
              <p className="text-[11px] text-slate-500 line-clamp-1 italic max-w-xs">
                • {curr.highlights[0]}
              </p>
            )}
          </div>
        );
      }
    },
    {
      header: 'Urutan',
      className: 'w-20 text-center',
      render: (curr) => (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
          {curr.sortOrder ?? 0}
        </span>
      )
    },
    {
      header: 'Status',
      className: 'w-24 text-center',
      render: (curr) => (
        <button
          onClick={() => handleToggleStatus(curr.id)}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
            curr.isActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
          }`}
          title="Klik untuk ubah status aktif"
        >
          {curr.isActive ? 'Aktif' : 'Nonaktif'}
        </button>
      )
    },
    {
      header: 'Aksi',
      className: 'w-24 text-right',
      render: (curr) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(curr)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#1A4FA0] hover:bg-blue-50 transition-colors"
            title="Edit Kurikulum"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(curr.id, curr.title)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Kurikulum"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Kurikulum Unit' }
        ]}
      />

      {/* Filter Tabs by Unit */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#DDE6F1] shadow-xs">
        <span className="text-xs font-bold text-[#64748B] px-3 py-1 flex items-center gap-1.5">
          <School className="w-3.5 h-3.5 text-[#0B2F6B]" />
          Kategori Unit:
        </span>
        <button
          onClick={() => setSelectedUnitFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedUnitFilter === 'all'
              ? 'bg-[#0B2F6B] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0B2F6B] hover:bg-[#F8FAFC]'
          }`}
        >
          Semua Kurikulum Unit ({curriculums.length})
        </button>
        {units.map((u) => {
          const count = curriculums.filter((c) => c.unitId === u.id || c.unit?.id === u.id).length;
          return (
            <button
              key={u.id}
              onClick={() => setSelectedUnitFilter(u.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedUnitFilter === u.id
                  ? 'bg-[#0B2F6B] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B2F6B] hover:bg-[#F8FAFC]'
              }`}
            >
              {u.shortName || u.name}
              {selectedUnitFilter === 'all' && count > 0 && ` (${count})`}
            </button>
          );
        })}
      </div>

      <DataTable
        title={getPageTitle()}
        description={getPageDescription()}
        columns={columns}
        data={curriculums}
        isLoading={isLoading}
        actionButton={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kurikulum</span>
          </button>
        }
      />

      {/* Modal Add / Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Pilar Kurikulum' : 'Tambah Pilar Kurikulum Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto px-1 py-1">
          {/* Unit Selector */}
          <div>
            <label className="block text-xs font-bold text-[#1A293B] mb-1">
              Unit Pendidikan <span className="text-red-500">*</span>
            </label>
            <select
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              required
            >
              <option value="" disabled>Pilih Unit</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.shortName || u.code})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#1A293B] mb-1">
              Judul Pilar Kurikulum <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kurikulum Nasional Merdeka Terpadu"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Badge */}
            <div>
              <label className="block text-xs font-bold text-[#1A293B] mb-1">
                Badge / Label Mini
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Contoh: Standar Nasional & Karakter"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            {/* Color Theme */}
            <div>
              <label className="block text-xs font-bold text-[#1A293B] mb-1">
                Warna Tema Aksen
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              >
                {COLOR_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-bold text-[#1A293B] mb-1">
              Pilihan Ikon
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 border border-[#DDE6F1] rounded-xl bg-[#F8FAFC]">
              {ICON_OPTIONS.map((opt) => {
                const IconCmp = opt.icon;
                const isSelected = icon === opt.name;
                return (
                  <button
                    type="button"
                    key={opt.name}
                    onClick={() => setIcon(opt.name)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B2F6B] text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <IconCmp className="w-5 h-5" />
                    <span className="text-[10px] font-medium line-clamp-1 leading-tight">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#1A293B] mb-1">
              Deskripsi Kurikulum <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Jelaskan gambaran umum, metode, dan tujuan kurikulum ini..."
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              required
            />
          </div>

          {/* Highlights / Keunggulan Array */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#1A293B]">
                Poin Capaian & Keunggulan Program
              </label>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B2F6B] hover:text-[#1A4FA0] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Poin
              </button>
            </div>

            <div className="space-y-2">
              {highlights.map((h, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={h}
                    onChange={(e) => handleHighlightChange(e.target.value, idx)}
                    placeholder={`Poin capaian / keunggulan ${idx + 1}...`}
                    className="flex-1 p-2 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Hapus baris ini"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Poin capaian akan tampil sebagai daftar checklist (centang merah) di kartu kurikulum masing-masing unit.
            </p>
          </div>

          {/* Sort Order & Active */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-[#1A293B] mb-1">
                Urutan Tampilan
              </label>
              <input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#0B2F6B] rounded focus:ring-[#0B2F6B]"
                />
                <span className="text-xs font-bold text-[#1A293B]">
                  Aktifkan / Tampilkan di Website
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#0B2F6B] hover:bg-[#1A4FA0] text-white rounded-xl text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? 'Menyimpan...' : editId ? 'Simpan Perubahan' : 'Tambah Kurikulum'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CurriculumListPage;
