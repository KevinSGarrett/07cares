import crypto from "crypto";

export async function POST() {
  const ts = Math.round(Date.now() / 1000).toString();
  const secret = process.env.CLOUDINARY_API_SECRET!;
  const signature = crypto.createHash("sha1").update(`timestamp=${ts}${secret}`).digest("hex");
  return new Response(JSON.stringify({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp: ts,
    signature,
  }), { headers: { "content-type": "application/json" } });
}
