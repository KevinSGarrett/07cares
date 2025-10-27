import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtected = createRouteMatcher(["/portal(.*)", "/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtected(req)) auth().protect();
});

export const config = { matcher: ["/((?!_next|static|.*\\..*|api/public).*)", "/"] };
