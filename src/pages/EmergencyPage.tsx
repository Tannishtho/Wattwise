import React, { useState } from 'react';
import {
  ZapOff,
  Zap,
  CheckCircle2,
  Sliders,
  ShieldAlert,
  BatteryCharging,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatINR } from '../utils/currency';
import { formatPower, formatEnergy } from '../utils/formatting';

export const EmergencyPage: React.FC = () => {
  const {
    emergencyState,
    appliances,
    emergencyCombinations,
    emergencyLiveMetrics,
    triggerEmergencyPowerCut,
    toggleEmergencyAppliance,
    confirmEmergencySelection,
    applyEmergencyAdvisorCombination,
    restoreNormalPower,
  } = useApp();

  const [isPowerCutModalOpen, setIsPowerCutModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'SELECTION' | 'ADVISOR'>('SELECTION');

  const isEmergency = emergencyState.isActive;
  const selectedIds = emergencyState.selectedApplianceIds;
  const selectedCount = selectedIds.length;

  // Best recommended combination (#1 rank)
  const bestCombination = emergencyCombinations[0];

  const handleToggleAppliance = (id: string) => {
    setValidationError(null);
    const res = toggleEmergencyAppliance(id);
    if (!res.success && res.error) {
      setValidationError(res.error);
    }
  };

  const handleConfirmSelection = () => {
    setValidationError(null);
    const res = confirmEmergencySelection();
    if (!res.success && res.error) {
      setValidationError(res.error);
    }
  };

  return (
    <PageContainer
      title="Emergency Power Outage Management"
      subtitle="Simulate complete grid power failure, enforce strict 3-appliance backup constraints, and run the Smart Emergency Advisor across all 20 possible combinations."
    >
      {/* POWER OUTAGE STATUS BANNER / TRIGGER CONTROLS */}
      {isEmergency ? (
        <div className="p-6 rounded-2xl bg-danger/15 border-2 border-danger/60 emergency-active flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-danger text-white shadow-glow-danger shrink-0">
              <ZapOff className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-danger text-white uppercase tracking-wider">
                  SIMULATED OUTAGE ACTIVE
                </span>
                <span className="text-xs text-danger font-mono">
                  Started at {new Date(emergencyState.outageStartTime || Date.now()).toLocaleTimeString()}
                </span>
              </div>
              <h3 className="text-xl font-heading font-bold text-white">
                Household On Inverter / Battery Backup
              </h3>
              <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
                Normal electrical grid is offline. Strictly <strong>three (3) appliances</strong> are permitted to run simultaneously to protect the emergency battery from rapid discharge or inverter tripping.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsRestoreModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald hover:bg-emerald/90 text-black font-bold text-xs shadow-glow transition-all"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Restore Normal Power</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald/15 text-emerald border border-emerald/30 shadow-glow shrink-0">
              <BatteryCharging className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald"></span>
                <span className="text-xs font-semibold text-emerald uppercase tracking-wider">
                  Grid Power Stable
                </span>
              </div>
              <h3 className="text-xl font-heading font-bold text-primaryText">
                Normal Electrical Operating Mode
              </h3>
              <p className="text-xs text-secondaryText mt-1 max-w-xl leading-relaxed">
                All household appliances are operating under standard utility power. Activate the outage simulation to test emergency load optimization algorithms.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPowerCutModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-danger hover:bg-danger/90 text-white font-bold text-xs shadow-glow-danger transition-all shrink-0"
          >
            <ZapOff className="w-4 h-4" />
            <span>TRIGGER POWER CUT</span>
          </button>
        </div>
      )}

      {/* ERROR / REJECTION NOTIFICATION BANNER */}
      {validationError && (
        <div className="p-4 rounded-xl bg-danger/20 border-2 border-danger text-danger text-xs font-semibold flex items-center justify-between gap-3 animate-bounce-subtle">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{validationError}</span>
          </div>
          <button
            onClick={() => setValidationError(null)}
            className="text-xs text-white underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB SELECTOR: Manual Exact-3 Selection vs Smart Advisor */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 p-1 bg-black/40 rounded-xl border border-white/5 text-xs">
          <button
            onClick={() => setActiveTab('SELECTION')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'SELECTION'
                ? 'bg-emerald text-black shadow-glow'
                : 'text-secondaryText hover:text-primaryText'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Appliance Selection (0/3 to 3/3 Rule)</span>
          </button>
          <button
            onClick={() => setActiveTab('ADVISOR')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'ADVISOR'
                ? 'bg-emerald text-black shadow-glow'
                : 'text-secondaryText hover:text-primaryText'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Smart Emergency Advisor (All 20 Combinations)</span>
          </button>
        </div>

        {isEmergency && (
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-secondaryText">Selection Status:</span>
            <span
              className={`px-2.5 py-1 rounded-full font-bold font-mono ${
                selectedCount === 3 ? 'bg-emerald/20 text-emerald' : 'bg-warning/20 text-warning'
              }`}
            >
              {selectedCount}/3 SELECTED
            </span>
          </div>
        )}
      </div>

      {/* TAB 1: EXACT-THREE SELECTION CONSOLE */}
      {activeTab === 'SELECTION' && (
        <div className="space-y-6">
          {/* Real-time Emergency Load Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl glass-panel border border-white/5">
              <span className="text-xs text-secondaryText block uppercase tracking-wider">
                Selection Count
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={`text-2xl font-heading font-bold ${selectedCount === 3 ? 'text-emerald' : 'text-warning'}`}>
                  {selectedCount}
                </span>
                <span className="text-sm text-secondaryText font-bold">/ 3 appliances</span>
              </div>
            </div>

            <div className="p-4 rounded-xl glass-panel border border-white/5">
              <span className="text-xs text-secondaryText block uppercase tracking-wider">
                Emergency Power Draw
              </span>
              <span className="text-2xl font-heading font-bold text-primaryText block mt-1">
                {formatPower(emergencyLiveMetrics.currentPowerWatts)}
              </span>
            </div>

            <div className="p-4 rounded-xl glass-panel border border-white/5">
              <span className="text-xs text-secondaryText block uppercase tracking-wider">
                Emergency Daily Energy
              </span>
              <span className="text-2xl font-heading font-bold text-primaryText block mt-1">
                {formatEnergy(emergencyLiveMetrics.dailyKWh)}
              </span>
            </div>

            <div className="p-4 rounded-xl glass-panel border border-white/5">
              <span className="text-xs text-secondaryText block uppercase tracking-wider">
                Emergency Monthly Est.
              </span>
              <span className="text-2xl font-heading font-bold text-emerald block mt-1">
                {formatINR(emergencyLiveMetrics.monthlyCostINR)}
              </span>
            </div>
          </div>

          {/* Interactive Appliance Grid */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-heading font-bold text-primaryText">
                  Select Exactly Three (3) Appliances
                </h3>
                <p className="text-xs text-secondaryText">
                  Click any card to select or deselect. Attempting to choose a 4th appliance is rejected by engine validation.
                </p>
              </div>

              {/* Confirm 3/3 Button */}
              <button
                onClick={handleConfirmSelection}
                disabled={selectedCount !== 3}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                  selectedCount === 3
                    ? 'bg-emerald hover:bg-emerald/90 text-black shadow-glow'
                    : 'bg-white/5 text-secondaryText cursor-not-allowed opacity-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm 3 Active Appliances</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {appliances.map((appliance) => {
                const isSelected = selectedIds.includes(appliance.id);

                return (
                  <div
                    key={appliance.id}
                    onClick={() => handleToggleAppliance(appliance.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                      isSelected
                        ? 'border-emerald bg-emerald/10 shadow-glow'
                        : 'border-white/5 bg-[#141F30] hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-base font-heading font-bold text-primaryText">
                          {appliance.name}
                        </h4>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSelected
                              ? 'bg-emerald text-black'
                              : 'border border-white/20 text-secondaryText'
                          }`}
                        >
                          {isSelected ? '✓' : ''}
                        </div>
                      </div>

                      <p className="text-xs text-secondaryText mb-3">
                        {appliance.description || `${appliance.category} appliance in ${appliance.location}`}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-secondaryText block uppercase">Power Draw</span>
                        <span className="font-heading font-bold text-primaryText">
                          {formatPower(appliance.ratedPowerWatts)}
                        </span>
                      </div>
                      <StatusBadge type="essentiality" value={appliance.essentiality} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SMART EMERGENCY ADVISOR (THE PROJECT TWIST) */}
      {activeTab === 'ADVISOR' && (
        <div className="space-y-6">
          {/* Algorithmic Methodology Banner */}
          <div className="p-5 rounded-2xl glass-panel border border-emerald/30 bg-emerald/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald text-black font-bold text-xl shrink-0">
                20
              </div>
              <div>
                <h4 className="text-base font-heading font-bold text-primaryText">
                  Combinatorial Optimization Engine: C(6, 3) = 20 Trios Evaluated
                </h4>
                <p className="text-xs text-secondaryText mt-1 max-w-2xl leading-relaxed">
                  The algorithm evaluates all 20 possible combinations of 3 appliances from the 6 default appliances using a weighted formula: <strong>45% Essentiality + 35% Inverter Battery Preservation + 20% Comfort - 45pt Overload Penalty</strong> (if total load &gt; 1000W).
                </p>
              </div>
            </div>

            <button
              onClick={() => applyEmergencyAdvisorCombination(bestCombination)}
              className="px-5 py-2.5 rounded-xl bg-emerald hover:bg-emerald/90 text-black font-bold text-xs shadow-glow transition-all shrink-0 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Apply #1 Ranked Trio</span>
            </button>
          </div>

          {/* HIGHLIGHT CARD: #1 Best Recommended Combination */}
          <div className="glass-panel p-6 rounded-2xl border-2 border-emerald shadow-glow bg-[#141F30]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald text-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <span>🏆</span>
                  <span>BEST RECOMMENDED COMBINATION</span>
                </span>
                <span className="text-xs text-secondaryText font-mono">Rank #1 of 20</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-heading font-bold text-emerald">
                  {bestCombination.compositeScore}
                </span>
                <span className="text-xs text-secondaryText font-semibold">/ 100 Score</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {bestCombination.appliances.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl bg-secondary/40 border border-emerald/20 flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-sm font-bold text-primaryText">{app.name}</h5>
                    <span className="text-xs text-secondaryText">{formatPower(app.ratedPowerWatts)}</span>
                  </div>
                  <StatusBadge type="essentiality" value={app.essentiality} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-black/30 border border-white/5 mb-4 text-center text-xs">
              <div>
                <span className="text-[10px] text-secondaryText uppercase block">Total Power Draw</span>
                <span className="text-base font-heading font-bold text-primaryText">
                  {formatPower(bestCombination.totalPowerWatts)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-secondaryText uppercase block">Emergency Daily kWh</span>
                <span className="text-base font-heading font-bold text-primaryText">
                  {formatEnergy(bestCombination.dailyConsumptionKWh)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-secondaryText uppercase block">Monthly Cost Est.</span>
                <span className="text-base font-heading font-bold text-emerald">
                  {formatINR(bestCombination.projectedMonthlyCostINR)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-secondaryText uppercase block">Inverter Overload Risk</span>
                <span className="text-base font-heading font-bold text-emerald">
                  SAFE (Low Draw)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-secondary/30 border border-white/5 text-xs text-secondaryText">
              <span className="font-bold text-primaryText">Algorithmic Rationale: </span>
              {bestCombination.rationale}
            </div>
          </div>

          {/* ALL 20 COMBINATIONS RANKED TABLE */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-heading font-bold text-primaryText mb-2">
              All 20 Possible Combinations (C(6, 3)) Evaluated & Ranked
            </h3>
            <p className="text-xs text-secondaryText mb-5">
              Complete deterministic evaluation matrix demonstrating how each 3-appliance trio balances essential survival vs electrical overload.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-secondaryText uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Rank</th>
                    <th className="pb-3 font-semibold">Trio Combination</th>
                    <th className="pb-3 font-semibold text-right">Total Watts</th>
                    <th className="pb-3 font-semibold text-right">Daily kWh</th>
                    <th className="pb-3 font-semibold text-right">Monthly Cost</th>
                    <th className="pb-3 font-semibold text-center">Inverter Status</th>
                    <th className="pb-3 font-semibold text-right">Score</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {emergencyCombinations.map((combo) => (
                    <tr
                      key={combo.id}
                      className={`hover:bg-white/5 transition-colors ${
                        combo.isRecommended ? 'bg-emerald/5 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 font-mono text-secondaryText">#{combo.rank}</td>
                      <td className="py-3 font-medium text-primaryText">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{combo.applianceNames[0]}</span>
                          <span className="text-secondaryText">+</span>
                          <span>{combo.applianceNames[1]}</span>
                          <span className="text-secondaryText">+</span>
                          <span>{combo.applianceNames[2]}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono text-primaryText">
                        {combo.totalPowerWatts} W
                      </td>
                      <td className="py-3 text-right font-mono text-secondaryText">
                        {combo.dailyConsumptionKWh} kWh
                      </td>
                      <td className="py-3 text-right font-mono text-emerald">
                        {formatINR(combo.projectedMonthlyCostINR)}
                      </td>
                      <td className="py-3 text-center">
                        {combo.isOverloadRisk ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-danger/20 text-danger border border-danger/40">
                            TRIP RISK (&gt;1000W)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald/10 text-emerald">
                            SAFE
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right font-heading font-bold text-sm">
                        <span
                          className={
                            combo.compositeScore >= 70
                              ? 'text-emerald'
                              : combo.compositeScore >= 40
                              ? 'text-warning'
                              : 'text-danger'
                          }
                        >
                          {combo.compositeScore}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => applyEmergencyAdvisorCombination(combo)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/5 hover:bg-emerald hover:text-black transition-all"
                        >
                          Apply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Triggering Power Cut */}
      <ConfirmationModal
        isOpen={isPowerCutModalOpen}
        title="Simulate Grid Power Outage?"
        message="This will instantly disconnect normal utility power, power down all running appliances, and switch WATTWISE into Emergency Mode governed by the strict 3-appliance backup rule."
        confirmLabel="Simulate Outage"
        cancelLabel="Keep Normal Power"
        isDestructive={true}
        onConfirm={() => {
          setIsPowerCutModalOpen(false);
          triggerEmergencyPowerCut();
        }}
        onCancel={() => setIsPowerCutModalOpen(false)}
      />

      {/* Confirmation Modal for Restoring Normal Power */}
      <ConfirmationModal
        isOpen={isRestoreModalOpen}
        title="Restore Normal Grid Electricity?"
        message="Exiting Emergency Mode will reinstate the exact pre-outage appliance states that existed before the power cut. Emergency load limits will be safely removed."
        confirmLabel="Restore Grid Power"
        cancelLabel="Stay in Emergency"
        isDestructive={false}
        onConfirm={() => {
          setIsRestoreModalOpen(false);
          restoreNormalPower();
        }}
        onCancel={() => setIsRestoreModalOpen(false)}
      />
    </PageContainer>
  );
};
