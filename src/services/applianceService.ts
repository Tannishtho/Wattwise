import { Appliance } from '../types/appliance';
import { validateWattage, validateOperatingHours } from '../utils/validation';

export class ApplianceService {
  /**
   * Toggles the ON/OFF state of an appliance
   */
  public toggleAppliance(appliances: Appliance[], id: string): { updated: Appliance[]; toggled: Appliance | null } {
    let toggled: Appliance | null = null;
    const updated = appliances.map((a) => {
      if (a.id === id) {
        toggled = { ...a, isOn: !a.isOn };
        return toggled;
      }
      return a;
    });
    return { updated, toggled };
  }

  /**
   * Updates an existing appliance's configuration with strict validation
   */
  public updateAppliance(
    appliances: Appliance[],
    id: string,
    updates: Partial<Omit<Appliance, 'id'>>
  ): { success: boolean; appliances: Appliance[]; error?: string } {
    if (updates.ratedPowerWatts !== undefined) {
      const v = validateWattage(updates.ratedPowerWatts);
      if (!v.isValid) return { success: false, appliances, error: v.error };
    }

    if (updates.dailyOperatingHours !== undefined) {
      const v = validateOperatingHours(updates.dailyOperatingHours);
      if (!v.isValid) return { success: false, appliances, error: v.error };
    }

    const updated = appliances.map((a) => {
      if (a.id === id) {
        return { ...a, ...updates };
      }
      return a;
    });

    return { success: true, appliances: updated };
  }

  /**
   * Adds a new custom appliance with validation
   */
  public addAppliance(
    appliances: Appliance[],
    newAppliance: Omit<Appliance, 'id' | 'isCustom'>
  ): { success: boolean; appliances: Appliance[]; error?: string; created?: Appliance } {
    const vWatts = validateWattage(newAppliance.ratedPowerWatts);
    if (!vWatts.isValid) return { success: false, appliances, error: vWatts.error };

    const vHours = validateOperatingHours(newAppliance.dailyOperatingHours);
    if (!vHours.isValid) return { success: false, appliances, error: vHours.error };

    if (!newAppliance.name || newAppliance.name.trim() === '') {
      return { success: false, appliances, error: 'Appliance name cannot be empty' };
    }

    const created: Appliance = {
      ...newAppliance,
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: newAppliance.name.trim(),
      isCustom: true,
      isOn: true,
    };

    return { success: true, appliances: [...appliances, created], created };
  }

  /**
   * Removes an appliance by ID
   */
  public removeAppliance(
    appliances: Appliance[],
    id: string
  ): { success: boolean; appliances: Appliance[]; removed?: Appliance } {
    const existing = appliances.find((a) => a.id === id);
    if (!existing) {
      return { success: false, appliances };
    }

    const updated = appliances.filter((a) => a.id !== id);
    return { success: true, appliances: updated, removed: existing };
  }
}

export const applianceService = new ApplianceService();
