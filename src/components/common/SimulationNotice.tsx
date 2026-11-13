import React from 'react';
import { Info } from 'lucide-react';

interface SimulationNoticeProps {
  className?: string;
  compact?: boolean;
}

export const SimulationNotice: React.FC<SimulationNoticeProps> = ({ className = '', compact = false }) => {
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald/10 text-emerald border border-emerald/20 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse"></span>
        <span>Deterministic Simulation</span>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-secondary/60 text-xs text-secondaryText ${className}`}>
      <Info className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-primaryText mr-1">Version A Software Simulation:</span>
        All readings, load distributions, and bill projections are calculated using deterministic physics-based formulas. No physical smart meters or IoT sensors are connected.
      </div>
    </div>
  );
};
