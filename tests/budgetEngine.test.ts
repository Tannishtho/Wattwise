import { describe, it, expect } from 'vitest';
import { analyzeBudget, calculateApplianceContributions } from '../src/engines/budgetEngine';
import { DEFAULT_APPLIANCES } from '../src/data/defaultAppliances';

describe('Budget Engine Unit Tests', () => {
  it('correctly categorizes Normal tier below 75% utilisation', () => {
    // If target is high (e.g. ₹10,000) and projected is ~₹3,200 (32%)
    const analysis = analyzeBudget(DEFAULT_APPLIANCES, {
      monthlyTargetINR: 10000,
      tariffPerKWh: 8,
      billingCycleDays: 30,
    });

    expect(analysis.tier).toBe('NORMAL');
    expect(analysis.utilisationPercentage).toBeLessThan(75);
    expect(analysis.amountRemainingINR).toBeGreaterThan(0);
    expect(analysis.amountOverBudgetINR).toBe(0);
  });

  it('correctly categorizes Warning tier between 75% and 89.9%', () => {
    // Projected is ~₹3,200. Set target = ₹4,000 -> 3200/4000 = 80% (Warning)
    const metrics = analyzeBudget(DEFAULT_APPLIANCES, {
      monthlyTargetINR: 4000,
      tariffPerKWh: 8,
      billingCycleDays: 30,
    });

    expect(metrics.utilisationPercentage).toBeGreaterThanOrEqual(75);
    expect(metrics.utilisationPercentage).toBeLessThan(90);
    expect(metrics.tier).toBe('WARNING');
  });

  it('correctly categorizes Critical tier between 90% and 100%', () => {
    // Target set so utilisation is exactly 95%
    const analysis95 = analyzeBudget(DEFAULT_APPLIANCES, {
      monthlyTargetINR: 3600, // 3401.28 / 3600 = 94.5%
      tariffPerKWh: 8,
      billingCycleDays: 30,
    });

    expect(analysis95.utilisationPercentage).toBeGreaterThanOrEqual(90);
    expect(analysis95.utilisationPercentage).toBeLessThanOrEqual(100);
    expect(analysis95.tier).toBe('CRITICAL');
  });

  it('correctly categorizes Over Budget tier above 100%', () => {
    // Target set to low value (e.g. ₹1,500)
    const analysis = analyzeBudget(DEFAULT_APPLIANCES, {
      monthlyTargetINR: 1500,
      tariffPerKWh: 8,
      billingCycleDays: 30,
    });

    expect(analysis.utilisationPercentage).toBeGreaterThan(100);
    expect(analysis.tier).toBe('OVER_BUDGET');
    expect(analysis.amountOverBudgetINR).toBeGreaterThan(0);
    expect(analysis.amountRemainingINR).toBe(0);
  });

  it('safely handles zero or negative monthly targets without division by zero', () => {
    const analysis = analyzeBudget(DEFAULT_APPLIANCES, {
      monthlyTargetINR: 0,
      tariffPerKWh: 8,
      billingCycleDays: 30,
    });

    expect(Number.isFinite(analysis.utilisationPercentage)).toBe(true);
    expect(analysis.tier).toBe('OVER_BUDGET');
  });

  it('computes suggested budget allocations according to essentiality weighting', () => {
    const contributions = calculateApplianceContributions(DEFAULT_APPLIANCES, {
      monthlyTargetINR: 2500,
      tariffPerKWh: 8,
      billingCycleDays: 30,
    });

    const fridge = contributions.find((c) => c.applianceId === 'appliance-fridge');
    const tv = contributions.find((c) => c.applianceId === 'appliance-tv');

    // Refrigerator has CRITICAL essentiality (weight 3), TV has OPTIONAL (weight 1)
    expect(fridge?.suggestedAllocatedBudgetINR).toBeGreaterThan(tv?.suggestedAllocatedBudgetINR || 0);
  });
});
