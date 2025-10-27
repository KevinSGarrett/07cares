import "./globals.css";
// (local) ClerkProvider disabled
import { GBProvider } from "@/lib/growthbook";

export const metadata = {
  title: "Fundraise",
  description: "Campaigns & donations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>{/* local: disabled */}
      <html lang="en">
        <body className="min-h-screen bg-white">
          <GBProvider>{children}</GBProvider>
        
        {process.env.AUTH_BYPASS === "true" ? (
          <div style={{position:"fixed",top:0,left:0,right:0,background:"#fde68a",color:"#111",padding:"6px 10px",fontSize:12,zIndex:9999,textAlign:"center",borderBottom:"1px solid #f59e0b"}}>
            AUTH BYPASS ON — local dev only
          </div>
        ) : null}
        </body>
      </html>
    </>
  );
}

