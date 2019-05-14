import { Material, lighting } from "./material";
import { Color } from "./color";
import { point, vector } from "./tuple";
import { PointLight } from "./light";
import { Stripe } from "./pattern";
import { Sphere } from "./sphere";

describe("Material", () => {
  it("should have default values", () => {
    const m = Material();
    expect(m.color).toEqualColor(Color(1, 1, 1));
    expect(m.ambient).toBe(0.1);
    expect(m.diffuse).toBe(0.9);
    expect(m.specular).toBe(0.9);
    expect(m.shininess).toBe(200);
  });

  describe("lighting", () => {
    let m, object, position;

    beforeEach(() => {
      m = Material();
      object = new Sphere();
      position = point(0, 0, 0);
    });

    it("with eye b/w light and surface should have color 1.9", () => {
      const eyev = vector(0, 0, -1);
      const normalv = vector(0, 0, -1);
      const light = PointLight(point(0, 0, -10), Color(1, 1, 1));
      const result = lighting(m, object, light, position, eyev, normalv);
      const color = 1.9;
      expect(result).toEqualColor(Color(color, color, color));
    });

    it("with eye b/w light and surface, eye offset 45 deg should have color 1.0", () => {
      const eyev = vector(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
      const normalv = vector(0, 0, -1);
      const light = PointLight(point(0, 0, -10), Color(1, 1, 1));
      const result = lighting(m, object, light, position, eyev, normalv);
      const color = 1.0;
      expect(result).toEqualColor(Color(color, color, color));
    });

    it("with eye opposite surface, light offset 45°", () => {
      const eyev = vector(0, 0, -1);
      const normalv = vector(0, 0, -1);
      const light = PointLight(point(0, 10, -10), Color(1, 1, 1));
      const result = lighting(m, object, light, position, eyev, normalv);
      const color = 0.7364;
      expect(result).toEqualColor(Color(color, color, color));
    });

    it("with eye in the path of the reflection vector", () => {
      const eyev = vector(0, -Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
      const normalv = vector(0, 0, -1);
      const light = PointLight(point(0, 10, -10), Color(1, 1, 1));
      const result = lighting(m, object, light, position, eyev, normalv);
      const color = 1.6364;
      expect(result).toEqualColor(Color(color, color, color));
    });

    it("with light behind the surface", () => {
      const eyev = vector(0, 0, -1);
      const normalv = vector(0, 0, -1);
      const light = PointLight(point(0, 0, 10), Color(1, 1, 1));
      const result = lighting(m, object, light, position, eyev, normalv);
      const color = 0.1;
      expect(result).toEqualColor(Color(color, color, color));
    });

    it("with the surface in shadow", () => {
      const eyev = vector(0, 0, -1);
      const normalv = vector(0, 0, -1);
      const light = PointLight(point(0, 0, -10), Color(1, 1, 1));
      const inShadow = true;
      const result = lighting(
        m,
        object,
        light,
        position,
        eyev,
        normalv,
        inShadow
      );
      const color = 0.1;
      expect(result).toEqualColor(Color(color, color, color));
    });

    describe("with pattern applied", () => {
      it("should use pattern colors", () => {
        m.pattern = new Stripe(Color.White, Color.Black);
        m.ambient = 1;
        m.diffuse = 0;
        m.specular = 0;
        const eyev = vector(0, 0, -1);
        const normalv = vector(0, 0, -1);
        const light = PointLight(point(0, 0, -10), Color(1, 1, 1));
        const c1 = lighting(
          m,
          object,
          light,
          point(0.9, 0, 0),
          eyev,
          normalv,
          false
        );
        const c2 = lighting(
          m,
          object,
          light,
          point(1.1, 0, 0),
          eyev,
          normalv,
          false
        );
        expect(c1).toEqualColor(Color.White);
        expect(c2).toEqualColor(Color.Black);
      });
    });
  });
});
