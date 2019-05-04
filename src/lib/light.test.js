import { PointLight } from "./light";
import { point } from "./tuple";
import { Color } from "./color";

describe("Lights", () => {
  describe("point light", () => {
    it("should have position and intensity", () => {
      const intensity = Color(1, 1, 1);
      const position = point(0, 0, 0);
      const pointLight = PointLight(position, intensity);
      expect(pointLight.position).toEqualPoint(position);
      expect(pointLight.intensity).toEqualColor(intensity);
    });
  });
});
