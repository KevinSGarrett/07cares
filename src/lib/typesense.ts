import Typesense from "typesense";

/** Return a Typesense client or null if env vars are incomplete */
export function getTypesense() {
  const host = process.env.TYPESENSE_HOST || "localhost";
  const port = Number(process.env.TYPESENSE_PORT || "8108");
  const protocol = process.env.TYPESENSE_PROTOCOL || "http";
  const apiKey = process.env.TYPESENSE_API_KEY;

  if (!apiKey || !host || !protocol || !port) return null; // safe no-op

  return new (Typesense as any).Client({
    nodes: [{ host, port, protocol }],
    apiKey,
    connectionTimeoutSeconds: 8,
  });
}
