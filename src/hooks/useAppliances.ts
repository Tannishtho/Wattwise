import { useApp } from '../context/AppContext';

export function useAppliances() {
  const {
    appliances,
    applianceCalculations,
    toggleAppliance,
    updateAppliance,
    addAppliance,
    removeAppliance,
  } = useApp();

  return {
    appliances,
    applianceCalculations,
    toggleAppliance,
    updateAppliance,
    addAppliance,
    removeAppliance,
  };
}
