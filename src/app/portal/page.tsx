// src/app/portal/page.tsx
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function Portal() {
  // Default to stub if Clerk isn’t fully configured
  const BYPASS = process.env.AUTH_BYPASS !== "false"; // default true if unset
  if (BYPASS) {
    return (
      <div className="p-8">
        <h1 className="text-2xl">Welcome</h1>
        <p className="mt-2 text-sm opacity-70">(Bypass/stub view)</p>
      </div>
    );
  }

  try {
    const { currentUser } = await import("@clerk/nextjs/server");
    const user = await currentUser();
    return (
      <div className="p-8">
        <h1 className="text-2xl">Welcome{user?.firstName ? `, ${user.firstName}` : ""}</h1>
        <p className="mt-2 text-sm opacity-70">You are signed in.</p>
      </div>
    );
  } catch {
    return (
      <div className="p-8">
        <h1 className="text-2xl">Welcome</h1>
        <p className="mt-2 text-sm opacity-70">(Clerk not available; showing stub)</p>
      </div>
    );
  }
}
