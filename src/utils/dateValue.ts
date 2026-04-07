import type { Timestamp } from 'firebase/firestore';

export type DateValue = Timestamp | Date | string | null | undefined;

export function isTimestamp(value: unknown): value is Timestamp {
  return (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate?: () => Date }).toDate === 'function'
  );
}

export function toDate(value: DateValue): Date | null {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (isTimestamp(value)) {
    const parsed = value.toDate();
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

export function toMillis(value: DateValue): number {
  return toDate(value)?.getTime() ?? 0;
}

export function formatDateValue(value: DateValue, locale = 'it-IT') {
  const date = toDate(value);
  if (!date) return '';
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
