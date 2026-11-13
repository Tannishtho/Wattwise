import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Appliance, ApplianceCalculation } from '../types/appliance';
import { AppSettings, ActivityLogEvent } from '../types/settings';
import { EmergencyState, EmergencyCombination } from '../types/emergency';
import { EnergyCalculations } from '../types/energy';
import { BudgetAnalysis, BudgetConfig, ApplianceCostContribution } from '../types/budget';
import { Recommendation } from '../types/recommendation';
import { BabaMessage, BabaMood } from '../types/notification';

import { persistenceService } from '../services/persistenceService';
import { applianceService } from '../services/applianceService';
import { notificationService } from '../services/notificationService';
import { settingsService } from '../services/settingsService';

import {
  calculateHouseholdEnergyMetrics,
  calculateApplianceBreakdowns,
} from '../engines/calculationEngine';
import {
  analyzeBudget,
  calculateApplianceContributions,
} from '../engines/budgetEngine';
import { generateRecommendations } from '../engines/recommendationEngine';
import {
  validateEmergencySelection,
  evaluateAllCombinations,
  calculateEmergencyLiveMetrics,
} from '../engines/emergencyEngine';

interface AppContextValue {
  // State
  appliances: Appliance[];
  settings: AppSettings;
  emergencyState: EmergencyState;
  activityLog: ActivityLogEvent[];
  babaMessages: BabaMessage[];
  activeBabaToast: BabaMessage | null;

  // Derived calculations from central engines
  energyMetrics: EnergyCalculations;
  budgetAnalysis: BudgetAnalysis;
  applianceCalculations: ApplianceCalculation[];
  applianceContributions: ApplianceCostContribution[];
  recommendations: Recommendation[];
  emergencyCombinations: EmergencyCombination[];
  emergencyLiveMetrics: ReturnType<typeof calculateEmergencyLiveMetrics>;

  // Actions
  toggleAppliance: (id: string) => void;
  updateAppliance: (id: string, updates: Partial<Omit<Appliance, 'id'>>) => { success: boolean; error?: string };
  addAppliance: (newAppliance: Omit<Appliance, 'id' | 'isCustom'>) => { success: boolean; error?: string };
  removeAppliance: (id: string) => { success: boolean };
  updateSettings: (updates: Partial<AppSettings>) => { success: boolean; error?: string };
  resetToDefaults: () => void;
  applyRecommendation: (recommendation: Recommendation) => void;

  // Emergency Mode actions
  triggerEmergencyPowerCut: () => void;
  toggleEmergencyAppliance: (id: string) => { success: boolean; error?: string };
  confirmEmergencySelection: () => { success: boolean; error?: string };
  applyEmergencyAdvisorCombination: (combo: EmergencyCombination) => void;
  restoreNormalPower: () => void;

  // Assistant actions
  dismissBabaToast: () => void;
  triggerManualBabaTip: () => void;
  setBabaMood: (mood: BabaMood) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage
  const [initialData] = useState(() => persistenceService.loadState());

  const [appliances, setAppliances] = useState<Appliance[]>(initialData.appliances);
  const [settings, setSettings] = useState<AppSettings>(initialData.settings);
  const [emergencyState, setEmergencyState] = useState<EmergencyState>(initialData.emergencyState);
  const [activityLog, setActivityLog] = useState<ActivityLogEvent[]>(initialData.activityLog);
  const [babaMessages, setBabaMessages] = useState<BabaMessage[]>([]);
  const [activeBabaToast, setActiveBabaToast] = useState<BabaMessage | null>(null);

