import { perlin } from "./math";
import { point } from "./tuple";

describe("math", () => {
  it("perlin should generate noise value from 3d point", () => {
    const p = point(0.2, 0.3, 0.4);
    const res = perlin(p.x, p.y, p.z);
    expect(Math.abs(res) < 1);
    expect(Math.abs(res) > 0);
  });

  it("perlin should generate same noise for the same point", () => {
    const p = point(0.2, 0.3, 0.4);
    const res1 = perlin(p.x, p.y, p.z);
    const res2 = perlin(p.x, p.y, p.z);
    expect(res1).toEqual(res2);
  });

  it("should generate non-zero noise for all points", () => {
    const p = point(0.0, 1.0, 1.0);
    const res = perlin(p.x, p.y, p.z);
    expect(res).not.toEqual(0);
  });
});

