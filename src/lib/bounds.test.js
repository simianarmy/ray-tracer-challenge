import { Bounds } from "./bounds";

describe("Bounds", () => {
  it("should have min and max coordinates", () => {
    const bounds = Bounds();
    expect(bounds.min).toBeTruthy();
    expect(bounds.max).toBeTruthy();
  });
});
