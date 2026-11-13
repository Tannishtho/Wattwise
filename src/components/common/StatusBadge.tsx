import React from 'react';
import { EssentialityLevel, ComfortLevel } from '../../types/appliance';
import { BudgetTier } from '../../types/budget';

interface StatusBadgeProps {
  type: 'essentiality' | 'comfort' | 'budgetTier' | 'custom' | 'powerStatus';
  value: EssentialityLevel | ComfortLevel | BudgetTier | 'ON' | 'OFF' | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, className = '' }) => {
  let style = 'bg-white/10 text-secondaryText border-white/10';
  let label = String(value);

  if (type === 'essentiality') {
    switch (value) {
      case 'CRITICAL':
        style = 'bg-danger/15 text-danger border-danger/30';
        label = 'Critical Essential';
        break;
      case 'ESSENTIAL':
        style = 'bg-emerald/15 text-emerald border-emerald/30';
        label = 'Essential';
        break;
      case 'OPTIONAL':
        style = 'bg-secondary/40 text-secondaryText border-white/10';
        label = 'Non-Essential';
        break;
    }
  } else if (type === 'comfort') {
    switch (value) {
      case 'HIGH':
        style = 'bg-emerald/15 text-emerald border-emerald/30';
        label = 'High Comfort';
        break;
      case 'MEDIUM':
        style = 'bg-warning/15 text-warning border-warning/30';
        label = 'Medium Comfort';
        break;
      case 'LOW':
        style = 'bg-white/10 text-secondaryText border-white/10';
        label = 'Low Comfort';
        break;
    }
  } else if (type === 'budgetTier') {
    switch (value) {
      case 'NORMAL':
        style = 'bg-emerald/15 text-emerald border-emerald/30';
        label = 'Normal (<75%)';
        break;
      case 'WARNING':
        style = 'bg-warning/15 text-warning border-warning/30';
        label = 'Warning (75-90%)';
        break;
      case 'CRITICAL':
        style = 'bg-danger/20 text-danger border-danger/40';
        label = 'Critical (90-100%)';
        break;
      case 'OVER_BUDGET':
        style = 'bg-danger/30 text-danger border-danger/60 animate-pulse';
        label = 'Over Budget (>100%)';
        break;
    }
  } else if (type === 'powerStatus') {
    if (value === 'ON') {
      style = 'bg-emerald/20 text-emerald border-emerald/40 font-semibold';
      label = 'ACTIVE';
    } else {
      style = 'bg-white/5 text-secondaryText/60 border-white/5';
      label = 'INACTIVE';
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border tracking-wide uppercase ${style} ${className}`}
    >
      {label}
    </span>
  );
};
