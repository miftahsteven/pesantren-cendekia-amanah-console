import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import {
  Menu,
  Search,
  Plus,
  Bell,
  User,
  LogOut,
  Shield,
  FileText,
  MessageSquareQuote,
  Calendar,
  Trophy,
  Image as ImageIcon,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export function Topbar() {
  const { user, logout } = useAuth();
  const { setMobileMenuOpen } = useUI();
  const navigate = useNavigate();

  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const createRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (createRef.current && !createRef.current.contains(e.target as Node)) {
        setCreateDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/news?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-[#DDE6F1] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-xl text-[#0B2F6B] hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-md w-full hidden sm:block">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel, santri, media, menu..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#F4F7FB] border border-[#DDE6F1] rounded-full focus:outline-hidden focus:border-[#1F5FD0] focus:bg-white transition-all text-[#1A293B]"
          />
        </form>
      </div>

      {/* Action Buttons & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Quick Create Dropdown */}
        <div className="relative" ref={createRef}>
          <button
            onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-white bg-[#D8232A] hover:bg-[#B81C22] shadow-xs hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Buat Baru</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {createDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#DDE6F1] py-2 z-50 animate-in fade-in-50">
              <Link
                to="/news/create"
                onClick={() => setCreateDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1A293B] hover:bg-[#F4F7FB] hover:text-[#1F5FD0] transition-colors"
              >
                <FileText className="w-4 h-4 text-[#1F5FD0]" />
                <span>Berita Baru</span>
              </Link>
              <Link
                to="/opinions/create"
                onClick={() => setCreateDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1A293B] hover:bg-[#F4F7FB] hover:text-[#1F5FD0] transition-colors"
              >
                <MessageSquareQuote className="w-4 h-4 text-[#D8232A]" />
                <span>Opini Baru</span>
              </Link>
              <Link
                to="/agendas"
                onClick={() => setCreateDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1A293B] hover:bg-[#F4F7FB] hover:text-[#1F5FD0] transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#D4A31C]" />
                <span>Agenda Baru</span>
              </Link>
              <Link
                to="/achievements"
                onClick={() => setCreateDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1A293B] hover:bg-[#F4F7FB] hover:text-[#1F5FD0] transition-colors"
              >
                <Trophy className="w-4 h-4 text-[#D8232A]" />
                <span>Prestasi Baru</span>
              </Link>
              <Link
                to="/media"
                onClick={() => setCreateDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1A293B] hover:bg-[#F4F7FB] hover:text-[#1F5FD0] transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-[#0B2F6B]" />
                <span>Upload Media</span>
              </Link>
            </div>
          )}
        </div>

        {/* View Public Website */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl text-[#64748B] hover:text-[#0B2F6B] hover:bg-[#F4F7FB] transition-colors hidden sm:flex items-center gap-1.5 text-xs font-semibold"
          title="Buka Website Publik"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="hidden lg:inline">Lihat Web</span>
        </a>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full border border-[#DDE6F1] hover:bg-[#F4F7FB] transition-colors"
          >
            <div className="text-left hidden md:block leading-tight">
              <p className="text-xs font-bold text-[#0B2F6B]">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-[#64748B] font-medium">{user?.roles?.[0] || 'Superadmin'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#0B2F6B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#DDE6F1] py-2 z-50 animate-in fade-in-50">
              <div className="px-4 py-2.5 border-b border-[#DDE6F1]">
                <p className="text-xs font-bold text-[#0B2F6B] truncate">{user?.name}</p>
                <p className="text-[11px] text-[#64748B] truncate">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-[#FDE8E9] text-[#D8232A] uppercase">
                  {user?.roles?.[0] || 'ADMIN'}
                </span>
              </div>

              <div className="py-1">
                <Link
                  to="/admin-users"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1A293B] hover:bg-[#F4F7FB] transition-colors"
                >
                  <Shield className="w-4 h-4 text-[#64748B]" />
                  <span>Kelola Akun</span>
                </Link>
                <Link
                  to="/sessions"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1A293B] hover:bg-[#F4F7FB] transition-colors"
                >
                  <User className="w-4 h-4 text-[#64748B]" />
                  <span>Sesi Aktif</span>
                </Link>
              </div>

              <div className="border-t border-[#DDE6F1] pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#D8232A] hover:bg-[#FEECEC] transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
