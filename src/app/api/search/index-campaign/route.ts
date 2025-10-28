import { typesense } from "@/lib/typesense";
import { prisma } from "@/server/db";

export async function POST() {
  const campaigns = await prisma.campaign.findMany({ take: 100 });
  const collection = "campaigns";
  try { await typesense.collections(collection).retrieve(); }
  catch {
    await typesense.collections().create({
      name: collection,
      fields: [
        { name: "id", type: "string" },
        { name: "title", type: "string" },
        { name: "city", type: "string" },
        { name: "state", type: "string", facet: true },
        { name: "isAon", type: "bool", facet: true },
      ],
      default_sorting_field: "id",
    });
  }
  const docs = (campaigns as any[]).map((c: any) => ({ id: c.id, title: c.title, city: c.city, state: c.state, isAon: (c as any).isAon }));
  await typesense.collections(collection).documents().import(docs, { action: "upsert" });
  return new Response("ok");
}




