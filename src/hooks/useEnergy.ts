import { useApp } from '../context/AppContext';

export function useEnergy() {
  const { energyMetrics, appliances, settings } = useApp();

  return {
    ...energyMetrics,
    appliances,
    tariff: settings.electricityTariffINR,
    billingDays: settings.billingCycleDays,
  };
}
