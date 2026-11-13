import { useApp } from '../context/AppContext';

export function useBudget() {
  const { budgetAnalysis, applianceContributions, settings, updateSettings } = useApp();

  return {
    ...budgetAnalysis,
    applianceContributions,
    settings,
    updateBudget: (target: number) => updateSettings({ monthlyBudgetTargetINR: target }),
    updateTariff: (tariff: number) => updateSettings({ electricityTariffINR: tariff }),
    updateBillingDays: (days: number) => updateSettings({ billingCycleDays: days }),
  };
}
