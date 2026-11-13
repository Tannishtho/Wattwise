import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Activity,
  Calendar,
  IndianRupee,
  AlertTriangle,
  Lightbulb,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { MetricCard } from '../components/common/MetricCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatINR } from '../utils/currency';
import { formatPower, formatEnergy, formatHours, formatDateTime } from '../utils/formatting';
import { generate24HourLoadProfile } from '../data/demoData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    energyMetrics,
    budgetAnalysis,
    appliances,
    recommendations,
    activityLog,
    emergencyState,
    toggleAppliance,
  } = useApp();

  const isEmergency = emergencyState.isActive;
  const topRec = recommendations[0];
  const hourlyData = generate24HourLoadProfile(appliances);

  return (
    <PageContainer
      title="Overview Dashboard"
      subtitle="Comprehensive real-time simulation of household electrical power, budget pacing, and consumption telemetry."
      action={
        isEmergency ? (
          <button
            onClick={() => navigate('/emergency')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-danger text-white text-xs font-bold emergency-active"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Power Cut Active: Manage 3 Appliances</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/emergency')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/80 hover:bg-secondary text-primaryText border border-white/10 text-xs font-semibold transition-all hover:border-emerald/40"
          >
            <Zap className="w-4 h-4 text-emerald" />
            <span>Emergency Mode Simulator</span>
          </button>
        )
      }
    >
      {/* Emergency Mode Alert Banner on Dashboard if active */}
      {isEmergency && (
        <div className="p-4 rounded-2xl bg-danger/15 border border-danger/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 emergency-active">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-danger text-white">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-heading font-bold text-white">
                Household Power Cut in Progress
              </h4>
              <p className="text-xs text-danger-200 text-gray-300">
                Active load strictly governed by the Exact-Three rule. Currently {emergencyState.selectedApplianceIds.length}/3 appliances configured.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/emergency')}
            className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs shrink-0 hover:bg-gray-100 transition-colors"
          >
            Open Emergency Console
          </button>
        </div>
      )}

      {/* TOP 4 PRIMARY KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Current Power Draw (Watts) */}
        <MetricCard
          title="Current Power Draw"
          value={formatPower(energyMetrics.currentPowerDrawWatts)}
          unit=""
          icon={Zap}
          variant="emerald"
          subtitle={`${appliances.filter((a) => a.isOn).length} of ${appliances.length} appliances active`}
          trend={{
            value: `${energyMetrics.currentPowerDrawWatts} W`,
            isPositive: energyMetrics.currentPowerDrawWatts < 1000,
            label: 'Instantaneous',
          }}
          onClick={() => navigate('/appliances')}
        />

        {/* KPI 2: Today's Energy (kWh) */}
        <MetricCard
          title="Today's Energy"
          value={energyMetrics.todayEnergyKWh.toFixed(2)}
          unit="kWh"
          icon={Activity}
          variant="emerald"
          subtitle="Estimated diurnal daily consumption"
          trend={{
            value: `${formatINR(energyMetrics.todayEnergyKWh * budgetAnalysis.dailyBudgetLimitINR, false)}`,
            isPositive: true,
            label: 'est. cost',
          }}
          onClick={() => navigate('/analytics')}
        />

        {/* KPI 3: Projected Monthly Energy (kWh) */}
        <MetricCard
          title="Monthly Projected"
          value={energyMetrics.projectedMonthlyEnergyKWh.toFixed(1)}
          unit="kWh"
          icon={Calendar}
          variant={budgetAnalysis.tier === 'OVER_BUDGET' ? 'danger' : 'warning'}
          subtitle={`Across ${appliances.length} configured appliances`}
          trend={{
            value: `${budgetAnalysis.utilisationPercentage}%`,
            isPositive: budgetAnalysis.utilisationPercentage <= 100,
            label: 'of budget',
          }}
          onClick={() => navigate('/budget')}
        />

        {/* KPI 4: Projected Monthly Electricity Bill (₹) */}
        <MetricCard
          title="Projected Monthly Bill"
          value={formatINR(energyMetrics.projectedMonthlyBillINR)}
          unit=""
          icon={IndianRupee}
          variant={
            budgetAnalysis.tier === 'OVER_BUDGET'
              ? 'danger'
              : budgetAnalysis.tier === 'CRITICAL'
              ? 'warning'
              : 'emerald'
          }
          subtitle={`Budget Target: ${formatINR(budgetAnalysis.monthlyTargetINR)}`}
          trend={{
            value: budgetAnalysis.amountRemainingINR > 0
              ? `${formatINR(budgetAnalysis.amountRemainingINR)} left`
              : `${formatINR(budgetAnalysis.amountOverBudgetINR)} over`,
            isPositive: budgetAnalysis.amountRemainingINR > 0,
          }}
          onClick={() => navigate('/budget')}
        />
      </div>

      {/* SECOND ROW: 24h Consumption Curve & Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time 24h Load Curve Mini-Graph */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-heading font-bold text-primaryText">
                Simulated 24-Hour Diurnal Load Profile
              </h3>
              <p className="text-xs text-secondaryText">
                Hourly simulated power demand reflecting household morning & evening peaks
              </p>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="text-xs text-emerald hover:text-emerald-400 font-medium flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#20C997" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#20C997" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="hour"
                  stroke="#5A6E85"
                  fontSize={10}
                  tickLine={false}
                  interval={3}
                />
                <YAxis
                  stroke="#5A6E85"
                  fontSize={10}
                  tickLine={false}
                  unit="W"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#141F30] border border-emerald/30 p-2.5 rounded-lg text-xs shadow-xl">
                          <p className="font-semibold text-primaryText">{data.hour}</p>
                          <p className="text-emerald font-mono">{data.watts} Watts</p>
                          <p className="text-[10px] text-secondaryText">{data.kWh} kWh / hr</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="watts"
                  stroke="#20C997"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#emeraldGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Utilisation Widget */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-heading font-bold text-primaryText">
                Budget Utilisation
              </h3>
              <StatusBadge type="budgetTier" value={budgetAnalysis.tier} />
            </div>

            <div className="space-y-4 my-3">
              <ProgressBar
                value={budgetAnalysis.utilisationPercentage}
                max={100}
                showLabel={true}
                size="lg"
              />

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-secondary/30 border border-white/5">
                  <span className="text-[11px] text-secondaryText block">Monthly Target</span>
                  <span className="text-base font-heading font-bold text-primaryText">
                    {formatINR(budgetAnalysis.monthlyTargetINR)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-secondary/30 border border-white/5">
                  <span className="text-[11px] text-secondaryText block">
                    {budgetAnalysis.amountRemainingINR > 0 ? 'Remaining' : 'Over Target'}
                  </span>
                  <span
                    className={`text-base font-heading font-bold ${
                      budgetAnalysis.amountRemainingINR > 0 ? 'text-emerald' : 'text-danger'
                    }`}
                  >
                    {formatINR(
                      budgetAnalysis.amountRemainingINR > 0
                        ? budgetAnalysis.amountRemainingINR
                        : budgetAnalysis.amountOverBudgetINR
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-secondaryText">Daily limit: {formatINR(budgetAnalysis.dailyBudgetLimitINR)}/day</span>
            <button
              onClick={() => navigate('/budget')}
              className="text-emerald hover:underline font-semibold"
            >
              Adjust Budget →
            </button>
          </div>
        </div>
      </div>

      {/* THIRD ROW: Quick Appliance Controls & Top Consumer Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Appliance Grid */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-heading font-bold text-primaryText">
                Active Appliance Status
              </h3>
              <p className="text-xs text-secondaryText">
                Instant toggles update calculations across all modules immediately
              </p>
            </div>
            <button
              onClick={() => navigate('/appliances')}
              className="text-xs text-emerald hover:text-emerald-400 font-medium flex items-center gap-1"
            >
              <span>Manage All ({appliances.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {appliances.slice(0, 6).map((appliance) => (
              <div
                key={appliance.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  appliance.isOn
                    ? 'bg-secondary/40 border-emerald/30 shadow-sm'
                    : 'bg-black/20 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-sm font-semibold text-primaryText truncate">
                      {appliance.name}
                    </h4>
                    <span className="text-[11px] text-secondaryText">
                      {appliance.ratedPowerWatts} W • {formatHours(appliance.dailyOperatingHours)}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleAppliance(appliance.id)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                      appliance.isOn
                        ? 'bg-emerald text-black shadow-glow'
                        : 'bg-white/10 text-secondaryText hover:text-primaryText'
                    }`}
                  >
                    {appliance.isOn ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                  <span className="text-secondaryText">
                    {formatEnergy(
                      (appliance.ratedPowerWatts * appliance.dailyOperatingHours) / 1000
                    )}/day
                  </span>
                  <StatusBadge type="essentiality" value={appliance.essentiality} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highest Consumer Card & Smart Recommendation Preview */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Highest Energy-Consuming Appliance */}
          <div className="glass-panel p-5 rounded-2xl border border-warning/30 bg-warning/5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-warning" />
              <span className="text-xs font-bold text-warning uppercase tracking-wider">
                Top Energy Consumer
              </span>
            </div>
            <h4 className="text-lg font-heading font-bold text-primaryText">
              {energyMetrics.highestConsumingApplianceName || 'None'}
            </h4>
            <p className="text-xs text-secondaryText mt-1">
              Consuming {energyMetrics.highestConsumingApplianceWatts} Watts rated power. Accounts for the single largest share of your projected electricity bill.
            </p>
          </div>

          {/* Smart Recommendation Preview */}
          {topRec && (
            <div className="glass-panel p-5 rounded-2xl border border-emerald/30 bg-emerald/5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-emerald" />
                  <span className="text-xs font-bold text-emerald uppercase tracking-wider">
                    Smart Saving Tip
                  </span>
                </div>
                <h4 className="text-sm font-heading font-semibold text-primaryText">
                  {topRec.title}
                </h4>
                <p className="text-xs text-secondaryText mt-1 line-clamp-2">
                  {topRec.explanation}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald">
                  Save ~{formatINR(topRec.monthlyMonetarySavingINR)}/mo
                </span>
                <button
                  onClick={() => navigate('/recommendations')}
                  className="text-xs font-semibold text-primaryText hover:text-emerald flex items-center gap-1"
                >
                  <span>Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOURTH ROW: Recent Activity Timeline */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondaryText" />
            <h3 className="text-base font-heading font-bold text-primaryText">
              Recent Application Activity Log
            </h3>
          </div>
          <span className="text-xs text-secondaryText font-mono">
            {activityLog.length} events recorded
          </span>
        </div>

        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2">
          {activityLog.slice(0, 5).map((act) => (
            <div
              key={act.id}
              className="p-2.5 rounded-xl bg-secondary/20 border border-white/5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald"></span>
                <span className="text-primaryText font-medium">{act.description}</span>
              </div>
              <span className="text-[10px] text-secondaryText font-mono shrink-0 ml-4">
                {formatDateTime(act.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};
