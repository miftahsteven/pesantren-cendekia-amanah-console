import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Share2, ExternalLink } from 'lucide-react';

export function SocialLinksPage() {
  const [socials, setSocials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useUI();

  useEffect(() => {
    async function loadSocials() {
      try {
        setIsLoading(true);
        const res: any = await apiClient.get('/admin/site/socials');
        if (res?.data) setSocials(res.data);
      } catch (err: any) {
        addToast(err.message || 'Gagal memuat media sosial', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadSocials();
  }, []);

  const columns: Column<any>[] = [
    {
      header: 'Platform',
      render: (s) => (
        <div className="flex items-center gap-2 font-bold text-[#0B2F6B]">
          <Share2 className="w-4 h-4 text-[#1F5FD0]" />
          <span>{s.platform}</span>
        </div>
      )
    },
    {
      header: 'Tautan URL',
      render: (s) => (
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#1F5FD0] hover:underline flex items-center gap-1"
        >
          <span>{s.url}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )
    },
    {
      header: 'Status',
      render: () => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FDE8E9] text-[#D8232A]">
          Aktif
        </span>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Media Sosial' }]} />

      <DataTable
        title="Tautan Media Sosial Resmi"
        description="Akun Instagram, YouTube Channel, Facebook, dan media sosial resmi pesantren."
        columns={columns}
        data={socials}
        isLoading={isLoading}
      />
    </div>
  );
}
