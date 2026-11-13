import { BabaMood } from './notification';

export interface AppSettings {
  electricityTariffINR: number; // default: 8
  monthlyBudgetTargetINR: number; // default: 2500
  billingCycleDays: number; // default: 30
  currencyCode: string; // default: 'INR'
  currencySymbol: string; // default: '₹'
  babaMood: BabaMood; // default: 'ROAST' or 'NORMAL'
  babaAudioEnabled: boolean;
  simulationPaceSeconds: number; // For demo updates
}

export interface ActivityLogEvent {
  id: string;
  timestamp: string;
  type: 
    | 'APPLIANCE_TOGGLED'
    | 'APPLIANCE_EDITED'
    | 'APPLIANCE_ADDED'
    | 'APPLIANCE_DELETED'
    | 'BUDGET_UPDATED'
    | 'TARIFF_UPDATED'
    | 'EMERGENCY_TRIGGERED'
    | 'EMERGENCY_CONFIRMED'
    | 'FOURTH_APPLIANCE_REJECTED'
    | 'NORMAL_RESTORED'
    | 'RECOMMENDATION_APPLIED'
    | 'SYSTEM_RESET';
  description: string;
  metadata?: Record<string, unknown>;
}

export interface PersistedAppState {
  schemaVersion: string;
  lastUpdated: string;
  settings: AppSettings;
  appliances: import('./appliance').Appliance[];
  emergencyState: import('./emergency').EmergencyState;
  activityLog: ActivityLogEvent[];
}
