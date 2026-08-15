import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Plus, Trash2, HelpCircle } from 'lucide-react';

export function FAQListPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [category, setCategory] = useState('Umum');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useUI();

  const loadFaqs = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/faqs');
      if (res?.data) setFaqs(res.data);
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat FAQ', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await apiClient.post('/admin/faqs', { category, question, answer });
      addToast('Pertanyaan FAQ berhasil ditambahkan', 'success');
      setModalOpen(false);
      setQuestion('');
      setAnswer('');
      loadFaqs();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan FAQ', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus pertanyaan FAQ ini?')) return;
    try {
      await apiClient.delete(`/admin/faqs/${id}`);
      addToast('FAQ berhasil dihapus', 'success');
      loadFaqs();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus FAQ', 'error');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Pertanyaan & Jawaban',
      render: (f) => (
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#17804A] uppercase tracking-wider">
            {f.category || 'Umum'}
          </span>
          <h4 className="font-bold text-[#0B2F6B]">{f.question}</h4>
          <p className="text-xs text-[#64748B] line-clamp-2">{f.answer}</p>
        </div>
      )
    },
    {
      header: 'Aksi',
      className: 'text-right',
      render: (f) => (
        <button
          onClick={() => handleDelete(f.id)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Tanya Jawab (FAQ)' }]} />

      <DataTable
        title="Pertanyaan yang Sering Diajukan (FAQ)"
        description="Kelola daftar tanya-jawab seputar PPDB, kurikulum, asrama, dan fasilitas pesantren."
        columns={columns}
        data={faqs}
        isLoading={isLoading}
        actionButton={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pertanyaan</span>
          </button>
        }
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tambah Pertanyaan FAQ Baru"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            >
              <option value="PPDB">PPDB & Pendaftaran</option>
              <option value="Kurikulum">Kurikulum & Pembelajaran</option>
              <option value="Asrama">Kepesantrenan & Asrama</option>
              <option value="Biaya">Biaya Pendidikan</option>
              <option value="Umum">Umum</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Pertanyaan</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              placeholder="Contoh: Apa saja syarat pendaftaran santri baru?"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Jawaban Lengkap</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              required
              placeholder="Tuliskan jawaban yang jelas dan informatif..."
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
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
              {isSaving ? 'Menyimpan...' : 'Simpan FAQ'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
