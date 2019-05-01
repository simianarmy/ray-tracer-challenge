import { Intersection, intersections, hit } from "./intersection";
import { Sphere } from "./sphere";

describe("Intersection", () => {
  it("should encapsulate t and an object", () => {
    const s = Sphere();
    const i = Intersection(3.5, s);
    expect(i.t).toBe(3.5);
    expect(i.object).toEqual(s);
  });
});

describe("intersections", () => {
  it("should aggregate intersections", () => {
    const s = Sphere();
    const i1 = Intersection(1, s);
    const i2 = Intersection(2, s);
    const xs = intersections(i1, i2);
    expect(xs.length).toBe(2);
    expect(xs[0].t).toBe(1);
    expect(xs[1].t).toBe(2);
  });
});

describe("hit", () => {
  describe("when all intersections have positive t", () => {
    it("should return closest visible intersection", () => {
      const s = Sphere();
      const i1 = Intersection(1, s);
      const i2 = Intersection(2, s);
      const xs = intersections(i1, i2);
      expect(hit(xs)).toEqual(i1);
    });
  });

  describe("when some intersections have negative t", () => {
    it("should return closest forward intersection", () => {
      const s = Sphere();
      const i1 = Intersection(-1, s);
      const i2 = Intersection(1, s);
      const xs = intersections(i1, i2);
      expect(hit(xs)).toEqual(i2);
    });
  });

  describe("when all intersections have negative t", () => {
    it("should return nothing", () => {
      const s = Sphere();
      const i1 = Intersection(-1, s);
      const i2 = Intersection(-2, s);
      const xs = intersections(i1, i2);
      expect(hit(xs)).not.toBeTruthy();
    });
  });

  it("is always the lowest nonnegative intersection", () => {
      const s = Sphere();
      const i1 = Intersection(5, s);
      const i2 = Intersection(7, s);
      const i3 = Intersection(-3, s);
      const i4 = Intersection(2, s);
      const xs = intersections(i1, i2, i3, i4);
      expect(hit(xs)).toEqual(i4);
  });
});
