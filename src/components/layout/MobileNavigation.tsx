import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { NAV_ITEMS } from './Sidebar';
import { useApp } from '../../context/AppContext';

export const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { emergencyState } = useApp();
  const isEmergency = emergencyState.isActive;

  return (
    <>
      {/* Mobile Top App Bar */}
      <div className="lg:hidden bg-[#0E1726] border-b border-white/5 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald flex items-center justify-center">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <span className="font-heading font-black text-lg text-primaryText">
            WATT<span className="text-emerald">WISE</span>
          </span>
          {isEmergency && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-danger text-white uppercase">
              Outage
            </span>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-white/5 text-primaryText hover:bg-white/10"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md pt-16 p-6 flex flex-col justify-between animate-fade-in">
          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? 'bg-emerald text-black font-semibold'
                        : 'text-secondaryText hover:text-primaryText hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="p-4 rounded-xl glass-panel text-center text-xs text-secondaryText">
            WATTWISE Version A — Intelligent Simulation
          </div>
        </div>
      )}

      {/* Mobile Bottom Quick Bar for Top 4 Destinations */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0E1726]/95 backdrop-blur-lg border-t border-white/10 px-2 py-2 flex items-center justify-around">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium transition-colors ${
                  isActive ? 'text-emerald' : 'text-secondaryText hover:text-primaryText'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="truncate max-w-[56px]">{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};
