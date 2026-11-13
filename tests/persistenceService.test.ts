import { describe, it, expect, beforeEach } from 'vitest';
import { persistenceService, INITIAL_STATE } from '../src/services/persistenceService';

describe('Persistence Service Tests', () => {
  // Mock localStorage in node environment
  let storageMap: Record<string, string> = {};

  beforeEach(() => {
    storageMap = {};
    globalThis.localStorage = {
      getItem: (key: string) => storageMap[key] || null,
      setItem: (key: string, val: string) => {
        storageMap[key] = val;
      },
      removeItem: (key: string) => {
        delete storageMap[key];
      },
      clear: () => {
        storageMap = {};
      },
      length: 0,
      key: () => null,
    };
  });

  it('loads pristine defaults when LocalStorage is empty', () => {
    const state = persistenceService.loadState();
    expect(state.schemaVersion).toBe('1.0.0');
    expect(state.appliances.length).toBe(6);
    expect(state.settings.electricityTariffINR).toBe(8);
    expect(state.settings.monthlyBudgetTargetINR).toBe(2500);
  });

  it('saves and reloads state accurately without data loss', () => {
    const state = persistenceService.loadState();
    state.settings.electricityTariffINR = 12.5;
    persistenceService.saveState(state);

    const reloaded = persistenceService.loadState();
    expect(reloaded.settings.electricityTariffINR).toBe(12.5);
  });

  it('safely recovers to defaults when stored JSON is corrupted', () => {
    localStorage.setItem('wattwise_v1_store', '{invalid-malformed-json');
    const recovered = persistenceService.loadState();
    expect(recovered.schemaVersion).toBe('1.0.0');
    expect(recovered.appliances.length).toBe(6);
  });

  it('safely resets entire application state to factory defaults on command', () => {
    const state = persistenceService.loadState();
    state.settings.monthlyBudgetTargetINR = 9999;
    persistenceService.saveState(state);

    const resetState = persistenceService.resetToDefaults();
    expect(resetState.settings.monthlyBudgetTargetINR).toBe(2500);
    expect(resetState.appliances.length).toBe(6);
    expect(resetState.emergencyState.isActive).toBe(false);
  });
});
