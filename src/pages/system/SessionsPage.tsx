import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Laptop, Trash2, Clock, Globe } from 'lucide-react';

export function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useUI();

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/system/sessions');
      if (res?.data) setSessions(res.data);
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat sesi aktif', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleTerminateSession = async (id: string) => {
    if (!window.confirm('Hentikan dan logout sesi login ini?')) return;
    try {
      await apiClient.delete(`/admin/system/sessions/${id}`);
      addToast('Sesi berhasil dihentikan', 'success');
      loadSessions();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghentikan sesi', 'error');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Perangkat & Pengguna',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBF3FF] text-[#1F5FD0] flex items-center justify-center font-bold">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[#0B2F6B] text-xs sm:text-sm">{s.adminUser?.name}</h4>
            <p className="text-[11px] text-[#64748B] line-clamp-1 max-w-xs">{s.userAgent || 'Browser'}</p>
          </div>
        </div>
      )
    },
    {
      header: 'IP Address',
      render: (s) => (
        <div className="flex items-center gap-1.5 font-mono text-xs text-[#1A293B]">
          <Globe className="w-3.5 h-3.5 text-[#D8232A]" />
          <span>{s.ipAddress || '127.0.0.1'}</span>
        </div>
      )
    },
    {
      header: 'Waktu Login',
      render: (s) => (
        <span className="text-[#64748B] text-xs">
          {new Date(s.createdAt).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}
        </span>
      )
    },
    {
      header: 'Kadaluarsa Sesi',
      render: (s) => (
        <span className="text-[#64748B] text-xs">
          {new Date(s.expiresAt).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}
        </span>
      )
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (s) => (
        <button
          onClick={() => handleTerminateSession(s.id)}
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          Logout Sesi
        </button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Sesi Login Aktif' }]} />

      <DataTable
        title="Daftar Sesi Login Administrator Aktif"
        description="Perangkat dan browser yang saat ini memiliki token sesi terautentikasi ke Console CMS."
        columns={columns}
        data={sessions}
        isLoading={isLoading}
      />
    </div>
  );
}
