import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Plus, Edit, Trash2, ExternalLink, Eye } from 'lucide-react';
import { getUploadUrl } from '../../lib/uploads';

export function NewsListPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const { addToast } = useUI();
  const navigate = useNavigate();

  const loadNews = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (activeTab !== 'ALL') params.append('status', activeTab);
      params.append('page', String(pagination.page));
      params.append('limit', '15');

      const res: any = await apiClient.get(`/admin/news?${params.toString()}`);
      if (res && res.data) {
        setArticles(res.data);
        if (res.pagination) {
          setPagination({
            page: res.pagination.page,
            totalPages: res.pagination.totalPages,
            total: res.pagination.total
          });
        }
      }
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat daftar berita', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [search, activeTab, pagination.page]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus artikel berita "${title}"?`)) return;

    try {
      await apiClient.delete(`/admin/news/${id}`);
      addToast('Artikel berita berhasil dihapus', 'success');
      loadNews();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus artikel', 'error');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Artikel',
      render: (art) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-[#DDE6F1]">
            <img
              src={getUploadUrl(art.featuredImage)}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-0.5 max-w-sm">
            <span className="text-[10px] font-bold text-[#17804A] uppercase tracking-wider">
              {art.category?.name || 'Pesantren'}
            </span>
            <Link
              to={`/news/edit/${art.id}`}
              className="block font-bold text-[#0B2F6B] hover:text-[#1F5FD0] line-clamp-1 transition-colors"
            >
              {art.title}
            </Link>
            <p className="text-[11px] text-[#64748B] line-clamp-1">{art.excerpt}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      render: (art) => <StatusBadge status={art.status} />
    },
    {
      header: 'Penulis',
      accessor: 'author',
      className: 'text-[#64748B]'
    },
    {
      header: 'Dibaca',
      render: (art) => (
        <div className="flex items-center gap-1 font-semibold text-[#64748B]">
          <Eye className="w-3.5 h-3.5 text-[#1F5FD0]" />
          <span>{art.viewsCount || 0}</span>
        </div>
      )
    },
    {
      header: 'Tanggal',
      render: (art) => (
        <span className="text-[#64748B] whitespace-nowrap">
          {art.publishedDateText || new Date(art.createdAt).toLocaleDateString('id-ID')}
        </span>
      )
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (art) => (
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={`http://localhost:3000/berita/${art.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#1F5FD0] hover:bg-blue-50 transition-colors"
            title="Lihat di Web"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => navigate(`/news/edit/${art.id}`)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#0B2F6B] hover:bg-gray-100 transition-colors"
            title="Edit Berita"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(art.id, art.title)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Berita"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Berita' }]} />

      <DataTable
        title="Manajemen Berita"
        description="Kelola seluruh artikel publikasi, warta kegiatan, dan pengumuman pesantren."
        columns={columns}
        data={articles}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari judul atau ringkasan berita..."
        tabs={[
          { key: 'ALL', label: 'Semua Berita' },
          { key: 'PUBLISHED', label: 'Terbit' },
          { key: 'DRAFT', label: 'Draft' },
          { key: 'ARCHIVED', label: 'Arsip' }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actionButton={
          <Link
            to="/news/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Berita Baru</span>
          </Link>
        }
        pagination={{
          page: pagination.page,
          totalPages: pagination.totalPages,
          total: pagination.total,
          onPageChange: (newPage) => setPagination((prev) => ({ ...prev, page: newPage }))
        }}
      />
    </div>
  );
}
