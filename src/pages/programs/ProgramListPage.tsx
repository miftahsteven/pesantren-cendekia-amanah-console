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
  Sparkles,
  BookOpen,
  Heart,
  Globe,
  Users,
  GraduationCap,
  Microscope,
  Languages,
  Award,
  Briefcase,
  Laptop,
  Cpu,
  Trophy,
  HeartHandshake,
  UserCheck,
  Scroll,
  ShieldCheck,
  Compass,
  Code,
  School,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

const ICON_OPTIONS = [
  { name: 'BookOpen', label: 'Buku / Akademik', icon: BookOpen },
  { name: 'GraduationCap', label: 'Toga / PTN', icon: GraduationCap },
  { name: 'Microscope', label: 'Riset / Sains', icon: Microscope },
  { name: 'Languages', label: 'Bahasa Asing', icon: Languages },
  { name: 'Award', label: 'Prestasi / Juara', icon: Award },
  { name: 'Briefcase', label: 'Karir / Mentoring', icon: Briefcase },
  { name: 'Laptop', label: 'Digital / Komputer', icon: Laptop },
  { name: 'Cpu', label: 'Robotika / IT', icon: Cpu },
  { name: 'Trophy', label: 'Ekstrakurikuler', icon: Trophy },
  { name: 'HeartHandshake', label: 'Karakter / Adab', icon: HeartHandshake },
  { name: 'UserCheck', label: 'Kepemimpinan', icon: UserCheck },
  { name: 'Scroll', label: 'Kitab / Tarikh', icon: Scroll },
  { name: 'ShieldCheck', label: 'Aqidah / Disiplin', icon: ShieldCheck },
  { name: 'Sparkles', label: 'Inovasi / Unggulan', icon: Sparkles },
  { name: 'Globe', label: 'Wawasan Global', icon: Globe },
  { name: 'Users', label: 'Organisasi / Santri', icon: Users },
  { name: 'Heart', label: 'Kepedulian Sosial', icon: Heart },
  { name: 'Compass', label: 'Pemandu / Eksplorasi', icon: Compass },
  { name: 'Code', label: 'Pemrograman / Coding', icon: Code }
];

const ICON_MAP: Record<string, any> = {
  BookOpen,
  GraduationCap,
  Microscope,
  Languages,
  Award,
  Briefcase,
  Laptop,
  Cpu,
  Trophy,
  HeartHandshake,
  UserCheck,
  Scroll,
  ShieldCheck,
  Sparkles,
  Globe,
  Users,
  Heart,
  Compass,
  Code
};

