// src/middleware.ts
import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Local dev bypass:
 * If AUTH_BYPASS=true, do NOT run Clerk middleware at all.
 * Staging/prod: leave AUTH_BYPASS unset/false and Clerk will protect routes.
 */
const BYPASS = process.env.AUTH_BYPASS === "true";

// No-op for local bypass
const noop = () => NextResponse.next();

// Export handler: bypass locally, otherwise use Clerk on protected routes
export default BYPASS
  ? noop
  : clerkMiddleware({
      // Public routes that stay open even when Clerk is enabled
      publicRoutes: ["/api/health"],
    });

// MUST be a static literal for Next 16 to statically analyze
export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
