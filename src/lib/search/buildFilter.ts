export function buildFilterBy(params: { state?: string | null }): string | undefined {
  const parts: string[] = [];
  if (params.state && params.state.trim()) {
    parts.push(`state:=${params.state.trim()}`);
  }
  return parts.length ? parts.join(" && ") : undefined;
}


