import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Plus, Shield, User, Lock, Mail } from 'lucide-react';

export function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleCode, setRoleCode] = useState('EDITOR');
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useUI();

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/system/users');
      if (res?.data) setUsers(res.data);
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat pengguna admin', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await apiClient.post('/admin/system/users', { name, email, password, roleCode });
      addToast('Akun administrator baru berhasil dibuat', 'success');
      setModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      loadUsers();
    } catch (err: any) {
      addToast(err.message || 'Gagal membuat admin', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Nama & Email Pengguna',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0B2F6B] text-white flex items-center justify-center font-bold text-xs">
            {u.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-[#0B2F6B] text-xs sm:text-sm">{u.name}</h4>
            <p className="text-[11px] text-[#64748B] flex items-center gap-1">
              <Mail className="w-3 h-3 text-[#1F5FD0]" />
              <span>{u.email}</span>
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'Role Akses',
      render: (u) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EBF3FF] text-[#1F5FD0] border border-[#1F5FD0]/20">
          {u.roles?.join(', ') || 'ADMIN'}
        </span>
      )
    },
    {
      header: 'Status',
      render: (u) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            u.status === 'ACTIVE' ? 'bg-[#FDE8E9] text-[#D8232A]' : 'bg-[#FEECEC] text-[#D8232A]'
          }`}
        >
          {u.status === 'ACTIVE' ? 'Aktif' : 'Non-aktif'}
        </span>
      )
    },
    {
      header: 'Login Terakhir',
      render: (u) => (
        <span className="text-[#64748B] text-xs">
          {u.lastLoginAt
            ? new Date(u.lastLoginAt).toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })
            : 'Belum pernah login'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Administrator & Hak Akses' }]} />

      <DataTable
        title="Pengguna Administrator Sistem"
        description="Kelola akun pengguna pengelola CMS, role hak akses, dan status akun."
        columns={columns}
        data={users}
        isLoading={isLoading}
        actionButton={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Admin Baru</span>
          </button>
        }
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tambah Akun Administrator Baru"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ustadz Ahmad Fauzi"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Alamat Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ahmad@cendekiaamanah.sch.id"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Password Awal</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimal 8 karakter"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Role / Hak Akses</label>
            <select
              value={roleCode}
              onChange={(e) => setRoleCode(e.target.value)}
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            >
              <option value="SUPERADMIN">SUPERADMIN (Akses Penuh Semua Modul)</option>
              <option value="ADMIN">ADMINISTRATOR (Pengelola Sistem & Konten)</option>
              <option value="EDITOR">EDITOR KONTEN (Berita, Opini, Galeri)</option>
              <option value="PPDB_ADMIN">PPDB ADMIN (Pengelola Pendaftar Santri)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-[#DDE6F1] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0]"
            >
              {isSaving ? 'Membuat...' : 'Buat Akun'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
