import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  variant?: 'emerald' | 'warning' | 'danger' | 'default';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  subtitle,
  trend,
  variant = 'emerald',
  onClick,
}) => {
  const variantStyles = {
    emerald: 'border-emerald/20 hover:border-emerald/40 text-emerald',
    warning: 'border-warning/20 hover:border-warning/40 text-warning',
    danger: 'border-danger/20 hover:border-danger/40 text-danger',
    default: 'border-white/10 hover:border-white/20 text-secondaryText',
  };

  const iconBgStyles = {
    emerald: 'bg-emerald/10 text-emerald',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    default: 'bg-white/5 text-secondaryText',
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-5 rounded-xl border transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      } ${variantStyles[variant]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-secondaryText">
          {title}
        </span>
        <div className={`p-2.5 rounded-lg ${iconBgStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-2xl sm:text-3xl font-heading font-bold text-primaryText">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-secondaryText">
            {unit}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-white/5">
          {subtitle && <span className="text-secondaryText truncate">{subtitle}</span>}
          {trend && (
            <span
              className={`font-medium ml-auto ${
                trend.isPositive ? 'text-emerald' : 'text-danger'
              }`}
            >
              {trend.value} {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
