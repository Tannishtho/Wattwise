import { describe, it, expect } from 'vitest';
import {
  validateEmergencySelection,
  evaluateAllCombinations,
  scoreEmergencyCombination,
  calculateEmergencyLiveMetrics,
} from '../src/engines/emergencyEngine';
import { DEFAULT_APPLIANCES } from '../src/data/defaultAppliances';

describe('Emergency Mode & Smart Advisor Engine Tests', () => {
  describe('Strict Exact-Three Validation Rules', () => {
    it('rejects confirmation with 0 appliances selected', () => {
      const res = validateEmergencySelection([]);
      expect(res.isValid).toBe(false);
      expect(res.errorCode).toBe('EMPTY_SELECTION');
    });

    it('rejects confirmation with 1 appliance selected', () => {
      const res = validateEmergencySelection(['appliance-fridge']);
      expect(res.isValid).toBe(false);
      expect(res.errorCode).toBe('INSUFFICIENT_SELECTION');
      expect(res.selectedCount).toBe(1);
    });

    it('rejects confirmation with 2 appliances selected', () => {
      const res = validateEmergencySelection(['appliance-fridge', 'appliance-fan']);
      expect(res.isValid).toBe(false);
      expect(res.errorCode).toBe('INSUFFICIENT_SELECTION');
      expect(res.selectedCount).toBe(2);
    });

    it('approves confirmation with exactly 3 appliances selected', () => {
      const res = validateEmergencySelection(['appliance-fridge', 'appliance-fan', 'appliance-led']);
      expect(res.isValid).toBe(true);
      expect(res.selectedCount).toBe(3);
    });

    it('strictly rejects any attempt to select a 4th appliance', () => {
      const res = validateEmergencySelection([
        'appliance-fridge',
        'appliance-fan',
        'appliance-led',
        'appliance-tv',
      ]);
      expect(res.isValid).toBe(false);
      expect(res.errorCode).toBe('EXACTLY_THREE_MAX_EXCEEDED');
      expect(res.errorMessage).toContain('cannot activate a 4th appliance');
    });
  });

  describe('Smart Emergency Advisor Combinatorial Engine (C(6,3) = 20)', () => {
    it('evaluates exactly 20 distinct 3-appliance combinations for the 6 default appliances', () => {
      const combinations = evaluateAllCombinations(DEFAULT_APPLIANCES, 8, 30);
      expect(combinations.length).toBe(20);
    });

    it('ranks combinations in descending order of composite score', () => {
      const combinations = evaluateAllCombinations(DEFAULT_APPLIANCES, 8, 30);
      for (let i = 0; i < combinations.length - 1; i++) {
        expect(combinations[i].compositeScore).toBeGreaterThanOrEqual(
          combinations[i + 1].compositeScore
        );
      }
    });

    it('identifies Refrigerator + Fan + LED Lights as the #1 Recommended Combination', () => {
      const combinations = evaluateAllCombinations(DEFAULT_APPLIANCES, 8, 30);
      const winner = combinations[0];

      expect(winner.isRecommended).toBe(true);
      expect(winner.rank).toBe(1);

      // Verify winner contains Refrigerator (150W), Fan (75W), LED (12W) = 237W
      const names = winner.applianceNames.map((n) => n.toLowerCase());
      expect(names.some((n) => n.includes('refrigerator'))).toBe(true);
      expect(names.some((n) => n.includes('fan'))).toBe(true);
      expect(names.some((n) => n.includes('led') || n.includes('light'))).toBe(true);
      expect(winner.totalPowerWatts).toBe(150 + 75 + 12); // 237W
    });

    it('flags high power combinations containing Air Conditioner (>1000W) as Inverter Trip Risk', () => {
      const combinations = evaluateAllCombinations(DEFAULT_APPLIANCES, 8, 30);
      const acCombos = combinations.filter((c) =>
        c.applianceNames.some((n) => n.toLowerCase().includes('air conditioner'))
      );

      // All trios containing the 1500W AC should exceed 1000W and be flagged as overload trip risk
      for (const combo of acCombos) {
        expect(combo.totalPowerWatts).toBeGreaterThan(1000);
        expect(combo.isOverloadRisk).toBe(true);
      }
    });
  });

  describe('Emergency Live Metrics Calculation', () => {
    it('recalculates instantaneous power draw strictly using the 3 selected appliances', () => {
      const selected = ['appliance-fridge', 'appliance-fan', 'appliance-led'];
      const metrics = calculateEmergencyLiveMetrics(DEFAULT_APPLIANCES, selected, 8, 30);

      expect(metrics.selectedCount).toBe(3);
      expect(metrics.currentPowerWatts).toBe(150 + 75 + 12); // 237W
      expect(metrics.dailyKWh).toBeGreaterThan(0);
      expect(metrics.monthlyCostINR).toBeGreaterThan(0);
    });
  });
});
