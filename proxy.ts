// ═══════════════════════════════════════════════════
// MIDDLEWARE - Authentication & Route Protection (Next.js 16)
// ═══════════════════════════════════════════════════

import { NextResponse } from "next/server";

import { auth } from "lib/auth";

// ═══════════════════════════════════════════════════
// ROUTE CONFIGURATION
// ═══════════════════════════════════════════════════

// Protected routes that require authentication
const protectedRoutes = ["/admin", "/profile", "/dashboard", "/bookmarks"];

// Auth routes that should redirect to home if already authenticated
const authRoutes = [
  "/(auth)/sign-in",
  "/(auth)/sign-up",
  "/(auth)/register",
  "/sign-in",
  "/register",
];

// Admin-only routes
const adminRoutes = ["/admin"];

// ═══════════════════════════════════════════════════
// MIDDLEWARE HANDLER
// ═══════════════════════════════════════════════════

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Check if route is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // Check if route is auth page
  const isAuthRoute = authRoutes.some(
    (route) => pathname.includes(route) || pathname.startsWith(route)
  );

  // Check if route is admin-only
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // ═══════════════════════════════════════════════════
  // Authentication Guards
  // ═══════════════════════════════════════════════════

  // Redirect to sign-in if accessing protected route without session
  if (isProtected && !isAuthenticated) {
    const signInUrl = new URL("/(auth)/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect to home if accessing auth route with active session
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ═══════════════════════════════════════════════════
  // Admin Route Protection
  // ═══════════════════════════════════════════════════

  if (isAdminRoute) {
    const userRole = req.auth?.user?.role as string | undefined;

    // Allow admin and moderator roles
    if (userRole !== "admin" && userRole !== "moderator") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ═══════════════════════════════════════════════════
  // Security Headers
  // ═══════════════════════════════════════════════════

  const response = NextResponse.next();

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  return response;
});

// ═══════════════════════════════════════════════════
// MATCHER CONFIGURATION
// ═══════════════════════════════════════════════════

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes (except auth)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public assets (images, etc.)
     */
    "/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
