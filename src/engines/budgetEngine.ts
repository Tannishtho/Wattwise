import { Appliance } from '../types/appliance';
import { BudgetAnalysis, BudgetConfig, BudgetTier, ApplianceCostContribution } from '../types/budget';
import { calculateHouseholdEnergyMetrics, calculateMonthlyKWh, calculateMonthlyCostINR } from './calculationEngine';

/**
 * Calculates budget health, percentage utilisation, and alert status
 */
export function analyzeBudget(
  appliances: Appliance[],
  config: BudgetConfig
): BudgetAnalysis {
  const { monthlyTargetINR, tariffPerKWh, billingCycleDays } = config;
  const metrics = calculateHouseholdEnergyMetrics(appliances, tariffPerKWh, billingCycleDays);
  const projectedBill = metrics.projectedMonthlyBillINR;

  const validTarget = monthlyTargetINR > 0 ? monthlyTargetINR : 1;
  const utilisationPercentage = Number(((projectedBill / validTarget) * 100).toFixed(1));

  let tier: BudgetTier = 'NORMAL';
  let statusLabel = 'On Track';

  if (utilisationPercentage > 100) {
    tier = 'OVER_BUDGET';
    statusLabel = 'Budget Exceeded';
  } else if (utilisationPercentage >= 90) {
    tier = 'CRITICAL';
    statusLabel = 'Critical Pace (90%+)';
  } else if (utilisationPercentage >= 75) {
    tier = 'WARNING';
    statusLabel = 'Budget Warning (75%+)';
  } else {
    tier = 'NORMAL';
    statusLabel = 'Healthy Utilisation';
  }

  const amountRemainingINR = Math.max(0, Number((monthlyTargetINR - projectedBill).toFixed(2)));
  const amountOverBudgetINR = Math.max(0, Number((projectedBill - monthlyTargetINR).toFixed(2)));
  const dailyBudgetLimitINR = Number((monthlyTargetINR / Math.max(1, billingCycleDays)).toFixed(2));

  return {
    monthlyTargetINR,
    projectedMonthlyBillINR: projectedBill,
    amountRemainingINR,
    amountOverBudgetINR,
    utilisationPercentage,
    tier,
    projectedMonthlyKWh: metrics.projectedMonthlyEnergyKWh,
    dailyBudgetLimitINR,
    statusLabel,
  };
}

/**
 * Generates an appliance-wise cost contribution breakdown
 * Also calculates an ideal suggested budget allocation based on essentiality
 */
export function calculateApplianceContributions(
  appliances: Appliance[],
  config: BudgetConfig
): ApplianceCostContribution[] {
  const { monthlyTargetINR, tariffPerKWh, billingCycleDays } = config;
  const metrics = calculateHouseholdEnergyMetrics(appliances, tariffPerKWh, billingCycleDays);
  const totalCost = metrics.projectedMonthlyBillINR;

  // Calculate weights for ideal suggested budget allocation
  // Essential appliances get prioritized allocation from monthly target
  const essentialityWeights: Record<string, number> = {
    CRITICAL: 3,
    ESSENTIAL: 2,
    OPTIONAL: 1,
  };

  const totalWeight = appliances.reduce(
    (sum, a) => sum + (essentialityWeights[a.essentiality] || 1),
    0
  );

  return appliances.map((a) => {
    const mKWh = a.isOn
      ? calculateMonthlyKWh(a.ratedPowerWatts, a.dailyOperatingHours, billingCycleDays)
      : 0;
    const mCost = a.isOn ? calculateMonthlyCostINR(mKWh, tariffPerKWh) : 0;
    const percentage = totalCost > 0 && a.isOn
      ? Number(((mCost / totalCost) * 100).toFixed(1))
      : 0;

    const weight = essentialityWeights[a.essentiality] || 1;
    const suggestedAllocated = totalWeight > 0
      ? Number(((weight / totalWeight) * monthlyTargetINR).toFixed(2))
      : 0;

    return {
      applianceId: a.id,
      name: a.name,
      category: a.category,
      monthlyKWh: Number(mKWh.toFixed(2)),
      monthlyCostINR: mCost,
      percentageOfTotalCost: percentage,
      suggestedAllocatedBudgetINR: suggestedAllocated,
    };
  });
}
