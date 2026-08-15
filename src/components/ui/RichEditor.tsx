import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Eye,
  Undo,
  Redo,
  Table as TableIcon
} from 'lucide-react';
import { apiClient } from '../../lib/api-client';

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichEditor({
  value,
  onChange,
  placeholder = 'Mulai menulis konten artikel di sini...',
  minHeight = '350px'
}: RichEditorProps) {
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const executeCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const res: any = await apiClient.post('/upload/image?category=news', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res && res.data?.url) {
        executeCommand('insertImage', res.data.url);
      }
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah gambar');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleInsertLink = () => {
    const url = prompt('Masukkan tautan URL (misal: https://example.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const handleInsertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <thead>
          <tr style="background: #F4F7FB;">
            <th style="border: 1px solid #DDE6F1; padding: 8px;">Kolom 1</th>
            <th style="border: 1px solid #DDE6F1; padding: 8px;">Kolom 2</th>
            <th style="border: 1px solid #DDE6F1; padding: 8px;">Kolom 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #DDE6F1; padding: 8px;">Data 1</td>
            <td style="border: 1px solid #DDE6F1; padding: 8px;">Data 2</td>
            <td style="border: 1px solid #DDE6F1; padding: 8px;">Data 3</td>
          </tr>
        </tbody>
      </table><p></p>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  return (
    <div className="bg-white rounded-xl border border-[#DDE6F1] shadow-xs overflow-hidden flex flex-col">
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
      />

      {/* Toolbar */}
      <div className="bg-[#F8FAFC] p-2 border-b border-[#DDE6F1] flex flex-wrap items-center gap-1 text-[#64748B]">
        <button
          type="button"
          onClick={() => executeCommand('undo')}
          title="Undo"
          className="p-1.5 rounded hover:bg-gray-200 hover:text-[#1A293B] transition-colors"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('redo')}
          title="Redo"
          className="p-1.5 rounded hover:bg-gray-200 hover:text-[#1A293B] transition-colors"
        >
          <Redo className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-[#CBD5E1] mx-1"></span>

        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h2>')}
          title="Heading 2"
          className="p-1.5 rounded hover:bg-gray-200 hover:text-[#1A293B] transition-colors"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h3>')}
          title="Heading 3"
          className="p-1.5 rounded hover:bg-gray-200 hover:text-[#1A293B] transition-colors"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-[#CBD5E1] mx-1"></span>

        <button
          type="button"
          onClick={() => executeCommand('bold')}
          title="Tebal (Bold)"
          className="p-1.5 rounded hover:bg-gray-200 hover:text-[#1A293B] transition-colors font-bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          title="Miring (Italic)"
          className="p-1.5 rounded hover:bg-gray-200 hover:text-[#1A293B] transition-colors"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          title="Garis Bawah (Underline)"
          className="p-1.5 rounded hover:bg-gray-200 hover:text-[#1A293B] transition-colors"
        >
          <Underline className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-[#CBD5E1] mx-1"></span>

        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          title="Daftar Bullet"
          className="p-1.5 rounded hover:bg-gray-200 hover:text-[#1A293B] transition-colors"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          title="Daftar Angka"
          className="p-1.5 rounded hover:bg-gray-200 hover:text-[#1A293B] transition-colors"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<blockquote>')}
          title="Kutipan (Blockquote)"
          className="p-1.5 rounded hover:bg-gray-200 hover:text-[#1A293B] transition-colors"
        >
          <Quote className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-[#CBD5E1] mx-1"></span>

        <button
          type="button"
          onClick={handleInsertLink}
          title="Sisipkan Tautan"
          className="p-1.5 rounded hover:bg-gray-200 hover:text-[#1A293B] transition-colors"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploadingImage}
          title="Unggah & Sisipkan Foto"
          className="p-1.5 rounded hover:bg-gray-200 hover:text-[#1A293B] transition-colors flex items-center gap-1"
        >
          <ImageIcon className="w-4 h-4" />
          {isUploadingImage && <span className="text-[10px] animate-pulse">Uploading...</span>}
        </button>
        <button
          type="button"
          onClick={handleInsertTable}
          title="Sisipkan Tabel"
          className="p-1.5 rounded hover:bg-gray-200 hover:text-[#1A293B] transition-colors"
        >
          <TableIcon className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-[#CBD5E1] mx-1"></span>

        <button
          type="button"
          onClick={() => setIsSourceMode(!isSourceMode)}
          title={isSourceMode ? 'Tampilan Visual' : 'Tampilan Kode HTML'}
          className={`p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-semibold ${
            isSourceMode ? 'bg-[#0B2F6B] text-white' : 'hover:bg-gray-200 hover:text-[#1A293B]'
          }`}
        >
          {isSourceMode ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
          <span>{isSourceMode ? 'Visual' : 'HTML'}</span>
        </button>
      </div>

      {/* Editor Content Area */}
      {isSourceMode ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tulis kode HTML di sini..."
          style={{ minHeight }}
          className="p-4 text-xs font-mono bg-[#1E293B] text-green-400 focus:outline-hidden resize-y w-full leading-relaxed"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: value }}
          data-placeholder={placeholder}
          style={{ minHeight }}
          className="p-4 text-xs sm:text-sm text-[#1A293B] focus:outline-hidden prose prose-sm max-w-none prose-headings:text-[#0B2F6B] prose-a:text-[#1F5FD0] overflow-y-auto leading-relaxed"
        />
      )}
    </div>
  );
}
