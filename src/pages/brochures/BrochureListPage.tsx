import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Plus, Trash2, FileText, Download } from 'lucide-react';
import { getUploadUrl } from '../../lib/uploads';

export function BrochureListPage() {
  const [brochures, setBrochures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [unitName, setUnitName] = useState('Pesantren');
  const [title, setTitle] = useState('');
  const [fileSize, setFileSize] = useState('2.5 MB');
  const [fileUrl, setFileUrl] = useState('/uploads/brochures/brosur-pesantren.pdf');
  const [academicYear, setAcademicYear] = useState('2027/2028');
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useUI();

  const loadBrochures = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/brochures');
      if (res?.data) setBrochures(res.data);
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat brosur', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBrochures();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await apiClient.post('/admin/brochures', {
        unitName,
        title,
        fileSize,
        fileUrl,
        academicYear
      });
      addToast('Brosur PDF berhasil ditambahkan', 'success');
      setModalOpen(false);
      loadBrochures();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan brosur', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus brosur "${title}"?`)) return;
    try {
      await apiClient.delete(`/admin/brochures/${id}`);
      addToast('Brosur berhasil dihapus', 'success');
      loadBrochures();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus brosur', 'error');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Brosur & Dokumen',
      render: (b) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FEECEC] text-[#D8232A] flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#D8232A] uppercase tracking-wider">
              {b.unitName}
            </span>
            <h4 className="font-bold text-[#0B2F6B]">{b.title}</h4>
            <p className="text-xs text-[#64748B]">Tahun Ajaran: {b.academicYear}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Ukuran File',
      accessor: 'fileSize',
      className: 'font-mono text-xs text-[#64748B]'
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (b) => (
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={getUploadUrl(b.fileUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#1F5FD0] hover:bg-blue-50 transition-colors"
            title="Unduh File"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={() => handleDelete(b.id, b.title)}
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
      <Breadcrumbs items={[{ label: 'Brosur PDF' }]} />

      <DataTable
        title="Manajemen Brosur & Panduan PDF"
        description="Kelola file PDF brosur resmi pendaftaran per jenjang pendidikan."
        columns={columns}
        data={brochures}
        isLoading={isLoading}
        actionButton={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Brosur</span>
          </button>
        }
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tambah Brosur PDF Baru"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Unit Pendidikan</label>
              <select
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              >
                <option value="Pesantren">Pesantren</option>
                <option value="SMP">SMP Cendekia</option>
                <option value="SMA">SMA Cendekia</option>
                <option value="Diniyah">Madrasah Diniyah</option>
                <option value="Umum">Umum / Semua Unit</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Tahun Ajaran</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2027/2028"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Judul Brosur</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Contoh: Brosur Resmi PPDB Pesantren Cendekia Amanah"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Ukuran File</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="2.5 MB"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Path File PDF</label>
              <input
                type="text"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="/uploads/brochures/brosur.pdf"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
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
              {isSaving ? 'Menyimpan...' : 'Simpan Brosur'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
