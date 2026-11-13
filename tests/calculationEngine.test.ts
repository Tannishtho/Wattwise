import { describe, it, expect } from 'vitest';
import {
  calculateDailyKWh,
  calculateMonthlyKWh,
  calculateMonthlyCostINR,
  calculateCurrentPowerDrawWatts,
  calculateHouseholdEnergyMetrics,
  calculateApplianceBreakdowns,
} from '../src/engines/calculationEngine';
import { DEFAULT_APPLIANCES } from '../src/data/defaultAppliances';

describe('Central Calculation Engine Unit Tests', () => {
  it('correctly calculates daily kWh for AC (1500W for 6 hours = 9.0 kWh)', () => {
    // (1500 * 6) / 1000 = 9.0 kWh
    const daily = calculateDailyKWh(1500, 6);
    expect(daily).toBe(9);
  });

  it('correctly calculates daily kWh for Refrigerator (150W for 24 hours = 3.6 kWh)', () => {
    // (150 * 24) / 1000 = 3.6 kWh
    const daily = calculateDailyKWh(150, 24);
    expect(daily).toBe(3.6);
  });

  it('correctly calculates daily kWh for LED Lights (12W for 6 hours = 0.072 kWh)', () => {
    // (12 * 6) / 1000 = 0.072 kWh
    const daily = calculateDailyKWh(12, 6);
    expect(daily).toBe(0.072);
  });

  it('correctly calculates monthly kWh for 30 billing days', () => {
    // (1500 * 6 * 30) / 1000 = 270 kWh
    const monthlyAC = calculateMonthlyKWh(1500, 6, 30);
    expect(monthlyAC).toBe(270);
  });

  it('correctly calculates monthly cost with ₹8/kWh tariff', () => {
    // 270 kWh * ₹8 = ₹2,160
    const cost = calculateMonthlyCostINR(270, 8);
    expect(cost).toBe(2160);
  });

  it('correctly calculates total instantaneous power draw for active appliances only', () => {
    // Active default appliances: AC (1500) + Fridge (150) + Fan (75) + LED (12) = 1737W
    // TV (100) and Washer (500) are OFF by default
    const activeWatts = calculateCurrentPowerDrawWatts(DEFAULT_APPLIANCES);
    expect(activeWatts).toBe(1500 + 150 + 75 + 12);
  });

  it('immediately recalculates when tariff changes from ₹8 to ₹10', () => {
    const metrics8 = calculateHouseholdEnergyMetrics(DEFAULT_APPLIANCES, 8, 30);
    const metrics10 = calculateHouseholdEnergyMetrics(DEFAULT_APPLIANCES, 10, 30);

    expect(metrics10.projectedMonthlyBillINR).toBeGreaterThan(metrics8.projectedMonthlyBillINR);
    expect(metrics10.projectedMonthlyBillINR).toBe(
      Number((metrics8.projectedMonthlyEnergyKWh * 10).toFixed(2))
    );
  });

  it('correctly computes appliance-wise cost contribution percentages totaling ~100%', () => {
    const breakdowns = calculateApplianceBreakdowns(DEFAULT_APPLIANCES, 8, 30);
    const totalPercentage = breakdowns.reduce((sum, b) => sum + b.costPercentageOfTotal, 0);
    expect(Math.round(totalPercentage)).toBe(100);
  });
});
