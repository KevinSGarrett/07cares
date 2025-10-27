"use client";

import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";

const gb = new GrowthBook({
  apiHost: process.env.GROWTHBOOK_API_HOST,
  clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
  enableDevMode: process.env.NODE_ENV !== "production",
});

export function GBProvider({ children }: { children: React.ReactNode }) {
  return <GrowthBookProvider growthbook={gb}>{children}</GrowthBookProvider>;
}
