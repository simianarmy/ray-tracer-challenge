import { perlin } from "./math";
import { point } from "./tuple";
import { Noise } from "noisejs";

describe("math", () => {
  describe("Perlin noise", () => {
    it("should generate noise value from 3d point", () => {
      const p = point(0.2, 0.3, 0.4);
      const res = perlin(p.x, p.y, p.z);
      //console.log("perlin", res);
      expect(Math.abs(res) < 1);
      expect(Math.abs(res) > 0);
    });

    it("should generate same noise for the same point", () => {
      const p = point(1, 1, 0.4);
      const res1 = perlin(p.x, p.y, p.z);
      const res2 = perlin(p.x, p.y, p.z);
      //console.log("perlin", res1);
      expect(res1).toEqual(res2);
    });

    it("should generate non-zero noise for all points", () => {
      const p = point(255.1, 255.1, 254.2);
      const res = perlin(p.x, p.y, p.z);
      //console.log("perlin", res);
      expect(res).not.toEqual(0);
    });
  });
});

