import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(price: number): string {
  return `US$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format a date string, Date object, or timestamp into strict 'dd.mm.yyyy' format.
 * Examples:
 *   - '2026-09-25' -> '25.09.2026'
 *   - '2026-09-25T14:30:00Z' -> '25.09.2026'
 *   - Date object -> '25.09.2026'
 *   - '25.09.2026' -> '25.09.2026' (idempotent)
 */
export function formatDateDDMMYYYY(val: string | Date | number | null | undefined): string {
  if (!val) return '';
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return '';
    // If already in dd.mm.yyyy format
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(trimmed)) {
      return trimmed;
    }
    // If yyyy-mm-dd or yyyy-mm-ddTHH:mm:ss
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, yyyy, mm, dd] = isoMatch;
      return `${dd}.${mm}.${yyyy}`;
    }
  }

  const d = typeof val === 'object' && val instanceof Date ? val : new Date(val);
  if (isNaN(d.getTime())) return typeof val === 'string' ? val : '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Format date and time in 'dd.mm.yyyy, HH:MM' format.
 */
export function formatDateTimeDDMMYYYY(val: string | Date | number | null | undefined): string {
  if (!val) return '';
  const d = typeof val === 'object' && val instanceof Date ? val : new Date(val);
  if (isNaN(d.getTime())) return formatDateDDMMYYYY(val);

  const dateStr = formatDateDDMMYYYY(d);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${dateStr}, ${hours}:${minutes}`;
}

/**
 * Converts any date representation (dd.mm.yyyy, ISO, Date) to ISO 'yyyy-mm-dd'
 * for internal HTML5 input values or date calculations.
 */
export function toIsoDate(val: string | Date | number | null | undefined): string {
  if (!val) return '';
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return '';
    // If dd.mm.yyyy
    const dotMatch = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
    if (dotMatch) {
      const [, dd, mm, yyyy] = dotMatch;
      return `${yyyy}-${mm}-${dd}`;
    }
    // If already yyyy-mm-dd
    const isoMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) return isoMatch[1];
  }
  const d = typeof val === 'object' && val instanceof Date ? val : new Date(val);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
