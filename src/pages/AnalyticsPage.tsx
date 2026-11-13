import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  Activity,
  BarChart2,
  PieChart as PieIcon,
  TrendingUp,
  Zap,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { MetricCard } from '../components/common/MetricCard';
import {
  getApplianceBarChartData,
  getCostDonutData,
  getMonthlyCumulativePaceData,
  generate24HourLoadProfile,
  generate30DayHistoricalRecords,
} from '../engines/analyticsEngine';
import { formatINR } from '../utils/currency';
import { formatPower, formatEnergy } from '../utils/formatting';

export const AnalyticsPage: React.FC = () => {
  const { appliances, settings, energyMetrics, budgetAnalysis } = useApp();

  const hourlyLoadData = generate24HourLoadProfile(appliances);
  const applianceBarData = getApplianceBarChartData(appliances, settings.electricityTariffINR, settings.billingCycleDays);
  const costDonutData = getCostDonutData(appliances, settings.electricityTariffINR, settings.billingCycleDays);
  const monthlyPaceData = getMonthlyCumulativePaceData(
    appliances,
    settings.monthlyBudgetTargetINR,
    settings.electricityTariffINR,
    settings.billingCycleDays
  );
  const historical30Days = generate30DayHistoricalRecords(energyMetrics.totalDailyKWh, settings.electricityTariffINR);

  return (
    <PageContainer
      title="Energy Analytics & Visualisation"
      subtitle="Interactive graphical telemetry, load breakdowns, monthly budget pace tracking, and simulated historical profiles."
    >
      {/* Top Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Instantaneous Load"
          value={formatPower(energyMetrics.currentPowerDrawWatts)}
          unit=""
          icon={Zap}
          variant="emerald"
          subtitle={`${appliances.filter((a) => a.isOn).length} active loads`}
        />
        <MetricCard
          title="Daily Energy Rate"
          value={formatEnergy(energyMetrics.totalDailyKWh)}
          unit=""
          icon={Activity}
          variant="emerald"
          subtitle={`${formatINR(energyMetrics.totalDailyKWh * settings.electricityTariffINR)}/day est.`}
        />
        <MetricCard
          title="Monthly Projected"
          value={formatEnergy(energyMetrics.projectedMonthlyEnergyKWh, 1)}
          unit=""
          icon={TrendingUp}
          variant={budgetAnalysis.tier === 'OVER_BUDGET' ? 'danger' : 'warning'}
          subtitle={`At ₹${settings.electricityTariffINR}/kWh tariff`}
        />
        <MetricCard
          title="Projected Expenditure"
          value={formatINR(energyMetrics.projectedMonthlyBillINR)}
          unit=""
          icon={PieIcon}
          variant={budgetAnalysis.tier === 'OVER_BUDGET' ? 'danger' : 'emerald'}
          subtitle={`Target: ${formatINR(budgetAnalysis.monthlyTargetINR)}`}
        />
      </div>

      {/* CHART 1: 24-Hour Diurnal Load Profile Line Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-heading font-bold text-primaryText flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald" />
              <span>24-Hour Diurnal Household Load Curve</span>
            </h3>
            <p className="text-xs text-secondaryText">
              Simulated continuous hourly power draw (Watts) showing residential morning & evening peaks
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-secondary/40 text-emerald border border-emerald/20">
            Peak Window: 18:00 - 22:00
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyLoadData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="loadCurveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#20C997" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#20C997" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" stroke="#5A6E85" fontSize={11} tickLine={false} interval={2} />
              <YAxis stroke="#5A6E85" fontSize={11} tickLine={false} unit=" W" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#141F30] border border-emerald/40 p-3 rounded-xl text-xs shadow-2xl">
                        <span className="font-bold text-primaryText block mb-1">{data.hour}</span>
                        <div className="text-emerald font-mono text-sm">{data.watts} Watts</div>
                        <div className="text-secondaryText text-[11px]">{data.kWh} kWh consumption</div>
                        {data.isPeak && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-warning/20 text-warning text-[10px] font-bold">
                            EVENING PEAK
                          </span>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="watts" stroke="#20C997" strokeWidth={2.5} fill="url(#loadCurveGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROW: Appliance Bar Chart & Cost Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 2: Appliance-Wise Consumption Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-heading font-bold text-primaryText flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald" />
              <span>Appliance-Wise Monthly Consumption (kWh)</span>
            </h3>
            <p className="text-xs text-secondaryText">
              Comparison of total monthly energy demand per appliance
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applianceBarData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  stroke="#5A6E85"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#5A6E85" fontSize={11} tickLine={false} unit=" kWh" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#141F30] border border-white/20 p-3 rounded-xl text-xs shadow-xl">
                          <span className="font-bold text-primaryText block">{data.name}</span>
                          <span className="text-emerald font-mono text-sm block mt-1">
                            {data.monthlyKWh} kWh / month
                          </span>
                          <span className="text-secondaryText text-[11px]">
                            Monthly Cost: {formatINR(data.monthlyCostINR)}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="monthlyKWh" radius={[6, 6, 0, 0]}>
                  {applianceBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Cost Contribution Donut Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-heading font-bold text-primaryText flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-emerald" />
              <span>Electricity Cost Share Breakdown</span>
            </h3>
            <p className="text-xs text-secondaryText">
              Percentage share of projected bill by appliance
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {costDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B1220" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#141F30] border border-white/20 p-3 rounded-xl text-xs shadow-xl">
                          <span className="font-bold text-primaryText">{data.name}</span>
                          <span className="text-emerald font-mono block mt-1">
                            {formatINR(data.value)} ({data.percentage}%)
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-[11px] text-secondaryText">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHART 4: Monthly Cumulative Energy vs Budget Pace */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-heading font-bold text-primaryText flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald" />
              <span>Cumulative Monthly Consumption vs Budget Ceiling</span>
            </h3>
            <p className="text-xs text-secondaryText">
              Day-by-day accumulation over the {settings.billingCycleDays}-day cycle compared with the linear budget limit
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyPaceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#5A6E85" fontSize={11} tickLine={false} unit="d" />
              <YAxis stroke="#5A6E85" fontSize={11} tickLine={false} unit=" kWh" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#141F30] border border-white/20 p-3 rounded-xl text-xs shadow-xl">
                        <span className="font-bold text-primaryText block mb-1">Day {data.day}</span>
                        <div className="text-emerald font-mono">
                          Cumulative: {data.cumulativeKWh} kWh ({formatINR(data.cumulativeKWh * settings.electricityTariffINR)})
                        </div>
                        <div className="text-warning font-mono text-[11px]">
                          Budget Ceiling Pace: {data.budgetCapKWh} kWh
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="cumulativeKWh"
                name="Actual / Projected Cumulative"
                stroke="#20C997"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="budgetCapKWh"
                name="Linear Budget Target Pace"
                stroke="#F5B942"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 30-Day Simulated Historical Demonstration Table */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-emerald" />
          <h3 className="text-base font-heading font-bold text-primaryText">
            Simulated 30-Day Historical Demonstration Profile
          </h3>
        </div>
        <p className="text-xs text-secondaryText mb-4">
          Deterministic simulation history generated with standard weekend occupancy variability (no fabricated hardware readings).
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {historical30Days.slice(0, 6).map((day) => (
            <div key={day.date} className="p-3 rounded-xl bg-secondary/30 border border-white/5 text-center">
              <span className="text-[11px] text-secondaryText block">{day.dayLabel}</span>
              <span className="text-sm font-bold text-primaryText block mt-1">{day.totalKWh} kWh</span>
              <span className="text-[10px] text-emerald font-semibold">{formatINR(day.costINR)}</span>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};
