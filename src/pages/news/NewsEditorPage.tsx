import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { RichEditor } from '../../components/ui/RichEditor';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { StickyPublishBar } from '../../components/layout/StickyPublishBar';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Sparkles, Globe, Tag, Eye } from 'lucide-react';

export function NewsEditorPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useUI();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [excerpt, setExcerpt] = useState('');
  const [contentHtml, setContentHtml] = useState('<p>Tulis artikel lengkap di sini...</p>');
  const [featuredImage, setFeaturedImage] = useState('/uploads/news/wisuda.jpg');
  const [author, setAuthor] = useState('Redaksi Cendekia Amanah');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('PUBLISHED');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [highlightQuote, setHighlightQuote] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load Categories & Existing Article
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const resCat: any = await apiClient.get('/news/categories');
        if (resCat?.data) {
          setCategories(resCat.data);
          if (!isEditMode && resCat.data.length > 0) {
            setCategoryId(resCat.data[0].id);
          }
        }

        if (isEditMode && id) {
          const resArt: any = await apiClient.get(`/admin/news/${id}`);
          if (resArt?.data) {
            const a = resArt.data;
            setTitle(a.title);
            setSlug(a.slug);
            setIsCustomSlug(true);
            setCategoryId(a.categoryId);
            setExcerpt(a.excerpt || '');
            setContentHtml(Array.isArray(a.content) ? a.content.join('\n\n') : a.content);
            setFeaturedImage(a.featuredImage);
            setAuthor(a.author);
            setStatus(a.status);
            setIsFeatured(a.isFeatured);
            setIsPopular(a.isPopular);
            setHighlightQuote(a.highlightQuote || '');
            setSeoTitle(a.seoTitle || '');
            setSeoDescription(a.seoDescription || '');
          }
        }
      } catch (err: any) {
        addToast(err.message || 'Gagal memuat data artikel', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id, isEditMode]);

  // Auto-generate slug when title changes
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isCustomSlug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      addToast('Judul artikel wajib diisi', 'error');
      return;
    }
    if (!categoryId) {
      addToast('Kategori artikel wajib dipilih', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        title,
        slug,
        categoryId,
        excerpt,
        content: [contentHtml],
        featuredImage,
        author,
        status,
        isFeatured,
        isPopular,
        highlightQuote: highlightQuote || null,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt
      };

      if (isEditMode && id) {
        await apiClient.put(`/admin/news/${id}`, payload);
        addToast('Artikel berhasil diperbarui', 'success');
      } else {
        await apiClient.post('/admin/news', payload);
        addToast('Artikel baru berhasil diterbitkan', 'success');
      }

      navigate('/news');
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan artikel', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
        <div className="h-40 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs
        items={[
          { label: 'Berita', href: '/news' },
          { label: isEditMode ? 'Edit Berita' : 'Tulis Berita Baru' }
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Form Column (Main Content) */}
        <div className="flex-1 space-y-5">
          {/* Title Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B] uppercase tracking-wider">
                Judul Artikel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Masukkan judul artikel berita yang informatif..."
                className="w-full px-4 py-3 text-base font-bold text-[#0B2F6B] bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] focus:bg-white transition-all"
              />
            </div>

            {/* Slug URL */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#64748B]">Tautan Permanen (Slug URL):</span>
                <button
                  type="button"
                  onClick={() => setIsCustomSlug(!isCustomSlug)}
                  className="text-[10px] font-bold text-[#1F5FD0] hover:underline"
                >
                  {isCustomSlug ? 'Auto-generate' : 'Edit Manual'}
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono bg-gray-50 px-3 py-1.5 rounded-lg border border-[#DDE6F1] text-[#64748B] overflow-x-auto">
                <span className="shrink-0 text-gray-400">cendekiaamanah.sch.id/berita/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setIsCustomSlug(true);
                    setSlug(e.target.value);
                  }}
                  className="bg-transparent text-[#0B2F6B] font-bold focus:outline-hidden flex-1"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold text-[#1A293B]">
                Ringkasan / Excerpt <span className="text-[10px] font-normal text-[#64748B]">(Tampil di kartu berita)</span>
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Tuliskan ringkasan singkat dari artikel berita ini (1-2 kalimat)..."
                className="w-full p-3 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] focus:bg-white transition-all text-[#1A293B]"
              />
            </div>
          </div>

          {/* WYSIWYG Editor Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-3">
            <label className="block text-xs font-bold text-[#1A293B] uppercase tracking-wider">
              Isi Konten Artikel <span className="text-red-500">*</span>
            </label>
            <RichEditor
              value={contentHtml}
              onChange={setContentHtml}
              placeholder="Mulai menulis naskah berita lengkap di sini..."
              minHeight="450px"
            />
          </div>

          {/* Highlight Quote (Optional) */}
          <div className="bg-white p-6 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-2">
            <label className="block text-xs font-bold text-[#1A293B]">
              Kutipan Penekanan (Highlight Quote) <span className="text-[10px] font-normal text-[#64748B]">(Opsional)</span>
            </label>
            <textarea
              value={highlightQuote}
              onChange={(e) => setHighlightQuote(e.target.value)}
              rows={2}
              placeholder="Contoh: 'Pendidikan Islam modern adalah jembatan menuju masa depan gemilang.' — KH. Cholil Nafis"
              className="w-full p-3 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] focus:bg-white transition-all text-[#1A293B]"
            />
          </div>
        </div>

        {/* Right Sidebar Column (Publish Settings & Meta) */}
        <div className="w-full lg:w-80 space-y-5 shrink-0">
          {/* Category & Status Box */}
          <div className="bg-white p-5 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#0B2F6B] uppercase tracking-wider border-b border-[#DDE6F1] pb-2.5">
              Pengaturan Publikasi
            </h3>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Kategori Berita</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] text-[#1A293B] font-semibold"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Nama Penulis / Redaksi</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Redaksi Cendekia Amanah"
                className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] text-[#1A293B]"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2 border-t border-[#DDE6F1]">
              <label className="flex items-center justify-between text-xs font-semibold cursor-pointer">
                <span className="text-[#1A293B]">Berita Pilihan (Featured)</span>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1F5FD0] focus:ring-[#1F5FD0]"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-semibold cursor-pointer">
                <span className="text-[#1A293B]">Tandai Populer</span>
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1F5FD0] focus:ring-[#1F5FD0]"
                />
              </label>
            </div>
          </div>

          {/* Featured Image Box */}
          <div className="bg-white p-5 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#0B2F6B] uppercase tracking-wider border-b border-[#DDE6F1] pb-2.5">
              Foto Sampul (Featured Image)
            </h3>
            <ImageUploader
              value={featuredImage}
              onChange={setFeaturedImage}
              category="news"
              label=""
            />
          </div>

          {/* SEO Metadata Box */}
          <div className="bg-white p-5 rounded-2xl border border-[#DDE6F1] shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#DDE6F1] pb-2.5">
              <h3 className="text-xs font-bold text-[#0B2F6B] uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#1F5FD0]" />
                <span>SEO Metadata</span>
              </h3>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#1A293B]">Meta Title</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title || 'Judul di Google Search'}
                className="w-full p-2 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-lg focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#1A293B]">Meta Description</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={3}
                placeholder={excerpt || 'Deskripsi singkat yang tampil di Google'}
                className="w-full p-2 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-lg focus:outline-hidden focus:border-[#1F5FD0]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar for Save & Publish */}
      <StickyPublishBar
        status={status}
        onStatusChange={setStatus}
        onSave={handleSave}
        isSaving={isSaving}
        backHref="/news"
      />
    </div>
  );
}
