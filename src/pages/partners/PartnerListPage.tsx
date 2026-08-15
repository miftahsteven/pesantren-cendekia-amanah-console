import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { getUploadUrl } from '../../lib/uploads';

export function PartnerListPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [logo, setLogo] = useState('/uploads/partners/kemenag.png');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useUI();

  const loadPartners = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/partners');
      if (res?.data) setPartners(res.data);
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat mitra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const handleOpenCreate = () => {
    setEditId(null);
    setName('');
    setLogo('/uploads/partners/kemenag.png');
    setWebsiteUrl('');
    setModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditId(p.id);
    setName(p.name);
    setLogo(p.logo || '/uploads/partners/kemenag.png');
    setWebsiteUrl(p.websiteUrl || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = { name, logo, websiteUrl: websiteUrl || null };
      if (editId) {
        await apiClient.put(`/admin/partners/${editId}`, payload);
        addToast('Mitra berhasil diperbarui', 'success');
      } else {
        await apiClient.post('/admin/partners', payload);
        addToast('Mitra baru berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      loadPartners();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan mitra', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Hapus mitra "${name}"?`)) return;
    try {
      await apiClient.delete(`/admin/partners/${id}`);
      addToast('Mitra berhasil dihapus', 'success');
      loadPartners();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus mitra', 'error');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Logo & Nama Lembaga',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-14 h-10 rounded-xl bg-gray-50 p-1 flex items-center justify-center shrink-0 border border-[#DDE6F1]">
            <img src={getUploadUrl(p.logo)} alt="" className="w-full h-full object-contain" />
          </div>
          <div>
            <h4 className="font-bold text-[#0B2F6B]">{p.name}</h4>
            {p.websiteUrl && (
              <a
                href={p.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#1F5FD0] hover:underline flex items-center gap-1"
              >
                <span>{p.websiteUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      render: () => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF7EF] text-[#17804A]">
          Aktif
        </span>
      )
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(p)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B2F6B] hover:bg-gray-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(p.id, p.name)}
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
      <Breadcrumbs items={[{ label: 'Mitra Kerja Sama' }]} />

      <DataTable
        title="Mitra & Kerja Sama Institusi"
        description="Kelola logo universitas, kementerian, lembaga pendidikan internasional, dan mitra resmi."
        columns={columns}
        data={partners}
        isLoading={isLoading}
        actionButton={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mitra Baru</span>
          </button>
        }
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Mitra Kerja Sama' : 'Tambah Mitra Kerja Sama Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Nama Lembaga / Instansi</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Contoh: Kementerian Agama RI"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Website Resmi (Opsional)</label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://kemenag.go.id"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <ImageUploader
            value={logo}
            onChange={setLogo}
            category="partners"
            label="Logo Instansi (Format PNG/SVG Transparan)"
            aspectRatio="aspect-video"
          />

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
              {isSaving ? 'Menyimpan...' : 'Simpan Mitra'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
