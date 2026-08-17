import { describe, expect, it } from "vitest";
import { strip } from "../../src/lib/strip";

describe("strip", () => {
  it("removes niqqud so vocalized and plain forms compare equal", () => {
    expect(strip("רָהוּט")).toBe(strip("רהוט"));
  });

  it("removes geresh/gershayim and collapses whitespace", () => {
    expect(strip("עזות  מצח")).toBe("עזות מצח");
  });

  it("handles empty/undefined input", () => {
    expect(strip(undefined)).toBe("");
    expect(strip("")).toBe("");
  });
});
