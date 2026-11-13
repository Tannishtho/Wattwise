import { HourlyConsumptionPoint, DayConsumptionRecord } from '../types/energy';
import { Appliance } from '../types/appliance';

/**
 * Generates an explainable 24-hour simulation load profile based on active appliances
 * and standard diurnal human activity cycles.
 */
export function generate24HourLoadProfile(appliances: Appliance[]): HourlyConsumptionPoint[] {
  const points: HourlyConsumptionPoint[] = [];

  // Typical household diurnal multipliers (0.0 to 1.0)
  const activityFactors = [
    0.35, 0.30, 0.28, 0.28, 0.32, 0.45, // 00:00 - 05:00 (Sleep/Baseload)
    0.65, 0.85, 0.95, 0.80, 0.70, 0.65, // 06:00 - 11:00 (Morning rush)
    0.60, 0.75, 0.70, 0.65, 0.60, 0.75, // 12:00 - 17:00 (Afternoon)
    0.90, 1.00, 0.98, 0.85, 0.70, 0.50, // 18:00 - 23:00 (Evening peak)
  ];

  const totalActiveWatts = appliances
    .filter((a) => a.isOn)
    .reduce((sum, a) => sum + a.ratedPowerWatts, 0);

  const baseWatts = Math.max(50, totalActiveWatts * 0.4);
  const variableWatts = totalActiveWatts - baseWatts;

  for (let hour = 0; hour < 24; hour++) {
    const factor = activityFactors[hour];
    const hourWatts = Math.round(baseWatts + variableWatts * factor);
    const hourKWh = Number(((hourWatts * 1) / 1000).toFixed(3));
    const isPeak = hour >= 18 && hour <= 22; // 6 PM - 10 PM peak

    points.push({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      watts: hourWatts,
      kWh: hourKWh,
      isPeak,
    });
  }

  return points;
}

/**
 * Generates 30-day simulated demonstration consumption records based on current daily consumption
 */
export function generate30DayHistoricalRecords(
  dailyKWh: number,
  tariffPerKWh: number
): DayConsumptionRecord[] {
  const records: DayConsumptionRecord[] = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();

  // Generate 30 days of deterministic simulated data with weekend variability
  for (let i = 29; i >= 0; i--) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - i);
    const dayOfWeek = daysOfWeek[targetDate.getDay()];
    const isWeekend = targetDate.getDay() === 0 || targetDate.getDay() === 6;

    // Weekends have ~15% higher consumption due to occupants staying home
    const varianceFactor = isWeekend ? 1.15 : 0.95 + (i % 7) * 0.015;
    const simulatedKWh = Number((dailyKWh * varianceFactor).toFixed(2));
    const cost = Number((simulatedKWh * tariffPerKWh).toFixed(2));

    records.push({
      date: targetDate.toISOString().split('T')[0],
      dayLabel: `${dayOfWeek} ${targetDate.getDate()}`,
      totalKWh: simulatedKWh,
      costINR: cost,
    });
  }

  return records;
}
