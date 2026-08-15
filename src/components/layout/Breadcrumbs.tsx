import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items?: { label: string; href?: string }[];
}

export function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#64748B] mb-3">
      <Link to="/" className="hover:text-[#0B2F6B] flex items-center gap-1 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
          {item.href ? (
            <Link to={item.href} className="hover:text-[#0B2F6B] font-medium transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-[#0B2F6B] truncate max-w-xs">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
