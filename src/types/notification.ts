export type BabaMood = 'NORMAL' | 'ROAST' | 'SILENT';
export type NotificationSeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS' | 'ROAST';

export type BabaTriggerEvent =
  | 'BUDGET_WARNING_75'
  | 'BUDGET_CRITICAL_90'
  | 'BUDGET_OVER_100'
  | 'ALL_APPLIANCES_ON'
  | 'HIGH_CONSUMER_ALERT'
  | 'SAVINGS_ACTION_TAKEN'
  | 'OUTAGE_TRIGGERED'
  | 'INCOMPLETE_SELECTION'
  | 'FOURTH_APPLIANCE_REJECTED'
  | 'EMERGENCY_ADVISOR_GENERATED'
  | 'NORMAL_POWER_RESTORED'
  | 'MANUAL_TIP_REQUEST';

export interface BabaMessage {
  id: string;
  triggerEvent: BabaTriggerEvent;
  mood: BabaMood;
  severity: NotificationSeverity;
  headline: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  applianceIdConcerned?: string;
}

export interface NotificationSettings {
  mood: BabaMood;
  soundEnabled: boolean;
  toastDurationMs: number;
}
