import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Modal } from '../../components/ui/Modal';
import {
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  ArrowUpRight,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { PpdbLinkItem } from '../../types';

export function PpdbLinksPage() {
  const [links, setLinks] = useState<PpdbLinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PpdbLinkItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [unitCode, setUnitCode] = useState('');
  const [unitName, setUnitName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [academicYear, setAcademicYear] = useState('2027/2028');
  const [badge, setBadge] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const { addToast } = useUI();

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/ppdb/links');
      if (res?.data) {
        setLinks(res.data);
      }
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat daftar tautan PPDB', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleOpenModal = (item?: PpdbLinkItem) => {
    if (item) {
      setEditingItem(item);
      setUnitCode(item.unitCode);
      setUnitName(item.unitName);
      setTitle(item.title);
      setDescription(item.description || '');
      setFormUrl(item.formUrl);
      setAcademicYear(item.academicYear || '2027/2028');
      setBadge(item.badge || '');
      setSortOrder(item.sortOrder);
      setIsActive(item.isActive);
    } else {
      setEditingItem(null);
      setUnitCode('sma');
      setUnitName('SMA Cendekia Amanah');
      setTitle('SPMB 2027-2028 SMA PCA');
      setDescription('Pendaftaran Peserta Didik Baru Jenjang SMA Boarding / Fullday School');
      setFormUrl('');
      setAcademicYear('2027/2028');
      setBadge('Boarding & Fullday');
      setSortOrder(links.length + 1);
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUrl.trim()) {
      addToast('Tautan formulir (URL) wajib diisi', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        unitCode,
        unitName,
        title,
        description,
        formUrl: formUrl.trim(),
        academicYear,
        badge,
        sortOrder: Number(sortOrder),
        isActive
      };

      if (editingItem) {
        await apiClient.put(`/admin/ppdb/links/${editingItem.id}`, payload);
        addToast('Tautan formulir PPDB berhasil diperbarui', 'success');
      } else {
        await apiClient.post('/admin/ppdb/links', payload);
        addToast('Tautan formulir PPDB berhasil ditambahkan', 'success');
      }

      setIsModalOpen(false);
      fetchLinks();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan tautan PPDB', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus tautan form untuk ${name}?`)) return;

    try {
      await apiClient.delete(`/admin/ppdb/links/${id}`);
      addToast('Tautan formulir PPDB berhasil dihapus', 'success');
      fetchLinks();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus tautan PPDB', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs
        items={[
          { label: 'PPDB Online', href: '/ppdb' },
          { label: 'Tautan Form PPDB Unit' }
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0B2F6B] flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#1F5FD0]" />
            <span>Tautan Formulir PPDB Unit (SPMB)</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Konfigurasi tautan formulir pendaftaran eksternal (Google Forms, Bitly, dll.) per unit pendidikan. Tautan ini akan dibuka saat pengunjung mengklik tombol <strong>PPDB ONLINE</strong> di website.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tautan Unit</span>
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-[#EBF3FC] border border-[#BFDBFE] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#1E3A8A]">
        <Sparkles className="w-5 h-5 text-[#1F5FD0] shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Integrasi Tombol PPDB Online Website Publik</p>
          <p className="text-[#3B82F6] mt-0.5 leading-relaxed">
            Ketika pengunjung mengklik tombol <strong>&quot;PPDB ONLINE&quot;</strong> di header, footer, maupun banner, sistem otomatis menampilkan modal interaktif berisi pilihan unit di bawah ini. Pengunjung langsung diarahkan ke form resmi unit tujuan masing-masing.
          </p>
        </div>
      </div>

      {/* List Cards */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#64748B] animate-pulse">
          Memuat daftar tautan PPDB unit...
        </div>
      ) : links.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#DDE6F1] shadow-xs space-y-3">
          <LinkIcon className="w-10 h-10 text-[#94A3B8] mx-auto" />
          <h3 className="text-sm font-bold text-[#1A293B]">Belum ada tautan formulir PPDB</h3>
          <p className="text-xs text-[#64748B]">Klik tombol di atas untuk menambahkan tautan form unit baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {links.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-[#DDE6F1] shadow-sm hover:border-[#1F5FD0]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0B2F6B] text-white">
                      {item.unitCode}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDE8E9] text-[#D8232A]">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                      item.isActive ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {item.isActive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aktif</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Non-aktif</span>
                      </>
                    )}
                  </span>
                </div>

                <h3 className="text-sm font-black text-[#0B2F6B] leading-snug">{item.title}</h3>
                <p className="text-xs font-semibold text-[#D8232A] mt-0.5">{item.unitName}</p>
                <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                  {item.description || 'Tidak ada deskripsi'}
                </p>

                {/* Form URL Box */}
                <div className="mt-3.5 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <LinkIcon className="w-3.5 h-3.5 text-[#1F5FD0] shrink-0" />
                    <span className="text-xs font-mono text-[#0B2F6B] truncate select-all">
                      {item.formUrl}
                    </span>
                  </div>
                  <a
                    href={item.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#1F5FD0] bg-white border border-[#BFDBFE] hover:bg-[#EBF3FC] transition-colors shrink-0"
                    title="Buka form di tab baru"
                  >
                    <span>Uji Form</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-[#64748B]">
                  TP: <strong className="text-[#1A293B]">{item.academicYear}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-1.5 rounded-lg text-[#1F5FD0] hover:bg-[#EBF3FC] transition-colors"
                    title="Edit Tautan"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-1.5 rounded-lg text-[#D8232A] hover:bg-[#FEE2E2] transition-colors"
                    title="Hapus Tautan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? 'Edit Tautan Formulir PPDB' : 'Tambah Tautan Formulir PPDB'}
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#1A293B]">Kode Unit</label>
                <select
                  value={unitCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    setUnitCode(code);
                    if (code === 'sma') setUnitName('SMA Cendekia Amanah');
                    else if (code === 'smp') setUnitName('SMP Cendekia Amanah');
                    else if (code === 'mdta') setUnitName('Madrasah Diniyah (MDTA / MDTU)');
                    else if (code === 'pesantren') setUnitName('Pesantren Cendekia Amanah');
                  }}
                  className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] font-semibold"
                >
                  <option value="sma">SMA (sma)</option>
                  <option value="smp">SMP (smp)</option>
                  <option value="mdta">MDTA (mdta)</option>
                  <option value="pesantren">Pesantren (pesantren)</option>
                  <option value="umum">Umum (umum)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#1A293B]">Nama Unit Pendidikan</label>
                <input
                  type="text"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  placeholder="SMA Cendekia Amanah"
                  className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1A293B]">Judul Pendaftaran</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="SPMB 2027-2028 SMA PCA"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] font-bold text-[#0B2F6B]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1A293B]">
                Tautan Formulir Pendaftaran (URL Form)
              </label>
              <input
                type="url"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://bit.ly/... atau https://forms.gle/..."
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] font-mono text-[#0B2F6B]"
                required
              />
              <p className="text-[10px] text-[#64748B]">
                Contoh: <code>https://bit.ly/SPMB_SMAPCA_27-28</code> atau tautan Google Form resmi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#1A293B]">Tahun Ajaran</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2027/2028"
                  className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#1A293B]">Badge Info</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Boarding & Fullday"
                  className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1A293B]">Deskripsi Singkat</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Pendaftaran Peserta Didik Baru Jenjang SMA..."
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#1A293B]">Urutan Tampilan</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1F5FD0] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isActiveCheck" className="text-xs font-bold text-[#1A293B] cursor-pointer">
                  Tampilkan di Website
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] rounded-xl shadow-xs transition-all"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Tautan'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
