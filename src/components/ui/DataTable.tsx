import React, { ReactNode } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | string;
  render?: (item: T) => ReactNode;
  className?: string;
}

export interface TabOption {
  key: string;
  label: string;
  count?: number;
}

interface DataTableProps<T> {
  title?: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  tabs?: TabOption[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  actionButton?: ReactNode;
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    onPageChange: (newPage: number) => void;
  };
}

export function DataTable<T extends { id?: string }>({
  title,
  description,
  columns,
  data,
  isLoading,
  searchPlaceholder = 'Cari data...',
  searchValue,
  onSearchChange,
  tabs,
  activeTab,
  onTabChange,
  actionButton,
  pagination
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-2xl border border-[#DDE6F1] shadow-sm overflow-hidden flex flex-col">
      {/* Header & Controls */}
      <div className="p-5 border-b border-[#DDE6F1] space-y-4">
        {(title || actionButton) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {title && <h2 className="text-lg font-bold text-[#0B2F6B]">{title}</h2>}
              {description && <p className="text-xs text-[#64748B] mt-0.5">{description}</p>}
            </div>
            {actionButton && <div>{actionButton}</div>}
          </div>
        )}

        {/* Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {tabs && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => onTabChange?.(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#0B2F6B] text-white shadow-xs'
                        : 'bg-[#F4F7FB] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#1A293B]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {onSearchChange !== undefined && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchValue || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F4F7FB] border border-[#DDE6F1] rounded-lg focus:outline-hidden focus:border-[#1F5FD0] focus:bg-white transition-all text-[#1A293B]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#1A293B]">
          <thead className="bg-[#F8FAFC] border-b border-[#DDE6F1] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-5 py-3.5 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-5 py-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-[#64748B]">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Inbox className="w-8 h-8 text-[#94A3B8]" />
                    <p className="text-sm font-medium">Tidak ada data ditemukan</p>
                    <p className="text-xs text-[#94A3B8]">Coba sesuaikan kata kunci pencarian atau filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rIdx) => (
                <tr key={row.id || rIdx} className="hover:bg-[#F8FAFC] transition-colors">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className={`px-5 py-3.5 align-middle ${col.className || ''}`}>
                      {col.render
                        ? col.render(row)
                        : col.accessor
                        ? String((row as any)[col.accessor] ?? '-')
                        : '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.totalPages > 1 && (
        <div className="p-4 border-t border-[#DDE6F1] flex items-center justify-between text-xs text-[#64748B]">
          <p>
            Menampilkan halaman <span className="font-semibold text-[#1A293B]">{pagination.page}</span> dari{' '}
            <span className="font-semibold text-[#1A293B]">{pagination.totalPages}</span> (Total {pagination.total} data)
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-[#DDE6F1] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-[#DDE6F1] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
