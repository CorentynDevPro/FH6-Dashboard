/**
 * Returns a new Date with the given number of days added.
 * @param date - The base date (not mutated).
 * @param days - Days to add (use negative value to subtract days).
 * @returns A new Date object offset by the specified number of days.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
