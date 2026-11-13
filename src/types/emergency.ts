import { Appliance } from './appliance';

export interface EmergencyValidationResult {
  isValid: boolean;
  errorCode?: 'EMPTY_SELECTION' | 'INSUFFICIENT_SELECTION' | 'EXACTLY_THREE_MAX_EXCEEDED' | 'UNKNOWN';
  errorMessage?: string;
  selectedCount: number;
}

export interface CombinationScoreBreakdown {
  essentialityPoints: number; // 0-100 (Max 100 for Fridge + Fan + Lights)
  efficiencyPoints: number;   // 0-100 (Inverter battery conservation)
  comfortPoints: number;      // 0-100 (Secondary convenience)
  overloadPenalty: number;    // Subtracted if > 1000W
}

export interface EmergencyCombination {
  id: string; // e.g. "combo-1"
  appliances: Appliance[];
  applianceIds: [string, string, string];
  applianceNames: [string, string, string];
  totalPowerWatts: number;
  dailyConsumptionKWh: number;
  projectedMonthlyKWh: number;
  projectedMonthlyCostINR: number;
  compositeScore: number; // 0-100 normalized
  rank: number;
  scoreBreakdown: CombinationScoreBreakdown;
  rationale: string;
  isRecommended: boolean;
  isOverloadRisk: boolean;
}

export interface EmergencyState {
  isActive: boolean;
  outageStartTime: string | null;
  selectedApplianceIds: string[]; // Max 3, strictly validated
  isConfirmed: boolean;
  preOutageApplianceSnapshot: Record<string, boolean>; // id -> wasOn
}
