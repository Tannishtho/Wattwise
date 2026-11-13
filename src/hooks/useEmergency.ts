import { useApp } from '../context/AppContext';

export function useEmergency() {
  const {
    emergencyState,
    emergencyCombinations,
    emergencyLiveMetrics,
    triggerEmergencyPowerCut,
    toggleEmergencyAppliance,
    confirmEmergencySelection,
    applyEmergencyAdvisorCombination,
    restoreNormalPower,
  } = useApp();

  return {
    ...emergencyState,
    combinations: emergencyCombinations,
    recommendedCombination: emergencyCombinations.find((c) => c.isRecommended) || emergencyCombinations[0],
    liveMetrics: emergencyLiveMetrics,
    triggerPowerCut: triggerEmergencyPowerCut,
    toggleAppliance: toggleEmergencyAppliance,
    confirmSelection: confirmEmergencySelection,
    applyCombination: applyEmergencyAdvisorCombination,
    restoreNormal: restoreNormalPower,
  };
}
