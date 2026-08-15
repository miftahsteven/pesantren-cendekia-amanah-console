import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Edit, ExternalLink, Building2, GraduationCap, BookOpen, Award } from 'lucide-react';
import { getUploadUrl } from '../../lib/uploads';

const iconMap: Record<string, any> = {
  pesantren: Building2,
  smp: GraduationCap,
  sma: BookOpen,
  diniyah: Award
};

export function UnitListPage() {
  const [units, setUnits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useUI();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUnits() {
      try {
        setIsLoading(true);
        const res: any = await apiClient.get('/admin/units');
        if (res?.data) setUnits(res.data);
      } catch (err: any) {
        addToast(err.message || 'Gagal memuat data unit pendidikan', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadUnits();
  }, []);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Unit Pendidikan' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0B2F6B]">Unit Pendidikan & Jenjang</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Kelola profil, kurikulum, fasilitas, dan foto hero tiap jenjang pendidikan terpadu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {units.map((u) => {
          const Icon = iconMap[u.code] || Building2;
          return (
            <div
              key={u.id}
              className="bg-white rounded-2xl border border-[#DDE6F1] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              {/* Cover Image */}
              <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                <img
                  src={getUploadUrl(u.heroImage || '/uploads/gallery/pesantren6.png')}
                  alt={u.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-[#0B2F6B] uppercase">
                  {u.badge || 'Unggulan'}
                </span>
                <div className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-white text-[#1A4FA0] flex items-center justify-center shadow-md">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#0B2F6B]">{u.name}</h3>
                  <p className="text-xs text-[#64748B] line-clamp-2">{u.tagline}</p>
                </div>

                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                  <a
                    href={`http://localhost:3000/${u.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#64748B] hover:text-[#1F5FD0] flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Lihat Halaman</span>
                  </a>

                  <button
                    onClick={() => navigate(`/units/edit/${u.id}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Kelola</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
