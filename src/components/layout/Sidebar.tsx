import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  Wallet,
  LineChart,
  Lightbulb,
  ZapOff,
  Sliders,
  Zap,
  Flame,
  MessageSquare,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NAV_ITEMS = [
  { path: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
  { path: '/appliances', label: 'Appliance Management', icon: Cpu },
  { path: '/budget', label: 'Budget Planner', icon: Wallet },
  { path: '/analytics', label: 'Energy Analytics', icon: LineChart },
  { path: '/recommendations', label: 'Smart Recommendations', icon: Lightbulb },
  { path: '/emergency', label: 'Emergency Mode', icon: ZapOff, isEmergency: true },
  { path: '/settings', label: 'Settings & Config', icon: Sliders },
];

export const Sidebar: React.FC = () => {
  const { emergencyState, settings, setBabaMood, triggerManualBabaTip } = useApp();
  const isEmergency = emergencyState.isActive;

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 bg-[#0E1726] border-r border-white/5 h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-emerald-600 flex items-center justify-center shadow-glow">
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xl tracking-wider text-primaryText">
                WATT<span className="text-emerald">WISE</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald/20 text-emerald uppercase tracking-wider">
                Ver A
              </span>
            </div>
            <p className="text-[11px] text-secondaryText tracking-wide">
              Monitor. Optimise. Save. Decide.
            </p>
          </div>
        </div>

        {/* System Mode Indicator */}
        <div className="mt-4">
          {isEmergency ? (
            <div className="p-2.5 rounded-lg bg-danger/15 border border-danger/40 flex items-center justify-between emergency-active">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-danger animate-ping"></span>
                <span className="text-xs font-bold text-danger uppercase tracking-wider">
                  Outage Mode Active
                </span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-danger/20 text-white">
                3/3 RULE
              </span>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-secondary/30 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald"></span>
                <span className="text-xs font-medium text-emerald uppercase tracking-wider">
                  Normal Grid Power
                </span>
              </div>
              <span className="text-[10px] text-secondaryText font-mono">
                Stable
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? item.isEmergency && isEmergency
                      ? 'bg-danger text-white shadow-glow-danger'
                      : 'bg-emerald text-black shadow-glow font-semibold'
                    : item.isEmergency && isEmergency
                    ? 'text-danger bg-danger/10 hover:bg-danger/20'
                    : 'text-secondaryText hover:text-primaryText hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive
                          ? item.isEmergency && isEmergency
                            ? 'text-white'
                            : 'text-black'
                          : item.isEmergency && isEmergency
                          ? 'text-danger'
                          : 'text-secondaryText group-hover:text-emerald'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.isEmergency && isEmergency && (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* BIJLI BABA Assistant Card */}
      <div className="p-4 m-4 rounded-2xl glass-panel border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">👳🏽‍♂️</span>
            <div>
              <h5 className="text-xs font-heading font-bold text-primaryText">
                BIJLI BABA
              </h5>
              <p className="text-[10px] text-emerald font-medium">
                Contextual Energy Mentor
              </p>
            </div>
          </div>
          <button
            onClick={triggerManualBabaTip}
            title="Ask Baba for a tip"
            className="p-1 rounded bg-white/5 hover:bg-white/10 text-secondaryText hover:text-emerald text-[11px] transition-colors"
          >
            Ask Tip
          </button>
        </div>

        {/* Mood Switcher Pills */}
        <div className="flex items-center gap-1 mt-2.5 p-1 rounded-lg bg-black/40 border border-white/5 text-[10px]">
          <button
            type="button"
            onClick={() => setBabaMood('ROAST')}
            className={`flex-1 py-1 rounded flex items-center justify-center gap-1 transition-all ${
              settings.babaMood === 'ROAST'
                ? 'bg-danger text-white font-bold shadow-sm'
                : 'text-secondaryText hover:text-primaryText'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Roast</span>
          </button>
          <button
            type="button"
            onClick={() => setBabaMood('NORMAL')}
            className={`flex-1 py-1 rounded flex items-center justify-center gap-1 transition-all ${
              settings.babaMood === 'NORMAL'
                ? 'bg-emerald text-black font-bold shadow-sm'
                : 'text-secondaryText hover:text-primaryText'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            <span>Normal</span>
          </button>
          <button
            type="button"
            onClick={() => setBabaMood('SILENT')}
            className={`flex-1 py-1 rounded flex items-center justify-center gap-1 transition-all ${
              settings.babaMood === 'SILENT'
                ? 'bg-white/20 text-white font-bold shadow-sm'
                : 'text-secondaryText hover:text-primaryText'
            }`}
          >
            <VolumeX className="w-3 h-3" />
            <span>Silent</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
