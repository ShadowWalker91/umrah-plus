import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { eq, sql } from "drizzle-orm"
import { db } from "@/lib/db/"
import { users } from "@/lib/db/schema/users"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import authConfig from "@/auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Dashboard Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const username = String(credentials?.username ?? "").trim()
        const password = String(credentials?.password ?? "")
        if (!username || !password) return null

        // 1. Database users table (admin + editors)
        try {
          const dbUser = await db.query.users.findFirst({
            where: sql`lower(${users.username}) = lower(${username})`,
          })

          if (dbUser) {
            const valid = await verifyPassword(password, dbUser.passwordHash)
            if (!valid) return null
            return {
              id: dbUser.id,
              name: dbUser.username,
              email: dbUser.username,
              role: dbUser.role,
            }
          }
        } catch (error) {
          console.error("[auth] users table lookup failed:", error)
        }

        // 2. Bootstrap: env admin credentials only work while no admin exists in the DB
        const envEmail = process.env.ADMIN_EMAIL
        const envPassword = process.env.ADMIN_PASSWORD
        if (!envEmail || !envPassword || username !== envEmail || password !== envPassword) {
          return null
        }

        try {
          const existingAdmin = await db.query.users.findFirst({
            where: eq(users.role, "admin"),
          })
          if (existingAdmin) return null // DB is now the source of truth
        } catch (error) {
          // users table not available yet -> env credentials stay valid
          console.error("[auth] admin lookup failed:", error)
          return { id: "1", name: "Admin", email: envEmail, role: "admin" }
        }

        try {
          const [created] = await db
            .insert(users)
            .values({
              username: envEmail,
              passwordHash: await hashPassword(envPassword),
              role: "admin",
            })
            .returning()
          return { id: created.id, name: created.username, email: created.username, role: "admin" }
        } catch (error) {
          console.error("[auth] failed to seed admin user:", error)
          return { id: "1", name: "Admin", email: envEmail, role: "admin" }
        }
      }
    })
  ],
})
