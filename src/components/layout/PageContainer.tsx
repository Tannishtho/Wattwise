import React from 'react';
import { SimulationNotice } from '../common/SimulationNotice';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  showSimulationNotice?: boolean;
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  action,
  showSimulationNotice = true,
  children,
}) => {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 pb-24 lg:pb-12 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primaryText tracking-tight">
              {title}
            </h2>
            {showSimulationNotice && <SimulationNotice compact={true} />}
          </div>
          {subtitle && (
            <p className="text-sm text-secondaryText mt-1 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 flex items-center gap-3">{action}</div>}
      </div>

      {/* Main Content Body */}
      {children}
    </div>
  );
};
