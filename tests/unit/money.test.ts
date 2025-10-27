import { describe, it, expect } from "vitest";
import { toCents, formatUSD } from "@/lib/money";

describe("money utils", () => {
  it("converts dollars to cents", () => {
    expect(toCents(12.34)).toBe(1234);
  });
  it("formats USD correctly", () => {
    expect(formatUSD(1234)).toMatch(/\$12\.34/);
  });
});
