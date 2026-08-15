import React, { ElementType } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ElementType;
  color?: 'blue' | 'green' | 'gold' | 'red' | 'navy';
  trend?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend
}: StatCardProps) {
  const colorMap = {
    blue: {
      bg: 'bg-[#EBF3FF]',
      text: 'text-[#1F5FD0]',
      border: 'border-[#1F5FD0]/20'
    },
    green: {
      bg: 'bg-[#EAF7EF]',
      text: 'text-[#17804A]',
      border: 'border-[#17804A]/20'
    },
    gold: {
      bg: 'bg-[#FEF8E8]',
      text: 'text-[#D4A31C]',
      border: 'border-[#F0BD28]/30'
    },
    red: {
      bg: 'bg-[#FEECEC]',
      text: 'text-[#D8232A]',
      border: 'border-[#D8232A]/20'
    },
    navy: {
      bg: 'bg-[#0B2F6B]/10',
      text: 'text-[#0B2F6B]',
      border: 'border-[#0B2F6B]/20'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#DDE6F1] shadow-sm hover:shadow-md transition-shadow flex items-start justify-between">
      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B2F6B] tracking-tight">{value}</h3>
          {trend && (
            <span className="text-xs font-bold text-[#17804A] bg-[#EAF7EF] px-1.5 py-0.5 rounded">
              {trend}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-[#64748B] pt-0.5">{subtitle}</p>}
      </div>

      <div className={`w-11 h-11 rounded-xl ${scheme.bg} ${scheme.text} flex items-center justify-center shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
