import {
  Intersection,
  intersections,
  hit,
  prepareComputations
} from "./intersection";
import { Sphere } from "./sphere";
import { Plane } from "./plane";
import { Ray } from "./ray";
import { point, vector } from "./tuple";
import { scaling, translation } from "./transformations";
import { EPSILON } from "./math";

describe("Intersection", () => {
  it("should encapsulate t and an object", () => {
    const s = new Sphere();
    const i = Intersection(3.5, s);
    expect(i.t).toBe(3.5);
    expect(i.object).toEqual(s);
  });
});

describe("intersections", () => {
  it("should aggregate intersections", () => {
    const s = new Sphere();
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
      const s = new Sphere();
      const i1 = Intersection(1, s);
      const i2 = Intersection(2, s);
      const xs = intersections(i1, i2);
      expect(hit(xs)).toEqual(i1);
    });
  });

  describe("when some intersections have negative t", () => {
    it("should return closest forward intersection", () => {
      const s = new Sphere();
      const i1 = Intersection(-1, s);
      const i2 = Intersection(1, s);
      const xs = intersections(i1, i2);
      expect(hit(xs)).toEqual(i2);
    });
  });

  describe("when all intersections have negative t", () => {
    it("should return nothing", () => {
      const s = new Sphere();
      const i1 = Intersection(-1, s);
      const i2 = Intersection(-2, s);
      const xs = intersections(i1, i2);
      expect(hit(xs)).not.toBeTruthy();
    });
  });

  it("is always the lowest nonnegative intersection", () => {
    const s = new Sphere();
    const i1 = Intersection(5, s);
    const i2 = Intersection(7, s);
    const i3 = Intersection(-3, s);
    const i4 = Intersection(2, s);
    const xs = intersections(i1, i2, i3, i4);
    expect(hit(xs)).toEqual(i4);
  });

  describe("precomputing the state of", () => {
    it("should return precomputed values", () => {
      const r = Ray(point(0, 0, -5), vector(0, 0, 1));
      const shape = new Sphere();
      const is = Intersection(4, shape);
      const comps = prepareComputations(is, r);
      expect(comps.t).toBe(is.t);
      expect(comps.object).toEqual(is.object);
      expect(comps.point).toEqualPoint(point(0, 0, -1));
      expect(comps.eyev).toEqualVector(vector(0, 0, -1));
      expect(comps.normalv).toEqualVector(vector(0, 0, -1));
    });

    it("should set inside property to false when hit intersection occurs on outside", () => {
      const r = Ray(point(0, 0, -5), vector(0, 0, 1));
      const shape = new Sphere();
      const is = Intersection(4, shape);
      const comps = prepareComputations(is, r);
      expect(comps.inside).not.toBeTruthy();
    });

    it("should set inside property to true when hit intersection occurs on inside", () => {
      const r = Ray(point(0, 0, 0), vector(0, 0, 1));
      const shape = new Sphere();
      const is = Intersection(1, shape);
      const comps = prepareComputations(is, r);
      expect(comps.point).toEqualPoint(point(0, 0, 1));
      expect(comps.eyev).toEqualVector(vector(0, 0, -1));
      expect(comps.inside).toBeTruthy();
      expect(comps.normalv).toEqualVector(vector(0, 0, -1));
    });

    it("hit should offset the point", () => {
      const r = Ray(point(0, 0, -5), vector(0, 0, 1));
      const shape = new Sphere();
      shape.setTransform(translation(0, 0, 1));
      const is = Intersection(5, shape);
      const comps = prepareComputations(is, r);
      expect(comps.overPoint.z).toBeLessThan(-Number.EPSILON / 2);
      expect(comps.point.z).toBeGreaterThan(comps.overPoint.z);
    });

    it("precomputes the reflection vector", () => {
      const angle = Math.sqrt(2) / 2;
      const plane = new Plane();
      const r = Ray(point(0, 1, -1), vector(0, -angle, angle));
      const is = Intersection(Math.sqrt(2), plane);
      const comps = prepareComputations(is, r);
      expect(comps.reflectv).toEqualVector(vector(0, angle, angle));
    });

    it("should calculate n1 and n2 for transparent objects", () => {
      const A = Sphere.Glass();
      A.setTransform(scaling(2, 2, 2));

      const B = Sphere.Glass();
      B.setTransform(translation(0, 0, -0.25));
      B.material.refractiveIndex = 2;

      const C = Sphere.Glass();
      C.setTransform(translation(0, 0, 0.25));
      C.material.refractiveIndex = 2.5;
      const r = Ray(point(0, 0, -4), vector(0, 0, 1));
      const xs = intersections(
        { t: 2, object: A },
        { t: 2.75, object: B },
        { t: 3.25, object: C },
        { t: 4.75, object: B },
        { t: 5.25, object: C },
        { t: 6, object: A }
      );
      const expects = [
        [1.0, 1.5],
        [1.5, 2.0],
        [2.0, 2.5],
        [2.5, 2.5],
        [2.5, 1.5],
        [1.5, 1.0]
      ];
      expects.forEach((ex, i) => {
        //console.log("===> testing index", i, xs[i].t, ex);
        const comps = prepareComputations(xs[i], r, xs);
        //console.log("comps", comps.n1, comps.n2);
        expect(comps.n1).toEqual(ex[0]);
        expect(comps.n2).toEqual(ex[1]);
      });
    });

    it("should set under point offset below the surface", () => {
      const r = Ray(point(0, 0, -5), vector(0, 0, 1));
      const shape = Sphere.Glass();
      shape.setTransform(translation(0, 0, 1));
      const is = Intersection(5, shape);
      const xs = intersections(is);
      const comps = prepareComputations(is, r, xs);
      expect(comps.underPoint.z).toBeGreaterThan(EPSILON / 2);
      expect(comps.point.z).toBeLessThan(comps.underPoint.z);
    });
  });
});
