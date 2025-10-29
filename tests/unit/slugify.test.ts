import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/slugify";

describe("slugify", () => {
  it("lowercases and replaces spaces with dashes", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  it("removes non-alphanumeric characters", () => {
    expect(slugify("Café & Tea!"))
      .toBe("caf-tea");
  });
  it("collapses multiple dashes", () => {
    expect(slugify("A   B   C"))
      .toBe("a-b-c");
  });
});