  // Helper to add activity log events
  const logActivity = useCallback((type: ActivityLogEvent['type'], description: string, metadata?: Record<string, unknown>) => {
    const newEvent: ActivityLogEvent = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      type,
      description,
      metadata,
    };
    setActivityLog((prev) => [newEvent, ...prev.slice(0, 99)]); // Keep latest 100 events
  }, []);

  // Helper to trigger Bijli Baba messages
  const dispatchBabaMessage = useCallback((trigger: Parameters<typeof notificationService.triggerBabaEvent>[0], overrideCooldown: boolean = false) => {
    const msg = notificationService.triggerBabaEvent(trigger, settings.babaMood, undefined, overrideCooldown);
    if (msg) {
      setActiveBabaToast(msg);
      setBabaMessages((prev) => [msg, ...prev.slice(0, 49)]);
    }
  }, [settings.babaMood]);

  // Sync state to LocalStorage
  useEffect(() => {
    persistenceService.saveState({
      schemaVersion: '1.0.0',
      lastUpdated: new Date().toISOString(),
      settings,
      appliances,
      emergencyState,
      activityLog,
    });
  }, [appliances, settings, emergencyState, activityLog]);

  // Auto-dismiss toast after 6 seconds
  useEffect(() => {
    if (!activeBabaToast) return;
    const timer = setTimeout(() => {
      setActiveBabaToast(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeBabaToast]);

  // Derived Calculations via Pure Engines
  const energyMetrics = useMemo(() => {
    return calculateHouseholdEnergyMetrics(
      appliances,
      settings.electricityTariffINR,
      settings.billingCycleDays
    );
  }, [appliances, settings.electricityTariffINR, settings.billingCycleDays]);

  const budgetConfig: BudgetConfig = useMemo(() => ({
    monthlyTargetINR: settings.monthlyBudgetTargetINR,
    tariffPerKWh: settings.electricityTariffINR,
    billingCycleDays: settings.billingCycleDays,
  }), [settings.monthlyBudgetTargetINR, settings.electricityTariffINR, settings.billingCycleDays]);

  const budgetAnalysis = useMemo(() => {
    return analyzeBudget(appliances, budgetConfig);
  }, [appliances, budgetConfig]);

  const applianceCalculations = useMemo(() => {
    return calculateApplianceBreakdowns(
      appliances,
      settings.electricityTariffINR,
      settings.billingCycleDays
    );
  }, [appliances, settings.electricityTariffINR, settings.billingCycleDays]);

  const applianceContributions = useMemo(() => {
    return calculateApplianceContributions(appliances, budgetConfig);
  }, [appliances, budgetConfig]);

  const recommendations = useMemo(() => {
    return generateRecommendations(
      appliances,
      settings.electricityTariffINR,
      settings.billingCycleDays
    );
  }, [appliances, settings.electricityTariffINR, settings.billingCycleDays]);

  const emergencyCombinations = useMemo(() => {
    return evaluateAllCombinations(
      appliances,
      settings.electricityTariffINR,
      settings.billingCycleDays
    );
  }, [appliances, settings.electricityTariffINR, settings.billingCycleDays]);

  const emergencyLiveMetrics = useMemo(() => {
    return calculateEmergencyLiveMetrics(
      appliances,
      emergencyState.selectedApplianceIds,
      settings.electricityTariffINR,
      settings.billingCycleDays
    );
  }, [appliances, emergencyState.selectedApplianceIds, settings.electricityTariffINR, settings.billingCycleDays]);

  // Contextual Trigger Watchers (Budget thresholds & all appliances ON)
  useEffect(() => {
    if (emergencyState.isActive) return; // Mute normal budget triggers during outage

    const pct = budgetAnalysis.utilisationPercentage;
    if (pct > 100) {
      dispatchBabaMessage('BUDGET_OVER_100');
    } else if (pct >= 90) {
      dispatchBabaMessage('BUDGET_CRITICAL_90');
    } else if (pct >= 75) {
      dispatchBabaMessage('BUDGET_WARNING_75');
    }
  }, [budgetAnalysis.utilisationPercentage, emergencyState.isActive, dispatchBabaMessage]);

  // Check if all appliances are ON
  useEffect(() => {
    if (emergencyState.isActive || appliances.length === 0) return;
    const allOn = appliances.every((a) => a.isOn);
    if (allOn) {
      dispatchBabaMessage('ALL_APPLIANCES_ON');
    }
  }, [appliances, emergencyState.isActive, dispatchBabaMessage]);

  // Action Handlers
  const toggleAppliance = useCallback((id: string) => {
    if (emergencyState.isActive) {
      // If user is in emergency mode, clicking an appliance toggles emergency selection
      toggleEmergencyAppliance(id);
      return;
    }

    const res = applianceService.toggleAppliance(appliances, id);
    setAppliances(res.updated);

    if (res.toggled) {
      logActivity(
        'APPLIANCE_TOGGLED',
        `${res.toggled.name} switched ${res.toggled.isOn ? 'ON' : 'OFF'}.`,
        { applianceId: id, powerWatts: res.toggled.ratedPowerWatts, isOn: res.toggled.isOn }
      );
    }
  }, [appliances, emergencyState.isActive, logActivity]);

  const updateAppliance = useCallback((id: string, updates: Partial<Omit<Appliance, 'id'>>) => {
    const res = applianceService.updateAppliance(appliances, id, updates);
    if (res.success) {
      setAppliances(res.appliances);
      const app = res.appliances.find((a) => a.id === id);
      logActivity('APPLIANCE_EDITED', `Updated configurations for ${app?.name || id}.`);
      return { success: true };
    }
    return { success: false, error: res.error };
  }, [appliances, logActivity]);

  const addAppliance = useCallback((newAppliance: Omit<Appliance, 'id' | 'isCustom'>) => {
    const res = applianceService.addAppliance(appliances, newAppliance);
    if (res.success && res.created) {
      setAppliances(res.appliances);
      logActivity('APPLIANCE_ADDED', `Added custom appliance: ${res.created.name} (${res.created.ratedPowerWatts}W).`);
      return { success: true };
    }
    return { success: false, error: res.error };
  }, [appliances, logActivity]);

  const removeAppliance = useCallback((id: string) => {
    const res = applianceService.removeAppliance(appliances, id);
    if (res.success && res.removed) {
      setAppliances(res.appliances);
      logActivity('APPLIANCE_DELETED', `Removed appliance: ${res.removed.name}.`);
      return { success: true };
    }
    return { success: false };
  }, [appliances, logActivity]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    const res = settingsService.updateSettings(settings, updates);
    if (res.success) {
      setSettings(res.settings);
      if (updates.electricityTariffINR !== undefined) {
        logActivity('TARIFF_UPDATED', `Electricity tariff updated to ₹${updates.electricityTariffINR}/kWh.`);
      }
      if (updates.monthlyBudgetTargetINR !== undefined) {
        logActivity('BUDGET_UPDATED', `Monthly bill target set to ₹${updates.monthlyBudgetTargetINR}.`);
      }
      return { success: true };
    }
    return { success: false, error: res.error };
  }, [settings, logActivity]);

  const resetToDefaults = useCallback(() => {
    const fresh = persistenceService.resetToDefaults();
    setAppliances(fresh.appliances);
    setSettings(fresh.settings);
    setEmergencyState(fresh.emergencyState);
    setActivityLog(fresh.activityLog);
    notificationService.clearCooldowns();
    logActivity('SYSTEM_RESET', 'All configurations reset to factory demonstration defaults.');
  }, [logActivity]);

  const applyRecommendation = useCallback((rec: Recommendation) => {
    const res = applianceService.updateAppliance(appliances, rec.applianceId, {
      dailyOperatingHours: rec.suggestedHours,
    });
    if (res.success) {
      setAppliances(res.appliances);
      logActivity(
        'RECOMMENDATION_APPLIED',
        `Applied energy recommendation for ${rec.applianceName}: reduced runtime to ${rec.suggestedHours}h/day, saving ₹${rec.monthlyMonetarySavingINR}/mo.`
      );
      dispatchBabaMessage('SAVINGS_ACTION_TAKEN', true);
    }
  }, [appliances, logActivity, dispatchBabaMessage]);

  // EMERGENCY MODE ACTIONS
  const triggerEmergencyPowerCut = useCallback(() => {
    // 1. Snapshot current appliance ON states
    const snapshot: Record<string, boolean> = {};
    appliances.forEach((a) => {
      snapshot[a.id] = a.isOn;
    });

    // 2. Temporarily turn off all appliances
    const poweredDown = appliances.map((a) => ({ ...a, isOn: false }));
    setAppliances(poweredDown);

    // 3. Set emergency state active with 0/3 selected
    setEmergencyState({
      isActive: true,
      outageStartTime: new Date().toISOString(),
      selectedApplianceIds: [],
      isConfirmed: false,
      preOutageApplianceSnapshot: snapshot,
    });

    logActivity('EMERGENCY_TRIGGERED', 'Simulated Grid Power Outage triggered. Normal power suspended.');
    dispatchBabaMessage('OUTAGE_TRIGGERED', true);
  }, [appliances, logActivity, dispatchBabaMessage]);

  const toggleEmergencyAppliance = useCallback((id: string): { success: boolean; error?: string } => {
    const current = emergencyState.selectedApplianceIds;
    const isAlreadySelected = current.includes(id);

    if (isAlreadySelected) {
      // Deselect appliance
      const next = current.filter((item) => item !== id);
      setEmergencyState((prev) => ({
        ...prev,
        selectedApplianceIds: next,
        isConfirmed: false,
      }));
      // Reflect in appliance ON state if confirmed
      setAppliances((prev) => prev.map((a) => (a.id === id ? { ...a, isOn: false } : a)));
      return { success: true };
    }

    // Attempting to add a new appliance
    if (current.length >= 3) {
      // STRICT BUSINESS VALIDATION: Reject 4th appliance!
      logActivity(
        'FOURTH_APPLIANCE_REJECTED',
        `Blocked attempt to add 4th appliance (${id}) during emergency mode. Exactly 3 limit enforced.`
      );
      dispatchBabaMessage('FOURTH_APPLIANCE_REJECTED', true);
      return {
        success: false,
        error: 'Emergency limit reached (3/3). You cannot activate a 4th appliance on emergency power! Deselect one first.',
      };
    }

    // Add 1st, 2nd, or 3rd appliance
    const next = [...current, id];
    setEmergencyState((prev) => ({
      ...prev,
      selectedApplianceIds: next,
      isConfirmed: false,
    }));

    return { success: true };
  }, [emergencyState.selectedApplianceIds, logActivity, dispatchBabaMessage]);

  const confirmEmergencySelection = useCallback((): { success: boolean; error?: string } => {
    const validation = validateEmergencySelection(emergencyState.selectedApplianceIds);
    if (!validation.isValid) {
      dispatchBabaMessage('INCOMPLETE_SELECTION', true);
      return { success: false, error: validation.errorMessage };
    }

    // Exactly 3 appliances confirmed!
    const selectedIds = new Set(emergencyState.selectedApplianceIds);
    setAppliances((prev) =>
      prev.map((a) => ({
        ...a,
        isOn: selectedIds.has(a.id),
      }))
    );

    setEmergencyState((prev) => ({
      ...prev,
      isConfirmed: true,
    }));

    logActivity(
      'EMERGENCY_CONFIRMED',
      `Emergency 3-appliance power load confirmed with: ${emergencyState.selectedApplianceIds.join(', ')}.`
    );
    return { success: true };
  }, [emergencyState.selectedApplianceIds, logActivity, dispatchBabaMessage]);

  const applyEmergencyAdvisorCombination = useCallback((combo: EmergencyCombination) => {
    const comboIds = combo.applianceIds;
    setEmergencyState((prev) => ({
      ...prev,
      selectedApplianceIds: [...comboIds],
      isConfirmed: true,
    }));

    const selectedSet = new Set(comboIds);
    setAppliances((prev) =>
      prev.map((a) => ({
        ...a,
        isOn: selectedSet.has(a.id),
      }))
    );

    logActivity(
      'EMERGENCY_CONFIRMED',
      `Applied Smart Advisor combination #${combo.rank}: ${combo.applianceNames.join(' + ')} (Score: ${combo.compositeScore}/100, Power: ${combo.totalPowerWatts}W).`
    );
    dispatchBabaMessage('EMERGENCY_ADVISOR_GENERATED', true);
  }, [logActivity, dispatchBabaMessage]);

  const restoreNormalPower = useCallback(() => {
    // Restore exact snapshot that existed before outage
    const snapshot = emergencyState.preOutageApplianceSnapshot;
    setAppliances((prev) =>
      prev.map((a) => ({
        ...a,
        isOn: snapshot[a.id] !== undefined ? snapshot[a.id] : a.isOn,
      }))
    );

    setEmergencyState({
      isActive: false,
      outageStartTime: null,
      selectedApplianceIds: [],
      isConfirmed: false,
      preOutageApplianceSnapshot: {},
    });

    logActivity('NORMAL_RESTORED', 'Normal grid power restored. All appliance states restored to pre-outage status.');
    dispatchBabaMessage('NORMAL_POWER_RESTORED', true);
  }, [emergencyState.preOutageApplianceSnapshot, logActivity, dispatchBabaMessage]);

  // Assistant Handlers
  const dismissBabaToast = useCallback(() => {
    setActiveBabaToast(null);
  }, []);

  const triggerManualBabaTip = useCallback(() => {
    dispatchBabaMessage('MANUAL_TIP_REQUEST', true);
  }, [dispatchBabaMessage]);

  const setBabaMood = useCallback((mood: BabaMood) => {
    updateSettings({ babaMood: mood });
  }, [updateSettings]);

  const value: AppContextValue = {
    appliances,
    settings,
    emergencyState,
    activityLog,
    babaMessages,
    activeBabaToast,
    energyMetrics,
    budgetAnalysis,
    applianceCalculations,
    applianceContributions,
    recommendations,
    emergencyCombinations,
    emergencyLiveMetrics,
    toggleAppliance,
    updateAppliance,
    addAppliance,
    removeAppliance,
    updateSettings,
    resetToDefaults,
    applyRecommendation,
    triggerEmergencyPowerCut,
    toggleEmergencyAppliance,
    confirmEmergencySelection,
    applyEmergencyAdvisorCombination,
    restoreNormalPower,
    dismissBabaToast,
    triggerManualBabaTip,
    setBabaMood,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
