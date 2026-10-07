/**
 * Image / media change detection used by server actions to stop editors from
 * adding or removing images while they are still allowed to edit text fields.
 *
 * Values are frequently multi-hundred-KB base64 strings, so we never compare
 * them directly: each value is reduced to a cheap fingerprint (length plus a
 * sampled checksum) and the fingerprint sets are compared instead.
 */

/** Fast, allocation-light fingerprint of a (possibly huge) media string. */
export function mediaFingerprint(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) return '';

  let hash = 5381;
  const step = value.length > 2048 ? Math.ceil(value.length / 512) : 1;
  for (let i = 0; i < value.length; i += step) {
    hash = ((hash * 33) ^ value.charCodeAt(i)) >>> 0;
  }
  return `${value.length}:${hash}`;
}

function toList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === '') return [];
  return [value];
}

function fingerprintSet(values: unknown[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = mediaFingerprint(value);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

/** True when two media lists differ in membership (order-insensitive). */
export function mediaListChanged(current: unknown, next: unknown): boolean {
  const a = fingerprintSet(toList(current));
  const b = fingerprintSet(toList(next));

  if (a.size !== b.size) return true;

  for (const [key, count] of a) {
    if ((b.get(key) ?? 0) !== count) return true;
  }
  return false;
}

/** True when a single media value (image / banner / pdf link) differs. */
export function mediaChanged(current: unknown, next: unknown): boolean {
  return mediaFingerprint(current) !== mediaFingerprint(next);
}
