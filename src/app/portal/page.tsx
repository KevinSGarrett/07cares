// src/app/portal/page.tsx

export const dynamic = "force-dynamic";

export default async function Portal() {
  const BYPASS = process.env.AUTH_BYPASS === "true";

  if (BYPASS) {
    return (
      <div className="p-8">
        <h1 className="text-2xl">Welcome</h1>
        <p className="mt-2 text-sm opacity-70">
          (AUTH_BYPASS=true — Clerk disabled locally; showing stubbed portal view)
        </p>
      </div>
    );
  }

  const { currentUser } = await import("@clerk/nextjs/server");
  const user = await currentUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl">
        Welcome{user?.firstName ? `, ${user.firstName}` : ""}
      </h1>
      <p className="mt-2 text-sm opacity-70">You are signed in.</p>
    </div>
  );
}
