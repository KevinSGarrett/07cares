import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!_next/|.*\\..*).*)"],
};

export default function middleware(_req: NextRequest) {
  return;
}
