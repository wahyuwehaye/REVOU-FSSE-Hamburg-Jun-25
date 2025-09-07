import { capitalize } from "@utils/string";

describe("capitalize", () => {
  it("uppercases first letter", () => {
    expect(capitalize("wahyu")).toBe("Wahyu");        // toBe
  });
  it("handles empty", () => {
    expect(capitalize("")).toBe("");
  });
});
