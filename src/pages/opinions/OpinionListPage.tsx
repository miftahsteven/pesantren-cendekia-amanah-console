import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { getUploadUrl } from '../../lib/uploads';

export function OpinionListPage() {
  const [opinions, setOpinions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useUI();
  const navigate = useNavigate();

  const loadOpinions = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/opinions');
      if (res && res.data) {
        setOpinions(res.data);
      }
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat daftar opini', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOpinions();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus artikel opini "${title}"?`)) return;

    try {
      await apiClient.delete(`/admin/opinions/${id}`);
      addToast('Artikel opini berhasil dihapus', 'success');
      loadOpinions();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus opini', 'error');
    }
  };

  const filtered = opinions.filter(
    (o) =>
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.author?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<any>[] = [
    {
      header: 'Artikel Opini',
      render: (op) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-[#DDE6F1]">
            <img
              src={getUploadUrl(op.author?.avatar)}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-0.5 max-w-sm">
            <span className="text-[10px] font-bold text-[#17804A] uppercase tracking-wider">
              {op.author?.name || 'KH. Cholil Nafis'}
            </span>
            <p className="font-bold text-[#0B2F6B] line-clamp-1">{op.title}</p>
            <p className="text-[11px] text-[#64748B] line-clamp-1">{op.excerpt}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Penulis & Jabatan',
      render: (op) => (
        <div className="text-xs">
          <p className="font-bold text-[#0B2F6B]">{op.author?.name}</p>
          <p className="text-[11px] text-[#64748B]">{op.author?.role}</p>
        </div>
      )
    },
    {
      header: 'Status',
      render: (op) => <StatusBadge status={op.status} />
    },
    {
      header: 'Waktu Baca',
      accessor: 'readTime',
      className: 'text-[#64748B]'
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (op) => (
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={`http://localhost:3000/opini/${op.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#1F5FD0] hover:bg-blue-50 transition-colors"
            title="Lihat di Web"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => handleDelete(op.id, op.title)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Opini"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Opini & Gagasan' }]} />

      <DataTable
        title="Manajemen Opini & Pemikiran"
        description="Kelola tulisan, pandangan keislaman, dan artikel ilmiah para asatidz dan pimpinan."
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari judul opini atau nama penulis..."
        actionButton={
          <Link
            to="/opinions/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Opini Baru</span>
          </Link>
        }
      />
    </div>
  );
}
