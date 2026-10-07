/**
 * Shared authorization copy.
 *
 * Imported by the server guards (src/lib/auth/guards.ts) AND the edge
 * middleware (src/proxy.ts), so this module must stay free of server-only
 * imports (no next/auth, no db, no next/cache).
 */
export const AUTH_MESSAGES = {
  notSignedIn: 'You must be signed in.',
  adminOnly: 'Only the admin can perform this action.',
  createAdminOnly: 'Only the admin can create new items.',
  deleteAdminOnly: 'Only the admin can delete items.',
  imageAdminOnly: 'Only the admin can add or remove images.',
  pageAdminOnly: 'Only the admin can access this page.',
  usersAdminOnly: 'Only the admin can manage users.',
} as const;

/** Unwrap an unknown thrown value into a user-facing message. */
export function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}
