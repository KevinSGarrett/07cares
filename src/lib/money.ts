export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function formatUSD(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
    .format(cents / 100);
}
