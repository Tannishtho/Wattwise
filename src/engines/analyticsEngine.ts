import { Appliance } from '../types/appliance';
import { calculateHouseholdEnergyMetrics, calculateMonthlyKWh, calculateMonthlyCostINR } from './calculationEngine';
import { generate24HourLoadProfile, generate30DayHistoricalRecords } from '../data/demoData';

export interface ApplianceBarChartItem {
  name: string;
  watts: number;
  monthlyKWh: number;
  monthlyCostINR: number;
  isOn: boolean;
  color: string;
}

export interface CostDonutItem {
  name: string;
  value: number; // cost in INR
  percentage: number;
  color: string;
}

export interface MonthlyPaceItem {
  day: number;
  actualOrSimulatedKWh: number;
  cumulativeKWh: number;
  budgetCapKWh: number;
}

// Chart color palette aligned with design system
export const CHART_COLORS = [
  '#20C997', // Emerald
  '#38D9A9', // Mint
  '#F5B942', // Amber
  '#4DABF7', // Cyan Blue
  '#9775FA', // Purple
  '#FF922B', // Orange
  '#F06464', // Coral Red
  '#63E6BE', // Seafoam
];

export function getApplianceBarChartData(
  appliances: Appliance[],
  tariffPerKWh: number,
  billingDays: number = 30
): ApplianceBarChartItem[] {
  return appliances.map((a, index) => {
    const monthlyKWh = a.isOn
      ? calculateMonthlyKWh(a.ratedPowerWatts, a.dailyOperatingHours, billingDays)
      : 0;
    const monthlyCostINR = a.isOn ? calculateMonthlyCostINR(monthlyKWh, tariffPerKWh) : 0;

    return {
      name: a.name,
      watts: a.isOn ? a.ratedPowerWatts : 0,
      monthlyKWh: Number(monthlyKWh.toFixed(1)),
      monthlyCostINR,
      isOn: a.isOn,
      color: a.isOn ? CHART_COLORS[index % CHART_COLORS.length] : '#243247',
    };
  });
}

export function getCostDonutData(
  appliances: Appliance[],
  tariffPerKWh: number,
  billingDays: number = 30
): CostDonutItem[] {
  const metrics = calculateHouseholdEnergyMetrics(appliances, tariffPerKWh, billingDays);
  const totalCost = metrics.projectedMonthlyBillINR;

  const active = appliances.filter((a) => a.isOn);
  const targetList = active.length > 0 ? active : [];

  return targetList.map((a, index) => {
    const mKWh = calculateMonthlyKWh(a.ratedPowerWatts, a.dailyOperatingHours, billingDays);
    const mCost = calculateMonthlyCostINR(mKWh, tariffPerKWh);
    const percentage = totalCost > 0 ? Number(((mCost / totalCost) * 100).toFixed(1)) : 0;

    return {
      name: a.name,
      value: mCost,
      percentage,
      color: CHART_COLORS[index % CHART_COLORS.length],
    };
  });
}

export function getMonthlyCumulativePaceData(
  appliances: Appliance[],
  monthlyBudgetTargetINR: number,
  tariffPerKWh: number,
  billingDays: number = 30
): MonthlyPaceItem[] {
  const metrics = calculateHouseholdEnergyMetrics(appliances, tariffPerKWh, billingDays);
  const dailyKWh = metrics.totalDailyKWh;
  const budgetCapKWh = tariffPerKWh > 0 ? Number((monthlyBudgetTargetINR / tariffPerKWh).toFixed(1)) : 300;
  const dailyBudgetKWh = budgetCapKWh / billingDays;

  const pace: MonthlyPaceItem[] = [];
  let cumulative = 0;

  for (let day = 1; day <= billingDays; day++) {
    cumulative += dailyKWh;
    pace.push({
      day,
      actualOrSimulatedKWh: Number(dailyKWh.toFixed(2)),
      cumulativeKWh: Number(cumulative.toFixed(2)),
      budgetCapKWh: Number((dailyBudgetKWh * day).toFixed(2)),
    });
  }

  return pace;
}

export { generate24HourLoadProfile, generate30DayHistoricalRecords };
