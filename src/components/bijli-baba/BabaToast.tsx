import React from 'react';
import { X, Flame, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BabaToast: React.FC = () => {
  const { activeBabaToast, dismissBabaToast } = useApp();

  if (!activeBabaToast) return null;

  const isRoast = activeBabaToast.severity === 'ROAST';
  const isCritical = activeBabaToast.severity === 'CRITICAL';
  const isSuccess = activeBabaToast.severity === 'SUCCESS';

  let borderColor = 'border-emerald/40';
  let badgeColor = 'bg-emerald/20 text-emerald';
  let Icon = Sparkles;

  if (isCritical) {
    borderColor = 'border-danger/60';
    badgeColor = 'bg-danger/20 text-danger';
    Icon = AlertCircle;
  } else if (isRoast) {
    borderColor = 'border-warning/60';
    badgeColor = 'bg-warning/20 text-warning';
    Icon = Flame;
  } else if (isSuccess) {
    borderColor = 'border-emerald/60';
    badgeColor = 'bg-emerald/20 text-emerald';
    Icon = CheckCircle2;
  }

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-full animate-bounce-subtle">
      <div
        className={`glass-panel p-4 rounded-2xl border ${borderColor} shadow-2xl relative overflow-hidden backdrop-blur-xl bg-[#0E1726]/95`}
      >
        {/* Accent Top Bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            isCritical ? 'bg-danger' : isRoast ? 'bg-warning' : 'bg-emerald'
          }`}
        />

        <div className="flex items-start gap-3.5">
          {/* Avatar Icon */}
          <div className="w-11 h-11 rounded-2xl bg-secondary/80 border border-white/10 flex items-center justify-center text-2xl shrink-0 shadow-inner">
            👳🏽‍♂️
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                <Icon className="w-3 h-3" />
                <span>BIJLI BABA</span>
              </span>
              <span className="text-[10px] text-secondaryText truncate">
                {activeBabaToast.headline}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-primaryText leading-relaxed">
              "{activeBabaToast.message}"
            </p>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={dismissBabaToast}
            className="absolute top-3 right-3 p-1 rounded-lg text-secondaryText hover:text-primaryText hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
