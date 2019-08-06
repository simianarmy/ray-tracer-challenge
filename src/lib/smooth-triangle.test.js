import { SmoothTriangle } from "./smooth-triangle";
import { point, vector } from "./tuple";
import { Ray } from "./ray";
import { intersections, prepareComputations, Intersection } from "./intersection";

describe("SmoothTriangle", () => {
  function makeTriangle() {
    const p1 = point(0, 1, 0);
    const p2 = point(-1, 0, 0);
    const p3 = point(1, 0, 0);
    const n1 = vector(0, 1, 0);
    const n2 = vector(-1, 0, 0);
    const n3 = vector(1, 0, 0);
    return new SmoothTriangle(p1, p2, p3, n1, n2, n3);
  }

  it("should store constructor args", () => {
    const tri = makeTriangle();
    expect(tri.p1).toEqualPoint(point(0, 1, 0));
    expect(tri.n1).toEqualVector(vector(0, 1, 0));
  });

  it("should store u/v when intersecting", () => {
    const tri = makeTriangle();
    const r = Ray(point(-0.2, 0.3, -0.2), vector(0, 0, 1));
    const xs = tri.localIntersect(r);
    expect(xs[0].u).toEqualFloat(0.45);
    expect(xs[0].v).toEqualFloat(0.25);
  });

  it("should use uv to interpolate the normal", () => {
    const tri = makeTriangle();
    const i = Intersection(1, tri, {u: 0.45, v: 0.25});
    const n = tri.normalAt(point(0, 0, 0), i);
    expect(n).toEqualVector(vector(-0.5547, 0.83205, 0));
  });

  it("should prepare the normal with an intersection", () => {
    const tri = makeTriangle();
    const i = Intersection(1, tri, {u: 0.45, v: 0.25});
    const ray = Ray(point(-0.2, 0.3, -0.2), vector(0, 0, 1));
    const xs = intersections(i);
    const comps = prepareComputations(i, ray, xs);
    expect(comps.normalv).toEqualVector(vector(-0.5547, 0.83205, 0));
  });
});
