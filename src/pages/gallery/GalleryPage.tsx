import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';
import { useUI } from '../../context/UIContext';
import { Modal } from '../../components/ui/Modal';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { getUploadUrl } from '../../lib/uploads';

export function GalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pesantren');
  const [imageUrl, setImageUrl] = useState('/uploads/gallery/pesantren1.png');
  const [caption, setCaption] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { addToast } = useUI();

  const loadGallery = async () => {
    try {
      setIsLoading(true);
      const res: any = await apiClient.get('/admin/galleries');
      if (res?.data?.items) {
        setItems(res.data.items);
      }
    } catch (err: any) {
      addToast(err.message || 'Gagal memuat galeri', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await apiClient.post('/admin/galleries', { title, category, imageUrl, caption });
      addToast('Foto galeri berhasil ditambahkan', 'success');
      setModalOpen(false);
      setTitle('');
      setCaption('');
      loadGallery();
    } catch (err: any) {
      addToast(err.message || 'Gagal menyimpan foto', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus foto "${title}"?`)) return;
    try {
      await apiClient.delete(`/admin/galleries/${id}`);
      addToast('Foto berhasil dihapus', 'success');
      loadGallery();
    } catch (err: any) {
      addToast(err.message || 'Gagal menghapus foto', 'error');
    }
  };

  const categories = ['ALL', 'Pesantren', 'SMP', 'SMA', 'Diniyah', 'Fasilitas', 'Kegiatan'];

  const filtered = selectedCategory === 'ALL'
    ? items
    : items.filter((it) => it.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Galeri Dokumentasi' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0B2F6B]">Galeri & Dokumentasi Visual</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Kelola album dokumentasi foto aktivitas santri, gedung pesantren, dan sarana prasarana.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Foto Baru</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#0B2F6B] text-white shadow-xs'
                : 'bg-white text-[#64748B] border border-[#DDE6F1] hover:bg-gray-50'
            }`}
          >
            {cat === 'ALL' ? 'Semua Kategori' : cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#DDE6F1] text-center text-[#64748B] space-y-2">
          <ImageIcon className="w-10 h-10 mx-auto text-gray-300" />
          <p className="text-sm font-bold text-[#0B2F6B]">Belum ada foto di kategori ini</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#DDE6F1] overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                <img
                  src={getUploadUrl(item.imageUrl)}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-bold bg-[#0B2F6B]/90 text-white uppercase">
                  {item.category}
                </span>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  title="Hapus Foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3.5 space-y-1">
                <h4 className="text-xs font-bold text-[#0B2F6B] line-clamp-1">{item.title}</h4>
                {item.caption && <p className="text-[11px] text-[#64748B] line-clamp-1">{item.caption}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tambah Foto Dokumentasi Galeri"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Judul Foto</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Contoh: Suasana Halaqah Tahfidz Pagi Hari"
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Kategori Galeri</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            >
              <option value="Pesantren">Pesantren</option>
              <option value="SMP">SMP Cendekia</option>
              <option value="SMA">SMA Cendekia</option>
              <option value="Diniyah">Madrasah Diniyah</option>
              <option value="Fasilitas">Fasilitas & Gedung</option>
              <option value="Kegiatan">Aktivitas Santri</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1A293B]">Keterangan / Caption (Opsional)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Keterangan singkat momen foto..."
              className="w-full p-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0]"
            />
          </div>

          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            category="gallery"
            label="Unggah File Foto"
          />

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
              {isSaving ? 'Menyimpan...' : 'Simpan ke Galeri'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
