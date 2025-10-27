export function toCents(amount: number): number {
  if (!Number.isFinite(amount)) throw new Error("Invalid amount");
  return Math.round(amount * 100);
}

export function formatUSD(cents: number): string {
  const dollars = cents / 100;
  return dollars.toLocaleString(undefined, { style: "currency", currency: "USD" });
}
