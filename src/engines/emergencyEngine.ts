import { Appliance } from '../types/appliance';
import {
  EmergencyValidationResult,
  EmergencyCombination,
  CombinationScoreBreakdown,
} from '../types/emergency';
import { getCombinations } from '../utils/combinatorics';
import { calculateDailyKWh, calculateMonthlyKWh, calculateMonthlyCostINR } from './calculationEngine';

/**
 * Validates the exact-three rule for emergency appliance selection.
 * Rules:
 * 1. Exactly 3 appliances can be confirmed.
 * 2. 0, 1, or 2 appliances cannot be confirmed.
 * 3. Selecting a 4th appliance is strictly rejected.
 */
export function validateEmergencySelection(selectedIds: string[]): EmergencyValidationResult {
  const count = selectedIds.length;

  if (count === 0) {
    return {
      isValid: false,
      errorCode: 'EMPTY_SELECTION',
      errorMessage: 'No appliances selected. You must select exactly 3 appliances for emergency power.',
      selectedCount: 0,
    };
  }

  if (count < 3) {
    return {
      isValid: false,
      errorCode: 'INSUFFICIENT_SELECTION',
      errorMessage: `Only ${count}/3 appliances selected. Please select ${3 - count} more appliance(s) to confirm emergency mode.`,
      selectedCount: count,
    };
  }

  if (count > 3) {
    return {
      isValid: false,
      errorCode: 'EXACTLY_THREE_MAX_EXCEEDED',
      errorMessage: `Emergency limit reached (3/3). You cannot activate a 4th appliance on emergency power. Deselect an active appliance first to swap.`,
      selectedCount: count,
    };
  }

  return {
    isValid: true,
    selectedCount: 3,
  };
}

/**
 * Evaluates the composite emergency score for a given trio of appliances.
 * Objective: Maximize survival essentiality and battery runtime while preventing inverter trips.
 */
export function scoreEmergencyCombination(appliances: Appliance[]): {
  score: number;
  breakdown: CombinationScoreBreakdown;
  rationale: string;
  isOverloadRisk: boolean;
} {
  let essentialityPoints = 0;
  let comfortPoints = 0;

  // Essentiality point distribution based on household survival priorities:
  // Refrigerator: 40 pts (Preserves medicine and perishable food)
  // Ceiling Fan: 25 pts (Thermal regulation, prevents heatstroke/suffocation)
  // LED Lights: 35 pts (Safety, visibility, psychological comfort at night)
  // Others: 0 essentiality points
  for (const a of appliances) {
    if (a.id === 'appliance-fridge' || a.name.toLowerCase().includes('refrigerator')) {
      essentialityPoints += 40;
    } else if (a.id === 'appliance-led' || a.name.toLowerCase().includes('light')) {
      essentialityPoints += 35;
    } else if (a.id === 'appliance-fan' || a.name.toLowerCase().includes('fan')) {
      essentialityPoints += 25;
    }

    if (a.comfort === 'HIGH') comfortPoints += 15;
    else if (a.comfort === 'MEDIUM') comfortPoints += 10;
    else comfortPoints += 5;
  }

  const totalWatts = appliances.reduce((sum, a) => sum + a.ratedPowerWatts, 0);

  // Maximum theoretical load among any 3 appliances: AC (1500) + Washer (500) + Fridge (150) = 2150 W
  const MAX_POSSIBLE_LOAD = 2150;
  const powerFraction = Math.min(1, totalWatts / MAX_POSSIBLE_LOAD);
  // Lower watts yields higher efficiency points (extends inverter backup duration)
  const efficiencyPoints = Math.round((1 - powerFraction) * 100);

  // Domestic inverter safety threshold is typically 900W - 1000W
  const isOverloadRisk = totalWatts > 1000;
  const overloadPenalty = isOverloadRisk ? 45 : 0;

  // Composite Weighted Formula:
  // 45% Essentiality + 35% Inverter Battery Efficiency + 20% Comfort - Overload Penalty
  const rawScore =
    0.45 * essentialityPoints +
    0.35 * efficiencyPoints +
    0.20 * comfortPoints -
    overloadPenalty;

  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Explainable rationale synthesis
  let rationale = '';
  if (isOverloadRisk) {
    rationale = `Dangerous load (${totalWatts}W). Total draw exceeds standard domestic inverter capacity (1000W) and will trip circuit breakers or drain battery in minutes.`;
  } else if (essentialityPoints >= 90) {
    rationale = `Optimal life-support combination (${totalWatts}W). Preserves food & medicine (Fridge), maintains basic illumination (LED), and keeps air circulating (Fan) with minimal battery drain.`;
  } else if (essentialityPoints >= 60) {
    rationale = `Moderate survival mix (${totalWatts}W). Covers vital functions but sacrifices either lighting, food preservation, or room ventilation.`;
  } else {
    rationale = `Poor emergency choice (${totalWatts}W). Prioritizes secondary luxury over vital preservation and lighting needs.`;
  }

  return {
    score,
    breakdown: {
      essentialityPoints,
      efficiencyPoints,
      comfortPoints,
      overloadPenalty,
    },
    rationale,
    isOverloadRisk,
  };
}

