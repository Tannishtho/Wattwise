import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Save,
  CheckCircle2,
  HardDrive,
  MessageSquare,
  Flame,
  VolumeX,
  Volume2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { BabaMood } from '../types/notification';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetToDefaults } = useApp();

  const [tariff, setTariff] = useState(settings.electricityTariffINR.toString());
  const [target, setTargetInput] = useState(settings.monthlyBudgetTargetINR.toString());
  const [cycleDays, setCycleDays] = useState(settings.billingCycleDays.toString());
  const [babaMood, setMood] = useState<BabaMood>(settings.babaMood);
  const [babaAudio, setBabaAudio] = useState(settings.babaAudioEnabled);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const res = updateSettings({
      electricityTariffINR: parseFloat(tariff) || 8,
      monthlyBudgetTargetINR: parseFloat(target) || 2500,
      billingCycleDays: parseInt(cycleDays, 10) || 30,
      babaMood,
      babaAudioEnabled: babaAudio,
    });

    if (res.success) {
      setSuccessBanner('Application preferences and mathematical parameters saved successfully.');
      setTimeout(() => setSuccessBanner(null), 4000);
    }
  };

  const handleConfirmReset = () => {
    setIsResetModalOpen(false);
    resetToDefaults();
    setTariff('8');
    setTargetInput('2500');
    setCycleDays('30');
    setMood('ROAST');
    setBabaAudio(false);
    setSuccessBanner('System fully restored to factory demonstration defaults.');
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <PageContainer
      title="Settings & Configuration"
      subtitle="Manage calculation engine constants, tariff tiers, Bijli Baba personality modes, and local browser persistence."
    >
      {successBanner && (
        <div className="p-3.5 rounded-xl bg-emerald/15 border border-emerald/30 text-xs text-emerald flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Electrical & Billing Constants */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Sliders className="w-5 h-5 text-emerald" />
            <div>
              <h3 className="text-base font-heading font-bold text-primaryText">
                Electrical Tariff & Household Billing Parameters
              </h3>
              <p className="text-xs text-secondaryText">
                Defines the central mathematical foundation for monthly cost and savings calculations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-secondaryText uppercase tracking-wider mb-2">
                Electricity Tariff (₹ per kWh)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="100"
                value={tariff}
                onChange={(e) => setTariff(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-white/10 text-sm text-primaryText focus:outline-none focus:border-emerald font-mono"
                required
              />
              <span className="text-[10px] text-secondaryText mt-1 block">Default: ₹8.00/kWh</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondaryText uppercase tracking-wider mb-2">
                Monthly Budget Target (₹)
              </label>
              <input
                type="number"
                min="100"
                max="50000"
                value={target}
                onChange={(e) => setTargetInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-white/10 text-sm text-primaryText focus:outline-none focus:border-emerald font-mono"
                required
              />
              <span className="text-[10px] text-secondaryText mt-1 block">Default: ₹2,500</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondaryText uppercase tracking-wider mb-2">
                Billing Cycle Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={cycleDays}
                onChange={(e) => setCycleDays(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-white/10 text-sm text-primaryText focus:outline-none focus:border-emerald font-mono"
                required
              />
              <span className="text-[10px] text-secondaryText mt-1 block">Standard month: 30 days</span>
            </div>
          </div>
        </div>

        {/* Section 2: BIJLI BABA Assistant Personality Modes */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <span className="text-xl">👳🏽‍♂️</span>
            <div>
              <h3 className="text-base font-heading font-bold text-primaryText">
                BIJLI BABA Contextual Energy Assistant
              </h3>
              <p className="text-xs text-secondaryText">
                Select assistant interaction tone and proactive notification aggressiveness
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Roast Mode */}
            <div
              onClick={() => setMood('ROAST')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                babaMood === 'ROAST'
                  ? 'border-danger bg-danger/10 shadow-glow-danger'
                  : 'border-white/5 bg-secondary/20 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 font-bold text-sm text-primaryText">
                  <Flame className="w-4 h-4 text-danger" />
                  <span>ROAST MODE</span>
                </span>
                <span className="text-xs">{babaMood === 'ROAST' ? '●' : '○'}</span>
              </div>
              <p className="text-xs text-secondaryText">
                Witty, sharp, Hinglish sarcastic quips that call you out whenever you waste electricity or blow your budget.
              </p>
            </div>

            {/* Normal Mode */}
            <div
              onClick={() => setMood('NORMAL')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                babaMood === 'NORMAL'
                  ? 'border-emerald bg-emerald/10 shadow-glow'
                  : 'border-white/5 bg-secondary/20 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 font-bold text-sm text-primaryText">
                  <MessageSquare className="w-4 h-4 text-emerald" />
                  <span>NORMAL MODE</span>
                </span>
                <span className="text-xs">{babaMood === 'NORMAL' ? '●' : '○'}</span>
              </div>
              <p className="text-xs text-secondaryText">
                Friendly, polite and informative energy guidance focused on constructive savings and advisory alerts.
              </p>
            </div>

            {/* Silent Mode */}
            <div
              onClick={() => setMood('SILENT')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                babaMood === 'SILENT'
                  ? 'border-white/40 bg-white/5'
                  : 'border-white/5 bg-secondary/20 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 font-bold text-sm text-primaryText">
                  <VolumeX className="w-4 h-4 text-secondaryText" />
                  <span>SILENT MODE</span>
                </span>
                <span className="text-xs">{babaMood === 'SILENT' ? '●' : '○'}</span>
              </div>
              <p className="text-xs text-secondaryText">
                Disables unsolicited toast popups. Advice is only surfaced when you explicitly click "Ask Baba".
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-secondaryText">Audio notifications (speech synthesis / chimes):</span>
            <button
              type="button"
              onClick={() => setBabaAudio(!babaAudio)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                babaAudio ? 'bg-emerald text-black' : 'bg-white/10 text-secondaryText'
              }`}
            >
              {babaAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{babaAudio ? 'Sound ON' : 'Sound Muted'}</span>
            </button>
          </div>
        </div>

        {/* Section 3: Data Persistence & Factory Reset */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <HardDrive className="w-5 h-5 text-emerald" />
            <div>
              <h3 className="text-base font-heading font-bold text-primaryText">
                Browser LocalStorage & Factory Defaults
              </h3>
              <p className="text-xs text-secondaryText">
                All appliance edits, ON/OFF states, budgets, and outage states persist automatically in your browser
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-secondary/20 border border-white/5">
            <div>
              <span className="text-sm font-bold text-primaryText block">
                Reset to Demonstration Defaults
              </span>
              <p className="text-xs text-secondaryText mt-0.5">
                Restores standard 6 appliances, ₹8/kWh tariff, ₹2500 budget target, and clears activity logs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-danger/15 hover:bg-danger text-danger hover:text-white border border-danger/30 text-xs font-bold transition-all shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restore Factory Defaults</span>
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald hover:bg-emerald/90 text-black font-bold text-sm shadow-glow transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configuration</span>
          </button>
        </div>
      </form>

      {/* Confirmation Modal for Factory Reset */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        title="Restore Factory Demonstration Defaults?"
        message="This action will erase all custom appliances, custom operating hour adjustments, and personalized budget settings, restoring WATTWISE to pristine competition demonstration state."
        confirmLabel="Reset Everything"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </PageContainer>
  );
};
