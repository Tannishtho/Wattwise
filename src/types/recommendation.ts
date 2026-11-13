export type RecommendationPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type RecommendationActionType = 
  | 'REDUCE_HOURS'
  | 'SHIFT_SCHEDULE'
  | 'STANDBY_ELIMINATION'
  | 'TEMPERATURE_OPTIMIZE'
  | 'REPLACE_EQUIPMENT';

export interface Recommendation {
  id: string;
  title: string;
  explanation: string;
  applianceId: string;
  applianceName: string;
  currentHours: number;
  suggestedHours: number;
  monthlyEnergySavingKWh: number;
  monthlyMonetarySavingINR: number;
  priority: RecommendationPriority;
  actionType: RecommendationActionType;
  suggestedActionLabel: string;
  canApplyDirectly: boolean;
}
