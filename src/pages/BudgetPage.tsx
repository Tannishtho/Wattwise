import React, { useState } from 'react';
import {
  Wallet,
  IndianRupee,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  PieChart,
  BarChart3,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatINR } from '../utils/currency';
import { formatEnergy, formatPercentage } from '../utils/formatting';

export const BudgetPage: React.FC = () => {
  const {
    budgetAnalysis,
    applianceContributions,
    settings,
    updateSettings,
  } = useApp();

  const [targetInput, setTargetInput] = useState(settings.monthlyBudgetTargetINR.toString());
  const [tariffInput, setTariffInput] = useState(settings.electricityTariffINR.toString());
  const [cycleInput, setCycleInput] = useState(settings.billingCycleDays.toString());
  const [activeTab, setActiveTab] = useState<'CONTRIBUTIONS' | 'ALLOCATION'>('CONTRIBUTIONS');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleSaveBudgetConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const t = parseFloat(targetInput);
    const tr = parseFloat(tariffInput);
    const c = parseInt(cycleInput, 10);

    const res = updateSettings({
      monthlyBudgetTargetINR: isNaN(t) || t <= 0 ? 2500 : t,
      electricityTariffINR: isNaN(tr) || tr <= 0 ? 8 : tr,
      billingCycleDays: isNaN(c) || c <= 0 ? 30 : c,
    });

    if (res.success) {
      setFeedbackMessage('Budget configuration updated. Calculations refreshed across all modules.');
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  return (
    <PageContainer
      title="Monthly Electricity Budget Planner"
      subtitle="Establish monthly electricity expenditure ceilings, track real-time utilisation pacing, and analyze appliance cost distributions."
    >
      {feedbackMessage && (
        <div className="p-3 rounded-xl bg-emerald/15 border border-emerald/30 text-xs text-emerald flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* TOP ROW: Live Budget Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Target */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondaryText uppercase">Monthly Target</span>
            <div className="p-2 rounded-lg bg-emerald/10 text-emerald">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-heading font-bold text-primaryText">
            {formatINR(budgetAnalysis.monthlyTargetINR)}
          </span>
          <span className="text-[11px] text-secondaryText block mt-1">
            Ceiling for {settings.billingCycleDays} billing days
          </span>
        </div>

        {/* Projected Monthly Bill */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondaryText uppercase">Projected Bill</span>
            <div className="p-2 rounded-lg bg-secondary/60 text-secondaryText">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-heading font-bold text-primaryText">
            {formatINR(budgetAnalysis.projectedMonthlyBillINR)}
          </span>
          <span className="text-[11px] text-secondaryText block mt-1">
            Calculated at ₹{settings.electricityTariffINR}/kWh
          </span>
        </div>

        {/* Remaining / Over Target */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondaryText uppercase">
              {budgetAnalysis.amountRemainingINR > 0 ? 'Remaining Buffer' : 'Budget Overage'}
            </span>
            <div
              className={`p-2 rounded-lg ${
                budgetAnalysis.amountRemainingINR > 0
                  ? 'bg-emerald/10 text-emerald'
                  : 'bg-danger/10 text-danger'
              }`}
            >
              {budgetAnalysis.amountRemainingINR > 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
            </div>
          </div>
          <span
            className={`text-2xl font-heading font-bold ${
              budgetAnalysis.amountRemainingINR > 0 ? 'text-emerald' : 'text-danger'
            }`}
          >
            {formatINR(
              budgetAnalysis.amountRemainingINR > 0
                ? budgetAnalysis.amountRemainingINR
                : budgetAnalysis.amountOverBudgetINR
            )}
          </span>
          <span className="text-[11px] text-secondaryText block mt-1">
            {budgetAnalysis.amountRemainingINR > 0 ? 'Under target limit' : 'Requires immediate load trimming'}
          </span>
        </div>

        {/* Utilisation Percentage */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondaryText uppercase">Utilisation</span>
            <StatusBadge type="budgetTier" value={budgetAnalysis.tier} />
          </div>
          <span className="text-2xl font-heading font-bold text-primaryText">
            {budgetAnalysis.utilisationPercentage}%
          </span>
          <span className="text-[11px] text-secondaryText block mt-1">
            Status: {budgetAnalysis.statusLabel}
          </span>
        </div>
      </div>

      {/* SECOND ROW: Progress Bar & Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Bar & Threshold Guages */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-heading font-bold text-primaryText">
                  Monthly Budget Utilisation Pacing
                </h3>
                <p className="text-xs text-secondaryText">
                  Visual threshold indicator with multi-tier alerts
                </p>
              </div>
              <StatusBadge type="budgetTier" value={budgetAnalysis.tier} />
            </div>

            <div className="space-y-4 my-6">
              <ProgressBar
                value={budgetAnalysis.utilisationPercentage}
                max={100}
                showLabel={true}
                size="lg"
              />

              {/* Threshold Milestones */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
                <div
                  className={`p-2.5 rounded-xl border ${
                    budgetAnalysis.utilisationPercentage < 75
                      ? 'bg-emerald/10 border-emerald/30 text-emerald'
                      : 'bg-black/20 border-white/5 text-secondaryText'
                  }`}
                >
                  <span className="font-bold block">&lt; 75%</span>
                  <span className="text-[10px]">Normal Zone</span>
                </div>
                <div
                  className={`p-2.5 rounded-xl border ${
                    budgetAnalysis.utilisationPercentage >= 75 && budgetAnalysis.utilisationPercentage < 90
                      ? 'bg-warning/15 border-warning/30 text-warning'
                      : 'bg-black/20 border-white/5 text-secondaryText'
                  }`}
                >
                  <span className="font-bold block">75% - 90%</span>
                  <span className="text-[10px]">Warning Zone</span>
                </div>
                <div
                  className={`p-2.5 rounded-xl border ${
                    budgetAnalysis.utilisationPercentage >= 90
                      ? 'bg-danger/20 border-danger/40 text-danger'
                      : 'bg-black/20 border-white/5 text-secondaryText'
                  }`}
                >
                  <span className="font-bold block">&gt; 90%</span>
                  <span className="text-[10px]">Critical / Over</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-secondary/30 border border-white/5 text-xs text-secondaryText flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-primaryText">Bijli Baba Automatic Trigger Guard:</span>
              Alert notifications are fired at 75%, 90%, and 100% budget marks with cooldown deduplication to prevent spamming.
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-5 h-5 text-emerald" />
            <h3 className="text-base font-heading font-bold text-primaryText">
              Tariff & Budget Settings
            </h3>
          </div>

          <form onSubmit={handleSaveBudgetConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-secondaryText uppercase tracking-wider mb-1.5">
                Monthly Target (₹)
              </label>
              <input
                type="number"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                min={100}
                max={50000}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-white/10 text-sm text-primaryText focus:outline-none focus:border-emerald"
                required
              />
              <span className="text-[10px] text-secondaryText mt-1 block">Default demonstration: ₹2,500</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondaryText uppercase tracking-wider mb-1.5">
                Tariff per kWh (₹)
              </label>
              <input
                type="number"
                step="0.5"
                value={tariffInput}
                onChange={(e) => setTariffInput(e.target.value)}
                min={1}
                max={100}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-white/10 text-sm text-primaryText focus:outline-none focus:border-emerald"
                required
              />
              <span className="text-[10px] text-secondaryText mt-1 block">Demonstration tariff: ₹8.00 / kWh</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondaryText uppercase tracking-wider mb-1.5">
                Billing Cycle (Days)
              </label>
              <input
                type="number"
                value={cycleInput}
                onChange={(e) => setCycleInput(e.target.value)}
                min={1}
                max={365}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-white/10 text-sm text-primaryText focus:outline-none focus:border-emerald"
                required
              />
              <span className="text-[10px] text-secondaryText mt-1 block">Standard month: 30 days</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald hover:bg-emerald/90 text-black font-bold text-xs shadow-glow transition-all"
            >
              Update Budget Parameters
            </button>
          </form>
        </div>
      </div>

      {/* THIRD ROW: Appliance Contribution vs Suggested Allocation Tabs */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
          <div>
            <h3 className="text-lg font-heading font-bold text-primaryText">
              Appliance Cost Distribution & Budget Allocation
            </h3>
            <p className="text-xs text-secondaryText">
              Compare actual simulated monthly costs against ideal essentiality-weighted budget allocations
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5 text-xs">
            <button
              onClick={() => setActiveTab('CONTRIBUTIONS')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'CONTRIBUTIONS'
                  ? 'bg-emerald text-black font-bold shadow-sm'
                  : 'text-secondaryText hover:text-primaryText'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Simulated Cost Contributions</span>
            </button>
            <button
              onClick={() => setActiveTab('ALLOCATION')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'ALLOCATION'
                  ? 'bg-emerald text-black font-bold shadow-sm'
                  : 'text-secondaryText hover:text-primaryText'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Suggested Allocation View</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Simulated Cost Contributions */}
        {activeTab === 'CONTRIBUTIONS' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-secondaryText uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Appliance</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold text-right">Monthly Energy</th>
                  <th className="pb-3 font-semibold text-right">Monthly Cost</th>
                  <th className="pb-3 font-semibold text-right">Share of Total</th>
                  <th className="pb-3 font-semibold pl-4">Cost Share Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applianceContributions.map((item) => (
                  <tr key={item.applianceId} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 font-medium text-primaryText">{item.name}</td>
                    <td className="py-3.5 text-secondaryText">{item.category}</td>
                    <td className="py-3.5 text-right font-mono text-primaryText">
                      {formatEnergy(item.monthlyKWh)}
                    </td>
                    <td className="py-3.5 text-right font-bold text-emerald">
                      {formatINR(item.monthlyCostINR)}
                    </td>
                    <td className="py-3.5 text-right font-mono text-primaryText">
                      {formatPercentage(item.percentageOfTotalCost)}
                    </td>
                    <td className="py-3.5 pl-4 w-40">
                      <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald h-full rounded-full"
                          style={{ width: `${Math.min(100, item.percentageOfTotalCost)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Suggested Allocation View */}
        {activeTab === 'ALLOCATION' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-secondary/30 border border-white/5 text-xs text-secondaryText">
              <span className="font-semibold text-primaryText">Allocation Methodology: </span>
              Based on essentiality weights (Critical = 3x, Essential = 2x, Optional = 1x), this suggests how your target budget of {formatINR(budgetAnalysis.monthlyTargetINR)} would ideally be distributed.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applianceContributions.map((item) => {
                const diff = item.monthlyCostINR - item.suggestedAllocatedBudgetINR;
                const isOverAllocated = diff > 0;

                return (
                  <div
                    key={item.applianceId}
                    className="p-4 rounded-xl bg-secondary/20 border border-white/5 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-primaryText">{item.name}</h4>
                      <span className="text-xs text-secondaryText font-mono">
                        Target Share: {formatINR(item.suggestedAllocatedBudgetINR)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-2 border-t border-white/5 mt-2">
                      <span className="text-secondaryText">Actual Calculated: {formatINR(item.monthlyCostINR)}</span>
                      <span
                        className={`font-semibold ${
                          isOverAllocated ? 'text-danger' : 'text-emerald'
                        }`}
                      >
                        {isOverAllocated
                          ? `+${formatINR(diff)} over target share`
                          : `${formatINR(Math.abs(diff))} below target share`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
