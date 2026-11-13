import { Appliance, ApplianceCalculation } from '../types/appliance';
import { EnergyCalculations } from '../types/energy';

/**
 * Central mathematical calculation engine for WATTWISE.
 * Acts as the single source of truth for all power, energy, and billing projections.
 *
 * Rules:
 * 1. When an appliance is ON (isOn === true), its configured power and daily hours
 *    are included in projected daily and monthly calculations.
 * 2. When an appliance is OFF (isOn === false), its projected consumption becomes ZERO.
 * 3. Total projected monthly consumption is the sum of monthlyKWh for all ON appliances.
 * 4. Projected monthly bill is totalMonthlyKWh * tariffPerKWh.
 */

/**
 * Calculates daily energy consumption in kWh for a single appliance
 * Formula: (Rated Power in Watts × Daily Operating Hours) / 1000
 */
export function calculateDailyKWh(powerWatts: number, dailyHours: number): number {
  if (powerWatts <= 0 || dailyHours <= 0) return 0;
  return Number(((powerWatts * dailyHours) / 1000).toFixed(4));
}

/**
 * Calculates monthly energy consumption in kWh for a single appliance
 * Formula: (Rated Power in Watts × Daily Operating Hours × Billing Days) / 1000
 */
export function calculateMonthlyKWh(
  powerWatts: number,
  dailyHours: number,
  billingDays: number = 30
): number {
  if (powerWatts <= 0 || dailyHours <= 0 || billingDays <= 0) return 0;
  return Number(((powerWatts * dailyHours * billingDays) / 1000).toFixed(4));
}

/**
 * Calculates estimated monthly cost in INR for an appliance
 * Formula: Monthly Energy (kWh) × Electricity Tariff (₹/kWh)
 */
export function calculateMonthlyCostINR(monthlyKWh: number, tariffPerKWh: number): number {
  if (monthlyKWh <= 0 || tariffPerKWh <= 0) return 0;
  return Number((monthlyKWh * tariffPerKWh).toFixed(2));
}

/**
 * Computes instantaneous power draw in Watts
 * Formula: Sum of rated power of all currently active (isOn === true) appliances
 */
export function calculateCurrentPowerDrawWatts(appliances: Appliance[]): number {
  return appliances
    .filter((a) => a.isOn)
    .reduce((sum, a) => sum + Math.max(0, a.ratedPowerWatts), 0);
}

/**
 * Performs complete, unified household energy calculations across all appliances.
 * Only appliances that are currently ON contribute to daily consumption,
 * projected monthly energy, and projected monthly bill.
 */
export function calculateHouseholdEnergyMetrics(
  appliances: Appliance[],
  tariffPerKWh: number,
  billingDays: number = 30
): EnergyCalculations {
  const currentPowerDrawWatts = calculateCurrentPowerDrawWatts(appliances);

  // Total daily kWh strictly for all ON appliances
  const totalDailyKWh = appliances.reduce((sum, a) => {
    if (!a.isOn) return sum;
    return sum + calculateDailyKWh(a.ratedPowerWatts, a.dailyOperatingHours);
  }, 0);

  const todayEnergyKWh = Number(totalDailyKWh.toFixed(3));

  // Projected monthly energy (kWh) strictly for all ON appliances
  const projectedMonthlyEnergyKWh = appliances.reduce((sum, a) => {
    if (!a.isOn) return sum;
    return sum + calculateMonthlyKWh(a.ratedPowerWatts, a.dailyOperatingHours, billingDays);
  }, 0);

  // Projected monthly bill (INR)
  const projectedMonthlyBillINR = Number(
    (projectedMonthlyEnergyKWh * tariffPerKWh).toFixed(2)
  );

  // Identify highest consuming appliance among active appliances (or configured if none active)
  let highestAppliance: Appliance | null = null;
  let highestMonthlyKWh = -1;

  const activeAppliances = appliances.filter((a) => a.isOn);
  const targetList = activeAppliances.length > 0 ? activeAppliances : appliances;

  for (const a of targetList) {
    const mKWh = calculateMonthlyKWh(a.ratedPowerWatts, a.dailyOperatingHours, billingDays);
    if (mKWh > highestMonthlyKWh) {
      highestMonthlyKWh = mKWh;
      highestAppliance = a;
    }
  }

  return {
    currentPowerDrawWatts,
    todayEnergyKWh,
    projectedMonthlyEnergyKWh: Number(projectedMonthlyEnergyKWh.toFixed(2)),
    projectedMonthlyBillINR,
    totalDailyKWh: Number(totalDailyKWh.toFixed(2)),
    highestConsumingApplianceId: highestAppliance?.id ?? null,
    highestConsumingApplianceName: highestAppliance?.name ?? null,
    highestConsumingApplianceWatts: highestAppliance?.ratedPowerWatts ?? 0,
  };
}

/**
 * Generates an appliance-wise calculation summary with cost percentages.
 * When an appliance is OFF, its monthly kWh and monthly cost are 0.
 */
export function calculateApplianceBreakdowns(
  appliances: Appliance[],
  tariffPerKWh: number,
  billingDays: number = 30
): ApplianceCalculation[] {
  const metrics = calculateHouseholdEnergyMetrics(appliances, tariffPerKWh, billingDays);
  const totalBill = metrics.projectedMonthlyBillINR;

  return appliances.map((a) => {
    const dailyKWh = a.isOn
      ? calculateDailyKWh(a.ratedPowerWatts, a.dailyOperatingHours)
      : 0;
    const monthlyKWh = a.isOn
      ? calculateMonthlyKWh(a.ratedPowerWatts, a.dailyOperatingHours, billingDays)
      : 0;
    const monthlyCostINR = a.isOn
      ? calculateMonthlyCostINR(monthlyKWh, tariffPerKWh)
      : 0;
    const costPercentageOfTotal =
      totalBill > 0 && a.isOn
        ? Number(((monthlyCostINR / totalBill) * 100).toFixed(1))
        : 0;

    return {
      applianceId: a.id,
      dailyKWh,
      monthlyKWh: Number(monthlyKWh.toFixed(2)),
      monthlyCostINR,
      costPercentageOfTotal,
    };
  });
}
