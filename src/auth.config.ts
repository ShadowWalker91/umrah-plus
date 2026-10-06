import type { NextAuthConfig } from 'next-auth'

/**
 * Edge-safe NextAuth config (no database imports).
 * Shared by src/auth.ts (server) and src/proxy.ts (route guard).
 */
export const authConfig = {
  providers: [],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const role = (user as { role?: string }).role
        token.role = role === 'editor' ? 'editor' : 'admin'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // Fail closed: only an explicit 'admin' claim grants the admin role
        const sessionUser = session.user as typeof session.user & { role?: string }
        sessionUser.role = (token as { role?: string }).role === 'admin' ? 'admin' : 'editor'
        if (token.name) session.user.name = token.name as string
      }
      return session
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
} satisfies NextAuthConfig

export default authConfig
