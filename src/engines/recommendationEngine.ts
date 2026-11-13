import { Appliance } from '../types/appliance';
import { Recommendation } from '../types/recommendation';
import { calculateMonthlyKWh, calculateMonthlyCostINR } from './calculationEngine';

/**
 * Generates explainable, deterministic energy-saving recommendations based on current configurations.
 */
export function generateRecommendations(
  appliances: Appliance[],
  tariffPerKWh: number,
  billingDays: number = 30
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const a of appliances) {
    // 1. Air Conditioner optimisation (high power, comfortable, reduction of 1-2 hours)
    if (a.ratedPowerWatts >= 1000 && a.dailyOperatingHours > 3) {
      const suggestedHours = Math.max(2, a.dailyOperatingHours - 2);
      const hoursSaved = a.dailyOperatingHours - suggestedHours;
      const energySavedKWh = Number(calculateMonthlyKWh(a.ratedPowerWatts, hoursSaved, billingDays).toFixed(2));
      const moneySavedINR = calculateMonthlyCostINR(energySavedKWh, tariffPerKWh);

      if (moneySavedINR > 0) {
        recommendations.push({
          id: `rec-ac-${a.id}`,
          title: `Optimise ${a.name} Runtime by 2 Hours`,
          explanation: `${a.name} accounts for a major chunk of your monthly electrical load (${a.ratedPowerWatts}W). Reducing daily runtime from ${a.dailyOperatingHours}h to ${suggestedHours}h (by setting a sleep timer or thermostat at 24°C) directly trims peak load.`,
          applianceId: a.id,
          applianceName: a.name,
          currentHours: a.dailyOperatingHours,
          suggestedHours,
          monthlyEnergySavingKWh: energySavedKWh,
          monthlyMonetarySavingINR: moneySavedINR,
          priority: 'HIGH',
          actionType: 'REDUCE_HOURS',
          suggestedActionLabel: `Set ${a.name} to ${suggestedHours} hrs/day`,
          canApplyDirectly: true,
        });
      }
    }

    // 2. Television standby and extended viewing
    if (a.category === 'ENTERTAINMENT' && a.dailyOperatingHours > 3) {
      const suggestedHours = Math.max(2, a.dailyOperatingHours - 1.5);
      const hoursSaved = a.dailyOperatingHours - suggestedHours;
      const energySavedKWh = Number(calculateMonthlyKWh(a.ratedPowerWatts, hoursSaved, billingDays).toFixed(2));
      const moneySavedINR = calculateMonthlyCostINR(energySavedKWh, tariffPerKWh);

      recommendations.push({
        id: `rec-tv-${a.id}`,
        title: `Trim ${a.name} Viewing & Prevent Standby Draw`,
        explanation: `Smart TVs and connected audio setups consume continuous phantom power on standby. Shaving 1.5 hours of passive viewing and switching off the master board wall socket prevents ghost energy draw.`,
        applianceId: a.id,
        applianceName: a.name,
        currentHours: a.dailyOperatingHours,
        suggestedHours,
        monthlyEnergySavingKWh: energySavedKWh,
        monthlyMonetarySavingINR: moneySavedINR,
        priority: 'MEDIUM',
        actionType: 'STANDBY_ELIMINATION',
        suggestedActionLabel: `Adjust ${a.name} to ${suggestedHours} hrs/day`,
        canApplyDirectly: true,
      });
    }

    // 3. Washing machine batch consolidation
    if (a.category === 'CLEANING' && a.dailyOperatingHours > 1) {
      const suggestedHours = 0.5; // Every 2 days
      const hoursSaved = a.dailyOperatingHours - suggestedHours;
      const energySavedKWh = Number(calculateMonthlyKWh(a.ratedPowerWatts, hoursSaved, billingDays).toFixed(2));
      const moneySavedINR = calculateMonthlyCostINR(energySavedKWh, tariffPerKWh);

      recommendations.push({
        id: `rec-washer-${a.id}`,
        title: `Consolidate Laundry into Full Batches`,
        explanation: `Running washing machines with half loads wastes electrical heating cycles and motor torque. Running full capacity loads every 2 days cuts operational cycles by roughly half.`,
        applianceId: a.id,
        applianceName: a.name,
        currentHours: a.dailyOperatingHours,
        suggestedHours,
        monthlyEnergySavingKWh: energySavedKWh,
        monthlyMonetarySavingINR: moneySavedINR,
        priority: 'MEDIUM',
        actionType: 'SHIFT_SCHEDULE',
        suggestedActionLabel: `Set ${a.name} to ${suggestedHours} hrs/day`,
        canApplyDirectly: true,
      });
    }

    // 4. Lighting optimisation
    if (a.category === 'LIGHTING' && a.dailyOperatingHours > 6) {
      const suggestedHours = 4;
      const hoursSaved = a.dailyOperatingHours - suggestedHours;
      const energySavedKWh = Number(calculateMonthlyKWh(a.ratedPowerWatts, hoursSaved, billingDays).toFixed(2));
      const moneySavedINR = calculateMonthlyCostINR(energySavedKWh, tariffPerKWh);

      recommendations.push({
        id: `rec-led-${a.id}`,
        title: `Maximize Natural Daylighting for ${a.name}`,
        explanation: `Ambient light fixtures are frequently left illuminated in unoccupied rooms. Utilizing natural sunlight and turning off lights in vacant spaces reduces runtime to 4 hours.`,
        applianceId: a.id,
        applianceName: a.name,
        currentHours: a.dailyOperatingHours,
        suggestedHours,
        monthlyEnergySavingKWh: energySavedKWh,
        monthlyMonetarySavingINR: moneySavedINR,
        priority: 'LOW',
        actionType: 'REDUCE_HOURS',
        suggestedActionLabel: `Set ${a.name} to ${suggestedHours} hrs/day`,
        canApplyDirectly: true,
      });
    }

    // 5. Ceiling Fan speed regulation
    if (a.category === 'CLIMATE' && a.ratedPowerWatts < 150 && a.dailyOperatingHours > 8) {
      const suggestedHours = Math.max(6, a.dailyOperatingHours - 2);
      const hoursSaved = a.dailyOperatingHours - suggestedHours;
      const energySavedKWh = Number(calculateMonthlyKWh(a.ratedPowerWatts, hoursSaved, billingDays).toFixed(2));
      const moneySavedINR = calculateMonthlyCostINR(energySavedKWh, tariffPerKWh);

      recommendations.push({
        id: `rec-fan-${a.id}`,
        title: `Regulate ${a.name} Operating Duration`,
        explanation: `Turning off fans when exiting the room saves continuous motor power draw. Fans cool human skin through convection, not the room ambient temperature itself.`,
        applianceId: a.id,
        applianceName: a.name,
        currentHours: a.dailyOperatingHours,
        suggestedHours,
        monthlyEnergySavingKWh: energySavedKWh,
        monthlyMonetarySavingINR: moneySavedINR,
        priority: 'LOW',
        actionType: 'REDUCE_HOURS',
        suggestedActionLabel: `Set ${a.name} to ${suggestedHours} hrs/day`,
        canApplyDirectly: true,
      });
    }
  }

  // Sort recommendations by highest potential monetary savings first
  return recommendations.sort((a, b) => b.monthlyMonetarySavingINR - a.monthlyMonetarySavingINR);
}
