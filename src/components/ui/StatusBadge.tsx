import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case 'PUBLISHED':
    case 'VERIFIED':
    case 'ACCEPTED':
    case 'ACTIVE':
    case 'READ':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FDE8E9] text-[#D8232A] border border-[#D8232A]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D8232A] mr-1.5"></span>
          {normalized === 'PUBLISHED' ? 'Terbit' : normalized === 'VERIFIED' ? 'Terverifikasi' : normalized === 'ACCEPTED' ? 'Diterima' : normalized === 'READ' ? 'Dibaca' : 'Aktif'}
        </span>
      );

    case 'DRAFT':
    case 'SUBMITTED':
    case 'PENDING':
    case 'NEW':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF8E8] text-[#D4A31C] border border-[#F0BD28]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F0BD28] mr-1.5"></span>
          {normalized === 'DRAFT' ? 'Draft' : normalized === 'SUBMITTED' ? 'Baru Masuk' : normalized === 'NEW' ? 'Pesan Baru' : 'Menunggu'}
        </span>
      );

    case 'CONTACTED':
    case 'REPLIED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF3FF] text-[#1F5FD0] border border-[#1F5FD0]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F5FD0] mr-1.5"></span>
          {normalized === 'CONTACTED' ? 'Dihubungi' : 'Dibalas'}
        </span>
      );

    case 'ARCHIVED':
    case 'REJECTED':
    case 'CANCELLED':
    case 'INACTIVE':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEECEC] text-[#D8232A] border border-[#D8232A]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D8232A] mr-1.5"></span>
          {normalized === 'ARCHIVED' ? 'Arsip' : normalized === 'REJECTED' ? 'Ditolak' : normalized === 'CANCELLED' ? 'Batal' : 'Non-aktif'}
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
          {status}
        </span>
      );
  }
}
