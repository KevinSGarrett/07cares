import { authMiddleware } from "@clerk/nextjs";

/**
 * Allow unauthenticated access to health and any other public endpoints.
 * Add more public routes as your app requires.
 */
export default authMiddleware({
  publicRoutes: [
    "/api/health",
  ],
});

/**
 * Run for app routes, but skip Next internals and static assets.
 * This prevents middleware from running on _next/ and files with extensions.
 */
export const config = {
  matcher: [
    "/((?!_next/|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map)).*)",
  ],
};
