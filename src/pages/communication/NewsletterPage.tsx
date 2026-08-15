import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Mail, Download } from 'lucide-react';

export function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useUI();

  useEffect(() => {
    async function loadNewsletters() {
      try {
        setIsLoading(true);
        const res: any = await apiClient.get('/admin/newsletters');
        if (res?.data) setSubscribers(res.data);
      } catch (err: any) {
        addToast(err.message || 'Gagal memuat daftar newsletter', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadNewsletters();
  }, []);

  const handleExportCsv = () => {
    if (subscribers.length === 0) return;
    const csvContent =
      'data:text/csv;charset=utf-8,Email,Status,Tanggal Daftar\n' +
      subscribers.map((s) => `"${s.email}","${s.status}","${s.createdAt}"`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Newsletter_Subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Daftar email berhasil diexport', 'success');
  };

  const columns: Column<any>[] = [
    {
      header: 'Alamat Email',
      render: (s) => (
        <div className="flex items-center gap-2.5 font-bold text-[#0B2F6B]">
          <Mail className="w-4 h-4 text-[#1F5FD0]" />
          <span>{s.email}</span>
        </div>
      )
    },
    {
      header: 'Status Langganan',
      render: (s) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF7EF] text-[#17804A]">
          {s.status}
        </span>
      )
    },
    {
      header: 'Tanggal Bergabung',
      render: (s) => (
        <span className="text-[#64748B] text-xs">
          {new Date(s.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Pelanggan Newsletter' }]} />

      <DataTable
        title="Daftar Pelanggan Buletin & Newsletter"
        description="Alamat email wali santri dan masyarakat yang berlangganan kabar berkala pesantren."
        columns={columns}
        data={subscribers}
        isLoading={isLoading}
        actionButton={
          <button
            onClick={handleExportCsv}
            disabled={subscribers.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#17804A] hover:bg-[#13683C] shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Email CSV</span>
          </button>
        }
      />
    </div>
  );
}
