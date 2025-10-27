import Typesense from "typesense";

export const typesense = new Typesense.Client({
  nodes: [{
    host: process.env.TYPESENSE_HOST!,
    port: Number(process.env.TYPESENSE_PORT || 443),
    protocol: (process.env.TYPESENSE_PROTOCOL || "https") as "http" | "https",
  }],
  apiKey: process.env.TYPESENSE_API_KEY!,
  connectionTimeoutSeconds: 5,
});
