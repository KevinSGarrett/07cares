"use client";

import { useState } from "react";

type CreatedCampaign = { id: string; slug: string; status: string };

export default function NewCampaignPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [created, setCreated] = useState<CreatedCampaign | null>(null);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  async function createCampaign(formData: FormData) {
    setBusy(true);
    setError("");
    try {
      const payload = {
        title: String(formData.get("title") || ""),
        city: String(formData.get("city") || ""),
        state: String(formData.get("state") || ""),
        goalDollars: Number(formData.get("goalDollars") || 0),
        startDate: String(formData.get("startDate") || ""),
        endDate: String(formData.get("endDate") || ""),
      };
      const res = await fetch("/api/campaign/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error("Failed to create campaign");
      setCreated(json.campaign);
      setStep(2);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function uploadCover(file: File) {
    if (!created) return;
    setBusy(true);
    setError("");
    try {
      const sigRes = await fetch("/api/cloudinary/sign", { method: "POST" });
      const sig = await sigRes.json();
      const fd = new FormData();
      fd.set("file", file);
      fd.set("api_key", sig.apiKey);
      fd.set("timestamp", sig.timestamp);
      fd.set("signature", sig.signature);
      fd.set("folder", "campaign_covers");
      const upRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
        { method: "POST", body: fd }
      );
      const upJson = await upRes.json();
      if (!upRes.ok) throw new Error(upJson.error?.message || "Upload failed");
      const url = String(upJson.secure_url || upJson.url);

      const upd = await fetch(`/api/campaign/${created.id}/update`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ coverUrl: url }),
      });
      const updJson = await upd.json();
      if (!upd.ok || !updJson.ok) throw new Error("Failed to save cover");
      setCoverUrl(url);
    } catch (e: any) {
      setError(e.message || "Upload error");
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!created) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/campaign/${created.id}/publish`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Publish failed");
      setCreated(json.campaign);
    } catch (e: any) {
      setError(e.message || "Publish error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1 className="text-2xl font-semibold">Create a Campaign</h1>

      {error ? (
        <p style={{ color: "#b91c1c", marginTop: 8 }}>{error}</p>
      ) : null}

      {step === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createCampaign(new FormData(e.currentTarget));
          }}
          style={{ marginTop: 16, display: "grid", gap: 12, maxWidth: 560 }}
        >
          <label style={{ display: "grid", gap: 4 }}>
            <span>Title</span>
            <input name="title" required className="border p-2 rounded" />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 4 }}>
              <span>City</span>
              <input name="city" required className="border p-2 rounded" />
            </label>
            <label style={{ display: "grid", gap: 4 }}>
              <span>State</span>
              <input name="state" required className="border p-2 rounded" />
            </label>
          </div>

          <label style={{ display: "grid", gap: 4 }}>
            <span>Goal (USD)</span>
            <input
              name="goalDollars"
              type="number"
              min={1}
              step="0.01"
              required
              className="border p-2 rounded"
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "grid", gap: 4 }}>
              <span>Start Date</span>
              <input name="startDate" type="date" required className="border p-2 rounded" />
            </label>
            <label style={{ display: "grid", gap: 4 }}>
              <span>End Date</span>
              <input name="endDate" type="date" required className="border p-2 rounded" />
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              disabled={busy}
              type="submit"
              className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </form>
      )}

      {step === 2 && created && (
        <div style={{ marginTop: 16, display: "grid", gap: 16, maxWidth: 720 }}>
          <div>
            <h2 className="text-xl font-medium">Cover Image</h2>
            <p className="text-sm opacity-70">Upload a wide image for the campaign header.</p>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadCover(file);
                }}
              />
              {coverUrl ? (
                <img src={coverUrl} alt="Cover" style={{ height: 56, borderRadius: 8 }} />
              ) : null}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              disabled={busy}
              className="rounded border px-4 py-2 disabled:opacity-50"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              type="button"
              disabled={busy || !coverUrl}
              className="rounded bg-emerald-600 text-white px-4 py-2 disabled:opacity-50"
              onClick={publish}
            >
              {busy ? "Publishing..." : "Publish"}
            </button>
          </div>

          {created.status === "live" && (
            <div className="mt-4">
              <a
                className="text-blue-600 underline"
                href={`/c/${created.slug}`}
              >
                View campaign →
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}


