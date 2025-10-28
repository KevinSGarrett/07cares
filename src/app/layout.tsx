// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "07.Cares",
  description: "Crowdfunding for good",
};

// Only load ClerkProvider when we're NOT bypassing auth
const usingClerk =
  process.env.AUTH_BYPASS !== "true" &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (usingClerk) {
    // Import at runtime to avoid bundling Clerk when bypassing
    const { ClerkProvider } = require("@clerk/nextjs");
    return (
      <ClerkProvider>
        <html lang="en">
          <body>{children}</body>
        </html>
      </ClerkProvider>
    );
  }

  return (
    <html lang="en">
      <body>
        {/* Dev banner so you can see bypass is on */}
        {process.env.AUTH_BYPASS === "true" ? (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              background: "#fde68a",
              color: "#111",
              padding: "6px 10px",
              fontSize: 12,
              zIndex: 9999,
              textAlign: "center",
              borderBottom: "1px solid #f59e0b",
            }}
          >
            AUTH BYPASS ON — local dev only
          </div>
        ) : null}
        {children}
      </body>
    </html>
  );
}
