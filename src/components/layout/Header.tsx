import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ZapOff,
  Zap,
  Bell,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    emergencyState,
    triggerEmergencyPowerCut,
    restoreNormalPower,
    babaMessages,
    triggerManualBabaTip,
  } = useApp();

  const [isPowerCutModalOpen, setIsPowerCutModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  const isEmergency = emergencyState.isActive;

  // Title lookup
  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'Overview Dashboard';
      case '/appliances':
        return 'Appliance Management';
      case '/budget':
        return 'Budget Planner';
      case '/analytics':
        return 'Energy Analytics';
      case '/recommendations':
        return 'Smart Recommendations';
      case '/emergency':
        return 'Emergency Mode & Advisor';
      case '/settings':
        return 'Settings & Configuration';
      default:
        return 'WATTWISE Platform';
    }
  };

  const handleConfirmPowerCut = () => {
    setIsPowerCutModalOpen(false);
    triggerEmergencyPowerCut();
    navigate('/emergency');
  };

  const handleConfirmRestore = () => {
    setIsRestoreModalOpen(false);
    restoreNormalPower();
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-[#0B1220]/90 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Title & Live Status */}
        <div className="flex items-center gap-3">
          <h1 className="text-lg sm:text-xl font-heading font-bold text-primaryText truncate">
            {getPageTitle(location.pathname)}
          </h1>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-secondaryText">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse"></span>
            <span>Simulated Telemetry</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Outage Control Button */}
          {isEmergency ? (
            <button
              onClick={() => setIsRestoreModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald hover:bg-emerald/90 text-black font-semibold text-xs transition-all shadow-glow"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Restore Normal Power</span>
            </button>
          ) : (
            <button
              onClick={() => setIsPowerCutModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-danger/20 hover:bg-danger text-danger hover:text-white border border-danger/40 font-semibold text-xs transition-all"
            >
              <ZapOff className="w-4 h-4" />
              <span>Trigger Power Cut</span>
            </button>
          )}

          {/* Bijli Baba Quick Roast / Tip */}
          <button
            onClick={triggerManualBabaTip}
            title="Ask Bijli Baba for advice"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 hover:bg-secondary text-primaryText border border-white/10 text-xs transition-colors"
          >
            <span>👳🏽‍♂️</span>
            <span className="text-secondaryText hover:text-emerald">Ask Baba</span>
          </button>

          {/* Activity / Notification Bell */}
          <button
            onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-secondaryText hover:text-primaryText border border-white/5 relative transition-colors"
            title="Notification History"
          >
            <Bell className="w-4 h-4" />
            {babaMessages.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald"></span>
            )}
          </button>
        </div>
      </header>

      {/* Confirmation Modal for Triggering Power Cut */}
      <ConfirmationModal
        isOpen={isPowerCutModalOpen}
        title="Simulate Power Outage?"
        message="This will immediately initiate simulated grid disconnection, suspend normal appliance operations, and switch the system into Emergency Mode where exactly 3 appliances can be active."
        confirmLabel="Simulate Outage"
        cancelLabel="Keep Normal Grid"
        isDestructive={true}
        onConfirm={handleConfirmPowerCut}
        onCancel={() => setIsPowerCutModalOpen(false)}
      />

      {/* Confirmation Modal for Restoring Power */}
      <ConfirmationModal
        isOpen={isRestoreModalOpen}
        title="Restore Normal Grid Electricity?"
        message="This will exit Emergency Mode and restore all appliances to the exact ON/OFF states that were running before the power cut. Emergency load allocations will be safely cleared."
        confirmLabel="Restore Grid"
        cancelLabel="Stay in Emergency"
        isDestructive={false}
        onConfirm={handleConfirmRestore}
        onCancel={() => setIsRestoreModalOpen(false)}
      />

      {/* Notification Drawer Modal */}
      {showNotificationDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="w-full max-w-md bg-[#0E1726] border-l border-white/10 h-full p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald" />
                <h3 className="font-heading font-bold text-base text-primaryText">
                  Baba Activity & Alerts
                </h3>
              </div>
              <button
                onClick={() => setShowNotificationDrawer(false)}
                className="text-secondaryText hover:text-primaryText text-xs font-semibold px-2 py-1 rounded bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {babaMessages.length === 0 ? (
                <div className="text-center py-12 text-secondaryText text-sm">
                  No notifications yet. Bijli Baba is observing your electricity usage quietly.
                </div>
              ) : (
                babaMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3.5 rounded-xl glass-panel border border-white/5 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-heading font-bold text-emerald">
                        {msg.headline}
                      </span>
                      <span className="text-[10px] text-secondaryText">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-primaryText leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
