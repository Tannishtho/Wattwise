/**
 * Formats power draw in Watts or kW with appropriate unit
 */
export function formatPower(watts: number): string {
  if (isNaN(watts) || watts === null || watts === undefined) return '0 W';
  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`;
  }
  return `${Math.round(watts)} W`;
}

/**
 * Formats energy consumption in kWh
 */
export function formatEnergy(kWh: number, decimals: number = 2): string {
  if (isNaN(kWh) || kWh === null || kWh === undefined) return '0.00 kWh';
  return `${kWh.toFixed(decimals)} kWh`;
}

/**
 * Formats percentages with % sign
 */
export function formatPercentage(val: number, decimals: number = 1): string {
  if (isNaN(val) || val === null || val === undefined) return '0%';
  return `${val.toFixed(decimals)}%`;
}

/**
 * Formats hours into "Xh" or "X.X hrs"
 */
export function formatHours(hours: number): string {
  if (isNaN(hours)) return '0h';
  if (Number.isInteger(hours)) {
    return `${hours}h / day`;
  }
  return `${hours.toFixed(1)}h / day`;
}

/**
 * Formats a timestamp into human-readable Indian Standard Time
 */
export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}
