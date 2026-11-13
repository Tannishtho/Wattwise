import { PersistedAppState, AppSettings } from '../types/settings';
import { EmergencyState } from '../types/emergency';
import { DEFAULT_APPLIANCES } from '../data/defaultAppliances';

const STORAGE_KEY = 'wattwise_v1_store';
const SCHEMA_VERSION = '1.0.0';

export const DEFAULT_SETTINGS: AppSettings = {
  electricityTariffINR: 8,
  monthlyBudgetTargetINR: 2500,
  billingCycleDays: 30,
  currencyCode: 'INR',
  currencySymbol: '₹',
  babaMood: 'ROAST',
  babaAudioEnabled: false,
  simulationPaceSeconds: 5,
};

export const INITIAL_EMERGENCY_STATE: EmergencyState = {
  isActive: false,
  outageStartTime: null,
  selectedApplianceIds: [],
  isConfirmed: false,
  preOutageApplianceSnapshot: {},
};

export const INITIAL_STATE: PersistedAppState = {
  schemaVersion: SCHEMA_VERSION,
  lastUpdated: new Date().toISOString(),
  settings: DEFAULT_SETTINGS,
  appliances: DEFAULT_APPLIANCES,
  emergencyState: INITIAL_EMERGENCY_STATE,
  activityLog: [
    {
      id: 'init-1',
      timestamp: new Date().toISOString(),
      type: 'SYSTEM_RESET',
      description: 'WATTWISE household energy simulation initialized with standard defaults.',
    },
  ],
};

class PersistenceService {
  private getStorage(): Storage | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage;
      }
      if (typeof localStorage !== 'undefined') {
        return localStorage;
      }
    } catch {
      return null;
    }
    return null;
  }

  /**
   * Loads state from LocalStorage with version validation and fallback
   */
  public loadState(): PersistedAppState {
    try {
      const storage = this.getStorage();
      if (!storage) {
        return this.createInitialSnapshot();
      }

      const serialized = storage.getItem(STORAGE_KEY);
      if (!serialized) {
        const fresh = this.createInitialSnapshot();
        this.saveState(fresh);
        return fresh;
      }

      const parsed: PersistedAppState = JSON.parse(serialized);

      // Validate schema version
      if (parsed.schemaVersion !== SCHEMA_VERSION || !parsed.appliances || !parsed.settings) {
        console.warn('[WATTWISE Persistence] Schema mismatch or corrupted storage. Resetting to defaults.');
        return this.resetToDefaults();
      }

      // Ensure all 6 standard appliances are present or have valid defaults
      if (!Array.isArray(parsed.appliances) || parsed.appliances.length === 0) {
        parsed.appliances = JSON.parse(JSON.stringify(DEFAULT_APPLIANCES));
      }

      // Ensure emergency state has required properties
      if (!parsed.emergencyState || typeof parsed.emergencyState.isActive !== 'boolean') {
        parsed.emergencyState = { ...INITIAL_EMERGENCY_STATE };
      }

      return parsed;
    } catch (err) {
      console.error('[WATTWISE Persistence] Failed to parse stored state. Recovering defaults.', err);
      return this.resetToDefaults();
    }
  }

  private createInitialSnapshot(): PersistedAppState {
    return {
      schemaVersion: SCHEMA_VERSION,
      lastUpdated: new Date().toISOString(),
      settings: { ...DEFAULT_SETTINGS },
      appliances: JSON.parse(JSON.stringify(DEFAULT_APPLIANCES)),
      emergencyState: { ...INITIAL_EMERGENCY_STATE },
      activityLog: [
        {
          id: 'init-1',
          timestamp: new Date().toISOString(),
          type: 'SYSTEM_RESET',
          description: 'WATTWISE household energy simulation initialized with standard defaults.',
        },
      ],
    };
  }

  /**
   * Persists entire application state to LocalStorage
   */
  public saveState(state: PersistedAppState): boolean {
    try {
      const storage = this.getStorage();
      if (!storage) return false;
      state.lastUpdated = new Date().toISOString();
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      console.error('[WATTWISE Persistence] Storage quota exceeded or unavailable.', err);
      return false;
    }
  }

  /**
   * Resets LocalStorage to pristine demo defaults
   */
  public resetToDefaults(): PersistedAppState {
    const freshState: PersistedAppState = {
      schemaVersion: SCHEMA_VERSION,
      lastUpdated: new Date().toISOString(),
      settings: { ...DEFAULT_SETTINGS },
      appliances: JSON.parse(JSON.stringify(DEFAULT_APPLIANCES)),
      emergencyState: { ...INITIAL_EMERGENCY_STATE },
      activityLog: [
        {
          id: `reset-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'SYSTEM_RESET',
          description: 'User initiated full restore to factory demonstration defaults.',
        },
      ],
    };
    this.saveState(freshState);
    return freshState;
  }
}

export const persistenceService = new PersistenceService();
