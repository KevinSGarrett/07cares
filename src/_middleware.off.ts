/** src/middleware.ts */
import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Default to BYPASS. Only run Clerk if you explicitly set AUTH_BYPASS=false.
 * This avoids 500s when runtime env doesn?t surface AUTH_BYPASS.
 */
const BYPASS = process.env.AUTH_BYPASS !== "false";

const noop = () => NextResponse.next();

// When BYPASS=true (default), no auth middleware is applied.
export default BYPASS ? noop : clerkMiddleware();

// Static matcher required by Next 16
export const config = {
  matcher: ["/portal(.*)", "/admin(.*)"],
};
