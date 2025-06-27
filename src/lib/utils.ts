
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { DailyUsageRecord } from '@/components/bakery-app';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalize = (s: string) => {
  if (!s) return '';
  return s
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

/**
 * Calculates the average daily usage for a specific day of the week from historical records.
 * @param records - An array of daily usage records.
 * @param targetDay - The target day of the week (0 for Sunday, 1 for Monday, etc.).
 * @returns An array of [ingredientName, averageAmount, unit].
 */
export function calculateAverageDailyUsage(
  records: DailyUsageRecord[],
  targetDay: number
): [string, number, string][] {
  // Filter records for the target day of the week and sort them by date descending
  const relevantRecords = records
    .filter(record => new Date(record.date).getDay() === targetDay)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4); // Get the last 4 records for that day

  if (relevantRecords.length === 0) {
    return [];
  }

  const totals: Record<string, { sum: number; unit: string; count: number }> = {};

  // Aggregate usage from the relevant records
  for (const record of relevantRecords) {
    for (const { name, amount, unit } of record.usage) {
      if (!totals[name]) {
        totals[name] = { sum: 0, unit, count: 0 };
      }
      totals[name].sum += amount;
    }
  }

  // To correctly average, we need to know how many records contributed to each total.
  // Since some ingredients might not be in every record, we create a map of ingredient appearances.
  const ingredientCounts: Record<string, number> = {};
  for (const record of relevantRecords) {
      for (const { name } of record.usage) {
          if (!ingredientCounts[name]) {
              ingredientCounts[name] = 0;
          }
          ingredientCounts[name]++;
      }
  }


  // Calculate the average
  const averages: [string, number, string][] = Object.entries(totals).map(
    ([name, data]) => {
      const divisor = relevantRecords.length; // Average over the number of days found
      const averageAmount = data.sum / divisor;
      return [name, averageAmount, data.unit];
    }
  );

  return averages.sort((a,b) => a[0].localeCompare(b[0]));
}
