import React, { useState } from 'react';
import {
  Lightbulb,
  TrendingDown,
  CheckCircle,
  Zap,
  Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Recommendation } from '../types/recommendation';
import { formatINR } from '../utils/currency';
import { formatEnergy, formatHours } from '../utils/formatting';
import { calculateMonthlyKWh, calculateMonthlyCostINR } from '../engines/calculationEngine';

export const RecommendationsPage: React.FC = () => {
  const {
    recommendations,
    appliances,
    settings,
    applyRecommendation,
    updateAppliance,
  } = useApp();

  const [appliedRecIds, setAppliedRecIds] = useState<Set<string>>(new Set());

  // Interactive Simulator State
  const [selectedSimApplianceId, setSelectedSimApplianceId] = useState<string>(appliances[0]?.id || '');
  const [simHours, setSimHours] = useState<number>(appliances[0]?.dailyOperatingHours || 4);

  const selectedSimAppliance = appliances.find((a) => a.id === selectedSimApplianceId) || appliances[0];

  const handleApply = (rec: Recommendation) => {
    applyRecommendation(rec);
    setAppliedRecIds((prev) => new Set(prev).add(rec.id));
  };

  // Simulator Calculations
  const currentSimMonthlyKWh = selectedSimAppliance
    ? calculateMonthlyKWh(selectedSimAppliance.ratedPowerWatts, selectedSimAppliance.dailyOperatingHours, settings.billingCycleDays)
    : 0;
  const currentSimMonthlyCost = calculateMonthlyCostINR(currentSimMonthlyKWh, settings.electricityTariffINR);

  const simulatedMonthlyKWh = selectedSimAppliance
    ? calculateMonthlyKWh(selectedSimAppliance.ratedPowerWatts, simHours, settings.billingCycleDays)
    : 0;
  const simulatedMonthlyCost = calculateMonthlyCostINR(simulatedMonthlyKWh, settings.electricityTariffINR);

  const simKWhDifference = Number((currentSimMonthlyKWh - simulatedMonthlyKWh).toFixed(2));
  const simCostDifference = Number((currentSimMonthlyCost - simulatedMonthlyCost).toFixed(2));

  const totalPotentialSavingsINR = recommendations.reduce(
    (sum, r) => sum + r.monthlyMonetarySavingINR,
    0
  );

  return (
    <PageContainer
      title="Smart Energy Recommendations"
      subtitle="Explainable, rule-based algorithmic heuristics designed to trim phantom power, curtail peak load, and reduce monthly electricity bills."
    >
      {/* Top Value Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl glass-panel border border-emerald/20 flex items-center justify-between">
          <div>
            <span className="text-xs text-secondaryText block uppercase tracking-wider">
              Total Potential Savings
            </span>
            <span className="text-2xl font-heading font-bold text-emerald">
              {formatINR(totalPotentialSavingsINR)} / mo
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald/10 text-emerald">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-secondaryText block uppercase tracking-wider">
              Available Opportunities
            </span>
            <span className="text-2xl font-heading font-bold text-primaryText">
              {recommendations.length} Actions
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-secondary/50 text-secondaryText">
            <Lightbulb className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-secondaryText block uppercase tracking-wider">
              Simulation Tariff
            </span>
            <span className="text-2xl font-heading font-bold text-primaryText">
              ₹{settings.electricityTariffINR} / kWh
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-secondary/50 text-secondaryText">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SECTION 1: Actionable Recommendations Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-bold text-primaryText">
            Prioritized Energy Optimisation Opportunities
          </h3>
          <span className="text-xs text-secondaryText">
            Ranked by highest monthly financial return
          </span>
        </div>

        {recommendations.length === 0 ? (
          <div className="p-8 rounded-2xl glass-panel text-center text-secondaryText">
            All appliances are already operating at highly efficient duty cycles!
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {recommendations.map((rec) => {
              const isApplied = appliedRecIds.has(rec.id);

              let priorityBadge = 'bg-secondary/40 text-secondaryText border-white/10';
              if (rec.priority === 'HIGH') {
                priorityBadge = 'bg-danger/15 text-danger border-danger/30 font-bold';
              } else if (rec.priority === 'MEDIUM') {
                priorityBadge = 'bg-warning/15 text-warning border-warning/30 font-semibold';
              }

              return (
                <div
                  key={rec.id}
                  className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isApplied
                      ? 'border-emerald/40 bg-emerald/5'
                      : 'border-white/10 hover:border-emerald/30'
                  }`}
                >
                  <div>
                    {/* Header: Title and Priority */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="text-base font-heading font-bold text-primaryText">
                        {rec.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase border tracking-wider shrink-0 ${priorityBadge}`}>
                        {rec.priority} Priority
                      </span>
                    </div>

                    {/* Explanation */}
                    <p className="text-xs text-secondaryText leading-relaxed mb-4">
                      {rec.explanation}
                    </p>

                    {/* Duty Cycle Comparison */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-secondary/30 border border-white/5 mb-4 text-xs">
                      <div>
                        <span className="text-[10px] text-secondaryText block">Current Runtime</span>
                        <span className="font-semibold text-primaryText">
                          {formatHours(rec.currentHours)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald block">Suggested Target</span>
                        <span className="font-bold text-emerald">
                          {formatHours(rec.suggestedHours)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Savings & Action Button */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-secondaryText block uppercase">Estimated Savings</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-heading font-bold text-emerald">
                          {formatINR(rec.monthlyMonetarySavingINR)}
                        </span>
                        <span className="text-[11px] text-secondaryText">
                          ({formatEnergy(rec.monthlyEnergySavingKWh)}/mo)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApply(rec)}
                      disabled={isApplied}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isApplied
                          ? 'bg-emerald/20 text-emerald border border-emerald/30 cursor-default'
                          : 'bg-emerald hover:bg-emerald/90 text-black shadow-glow'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <>
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Apply Runtime</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: Interactive What-If Savings Simulator */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <Sliders className="w-5 h-5 text-emerald" />
          <h3 className="text-lg font-heading font-bold text-primaryText">
            Interactive "What-If" Savings Simulator
          </h3>
        </div>
        <p className="text-xs text-secondaryText mb-6 max-w-2xl">
          Adjust the daily operating runtime slider for any appliance to simulate instantaneous changes in monthly energy consumption and expenditure.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Appliance Selection & Slider Controls */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-secondaryText uppercase tracking-wider mb-2">
                Select Appliance to Simulate
              </label>
              <select
                value={selectedSimApplianceId}
                onChange={(e) => {
                  setSelectedSimApplianceId(e.target.value);
                  const app = appliances.find((a) => a.id === e.target.value);
                  if (app) setSimHours(app.dailyOperatingHours);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-white/10 text-sm text-primaryText focus:outline-none focus:border-emerald"
              >
                {appliances.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.ratedPowerWatts}W) — Currently {a.dailyOperatingHours} hrs/day
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-secondaryText uppercase tracking-wider">
                  Adjust Daily Operating Runtime
                </label>
                <span className="text-sm font-heading font-bold text-emerald">
                  {simHours} hours / day
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="0.5"
                value={simHours}
                onChange={(e) => setSimHours(parseFloat(e.target.value))}
                className="w-full h-2 bg-secondary/60 rounded-lg appearance-none cursor-pointer accent-emerald"
              />
              <div className="flex justify-between text-[10px] text-secondaryText mt-1">
                <span>0 hrs (OFF)</span>
                <span>12 hrs</span>
                <span>24 hrs (Continuous)</span>
              </div>
            </div>
          </div>

          {/* Real-time Calculation Outcome Box */}
          <div className="p-5 rounded-2xl bg-secondary/30 border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-secondaryText uppercase block mb-1">
                Simulated Impact
              </span>
              <h4 className="text-base font-bold text-primaryText">
                {selectedSimAppliance?.name}
              </h4>
            </div>

            <div className="my-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-secondaryText">Simulated Monthly Bill:</span>
                <span className="font-bold text-primaryText">{formatINR(simulatedMonthlyCost)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-secondaryText">Energy Impact:</span>
                <span className="text-primaryText font-mono">
                  {simKWhDifference >= 0 ? `-${simKWhDifference} kWh/mo` : `+${Math.abs(simKWhDifference)} kWh/mo`}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-secondaryText">Current Monthly Bill:</span>
                <span className="text-secondaryText font-mono">{formatINR(currentSimMonthlyCost)}</span>
              </div>

              <div className="pt-2 border-t border-white/5 flex justify-between text-xs items-center">
                <span className="font-semibold text-primaryText">Net Monthly Change:</span>
                <span
                  className={`font-heading font-bold text-sm ${
                    simCostDifference >= 0 ? 'text-emerald' : 'text-danger'
                  }`}
                >
                  {simCostDifference >= 0
                    ? `Save ${formatINR(simCostDifference)} / mo`
                    : `+${formatINR(Math.abs(simCostDifference))} increase`}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (selectedSimAppliance) {
                  updateAppliance(selectedSimAppliance.id, { dailyOperatingHours: simHours });
                }
              }}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-emerald hover:text-black text-xs font-bold transition-all text-primaryText"
            >
              Apply Simulated Hours to Household
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
