/** src/app/layout.tsx */
export const dynamic = "force-dynamic";

import type { ReactNode } from "react";

// Toggle BYPASS via env (default = bypass)
// If AUTH_BYPASS is NOT "false", we do NOT run Clerk at all.
const RAW = (process.env.AUTH_BYPASS ?? "").trim().toLowerCase();
const RUNS_WITH_CLERK = RAW === "false";

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Minimal <html> & <body> shell so we always render something
  // Even if we decide not to mount Clerk below.
  // (ClerkProvider should wrap the subtree only when RUNS_WITH_CLERK)
  if (!RUNS_WITH_CLERK) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  // Only load Clerk on demand to avoid runtime import errors
  try {
    const { ClerkProvider } = await import("@clerk/nextjs");
    return (
      <html lang="en">
        <body>
          <ClerkProvider>{children}</ClerkProvider>
        </body>
      </html>
    );
  } catch {
    // If Clerk fails to load (missing keys, etc.), fall back gracefully
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }
}
