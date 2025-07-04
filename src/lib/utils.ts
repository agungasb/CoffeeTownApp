
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { DailyUsageRecord, DailyUsageIngredient } from '@/components/bakery-app';

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
 * @returns An array of ingredient usage objects.
 */
export function calculateAverageDailyUsage(
  records: DailyUsageRecord[],
  targetDay: number
): DailyUsageIngredient[] {
  // Filter records for the target day of the week and sort them by date descending
  const relevantRecords = records
    .filter(record => new Date(record.date).getDay() === targetDay)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4); // Get the last 4 records for that day

  if (relevantRecords.length === 0) {
    return [];
  }

  const totals: Record<string, { sum: number; unit: string; originalName: string }> = {};

  // Aggregate usage from the relevant records, case-insensitively
  for (const record of relevantRecords) {
    for (const { name, amount, unit } of record.usage) {
      const key = name.toLowerCase(); // Use lowercase key for grouping
      if (!totals[key]) {
        totals[key] = { sum: 0, unit, originalName: name }; // Store the first encountered casing
      }
      totals[key].sum += amount;
    }
  }

  // Calculate the average. The divisor is the number of relevant days.
  const divisor = relevantRecords.length;
  const averages: DailyUsageIngredient[] = Object.values(totals).map(
    (data) => {
      const averageAmount = data.sum / divisor;
      // Return the name with its original casing for display purposes
      return {name: data.originalName, amount: averageAmount, unit: data.unit};
    }
  );

  return averages.sort((a,b) => a.name.localeCompare(b.name));
}
