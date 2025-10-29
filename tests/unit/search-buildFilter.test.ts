import { describe, expect, it } from "vitest";
import { buildFilterBy } from "@/lib/search/buildFilter";

describe("buildFilterBy", () => {
  it("returns undefined when no filters", () => {
    expect(buildFilterBy({})).toBeUndefined();
  });
  it("builds state filter", () => {
    expect(buildFilterBy({ state: "TX" })).toBe("state:=TX");
  });
});


