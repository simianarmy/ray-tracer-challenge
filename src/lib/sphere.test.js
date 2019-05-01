import { Sphere } from "./sphere";
import { point, vector } from "./tuple";
import { Ray, intersect } from "./ray";

describe("Sphere", () => {
  it("intersect should set the object on the intersection", () => {
    const r = Ray(point(0, 0, -5), vector(0, 0, 1));
    const s = Sphere();
    const xs = intersect(s, r);
    expect(xs.length).toBe(2);
    expect(xs[0].object).toBe(s);
    expect(xs[1].object).toBe(s);
  });
});
