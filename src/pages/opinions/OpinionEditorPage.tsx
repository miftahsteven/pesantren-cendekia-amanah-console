import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { RichEditor } from '../../components/ui/RichEditor';
import { StickyPublishBar } from '../../components/layout/StickyPublishBar';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';

export function OpinionEditorPage() {
  const navigate = useNavigate();
  const { addToast } = useUI();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [authors, setAuthors] = useState<any[]>([]);
  const [excerpt, setExcerpt] = useState('');
  const [contentHtml, setContentHtml] = useState('<p>Tulis gagasan atau artikel opini di sini...</p>');
  const [readTime, setReadTime] = useState('5 menit baca');
  const [highlightQuote, setHighlightQuote] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('PUBLISHED');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadAuthors() {
      try {
        const res: any = await apiClient.get('/admin/opinion-authors');
        if (res?.data) {
          setAuthors(res.data);
          if (res.data.length > 0) setAuthorId(res.data[0].id);
        }
      } catch {
        // fallback
      }
    }
    loadAuthors();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generated = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setSlug(generated);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      addToast('Judul opini wajib diisi', 'error');
      return;
    }
    if (!authorId) {
      addToast('Penulis opini wajib dipilih', 'error');
      return;
    }

    try {
      setIsSaving(true);
      await apiClient.post('/admin/opinions', {
        title,
        slug,
        authorId,
        excerpt,
        content: [contentHtml],
        readTime,
        highlightQuote: highlightQuote || null,
        status
      });

      addToast('Artikel opini berhasil diterbitkan', 'success');
      navigate('/opinions');
    } catch (err: any) {
      addToast(err.message || 'Gagal menerbitkan opini', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs
        items={[
          { label: 'Opini', href: '/opinions' },
          { label: 'Tulis Opini Baru' }
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-5">
          <div className="bg-white p-6 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B] uppercase tracking-wider">
                Judul Opini <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Masukkan judul opini atau pemikiran..."
                className="w-full px-4 py-3 text-base font-bold text-[#0B2F6B] bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Ringkasan / Gagasan Pokok</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Ringkasan pemikiran yang disampaikan..."
                className="w-full p-3 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-3">
            <label className="block text-xs font-bold text-[#1A293B] uppercase tracking-wider">
              Naskah Tulisan Lengkap <span className="text-red-500">*</span>
            </label>
            <RichEditor
              value={contentHtml}
              onChange={setContentHtml}
              placeholder="Tulis naskah lengkap di sini..."
              minHeight="400px"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-2">
            <label className="block text-xs font-bold text-[#1A293B]">Highlight Quote (Kutipan Utama)</label>
            <textarea
              value={highlightQuote}
              onChange={(e) => setHighlightQuote(e.target.value)}
              rows={2}
              placeholder="Kutipan berbobot dari artikel opini ini..."
              className="w-full p-3 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-5 shrink-0">
          <div className="bg-white p-5 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#0B2F6B] uppercase tracking-wider border-b border-[#DDE6F1] pb-2.5">
              Penulis & Informasi
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Penulis Opini</label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] text-[#1A293B] font-semibold"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Estimasi Waktu Baca</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="Contoh: 5 menit baca"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>
        </div>
      </div>

      <StickyPublishBar
        status={status}
        onStatusChange={setStatus}
        onSave={handleSave}
        isSaving={isSaving}
        backHref="/opinions"
      />
    </div>
  );
}
