import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Plus, Edit, Trash2, Calendar, MapPin, Clock, School, Tag } from 'lucide-react';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const CATEGORIES = [
  'Akademik',
  'Ujian',
  'Persiapan PTN',
  'Try Out UTBK',
  'Riset & Sains',
  'Bimbingan Karir',
  'Kegiatan Siswa',
  'Peringatan',
  'Kesiswaan',
  'Wali Murid',
  'Tahfidz',
  'Umum'
];

export function AgendaListPage() {
  const [agendas, setAgendas] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [unitId, setUnitId] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [category, setCategory] = useState('Akademik');
  const [day, setDay] = useState('01');
  const [month, setMonth] = useState('Januari');
  const [year, setYear] = useState('2026');
  const [time, setTime] = useState('08:00 - 12:00 WIB');
  const [location, setLocation] = useState('Aula Utama Pesantren Cendekia Amanah');
  const [status, setStatus] = useState('Mendatang');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useUI();

  const loadUnits = async () => {
    try {
      const res: any = await apiClient.get('/admin/units');
      if (res?.data) setUnits(res.data);
    } catch {
      // ignore
    }
  };

  const loadAgendas = async () => {
    try {
      setIsLoading(true);
      const url = selectedUnitFilter && selectedUnitFilter !== 'all'
        ? `/admin/agendas?unitId=${selectedUnitFilter}`
        : '/admin/agendas';
      const res: any = await apiClient.get(url);
      if (res?.data) setAgendas(res.data);
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat agenda', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, []);

  useEffect(() => {
    loadAgendas();
  }, [selectedUnitFilter]);

  const handleDateChange = (val: string) => {
    setEventDate(val);
    if (!val) return;
    const parts = val.split('-');
    if (parts.length === 3) {
      const y = parts[0];
      const mIdx = parseInt(parts[1], 10) - 1;
      const d = parts[2];
      setDay(d);
      if (MONTH_NAMES[mIdx]) setMonth(MONTH_NAMES[mIdx]);
      setYear(y);
    }
  };

  const handleOpenCreate = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setUnitId(selectedUnitFilter !== 'all' ? selectedUnitFilter : '');
    setEventDate('');
    setCategory('Akademik');
    setDay('01');
    setMonth('Oktober');
    setYear('2026');
    setTime('08:00 - 12:00 WIB');
    setLocation('Kampus Pesantren Cendekia Amanah');
    setStatus('Mendatang');
    setIsFeatured(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (a: any) => {
    setEditId(a.id);
    setTitle(a.title);
    setDescription(a.description || '');
    setUnitId(a.unitId || '');
    setEventDate(a.eventDate || '');
    setCategory(a.category || 'Akademik');
    setDay(a.day);
    setMonth(a.month);
    setYear(a.year);
    setTime(a.time);
    setLocation(a.location || '');
    setStatus(a.status || 'Mendatang');
    setIsFeatured(a.isFeatured);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = {
        title,
        description,
        unitId: unitId || null,
        eventDate: eventDate || null,
        category: category || 'Akademik',
        day,
        month,
        year,
        time,
        location,
        status,
        isFeatured
      };
      if (editId) {
        await apiClient.put(`/admin/agendas/${editId}`, payload);
        addToast('Agenda berhasil diperbarui', 'success');
      } else {
        await apiClient.post('/admin/agendas', payload);
        addToast('Agenda baru berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      loadAgendas();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan agenda', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus agenda "${title}"?`)) return;
    try {
      await apiClient.delete(`/admin/agendas/${id}`);
      addToast('Agenda berhasil dihapus', 'success');
      loadAgendas();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus agenda', 'error');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Tanggal',
      render: (a) => (
        <div className="flex items-center gap-3">
          <div className="w-13 h-13 rounded-2xl bg-[#0B2F6B] text-white flex flex-col items-center justify-center font-bold shrink-0 shadow-sm border border-[#1A4FA0]/20">
            <span className="text-base leading-none">{a.day}</span>
            <span className="text-[10px] text-[#F0BD28] uppercase font-semibold mt-0.5">{a.month.slice(0, 3)}</span>
          </div>
          {a.eventDate && (
            <span className="text-[10px] text-[#64748B] font-mono hidden sm:inline">
              {a.eventDate}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Kegiatan & Informasi',
      render: (a) => (
        <div className="space-y-1.5 py-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold text-[#0B2F6B] text-sm">{a.title}</h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F8FAFC] text-[#0B2F6B] border border-[#DDE6F1]">
              {a.category || 'Akademik'}
            </span>
            {a.unit ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF3FF] text-[#1F5FD0]">
                {a.unit.shortName || a.unit.name}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-normal bg-gray-100 text-gray-600">
                Semua Unit (Umum)
              </span>
            )}
          </div>
          <p className="text-xs text-[#64748B] line-clamp-1">{a.description}</p>
          <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#1F5FD0]" />
              {a.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D8232A]" />
              {a.location}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      render: (a) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF3FF] text-[#1F5FD0]">
          {a.status || 'Mendatang'}
        </span>
      )
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (a) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(a)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B2F6B] hover:bg-gray-100 transition-colors"
            title="Edit Agenda"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(a.id, a.title)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Agenda"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Agenda & Kalender Akademik' }]} />

      {/* Filter Tabs by Unit */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#DDE6F1] shadow-xs">
        <span className="text-xs font-bold text-[#64748B] px-3 py-1 flex items-center gap-1.5">
          <School className="w-3.5 h-3.5 text-[#0B2F6B]" />
          Filter Unit:
        </span>
        <button
          onClick={() => setSelectedUnitFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedUnitFilter === 'all'
              ? 'bg-[#0B2F6B] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0B2F6B] hover:bg-[#F8FAFC]'
          }`}
        >
          Semua Agenda
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
      </div>

      <DataTable
        title="Agenda & Kalender Akademik"
        description="Kelola jadwal akademik sekolah, ujian semester, kegiatan santri, dan kalender kegiatan unit pendidikan."
        columns={columns}
        data={agendas}
        isLoading={isLoading}
        actionButton={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Agenda</span>
          </button>
        }
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Agenda / Kalender Akademik' : 'Tambah Agenda / Kalender Akademik Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Judul Agenda / Kegiatan</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Contoh: Penilaian Tengah Semester (PTS) Ganjil"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Unit Pendidikan</label>
              <select
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              >
                <option value="">Semua Unit (Umum / Pesantren)</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.shortName || u.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">
                Kategori Agenda <span className="text-[10px] text-[#64748B]">(Pilih atau ketik kategori baru)</span>
              </label>
              <input
                type="text"
                list="category-options"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Contoh: Persiapan PTN / Ujian"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
              <datalist id="category-options">
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Tanggal Picker */}
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#DDE6F1] space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0B2F6B]" />
                Pilih Tanggal Kegiatan (Otomatis mengisi Hari/Bulan/Tahun)
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-[#DDE6F1] rounded-lg focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#64748B]">Tanggal (Hari)</label>
                <input
                  type="text"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="25"
                  className="w-full p-2 text-xs bg-white border border-[#DDE6F1] rounded-lg focus:outline-hidden focus:border-[#1F5FD0]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#64748B]">Bulan</label>
                <input
                  type="text"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="Oktober"
                  className="w-full p-2 text-xs bg-white border border-[#DDE6F1] rounded-lg focus:outline-hidden focus:border-[#1F5FD0]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#64748B]">Tahun</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2026"
                  className="w-full p-2 text-xs bg-white border border-[#DDE6F1] rounded-lg focus:outline-hidden focus:border-[#1F5FD0]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Waktu Pelaksanaan</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="08:00 - 12:00 WIB"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Lokasi Acara</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ruang Kelas SMP / Aula Utama"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Deskripsi Singkat Kegiatan</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Deskripsi rincian kegiatan..."
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
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
              {isSaving ? 'Menyimpan...' : 'Simpan Agenda'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
