"use client";

import { useMemo, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function CheckoutForm({ campaignId }: { campaignId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState<number>(25);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setMessage("");
    try {
      const cents = Math.round(amount * 100);
      const res = await fetch("/api/donate/create-intent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: cents, campaignId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to create intent");
      const clientSecret = json.clientSecret as string;

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {},
        redirect: "if_required",
      });
      if (error) {
        setMessage(error.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        setMessage("Thank you! Your donation was successful.");
      } else {
        setMessage("Payment status: " + (paymentIntent?.status ?? "unknown"));
      }
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
      <label style={{ display: "grid", gap: 4 }}>
        <span>Amount (USD)</span>
        <input
          type="number"
          min={1}
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border p-2 rounded"
        />
      </label>
      <PaymentElement options={{ layout: "tabs" }} />
      <button
        type="submit"
        disabled={!stripe || busy}
        className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        {busy ? "Processing..." : "Donate"}
      </button>
      {message && <p className="text-sm" style={{ color: "#065f46" }}>{message}</p>}
    </form>
  );
}

export function DonateWidget({ campaignId }: { campaignId: string }) {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);
  return (
    <Elements stripe={stripePromise} options={{ appearance: { theme: "stripe" } }}>
      <CheckoutForm campaignId={campaignId} />
    </Elements>
  );
}


