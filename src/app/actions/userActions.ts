'use server'

import { db } from '@/lib/db/'
import { users } from '@/lib/db/schema/users'
import { desc, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import { requireAdmin, AUTH_MESSAGES } from '@/lib/auth/guards'

const MIN_PASSWORD_LENGTH = 6

type ActionResponse = { success: boolean; message?: string; error?: string }

function normalizeUsername(value: unknown): string {
  return String(value ?? '').trim()
}

// 1. List all dashboard users (admin only)
export async function getUsers() {
  const guard = await requireAdmin()
  if (!guard.ok) return { success: false as const, data: [], error: guard.error }

  try {
    const data = await db
      .select({
        id: users.id,
        username: users.username,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))

    return { success: true as const, data }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { success: false as const, data: [], error: 'Failed to load users' }
  }
}

// 2. Fetch a single user (admin only)
export async function getUserById(id: string) {
  const guard = await requireAdmin()
  if (!guard.ok) return { success: false as const, data: null, error: guard.error }

  try {
    const data = await db
      .select({
        id: users.id,
        username: users.username,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    return { success: true as const, data: data[0] ?? null }
  } catch (error) {
    console.error('Error fetching user:', error)
    return { success: false as const, data: null, error: 'Failed to load user' }
  }
}

// 3. Create a new editor account (admin only)
export async function createUser(input: { username: string; password: string }): Promise<ActionResponse> {
  const guard = await requireAdmin(AUTH_MESSAGES.createAdminOnly)
  if (!guard.ok) return { success: false, error: guard.error }

  try {
    const username = normalizeUsername(input.username)
    const password = String(input.password ?? '')

    if (username.length < 3) return { success: false, error: 'Username must be at least 3 characters.' }
    if (password.length < MIN_PASSWORD_LENGTH) return { success: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` }

    const existing = await db.query.users.findFirst({
      where: sql`lower(${users.username}) = lower(${username})`,
    })
    if (existing) return { success: false, error: 'That username is already taken.' }

    await db.insert(users).values({
      username,
      passwordHash: await hashPassword(password),
      role: 'editor',
    })

    revalidatePath('/admin/users')
    return { success: true, message: 'Editor account created successfully!' }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Failed to create user.' }
  }
}

// 4. Update a user's username and/or password (admin only)
export async function updateUser(input: { id: string; username: string; password?: string }): Promise<ActionResponse> {
  const guard = await requireAdmin()
  if (!guard.ok) return { success: false, error: guard.error }

  try {
    const username = normalizeUsername(input.username)
    const password = String(input.password ?? '')

    if (username.length < 3) return { success: false, error: 'Username must be at least 3 characters.' }
    if (password && password.length < MIN_PASSWORD_LENGTH) return { success: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` }

    const target = await db.query.users.findFirst({ where: eq(users.id, input.id) })
    if (!target) return { success: false, error: 'User not found.' }

    const taken = await db.query.users.findFirst({
      where: sql`lower(${users.username}) = lower(${username}) and ${users.id} != ${input.id}`,
    })
    if (taken) return { success: false, error: 'That username is already taken.' }

    await db
      .update(users)
      .set({
        username,
        ...(password ? { passwordHash: await hashPassword(password) } : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.id, input.id))

    revalidatePath('/admin/users')
    return { success: true, message: 'User updated successfully!' }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: 'Failed to update user.' }
  }
}

// 5. Delete an editor account (admin only — the admin account itself cannot be deleted)
export async function deleteUser(id: string): Promise<ActionResponse> {
  const guard = await requireAdmin(AUTH_MESSAGES.deleteAdminOnly)
  if (!guard.ok) return { success: false, error: guard.error }

  try {
    const target = await db.query.users.findFirst({ where: eq(users.id, id) })
    if (!target) return { success: false, error: 'User not found.' }
    if (target.role === 'admin') return { success: false, error: 'The admin account cannot be deleted.' }

    await db.delete(users).where(eq(users.id, id))

    revalidatePath('/admin/users')
    return { success: true, message: 'User deleted successfully!' }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'Failed to delete user.' }
  }
}

// 6. Admin changes own username / password (Settings page)
export async function updateMyAccount(input: {
  currentPassword: string
  username: string
  newPassword?: string
}): Promise<ActionResponse> {
  const guard = await requireAdmin()
  if (!guard.ok) return { success: false, error: guard.error }

  try {
    const username = normalizeUsername(input.username)
    const currentPassword = String(input.currentPassword ?? '')
    const newPassword = String(input.newPassword ?? '')

    if (username.length < 3) return { success: false, error: 'Username must be at least 3 characters.' }
    if (newPassword && newPassword.length < MIN_PASSWORD_LENGTH) {
      return { success: false, error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` }
    }

    const admin = await db.query.users.findFirst({ where: eq(users.role, 'admin') })

    if (admin) {
      const valid = await verifyPassword(currentPassword, admin.passwordHash)
      if (!valid) return { success: false, error: 'Current password is incorrect.' }

      const taken = await db.query.users.findFirst({
        where: sql`lower(${users.username}) = lower(${username}) and ${users.id} != ${admin.id}`,
      })
      if (taken) return { success: false, error: 'That username is already taken.' }

      await db
        .update(users)
        .set({
          username,
          ...(newPassword ? { passwordHash: await hashPassword(newPassword) } : {}),
          updatedAt: new Date(),
        })
        .where(eq(users.id, admin.id))
    } else {
      // No admin row yet: verify against the env bootstrap credentials and create the row
      if (currentPassword !== process.env.ADMIN_PASSWORD) {
        return { success: false, error: 'Current password is incorrect.' }
      }

      const taken = await db.query.users.findFirst({
        where: sql`lower(${users.username}) = lower(${username})`,
      })
      if (taken) return { success: false, error: 'That username is already taken.' }

      await db.insert(users).values({
        username,
        passwordHash: await hashPassword(newPassword || currentPassword),
        role: 'admin',
      })
    }

    revalidatePath('/admin/settings')
    revalidatePath('/admin/users')
    return {
      success: true,
      message: `Account updated${newPassword ? ' — use your new password the next time you sign in' : ''}.`,
    }
  } catch (error) {
    console.error('Error updating account:', error)
    return { success: false, error: 'Failed to update account.' }
  }
}
