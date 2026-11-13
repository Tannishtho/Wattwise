export type EssentialityLevel = 'CRITICAL' | 'ESSENTIAL' | 'OPTIONAL';
export type ComfortLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type ApplianceCategory = 'CLIMATE' | 'PRESERVATION' | 'LIGHTING' | 'ENTERTAINMENT' | 'CLEANING' | 'UTILITY';

export interface Appliance {
  id: string;
  name: string;
  iconName: string;
  category: ApplianceCategory;
  ratedPowerWatts: number;
  dailyOperatingHours: number;
  isOn: boolean;
  essentiality: EssentialityLevel;
  comfort: ComfortLevel;
  isCustom?: boolean;
  description?: string;
  location?: string;
}

export interface ApplianceCalculation {
  applianceId: string;
  dailyKWh: number;
  monthlyKWh: number;
  monthlyCostINR: number;
  costPercentageOfTotal: number;
}
