import { describe, expect, it } from "vitest";
import { joinClassNames } from "./class-names";

describe("joinClassNames", () => {
  it("joins truthy class names and removes empty values", () => {
    expect(joinClassNames("base", false, undefined, "active", null)).toBe(
      "base active"
    );
  });
});
