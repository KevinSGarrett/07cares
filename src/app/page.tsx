import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-10 space-y-6">
      <h1 className="text-3xl font-semibold">Fundraise Starter</h1>
      <p className="text-gray-600">Next.js + Stripe + Clerk + Prisma + more.</p>
      <div className="space-x-4">
        <Link href="/portal" className="rounded bg-black px-4 py-2 text-white">Portal</Link>
        <Link href="/c/example-campaign" className="rounded border px-4 py-2">Example campaign</Link>
        <Link href="/admin" className="rounded border px-4 py-2">Admin</Link>
      </div>
    </main>
  );
}
