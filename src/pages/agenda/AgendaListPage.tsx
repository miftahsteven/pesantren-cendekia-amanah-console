import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Plus, Edit, Trash2, Calendar, MapPin, Clock } from 'lucide-react';

export function AgendaListPage() {
  const [agendas, setAgendas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [day, setDay] = useState('01');
  const [month, setMonth] = useState('Januari');
  const [year, setYear] = useState('2026');
  const [time, setTime] = useState('08:00 - 12:00 WIB');
  const [location, setLocation] = useState('Aula Utama Pesantren Cendekia Amanah');
  const [status, setStatus] = useState('Mendatang');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useUI();

  const loadAgendas = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/agendas');
      if (res?.data) setAgendas(res.data);
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat agenda', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAgendas();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setDay('01');
    setMonth('Januari');
    setYear('2026');
    setTime('08:00 WIB');
    setLocation('Kampus Pesantren Cendekia Amanah');
    setStatus('Mendatang');
    setIsFeatured(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (a: any) => {
    setEditId(a.id);
    setTitle(a.title);
    setDescription(a.description || '');
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
      const payload = { title, description, day, month, year, time, location, status, isFeatured };
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
        <div className="w-14 h-14 rounded-2xl bg-[#0B2F6B] text-white flex flex-col items-center justify-center font-bold shrink-0">
          <span className="text-base leading-none">{a.day}</span>
          <span className="text-[10px] text-[#F0BD28] uppercase">{a.month.slice(0, 3)}</span>
        </div>
      )
    },
    {
      header: 'Kegiatan & Lokasi',
      render: (a) => (
        <div className="space-y-1">
          <h4 className="font-bold text-[#0B2F6B]">{a.title}</h4>
          <p className="text-xs text-[#64748B] line-clamp-1">{a.description}</p>
          <div className="flex items-center gap-3 text-[11px] text-[#64748B] pt-0.5">
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
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(a.id, a.title)}
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
      <Breadcrumbs items={[{ label: 'Agenda Kegiatan' }]} />

      <DataTable
        title="Agenda & Jadwal Kegiatan"
        description="Kelola jadwal kajian, wisuda, perlombaan, dan agenda resmi pesantren."
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
        title={editId ? 'Edit Agenda Kegiatan' : 'Tambah Agenda Kegiatan Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Judul Agenda</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Contoh: Wisuda Akbar & Haflah Santri 2026"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Tanggal (Hari)</label>
              <input
                type="text"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="25"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Bulan</label>
              <input
                type="text"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="Juni"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Tahun</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2026"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
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
                placeholder="Aula Utama / Masjid"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Deskripsi Singkat</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Deskripsi rincian acara..."
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
