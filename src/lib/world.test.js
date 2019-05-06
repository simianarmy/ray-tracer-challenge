import { World, intersectWorld } from "./world";
import { point, vector } from "./tuple";
import { PointLight } from "./light";
import { Color } from "./color";
import { Sphere } from "./sphere";
import { Ray } from "./ray";
import { scaling } from "./transformations";

describe("World", () => {
  it("constructor with no arguments yields no objects or lights", () => {
    const w = World();
    expect(w.objects.length).toBe(0);
    expect(w.lightSource).toBeNull();
  });

  describe("default world", () => {
    it("contains default light source and concentric spheres", () => {
      const w = World.Default();
      const expectedLight = PointLight(point(-10, 10, -10), Color(1, 1, 1));
      const expectedSphere1 = Sphere();
      expectedSphere1.material.color = Color(0.8, 1, 0.6);
      expectedSphere1.material.diffuse = 0.7;
      expectedSphere1.material.specular = 0.2;
      const expectedSphere2 = Sphere();
      expectedSphere2.setTransform(scaling(0.5, 0.5, 0.5));
      expect(w.lightSource.position).toEqualTuple(expectedLight.position);
      expect(w.lightSource.intensity).toEqualColor(expectedLight.intensity);
      expect(w.objects[0].getTransform()).toEqualMatrix(expectedSphere1.getTransform());
      expect(w.objects[0].material.color).toEqualColor(expectedSphere1.material.color);
      expect(w.objects[0].material.ambient).toBe(expectedSphere1.material.ambient);
      expect(w.objects[0].material.diffuse).toBe(expectedSphere1.material.diffuse);
      expect(w.objects[0].material.specular).toBe(expectedSphere1.material.specular);
      expect(w.objects[0].material.shininess).toBe(expectedSphere1.material.shininess);
      expect(w.objects[1].getTransform()).toEqualMatrix(expectedSphere2.getTransform());
      expect(w.objects[1].material.color).toEqualColor(expectedSphere2.material.color);
      expect(w.objects[1].material.ambient).toBe(expectedSphere2.material.ambient);
      expect(w.objects[1].material.diffuse).toBe(expectedSphere2.material.diffuse);
      expect(w.objects[1].material.specular).toBe(expectedSphere2.material.specular);
      expect(w.objects[1].material.shininess).toBe(expectedSphere2.material.shininess);
    });
  });

  describe("intersectWorld", () => {
    it("default world with ray from origin yields 4 intersections", () => {
      const w = World.Default();
      const r = Ray(point(0, 0, -5), vector(0, 0, 1));
      const xs = intersectWorld(w, r);
      expect(xs.length).toBe(4);
      expect(xs[0].t).toBe(4);
      expect(xs[1].t).toBe(4.5);
      expect(xs[2].t).toBe(5.5);
      expect(xs[3].t).toBe(6);
    });
  });
});
