import { auth } from '@/auth';

export type Role = 'admin' | 'editor';

export type SessionUser = {
  id: string;
  username: string;
  role: Role;
};

export type GuardResult =
  | { ok: true; user: SessionUser }
  | { ok: false; error: string };

type AuthUserLike = {
  id?: string
  name?: string | null
  email?: string | null
  role?: string
}

/**
 * Resolve the currently signed-in dashboard user (or null when logged out).
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth()
  if (!session?.user) return null

  const user = session.user as AuthUserLike

  return {
    id: String(user.id ?? ''),
    username: String(user.name ?? user.email ?? ''),
    role: user.role === 'admin' ? 'admin' : 'editor',
  }
}

/**
 * Role of the current session (defaults to 'editor' — the least privileged role).
 */
export async function getCurrentRole(): Promise<Role> {
  const user = await getSessionUser()
  return user?.role ?? 'editor'
}

export async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return user?.role === 'admin';
}

/**
 * Guard for actions restricted to the admin account (create / delete / user management).
 */
export async function requireAdmin(): Promise<GuardResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'You must be signed in.' };
  if (user.role !== 'admin') return { ok: false, error: 'Only the admin can perform this action.' };
  return { ok: true, user };
}

/**
 * Guard for actions any signed-in dashboard user may perform (view / edit / update).
 */
export async function requireMember(): Promise<GuardResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'You must be signed in.' };
  return { ok: true, user };
}

/**
 * Throwing variant of requireAdmin — for actions whose error convention is exceptions.
 */
export async function assertAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error('You must be signed in.');
  if (user.role !== 'admin') throw new Error('Only the admin can perform this action.');
  return user;
}

/**
 * Throwing variant of requireMember — for actions whose error convention is exceptions.
 */
export async function assertMember(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error('You must be signed in.');
  return user;
}
