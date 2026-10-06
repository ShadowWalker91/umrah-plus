import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import authConfig from "@/auth.config"
import { AUTH_MESSAGES } from "@/lib/auth/messages"

const { auth } = NextAuth(authConfig)

/** Send the user back to the dashboard carrying the reason, so the UI can
 *  show an inline banner + toast instead of failing silently. */
function denied(req: { nextUrl: URL }, message: string) {
  const url = new URL("/admin/dashboard", req.nextUrl)
  url.searchParams.set("denied", message)
  return NextResponse.redirect(url)
}

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const pathname = req.nextUrl.pathname
  const isOnAdminPanel = pathname.startsWith("/admin")
  const isOnLoginPage = pathname === "/admin/login"

  // 1. If trying to access Admin Panel but NOT logged in
  if (isOnAdminPanel && !isOnLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl))
  }

  // 2. If already logged in and tries to go to Login Page
  if (isOnLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl))
  }

  // 3. Role-based restrictions: editors can view and edit, never create/delete/manage users
  if (isOnAdminPanel && isLoggedIn) {
    const role = (req.auth?.user as { role?: string } | undefined)?.role
    const isAdmin = role === "admin"

    if (!isAdmin) {
      // User management is admin-only
      if (pathname === "/admin/users" || pathname.startsWith("/admin/users/")) {
        return denied(req, AUTH_MESSAGES.usersAdminOnly)
      }

      // Editors cannot open create/new entry routes
      if (/(^|\/)(create|new)(\/|$)/.test(pathname)) {
        return denied(req, AUTH_MESSAGES.createAdminOnly)
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