/**
 * THE SMART EMERGENCY ADVISOR ENGINE
 * Evaluates all C(6, 3) = 20 combinations of 3 appliances from the 6 default appliances.
 * Returns fully ranked list with scores, power draw, energy metrics, and detailed explanations.
 */
export function evaluateAllCombinations(
  availableAppliances: Appliance[],
  tariffPerKWh: number,
  billingDays: number = 30
): EmergencyCombination[] {
  // Filter down to the 6 primary household appliances (or first 6 if custom exists)
  const pool = availableAppliances.slice(0, 6);

  // Combinations C(pool.length, 3) -> 20 combinations when pool.length = 6
  const rawCombinations = getCombinations(pool, 3);

  const evaluated: EmergencyCombination[] = rawCombinations.map((combo, index) => {
    const totalWatts = combo.reduce((sum, a) => sum + a.ratedPowerWatts, 0);
    // In an outage, operating assumptions for emergency backup:
    // Appliances operate for essential emergency hours (average 8 hrs/day)
    const dailyKWh = Number(
      combo
        .reduce((sum, a) => sum + calculateDailyKWh(a.ratedPowerWatts, Math.min(8, a.dailyOperatingHours)), 0)
        .toFixed(3)
    );
    const monthlyKWh = Number(
      combo
        .reduce((sum, a) => sum + calculateMonthlyKWh(a.ratedPowerWatts, Math.min(8, a.dailyOperatingHours), billingDays), 0)
        .toFixed(2)
    );
    const monthlyCostINR = calculateMonthlyCostINR(monthlyKWh, tariffPerKWh);

    const evaluation = scoreEmergencyCombination(combo);

    const applianceIds = [combo[0].id, combo[1].id, combo[2].id] as [string, string, string];
    const applianceNames = [combo[0].name, combo[1].name, combo[2].name] as [string, string, string];

    return {
      id: `combo-${index + 1}`,
      appliances: combo,
      applianceIds,
      applianceNames,
      totalPowerWatts: totalWatts,
      dailyConsumptionKWh: dailyKWh,
      projectedMonthlyKWh: monthlyKWh,
      projectedMonthlyCostINR: monthlyCostINR,
      compositeScore: evaluation.score,
      rank: 0, // Assigned after sorting
      scoreBreakdown: evaluation.breakdown,
      rationale: evaluation.rationale,
      isRecommended: false,
      isOverloadRisk: evaluation.isOverloadRisk,
    };
  });

  // Sort descending by score; if tied, lower power draw wins
  evaluated.sort((a, b) => {
    if (b.compositeScore !== a.compositeScore) {
      return b.compositeScore - a.compositeScore;
    }
    return a.totalPowerWatts - b.totalPowerWatts;
  });

  // Assign ranks and mark recommended winner
  evaluated.forEach((item, idx) => {
    item.rank = idx + 1;
    if (idx === 0) {
      item.isRecommended = true;
    }
  });

  return evaluated;
}

/**
 * Calculates current live metrics for the selected emergency appliances
 */
export function calculateEmergencyLiveMetrics(
  allAppliances: Appliance[],
  selectedIds: string[],
  tariffPerKWh: number,
  billingDays: number = 30
) {
  const selected = allAppliances.filter((a) => selectedIds.includes(a.id));
  const currentPowerWatts = selected.reduce((sum, a) => sum + a.ratedPowerWatts, 0);

  // During emergency, active appliances run on conservative emergency hours (e.g. 6-8 hrs)
  const dailyKWh = Number(
    selected
      .reduce((sum, a) => sum + calculateDailyKWh(a.ratedPowerWatts, Math.min(8, a.dailyOperatingHours)), 0)
      .toFixed(3)
  );

  const monthlyKWh = Number(
    selected
      .reduce((sum, a) => sum + calculateMonthlyKWh(a.ratedPowerWatts, Math.min(8, a.dailyOperatingHours), billingDays), 0)
      .toFixed(2)
  );

  const monthlyCostINR = calculateMonthlyCostINR(monthlyKWh, tariffPerKWh);

  return {
    selectedCount: selectedIds.length,
    currentPowerWatts,
    dailyKWh,
    monthlyKWh,
    monthlyCostINR,
  };
}
