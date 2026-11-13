import { AppSettings } from '../types/settings';
import { validateTariff, validateBudgetTarget } from '../utils/validation';

export class SettingsService {
  public updateSettings(
    current: AppSettings,
    updates: Partial<AppSettings>
  ): { success: boolean; settings: AppSettings; error?: string } {
    if (updates.electricityTariffINR !== undefined) {
      const v = validateTariff(updates.electricityTariffINR);
      if (!v.isValid) return { success: false, settings: current, error: v.error };
    }

    if (updates.monthlyBudgetTargetINR !== undefined) {
      const v = validateBudgetTarget(updates.monthlyBudgetTargetINR);
      if (!v.isValid) return { success: false, settings: current, error: v.error };
    }

    if (updates.billingCycleDays !== undefined) {
      if (updates.billingCycleDays < 1 || updates.billingCycleDays > 365) {
        return { success: false, settings: current, error: 'Billing cycle days must be between 1 and 365' };
      }
    }

    const updated: AppSettings = {
      ...current,
      ...updates,
    };

    return { success: true, settings: updated };
  }
}

export const settingsService = new SettingsService();
