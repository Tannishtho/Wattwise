export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateWattage(watts: number): ValidationResult {
  if (isNaN(watts)) {
    return { isValid: false, error: 'Power rating must be a valid number' };
  }
  if (watts <= 0) {
    return { isValid: false, error: 'Power rating must be strictly greater than 0 Watts' };
  }
  if (watts > 10000) {
    return { isValid: false, error: 'Power rating cannot exceed 10,000 Watts for household appliances' };
  }
  return { isValid: true };
}

export function validateOperatingHours(hours: number): ValidationResult {
  if (isNaN(hours)) {
    return { isValid: false, error: 'Operating hours must be a valid number' };
  }
  if (hours < 0) {
    return { isValid: false, error: 'Operating hours cannot be negative' };
  }
  if (hours > 24) {
    return { isValid: false, error: 'Daily operating hours cannot exceed 24 hours per day' };
  }
  return { isValid: true };
}

export function validateTariff(tariff: number): ValidationResult {
  if (isNaN(tariff)) {
    return { isValid: false, error: 'Tariff must be a valid number' };
  }
  if (tariff <= 0) {
    return { isValid: false, error: 'Electricity tariff must be greater than ₹0' };
  }
  if (tariff > 100) {
    return { isValid: false, error: 'Tariff exceeds realistic domestic upper bound (₹100/kWh)' };
  }
  return { isValid: true };
}

export function validateBudgetTarget(target: number): ValidationResult {
  if (isNaN(target)) {
    return { isValid: false, error: 'Monthly budget must be a valid number' };
  }
  if (target <= 0) {
    return { isValid: false, error: 'Monthly budget target must be greater than ₹0' };
  }
  return { isValid: true };
}
