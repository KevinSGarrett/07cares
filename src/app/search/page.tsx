export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getTypesense } from "@/lib/typesense";
import { buildFilterBy } from "@/lib/search/buildFilter";

export default async function SearchPage({
  searchParams,
}: {
  // Next 16 note: in this repo we used Promise for params elsewhere; mirror pattern
  searchParams: Promise<{ q?: string; state?: string }>;
}) {
  const { q = "", state } = await searchParams;
  const ts = getTypesense();
  let results: Array<{ id: string; title: string; city: string; state: string; slug?: string }> = [];

  if (ts && q.trim()) {
    try {
      const filter_by = buildFilterBy({ state });
      const r = await (ts as any)
        .collections("campaigns")
        .documents()
        .search({ q, query_by: "title,city,state", per_page: 20, filter_by });
      results = (r?.hits || []).map((h: any) => h.document);
    } catch {
      // swallow to keep page rendering
    }
  }

  return (
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1 className="text-2xl font-semibold">Search</h1>
      <form method="get" style={{ display: "grid", gridTemplateColumns: "1fr 160px 120px", gap: 8, maxWidth: 720 }}>
        <input
          name="q"
          placeholder="Search campaigns"
          defaultValue={q}
          className="border p-2 rounded"
        />
        <select name="state" defaultValue={state || ""} className="border p-2 rounded">
          <option value="">All states</option>
          <option value="TX">TX</option>
          <option value="CA">CA</option>
          <option value="NY">NY</option>
        </select>
        <button className="rounded bg-black text-white px-4">Search</button>
      </form>

      {q && (
        <div>
          <p className="text-sm opacity-70">Showing results for “{q}” {state ? `(state: ${state})` : ""}</p>
          <ul style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {results.map((r) => (
              <li key={r.id} className="border rounded p-3">
                <a className="underline" href={`/c/${encodeURIComponent(r.slug || r.id)}`}>
                  {r.title}
                </a>
                <div className="text-sm opacity-70">{r.city}, {r.state}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}


