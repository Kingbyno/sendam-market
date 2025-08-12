import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Allow all requests to pass through - NextAuth will handle auth protection
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect sell routes - require authentication
        if (req.nextUrl.pathname.startsWith("/sell")) {
          return !!token
        }
        
        // Protect admin dashboard routes and check admin status
        if (req.nextUrl.pathname.startsWith("/admin")) {
          if (!token) return false
          
          const adminEmails = (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",")
          
          return adminEmails.includes(token.email || "")
        }
        
        // Allow all other routes
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
