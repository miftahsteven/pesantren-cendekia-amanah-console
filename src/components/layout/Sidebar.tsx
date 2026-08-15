import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUI } from '../../context/UIContext';
import {
  LayoutDashboard,
  FileText,
  MessageSquareQuote,
  GraduationCap,
  Sparkles,
  Calendar,
  Trophy,
  Image as ImageIcon,
  Quote,
  Handshake,
  HelpCircle,
  FileSpreadsheet,
  Users,
  Inbox,
  Mail,
  Sliders,
  Tv,
  Share2,
  ShieldCheck,
  History,
  Laptop,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen } = useUI();

  const navigationGroups: NavGroup[] = [
    {
      groupTitle: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/', icon: LayoutDashboard }
      ]
    },
    {
      groupTitle: 'CONTENT',
      items: [
        { label: 'Berita', href: '/news', icon: FileText },
        { label: 'Opini & Penulis', href: '/opinions', icon: MessageSquareQuote },
        { label: 'Unit Pendidikan', href: '/units', icon: GraduationCap },
        { label: 'Program Unggulan', href: '/programs', icon: Sparkles },
        { label: 'Agenda Kegiatan', href: '/agendas', icon: Calendar },
        { label: 'Prestasi Santri', href: '/achievements', icon: Trophy },
        { label: 'Galeri Dokumentasi', href: '/galleries', icon: ImageIcon },
        { label: 'Testimoni', href: '/testimonials', icon: Quote },
        { label: 'Mitra Kerja Sama', href: '/partners', icon: Handshake },
        { label: 'Brosur PDF', href: '/brochures', icon: FileSpreadsheet },
        { label: 'FAQ', href: '/faqs', icon: HelpCircle }
      ]
    },
    {
      groupTitle: 'MEDIA ASSETS',
      items: [
        { label: 'Media Library', href: '/media', icon: ImageIcon }
      ]
    },
    {
      groupTitle: 'PPDB ONLINE',
      items: [
        { label: 'Pendaftar PPDB', href: '/ppdb', icon: Users, badge: 'Baru' }
      ]
    },
    {
      groupTitle: 'KOMUNIKASI',
      items: [
        { label: 'Pesan Masuk', href: '/inbox', icon: Inbox },
        { label: 'Newsletter', href: '/newsletters', icon: Mail }
      ]
    },
    {
      groupTitle: 'PENGATURAN WEB',
      items: [
        { label: 'Pengaturan Website', href: '/site-settings', icon: Sliders },
        { label: 'Hero Slides', href: '/hero-slides', icon: Tv },
        { label: 'Media Sosial', href: '/social-links', icon: Share2 }
      ]
    },
    {
      groupTitle: 'SISTEM & KEAMANAN',
      items: [
        { label: 'Administrator', href: '/admin-users', icon: ShieldCheck },
        { label: 'Audit Log', href: '/audit-logs', icon: History },
        { label: 'Sesi Aktif', href: '/sessions', icon: Laptop }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 bg-[#0B2F6B] text-white flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1 shrink-0 shadow-xs">
              <img src="/uploads/logo/main-logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            {!sidebarCollapsed && (
              <div className="leading-tight">
                <h1 className="text-xs font-black uppercase tracking-wider text-white">Cendekia Amanah</h1>
                <p className="text-[9px] font-bold text-[#F0BD28] tracking-widest uppercase">Admin Console</p>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="hidden md:flex p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title={sidebarCollapsed ? 'Perluas Menu' : 'Persempit Menu'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!sidebarCollapsed && (
                <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-[#8EA2C6] mb-1.5">
                  {group.groupTitle}
                </p>
              )}

              {group.items.map((item, iIdx) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={iIdx}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#1F5FD0] text-white shadow-md font-bold'
                          : 'text-[#DDE6F1] hover:bg-white/10 hover:text-white'
                      } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
                    }
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#17804A] text-white uppercase">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Brand Info */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-white/10 bg-[#082452] text-[10px] text-[#8EA2C6] flex items-center justify-between">
            <span>v1.0 Enterprise</span>
            <span className="text-[#17804A] font-bold">● Server Online</span>
          </div>
        )}
      </aside>
    </>
  );
}
