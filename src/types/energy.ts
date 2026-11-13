export interface InstantaneousMetrics {
  currentPowerDrawWatts: number;
  activeApplianceCount: number;
  totalApplianceCount: number;
}

export interface EnergyCalculations {
  currentPowerDrawWatts: number;
  todayEnergyKWh: number;
  projectedMonthlyEnergyKWh: number;
  projectedMonthlyBillINR: number;
  totalDailyKWh: number;
  highestConsumingApplianceId: string | null;
  highestConsumingApplianceName: string | null;
  highestConsumingApplianceWatts: number;
}

export interface HourlyConsumptionPoint {
  hour: string; // "00:00", "01:00", ...
  watts: number;
  kWh: number;
  isPeak: boolean;
}

export interface DayConsumptionRecord {
  date: string; // YYYY-MM-DD
  dayLabel: string; // "Mon", "Tue", ...
  totalKWh: number;
  costINR: number;
}
