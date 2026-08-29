import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Drawer } from '../../components/ui/Drawer';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Mail, MessageSquare, CheckCircle, Eye, Reply } from 'lucide-react';
import { ContactMessage } from '../../types';

export function InboxPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');

  const { addToast } = useUI();

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (activeTab !== 'ALL') params.append('status', activeTab);

      const res: any = await apiClient.get(`/admin/contacts?${params.toString()}`);
      if (res?.data) setMessages(res.data);
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat pesan masuk', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [activeTab]);

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setDrawerOpen(true);

    if (msg.status === 'NEW') {
      try {
        await apiClient.patch(`/admin/contacts/${msg.id}/status`, { status: 'READ' });
        loadMessages();
      } catch {
        // ignore
      }
    }
  };

  const handleMarkReplied = async (id: string) => {
    try {
      await apiClient.patch(`/admin/contacts/${id}/status`, { status: 'REPLIED' });
      addToast('Pesan ditandai sebagai sudah dibalas', 'success');
      setDrawerOpen(false);
      loadMessages();
    } catch (err: any) {
      addToast(err.message || 'Gagal memperbarui status', 'error');
    }
  };

  const columns: Column<ContactMessage>[] = [
    {
      header: 'Pengirim & Email',
      render: (m) => (
        <div className="space-y-0.5">
          <h4 className="font-bold text-[#0B2F6B] text-xs">{m.name}</h4>
          <a
            href={`mailto:${m.email}`}
            className="text-[11px] text-[#1F5FD0] hover:underline flex items-center gap-1"
          >
            <Mail className="w-3 h-3" />
            <span>{m.email}</span>
          </a>
        </div>
      )
    },
    {
      header: 'Isi Pesan / Pertanyaan',
      render: (m) => <p className="text-xs text-[#1A293B] line-clamp-2">{m.message}</p>
    },
    {
      header: 'Status',
      render: (m) => <StatusBadge status={m.status} />
    },
    {
      header: 'Waktu Masuk',
      render: (m) => (
        <span className="text-[#64748B] text-[11px] whitespace-nowrap">
          {new Date(m.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </span>
      )
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (m) => (
        <button
          onClick={() => handleOpenMessage(m)}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F4F7FB] text-[#0B2F6B] hover:bg-[#EBF3FF] hover:text-[#1F5FD0] transition-colors"
        >
          Buka Pesan
        </button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Pesan Masuk (Inbox)' }]} />

      <DataTable
        title="Kotak Masuk Pesan Publik"
        description="Pesan dan pertanyaan yang dikirimkan oleh pengunjung melalui formulir kontak website."
        columns={columns}
        data={messages}
        isLoading={isLoading}
        tabs={[
          { key: 'ALL', label: 'Semua Pesan' },
          { key: 'NEW', label: 'Pesan Baru' },
          { key: 'READ', label: 'Sudah Dibaca' },
          { key: 'REPLIED', label: 'Sudah Dibalas' }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Message Reader Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Detail Pesan Masuk"
        subtitle={`Dari: ${selectedMessage?.name || ''}`}
        width="max-w-xl"
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#DDE6F1] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#64748B]">Status Pesan:</span>
                <div className="mt-1">
                  <StatusBadge status={selectedMessage.status} />
                </div>
              </div>

              {selectedMessage.status !== 'REPLIED' && (
                <button
                  onClick={() => handleMarkReplied(selectedMessage.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#D8232A] text-white hover:bg-[#B81C22] flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Tandai Sudah Dibalas</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0B2F6B] uppercase tracking-wider">
                Informasi Pengirim
              </h4>
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#DDE6F1] text-xs space-y-2">
                <div>
                  <span className="text-[#64748B]">Nama:</span>
                  <p className="font-bold text-[#0B2F6B] mt-0.5">{selectedMessage.name}</p>
                </div>
                <div>
                  <span className="text-[#64748B]">Email:</span>
                  <p className="font-bold text-[#1F5FD0] mt-0.5">{selectedMessage.email}</p>
                </div>
                <div>
                  <span className="text-[#64748B]">Waktu Pengiriman:</span>
                  <p className="text-[#1A293B] mt-0.5">
                    {new Date(selectedMessage.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0B2F6B] uppercase tracking-wider">
                Isi Pesan
              </h4>
              <div className="p-5 rounded-2xl bg-white border border-[#DDE6F1] text-xs text-[#1A293B] leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            <a
              href={`mailto:${selectedMessage.email}?subject=Balasan Pesan Pesantren Cendekia Amanah`}
              className="w-full py-3 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Reply className="w-4 h-4" />
              <span>Balas Pesan via Email</span>
            </a>
          </div>
        )}
      </Drawer>
    </div>
  );
}
