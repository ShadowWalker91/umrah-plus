import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdminPanel = req.nextUrl.pathname.startsWith("/admin")
  const isOnLoginPage = req.nextUrl.pathname === "/admin/login"

  // 1. If trying to access Admin Panel but NOT logged in
  if (isOnAdminPanel && !isOnLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  // 2. If already logged in and tries to go to Login Page
  if (isOnLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}