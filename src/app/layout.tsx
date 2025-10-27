import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { GBProvider } from "@/lib/growthbook";

export const metadata = {
  title: "Fundraise",
  description: "Campaigns & donations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-white">
          <GBProvider>{children}</GBProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
