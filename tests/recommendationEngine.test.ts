import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../src/engines/recommendationEngine';
import { DEFAULT_APPLIANCES } from '../src/data/defaultAppliances';

describe('Smart Recommendations Engine Tests', () => {
  it('generates high-priority saving recommendations for high-wattage appliances (e.g. AC)', () => {
    const recs = generateRecommendations(DEFAULT_APPLIANCES, 8, 30);
    const acRec = recs.find((r) => r.applianceId === 'appliance-ac');

    expect(acRec).toBeDefined();
    expect(acRec?.priority).toBe('HIGH');
    expect(acRec?.monthlyMonetarySavingINR).toBeGreaterThan(0);
    expect(acRec?.suggestedHours).toBeLessThan(acRec?.currentHours || 6);
  });

  it('calculates monetary savings in exact alignment with active tariff and energy reduction', () => {
    const tariff = 8;
    const days = 30;
    const recs = generateRecommendations(DEFAULT_APPLIANCES, tariff, days);
    const acRec = recs.find((r) => r.applianceId === 'appliance-ac');

    if (acRec) {
      // 2 hours reduction on 1500W for 30 days = (1500 * 2 * 30)/1000 = 90 kWh
      // 90 kWh * ₹8 = ₹720
      expect(acRec.monthlyEnergySavingKWh).toBe(90);
      expect(acRec.monthlyMonetarySavingINR).toBe(720);
    }
  });

  it('sorts recommendations by descending monetary savings potential', () => {
    const recs = generateRecommendations(DEFAULT_APPLIANCES, 8, 30);
    for (let i = 0; i < recs.length - 1; i++) {
      expect(recs[i].monthlyMonetarySavingINR).toBeGreaterThanOrEqual(
        recs[i + 1].monthlyMonetarySavingINR
      );
    }
  });
});
