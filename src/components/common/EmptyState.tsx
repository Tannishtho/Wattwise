import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`glass-panel p-8 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center ${className}`}>
      <div className="p-4 rounded-full bg-secondary/50 text-secondaryText mb-3">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-heading font-semibold text-primaryText mb-1">
        {title}
      </h4>
      <p className="text-sm text-secondaryText max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald/20 text-emerald hover:bg-emerald/30 border border-emerald/30 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
