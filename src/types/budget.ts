export type BudgetTier = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OVER_BUDGET';

export interface BudgetConfig {
  monthlyTargetINR: number;
  tariffPerKWh: number;
  billingCycleDays: number;
}

export interface BudgetAnalysis {
  monthlyTargetINR: number;
  projectedMonthlyBillINR: number;
  amountRemainingINR: number;
  amountOverBudgetINR: number;
  utilisationPercentage: number;
  tier: BudgetTier;
  projectedMonthlyKWh: number;
  dailyBudgetLimitINR: number;
  statusLabel: string;
}

export interface ApplianceCostContribution {
  applianceId: string;
  name: string;
  category: string;
  monthlyKWh: number;
  monthlyCostINR: number;
  percentageOfTotalCost: number;
  suggestedAllocatedBudgetINR: number;
}