export function ProgramListPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [unitId, setUnitId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('BookOpen');
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

  const loadPrograms = async () => {
    try {
      setIsLoading(true);
      if (selectedUnitFilter === 'home') {
        const res: any = await apiClient.get('/admin/featured-programs');
        if (res?.data) {
          setPrograms(
            res.data.map((p: any) => ({
              ...p,
              description: p.desc || p.description,
              isHomeFeatured: true
            }))
          );
        }
      } else {
        const url =
          selectedUnitFilter && selectedUnitFilter !== 'all'
            ? `/admin/unit-programs?unitId=${selectedUnitFilter}`
            : '/admin/unit-programs';
        const res: any = await apiClient.get(url);
        if (res?.data) {
          setPrograms(res.data);
        }
      }
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat program unggulan', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, []);

  useEffect(() => {
    loadPrograms();
  }, [selectedUnitFilter]);

  const handleOpenCreate = () => {
    setEditId(null);
    if (selectedUnitFilter !== 'all' && selectedUnitFilter !== 'home') {
      setUnitId(selectedUnitFilter);
    } else if (units.length > 0) {
      setUnitId(units[0].id);
    } else {
      setUnitId('');
    }
    setTitle('');
    setDescription('');
    setIcon('BookOpen');
    setSortOrder(programs.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (prog: any) => {
    setEditId(prog.id);
    setUnitId(prog.unitId || (selectedUnitFilter !== 'home' && selectedUnitFilter !== 'all' ? selectedUnitFilter : units[0]?.id || ''));
    setTitle(prog.title || '');
    setDescription(prog.description || prog.desc || '');
    setIcon(prog.icon || prog.iconName || 'BookOpen');
    setSortOrder(prog.sortOrder ?? 1);
    setIsActive(prog.isActive !== undefined ? Boolean(prog.isActive) : true);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const isHome = selectedUnitFilter === 'home';

      if (isHome) {
        if (editId) {
          await apiClient.put(`/admin/featured-programs/${editId}`, {
            title,
            desc: description,
            icon,
            sortOrder: Number(sortOrder),
            isActive
          });
          addToast('Program unggulan beranda berhasil diperbarui', 'success');
        } else {
          await apiClient.post('/admin/featured-programs', {
            title,
            desc: description,
            icon,
            sortOrder: Number(sortOrder),
            isActive
          });
          addToast('Program unggulan beranda baru berhasil ditambahkan', 'success');
        }
      } else {
        if (!unitId) {
          addToast('Unit pendidikan wajib dipilih', 'error');
          setIsSaving(false);
          return;
        }

        if (editId) {
          await apiClient.put(`/admin/unit-programs/${editId}`, {
            unitId,
            title,
            description,
            icon,
            sortOrder: Number(sortOrder),
            isActive
          });
          addToast('Program unggulan unit berhasil diperbarui', 'success');
        } else {
          await apiClient.post('/admin/unit-programs', {
            unitId,
            title,
            description,
            icon,
            sortOrder: Number(sortOrder),
            isActive
          });
          addToast('Program unggulan unit baru berhasil ditambahkan', 'success');
        }
      }

      setModalOpen(false);
      loadPrograms();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan program', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, progTitle: string, isHome?: boolean) => {
    if (!window.confirm(`Hapus program unggulan "${progTitle}"?`)) return;
    try {
      if (isHome || selectedUnitFilter === 'home') {
        await apiClient.delete(`/admin/featured-programs/${id}`);
      } else {
        await apiClient.delete(`/admin/unit-programs/${id}`);
      }
      addToast('Program unggulan berhasil dihapus', 'success');
      loadPrograms();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus program', 'error');
    }
  };

  // Helper for unit badge color
  const getUnitBadge = (prog: any) => {
    if (prog.isHomeFeatured || selectedUnitFilter === 'home') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          Beranda / Utama
        </span>
      );
    }

    const code = (prog.unit?.code || '').toLowerCase();
    const name = prog.unit?.shortName || prog.unit?.name || 'Unit';

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

  const selectedUnitObj = units.find((u) => u.id === selectedUnitFilter);

  const getPageTitle = () => {
    if (selectedUnitFilter === 'home') return 'Program Unggulan Beranda Website';
    if (selectedUnitObj) return `Program Unggulan ${selectedUnitObj.shortName || selectedUnitObj.name}`;
    return 'Semua Program Unggulan Unit';
  };

  const getPageDescription = () => {
    if (selectedUnitFilter === 'home') {
      return 'Kelola pilar program unggulan yang ditampilkan pada halaman depan / beranda website.';
    }
    if (selectedUnitObj) {
      return `Kelola 6 pilar program unggulan spesifik untuk unit ${selectedUnitObj.name} yang tampil di menu program unggulan unit.`;
    }
    return 'Kelola seluruh daftar program unggulan yang dikategorikan per unit pendidikan (Pesantren, SMP, SMA, MDTA).';
  };

  const columns: Column<any>[] = [
    {
      header: 'Program Unggulan',
      render: (prog) => {
        const IconComponent = ICON_MAP[prog.icon] || ICON_MAP[prog.iconName] || Sparkles;

        return (
          <div className="flex items-start gap-3 py-1">
            <div className="w-10 h-10 rounded-xl bg-[#EBF3FF] text-[#1A4FA0] flex items-center justify-center font-bold shrink-0 mt-0.5">
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-[#0B2F6B] text-sm">{prog.title}</h4>
                {prog.badge && (
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-semibold bg-[#F0BD28]/20 text-[#0B2F6B] border border-[#F0BD28]/30">
                    {prog.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] line-clamp-2 max-w-xl">
                {prog.description || prog.desc}
              </p>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Kategori Unit',
      render: (prog) => getUnitBadge(prog)
    },
    {
      header: 'Icon Simbol',
      render: (prog) => {
        const iconKey = prog.icon || prog.iconName || 'BookOpen';
        const IconComponent = ICON_MAP[iconKey] || Sparkles;
        return (
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-mono">
            <IconComponent className="w-3.5 h-3.5 text-[#1A4FA0]" />
            <span>{iconKey}</span>
          </div>
        );
      }
    },
    {
      header: 'Urutan',
      render: (prog) => (
        <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-[#F8FAFC] text-[#0B2F6B] border border-[#DDE6F1]">
          #{prog.sortOrder ?? 0}
        </span>
      )
    },
    {
      header: 'Status',
      render: (prog) =>
        prog.isActive !== false ? (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Aktif
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
            Nonaktif
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
            title="Edit Program"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(prog.id, prog.title, prog.isHomeFeatured)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Program"
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
          Semua Program Unit
        </button>
        {units.map((u) => (
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
          </button>
        ))}
        <button
          onClick={() => setSelectedUnitFilter('home')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedUnitFilter === 'home'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-[#64748B] hover:text-purple-700 hover:bg-[#F8FAFC]'
          }`}
        >
          Beranda (Website Utama)
        </button>
      </div>

      <DataTable
        title={getPageTitle()}
        description={getPageDescription()}
        columns={columns}
        data={programs}
        isLoading={isLoading}
        actionButton={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Program Unggulan</span>
          </button>
        }
      />

      {/* Program Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editId
            ? 'Edit Program Unggulan'
            : selectedUnitFilter === 'home'
            ? 'Tambah Program Unggulan Beranda'
            : 'Tambah Program Unggulan Unit'
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          {/* Unit Selector (only if not in home mode) */}
          {selectedUnitFilter !== 'home' ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">
                Unit Pendidikan <span className="text-red-500">*</span>
              </label>
              <select
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                required
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              >
                <option value="" disabled>
                  -- Pilih Unit Pendidikan --
                </option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.shortName || u.code})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Program ini akan ditampilkan pada highlight Program Unggulan di halaman beranda.</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">
              Judul Program <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Contoh: Academic Excellence & PTN Pathway"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">
              Deskripsi Program <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              placeholder="Jelaskan keunggulan dan rincian program pembelajaran ini..."
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          {/* Icon Selector with Visual Grid */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#1A293B]">
                Pilih Icon Simbol
              </label>
              <span className="text-[11px] font-mono text-[#1F5FD0] flex items-center gap-1 font-bold">
                {React.createElement(ICON_MAP[icon] || Sparkles, { className: 'w-3.5 h-3.5' })}
                {icon}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-44 overflow-y-auto p-2 bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl">
              {ICON_OPTIONS.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = icon === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setIcon(opt.name)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                      isSelected
                        ? 'bg-[#0B2F6B] text-white shadow-xs scale-95 font-bold'
                        : 'bg-white text-[#64748B] hover:text-[#0B2F6B] hover:bg-blue-50 border border-[#E2E8F0]'
                    }`}
                    title={opt.label}
                  >
                    <IconComp className="w-5 h-5 mb-1" />
                    <span className="text-[9px] truncate w-full">{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Urutan Tampil (Sort)</label>
              <input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2.5 bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-[#0B2F6B] focus:ring-0"
                />
                <span className="text-xs font-bold text-[#1A293B]">Tampilkan / Aktif di Website</span>
              </label>
            </div>
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
