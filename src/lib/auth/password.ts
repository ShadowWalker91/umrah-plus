import { randomBytes, scrypt, timingSafeEqual } from 'crypto';

const KEY_LENGTH = 64;
const SCHEME = 'scrypt';

function deriveKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

/**
 * Hash a plain-text password for storage in the users table.
 * Format: scrypt:<salt>:<hex key>
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const key = await deriveKey(password, salt);
  return `${SCHEME}:${salt}:${key.toString('hex')}`;
}

/**
 * Constant-time verification of a plain-text password against a stored hash.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [scheme, salt, hash] = storedHash.split(':');
    if (scheme !== SCHEME || !salt || !hash) return false;

    const key = await deriveKey(password, salt);
    const expected = Buffer.from(hash, 'hex');
    if (expected.length !== key.length) return false;
    return timingSafeEqual(key, expected);
  } catch {
    return false;
  }
}
