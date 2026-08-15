import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { History, Shield, Clock } from 'lucide-react';
import { AuditLog } from '../../types';

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const { addToast } = useUI();

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get(`/admin/system/audit-logs?page=${pagination.page}&limit=25`);
      if (res?.data) {
        setLogs(res.data);
        if (res.pagination) {
          setPagination({
            page: res.pagination.page,
            totalPages: res.pagination.totalPages,
            total: res.pagination.total
          });
        }
      }
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat audit log', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [pagination.page]);

  const columns: Column<AuditLog>[] = [
    {
      header: 'Waktu & Tanggal',
      render: (l) => (
        <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
          <Clock className="w-3.5 h-3.5 text-[#1F5FD0]" />
          <span>
            {new Date(l.createdAt).toLocaleString('id-ID', {
              dateStyle: 'medium',
              timeStyle: 'medium'
            })}
          </span>
        </div>
      )
    },
    {
      header: 'Aksi Sistem (Action)',
      render: (l) => (
        <span className="font-mono text-xs font-bold text-[#0B2F6B] bg-[#F4F7FB] px-2.5 py-1 rounded-lg border border-[#DDE6F1]">
          {l.action}
        </span>
      )
    },
    {
      header: 'Tipe Entitas',
      accessor: 'entityType',
      className: 'font-semibold text-xs text-[#1A293B]'
    },
    {
      header: 'Eksekutor / Admin',
      render: (l) => (
        <div className="text-xs">
          <p className="font-bold text-[#0B2F6B]">{l.actor?.name || 'Sistem / Guest'}</p>
          <p className="text-[10px] text-[#64748B]">{l.actor?.email}</p>
        </div>
      )
    },
    {
      header: 'IP Address',
      render: (l) => <span className="font-mono text-[11px] text-[#64748B]">{l.ipAddress || '127.0.0.1'}</span>
    }
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Audit Trail & Jejak Aktivitas' }]} />

      <DataTable
        title="Audit Log & Rekam Jejak Aktivitas"
        description="Pencatatan seluruh tindakan perubahan data, login, pembuatan berita, dan mutasi status PPDB."
        columns={columns}
        data={logs}
        isLoading={isLoading}
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
