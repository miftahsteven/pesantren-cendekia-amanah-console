import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  width?: string;
}

export function Drawer({ isOpen, onClose, title, subtitle, children, width = 'max-w-xl' }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen ${width} bg-white shadow-2xl flex flex-col`}>
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#DDE6F1] flex items-center justify-between bg-[#F8FAFC]">
            <div>
              <h3 className="text-base font-bold text-[#0B2F6B]">{title}</h3>
              {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="p-6 flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
