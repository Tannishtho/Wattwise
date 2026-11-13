import React from 'react';

interface ProgressBarProps {
  value: number; // percentage (0 to 100+)
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  className = '',
}) => {
  const normalizedPercentage = max > 0 ? (value / max) * 100 : 0;
  const clampedDisplayWidth = Math.min(100, Math.max(0, normalizedPercentage));

  let barColor = 'bg-emerald';
  let textColor = 'text-emerald';

  if (normalizedPercentage > 100) {
    barColor = 'bg-danger animate-pulse';
    textColor = 'text-danger font-bold';
  } else if (normalizedPercentage >= 90) {
    barColor = 'bg-danger';
    textColor = 'text-danger';
  } else if (normalizedPercentage >= 75) {
    barColor = 'bg-warning';
    textColor = 'text-warning';
  }

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-secondaryText font-medium">Progress</span>
          <span className={`font-semibold ${textColor}`}>
            {normalizedPercentage.toFixed(1)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-secondary/50 rounded-full overflow-hidden border border-white/5 ${heightClasses[size]}`}>
        <div
          className={`h-full transition-all duration-500 rounded-full ${barColor}`}
          style={{ width: `${clampedDisplayWidth}%` }}
        />
      </div>
    </div>
  );
};
