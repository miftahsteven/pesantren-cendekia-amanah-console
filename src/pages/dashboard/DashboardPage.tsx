import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  FileText,
  Users,
  Inbox,
  Image as ImageIcon,
  Trophy,
  Calendar,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Eye
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const UNIT_COLORS: Record<string, string> = {
  pesantren: '#1A4FA0',
  smp: '#0B2F6B',
  sma: '#1F5FD0',
  diniyah: '#D8232A'
};

export function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [ppdbDist, setPpdbDist] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true);
        const [resStats, resDist]: any = await Promise.all([
          apiClient.get('/admin/dashboard/stats'),
          apiClient.get('/admin/dashboard/ppdb-distribution')
        ]);
        if (resStats?.data) setStats(resStats.data);
        if (resDist?.data) setPpdbDist(resDist.data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const counters = stats.counters || {};

  const unitChartData = ppdbDist?.byUnit?.map((u: any) => ({
    name: u.unitName,
    value: u.count,
    color: UNIT_COLORS[u.unitCode] || '#1F5FD0'
  })) || [
    { name: 'Pesantren', value: 153, color: '#1A4FA0' },
    { name: 'SMP Cendekia', value: 142, color: '#0B2F6B' },
    { name: 'SMA Cendekia', value: 128, color: '#1F5FD0' },
    { name: 'Madrasah Diniyah', value: 63, color: '#D8232A' }
  ];

  const contentBarData = [
    { name: 'Berita', count: counters.articles?.total || 15 },
    { name: 'Opini', count: 5 },
    { name: 'Prestasi', count: counters.content?.achievements || 7 },
    { name: 'Agenda', count: counters.content?.agendas || 4 },
    { name: 'Galeri', count: 6 },
    { name: 'Testimoni', count: counters.content?.testimonials || 3 },
    { name: 'Mitra', count: counters.content?.partners || 8 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div
        className="bg-gradient-to-r from-[#0B2F6B] via-[#12377E] to-[#1F5FD0] p-6 sm:p-8 rounded-3xl text-white shadow-lg border border-[#1A4FA0]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{ background: 'linear-gradient(135deg, #0B2F6B 0%, #12377E 50%, #1F5FD0 100%)' }}
      >
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0BD28]/20 text-[#F0BD28] border border-[#F0BD28]/30 text-[11px] font-bold uppercase tracking-wider">
            <span>Operational Command Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white drop-shadow-xs">
            Pusat Pengelolaan Konten & Operasional
          </h1>
          <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed">
            Selamat datang di Console CMS Pesantren Cendekia Amanah. Kelola berita, calon santri PPDB, fasilitas pendidikan, dan pengaturan publikasi secara terpusat.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/news/create"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-[#F0BD28] text-[#0B2F6B] hover:bg-[#E0AD19] shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tulis Berita</span>
          </Link>
          <Link
            to="/ppdb"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/25 shadow-sm transition-all"
          >
            <Users className="w-4 h-4" />
            <span>Lihat PPDB</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Pendaftar PPDB"
          value={counters.ppdb?.total || '486'}
          subtitle={`${counters.ppdb?.submitted || 0} baru menunggu verifikasi`}
          icon={Users}
          color="blue"
          trend="+12% bulan ini"
        />
        <StatCard
          title="Artikel Berita"
          value={counters.articles?.total || '15'}
          subtitle={`${counters.articles?.published || 15} terbit • ${counters.articles?.draft || 0} draft`}
          icon={FileText}
          color="green"
        />
        <StatCard
          title="Pesan Kontak Masuk"
          value={counters.contacts?.new || '3'}
          subtitle="Pesan dari formulir publik"
          icon={Inbox}
          color="gold"
        />
        <StatCard
          title="Media & File Tersimpan"
          value={counters.media?.total || '98'}
          subtitle="Foto galeri, logo & dokumen"
          icon={ImageIcon}
          color="navy"
        />
      </div>

      {/* Interactive Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PPDB Distribution Chart */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-[#DDE6F1] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-[#DDE6F1]">
            <div>
              <h3 className="text-sm font-bold text-[#0B2F6B]">Distribusi Pendaftar PPDB per Unit</h3>
              <p className="text-xs text-[#64748B]">Tahun Ajaran 2027/2028</p>
            </div>
            <Link to="/ppdb" className="text-xs font-bold text-[#1F5FD0] hover:underline flex items-center gap-1">
              <span>Detail PPDB</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={unitChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {unitChartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value} Pendaftar`, 'Jumlah']}
                  contentStyle={{ backgroundColor: '#0B2F6B', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Inventory Distribution */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-[#DDE6F1] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-[#DDE6F1]">
            <div>
              <h3 className="text-sm font-bold text-[#0B2F6B]">Sebaran Konten Website</h3>
              <p className="text-xs text-[#64748B]">Jumlah item aktif di database</p>
            </div>
            <Link to="/news" className="text-xs font-bold text-[#1F5FD0] hover:underline flex items-center gap-1">
              <span>Semua Berita</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B2F6B', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#1F5FD0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row: Recent PPDB Leads & Popular Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent PPDB Registrations */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DDE6F1] shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#DDE6F1] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0B2F6B]">Pendaftar PPDB Terbaru</h3>
              <p className="text-xs text-[#64748B]">Calon santri baru yang baru mendaftar</p>
            </div>
            <Link to="/ppdb" className="text-xs font-bold text-[#1F5FD0] hover:underline">
              Lihat Semua ({counters.ppdb?.total || 0})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#DDE6F1] text-[11px] font-bold text-[#64748B] uppercase">
                <tr>
                  <th className="px-5 py-3">No. Reg</th>
                  <th className="px-5 py-3">Nama Santri</th>
                  <th className="px-5 py-3">Unit</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {(stats.recentPpdb || []).map((reg: any) => (
                  <tr key={reg.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3 font-mono font-bold text-[#1F5FD0]">{reg.registrationNo}</td>
                    <td className="px-5 py-3 font-semibold text-[#0B2F6B]">{reg.fullName}</td>
                    <td className="px-5 py-3 text-[#64748B]">{reg.unit?.name || reg.unitCode}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={reg.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular News Articles */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DDE6F1] shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#DDE6F1] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0B2F6B]">Berita Paling Populer</h3>
              <p className="text-xs text-[#64748B]">Berdasarkan jumlah pembaca</p>
            </div>
            <Link to="/news" className="text-xs font-bold text-[#1F5FD0] hover:underline">
              Kelola Berita
            </Link>
          </div>

          <div className="p-5 divide-y divide-[#F1F5F9] space-y-3.5">
            {(stats.popularNews || []).map((art: any) => (
              <div key={art.id} className="pt-3.5 first:pt-0 flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-bold text-[#D8232A] uppercase tracking-wider">
                    {art.category?.name || 'Pesantren'}
                  </span>
                  <Link
                    to={`/news/edit/${art.id}`}
                    className="block text-xs font-bold text-[#0B2F6B] hover:text-[#1F5FD0] transition-colors line-clamp-2 leading-snug"
                  >
                    {art.title}
                  </Link>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#64748B] font-bold shrink-0 bg-[#F4F7FB] px-2 py-1 rounded-lg">
                  <Eye className="w-3.5 h-3.5 text-[#1F5FD0]" />
                  <span>{art.viewsCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE6F1]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1F5FD0]" />
            <h3 className="text-sm font-bold text-[#0B2F6B]">Aktivitas Editor & Sistem Terbaru</h3>
          </div>
          <Link to="/audit-logs" className="text-xs font-bold text-[#1F5FD0] hover:underline">
            Lihat Audit Log
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(stats.recentActivities || []).map((act: any) => (
            <div key={act.id} className="p-3 bg-[#F8FAFC] rounded-xl border border-[#DDE6F1] space-y-1">
              <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                <span className="font-bold text-[#0B2F6B]">{act.actor?.name || 'Sistem'}</span>
                <span>{new Date(act.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs font-semibold text-[#1A293B] truncate">{act.action}</p>
              <p className="text-[10px] text-[#94A3B8]">{act.entityType}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
