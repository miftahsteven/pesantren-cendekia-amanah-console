import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Drawer } from '../../components/ui/Drawer';
import { Modal } from '../../components/ui/Modal';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import {
  Download,
  Eye,
  CheckCircle,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Building,
  FileCheck
} from 'lucide-react';
import { PpdbApplication, PpdbStatus } from '../../types';

export function PPDBListPage() {
  const [applicants, setApplicants] = useState<PpdbApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [unitFilter, setUnitFilter] = useState('ALL');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Detail Drawer state
  const [selectedApplicant, setSelectedApplicant] = useState<PpdbApplication | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Status Change Modal state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<PpdbStatus>('VERIFIED');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { addToast } = useUI();

  const loadApplicants = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (activeTab !== 'ALL') params.append('status', activeTab);
      if (unitFilter !== 'ALL') params.append('unit', unitFilter);
      params.append('page', String(pagination.page));
      params.append('limit', '20');

      const res: any = await apiClient.get(`/admin/ppdb?${params.toString()}`);
      if (res?.data) {
        setApplicants(res.data);
        if (res.pagination) {
          setPagination({
            page: res.pagination.page,
            totalPages: res.pagination.totalPages,
            total: res.pagination.total
          });
        }
      }
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat data pendaftar PPDB', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, [search, activeTab, unitFilter, pagination.page]);

  const handleOpenDetail = (app: PpdbApplication) => {
    setSelectedApplicant(app);
    setDrawerOpen(true);
  };

  const handleOpenStatusModal = (app: PpdbApplication) => {
    setSelectedApplicant(app);
    setTargetStatus(app.status);
    setAdminNotes(app.notes || '');
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplicant) return;

    try {
      setIsUpdatingStatus(true);
      await apiClient.patch(`/admin/ppdb/${selectedApplicant.id}/status`, {
        status: targetStatus,
        notes: adminNotes
      });
      addToast(`Status pendaftaran berhasil diubah menjadi ${targetStatus}`, 'success');
      setStatusModalOpen(false);
      setDrawerOpen(false);
      loadApplicants();
    } catch (err: any) {
      addToast(err.message || 'Gagal memperbarui status', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const res: any = await apiClient.get('/admin/ppdb/export');
      if (res?.data) {
        const rows = res.data.map((r: any) => ({
          'No. Registrasi': r.registrationNo,
          'Tahun Ajaran': r.academicYear,
          'Nama Santri': r.fullName,
          'NISN': r.nisn,
          'Tempat Tgl Lahir': r.birthPlaceDate,
          'Asal Sekolah': r.previousSchool,
          'Wali Santri': r.parentName,
          'WhatsApp': r.whatsapp,
          'Unit Pilihan': r.unit?.name || r.unitCode,
          'Status': r.status,
          'Alamat': r.address
        }));

        const csvContent =
          'data:text/csv;charset=utf-8,' +
          [Object.keys(rows[0] || {}).join(','), ...rows.map((e: any) => Object.values(e).map((v) => `"${v}"`).join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `PPDB_Cendekia_Amanah_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        addToast('File CSV pendaftar PPDB berhasil diexport', 'success');
      }
    } catch (err: any) {
      addToast(err.message || 'Gagal export data PPDB', 'error');
    }
  };

  const columns: Column<PpdbApplication>[] = [
    {
      header: 'No. Reg & Santri',
      render: (a) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-[#1F5FD0] bg-[#EBF3FF] px-2 py-0.5 rounded">
            {a.registrationNo}
          </span>
          <h4 className="font-bold text-[#0B2F6B] text-xs sm:text-sm mt-1">{a.fullName}</h4>
          <p className="text-[11px] text-[#64748B]">NISN: {a.nisn}</p>
        </div>
      )
    },
    {
      header: 'Unit Pilihan',
      render: (a) => (
        <div>
          <span className="font-semibold text-xs text-[#0B2F6B]">
            {a.unit?.name || a.unitCode.toUpperCase()}
          </span>
          <p className="text-[10px] text-[#64748B]">{a.academicYear}</p>
        </div>
      )
    },
    {
      header: 'Kontak Orang Tua',
      render: (a) => (
        <div className="space-y-0.5 text-xs">
          <p className="font-bold text-[#1A293B]">{a.parentName}</p>
          <a
            href={`https://wa.me/${a.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#17804A] hover:underline flex items-center gap-1 font-semibold"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{a.whatsapp}</span>
          </a>
        </div>
      )
    },
    {
      header: 'Status Berkas',
      render: (a) => <StatusBadge status={a.status} />
    },
    {
      header: 'Tgl Masuk',
      render: (a) => (
        <span className="text-[#64748B] text-[11px]">
          {new Date(a.createdAt || a.submittedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </span>
      )
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (a) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenDetail(a)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F4F7FB] text-[#0B2F6B] hover:bg-[#EBF3FF] hover:text-[#1F5FD0] flex items-center gap-1 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Detail</span>
          </button>
          <button
            onClick={() => handleOpenStatusModal(a)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#0B2F6B] text-white hover:bg-[#1A4FA0] transition-colors"
          >
            Ubah Status
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Pendaftar PPDB Online' }]} />

      <DataTable
        title="Pusat Data Penerimaan Santri Baru (PPDB)"
        description="Kelola verifikasi berkas, tindak lanjut calon santri, dan status kelulusan penerimaan."
        columns={columns}
        data={applicants}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari nama santri, no registrasi, NISN, atau WhatsApp..."
        tabs={[
          { key: 'ALL', label: 'Semua Status' },
          { key: 'SUBMITTED', label: 'Baru Masuk' },
          { key: 'VERIFIED', label: 'Terverifikasi' },
          { key: 'CONTACTED', label: 'Dihubungi' },
          { key: 'ACCEPTED', label: 'Diterima' },
          { key: 'REJECTED', label: 'Ditolak' }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actionButton={
          <div className="flex items-center gap-2">
            <select
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              className="p-2 text-xs font-bold text-[#0B2F6B] bg-white border border-[#DDE6F1] rounded-xl focus:outline-hidden"
            >
              <option value="ALL">Semua Unit</option>
              <option value="pesantren">Pesantren</option>
              <option value="smp">SMP Cendekia</option>
              <option value="sma">SMA Cendekia</option>
              <option value="diniyah">Madrasah Diniyah</option>
            </select>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#17804A] hover:bg-[#13683C] shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        }
        pagination={{
          page: pagination.page,
          totalPages: pagination.totalPages,
          total: pagination.total,
          onPageChange: (newPage) => setPagination((prev) => ({ ...prev, page: newPage }))
        }}
      />

      {/* Applicant Detail Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Biodata Lengkap Calon Santri"
        subtitle={`Nomor Registrasi: ${selectedApplicant?.registrationNo || ''}`}
        width="max-w-2xl"
      >
        {selectedApplicant && (
          <div className="space-y-6">
            {/* Status Header Banner */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#DDE6F1] flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#64748B] uppercase font-bold">Status Pendaftaran</p>
                <div className="mt-1">
                  <StatusBadge status={selectedApplicant.status} />
                </div>
              </div>

              <button
                onClick={() => {
                  setTargetStatus(selectedApplicant.status);
                  setAdminNotes(selectedApplicant.notes || '');
                  setStatusModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0B2F6B] text-white hover:bg-[#1A4FA0] transition-colors"
              >
                Ubah Status
              </button>
            </div>

            {/* Student Info Card */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-[#0B2F6B] uppercase tracking-wider">
                1. Data Pribadi Santri
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-[#DDE6F1] text-xs">
                <div>
                  <span className="text-[#64748B]">Nama Lengkap:</span>
                  <p className="font-bold text-[#0B2F6B] text-sm mt-0.5">{selectedApplicant.fullName}</p>
                </div>
                <div>
                  <span className="text-[#64748B]">NISN:</span>
                  <p className="font-bold text-[#1A293B] mt-0.5">{selectedApplicant.nisn}</p>
                </div>
                <div>
                  <span className="text-[#64748B]">Tempat & Tanggal Lahir:</span>
                  <p className="font-semibold text-[#1A293B] mt-0.5">{selectedApplicant.birthPlaceDate}</p>
                </div>
                <div>
                  <span className="text-[#64748B]">Asal Sekolah Sebelumnya:</span>
                  <p className="font-semibold text-[#1A293B] mt-0.5">{selectedApplicant.previousSchool}</p>
                </div>
              </div>
            </div>

            {/* Target Unit & Program Card */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-[#0B2F6B] uppercase tracking-wider">
                2. Pilihan Jenjang & Program
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-[#DDE6F1] text-xs">
                <div>
                  <span className="text-[#64748B]">Jenjang Pendidikan:</span>
                  <p className="font-bold text-[#1F5FD0] mt-0.5">
                    {selectedApplicant.unit?.name || selectedApplicant.unitCode.toUpperCase()}
                  </p>
                </div>
                <div>
                  <span className="text-[#64748B]">Tahun Ajaran:</span>
                  <p className="font-semibold text-[#1A293B] mt-0.5">{selectedApplicant.academicYear}</p>
                </div>
              </div>
            </div>

            {/* Parents & Address Card */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-[#0B2F6B] uppercase tracking-wider">
                3. Data Orang Tua / Wali
              </h4>
              <div className="space-y-3 bg-[#F8FAFC] p-4 rounded-2xl border border-[#DDE6F1] text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[#64748B]">Nama Orang Tua / Wali:</span>
                    <p className="font-bold text-[#1A293B] mt-0.5">{selectedApplicant.parentName}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B]">No. WhatsApp Aktif:</span>
                    <p className="font-bold text-[#17804A] mt-0.5 flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{selectedApplicant.whatsapp}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-[#64748B]">Alamat Lengkap Domisili:</span>
                  <p className="font-medium text-[#1A293B] mt-0.5 leading-relaxed">
                    {selectedApplicant.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Button */}
            <a
              href={`https://wa.me/${selectedApplicant.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Assalamu'alaikum Wr. Wb. Bapak/Ibu ${selectedApplicant.parentName}, kami dari Panitia PPDB Pesantren Cendekia Amanah terkait pendaftaran ananda ${selectedApplicant.fullName} (No. Reg: ${selectedApplicant.registrationNo}).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-full text-xs font-bold text-white bg-[#17804A] hover:bg-[#13683C] flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi Wali Santri via WhatsApp</span>
            </a>
          </div>
        )}
      </Drawer>

      {/* Change Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Ubah Status Verifikasi Pendaftar"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DDE6F1] text-xs space-y-1">
            <p className="font-bold text-[#0B2F6B]">{selectedApplicant?.fullName}</p>
            <p className="text-[#64748B]">No. Reg: {selectedApplicant?.registrationNo}</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Pilih Status Baru</label>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value as PpdbStatus)}
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] font-bold text-[#0B2F6B]"
            >
              <option value="SUBMITTED">SUBMITTED (Baru Masuk)</option>
              <option value="VERIFIED">VERIFIED (Berkas Terverifikasi)</option>
              <option value="CONTACTED">CONTACTED (Sudah Dihubungi Panitia)</option>
              <option value="ACCEPTED">ACCEPTED (Dinyatakan Diterima)</option>
              <option value="REJECTED">REJECTED (Ditolak / Gugur)</option>
              <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Catatan Panitia / Alasan</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              placeholder="Tambahkan catatan internal mengenai hasil tes, wawancara, atau kelengkapan berkas..."
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="pt-3 border-t border-[#DDE6F1] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setStatusModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUpdatingStatus}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0]"
            >
              {isUpdatingStatus ? 'Memperbarui...' : 'Simpan Status'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
