import { World, colorAt, intersectWorld, shadeHit, isShadowed, reflectedColor } from "./world";
import { point, vector } from "./tuple";
import { PointLight } from "./light";
import { Color } from "./color";
import { Sphere } from "./sphere";
import { Ray } from "./ray";
import { Plane } from "./plane";
import { scaling, translation } from "./transformations";
import { Intersection, prepareComputations } from "./intersection";

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
      const expectedSphere1 = new Sphere();
      expectedSphere1.material.color = Color(0.8, 1, 0.6);
      expectedSphere1.material.diffuse = 0.7;
      expectedSphere1.material.specular = 0.2;
      const expectedSphere2 = new Sphere();
      expectedSphere2.setTransform(scaling(0.5, 0.5, 0.5));
      expect(w.lightSource.position).toEqualTuple(expectedLight.position);
      expect(w.lightSource.intensity).toEqualColor(expectedLight.intensity);
      expect(w.objects[0].getTransform()).toEqualMatrix(
        expectedSphere1.getTransform()
      );
      expect(w.objects[0].material.color).toEqualColor(
        expectedSphere1.material.color
      );
      expect(w.objects[0].material.ambient).toBe(
        expectedSphere1.material.ambient
      );
      expect(w.objects[0].material.diffuse).toBe(
        expectedSphere1.material.diffuse
      );
      expect(w.objects[0].material.specular).toBe(
        expectedSphere1.material.specular
      );
      expect(w.objects[0].material.shininess).toBe(
        expectedSphere1.material.shininess
      );
      expect(w.objects[1].getTransform()).toEqualMatrix(
        expectedSphere2.getTransform()
      );
      expect(w.objects[1].material.color).toEqualColor(
        expectedSphere2.material.color
      );
      expect(w.objects[1].material.ambient).toBe(
        expectedSphere2.material.ambient
      );
      expect(w.objects[1].material.diffuse).toBe(
        expectedSphere2.material.diffuse
      );
      expect(w.objects[1].material.specular).toBe(
        expectedSphere2.material.specular
      );
      expect(w.objects[1].material.shininess).toBe(
        expectedSphere2.material.shininess
      );
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

  describe("shadeHit", () => {
    it("should return the correct outside color", () => {
      const w = World.Default();
      const r = Ray(point(0, 0, -5), vector(0, 0, 1));
      const shape = w.objects[0];
      const is = Intersection(4, shape);
      const comps = prepareComputations(is, r);
      const expected = shadeHit(w, comps);
      expect(expected).toEqualColor(Color(0.38066, 0.47583, 0.2855));
    });

    it("should return the correct inside color", () => {
      const w = World.Default();
      w.lightSource = PointLight(point(0, 0.25, 0), Color(1, 1, 1));
      const r = Ray(point(0, 0, 0), vector(0, 0, 1));
      const shape = w.objects[1];
      const is = Intersection(0.5, shape);
      const comps = prepareComputations(is, r);
      const expected = shadeHit(w, comps);
      expect(expected).toEqualColor(Color(0.90498, 0.90498, 0.90498));
    });

    it("given an intersection in shadow should return the ambient color", () => {
      const w = World();
      w.lightSource = PointLight(point(0, 0, -10), Color(1, 1, 1));
      const s1 = new Sphere();
      const s2 = new Sphere();
      s2.setTransform(translation(0, 0, 10));
      w.objects.push(s1);
      w.objects.push(s2);
      const r = Ray(point(0, 0, 5), vector(0, 0, 1));
      const is = Intersection(4, s2);
      const comps = prepareComputations(is, r);
      const expected = shadeHit(w, comps);
      expect(expected).toEqualColor(Color(0.1, 0.1, 0.1));
    });

    it("should include reflective color of an object", () => {
      const w = World.Default();
      const shape = new Plane();
      shape.material.reflective = 0.5;
      shape.setTransform(translation(0, -1, 0));
      w.objects.push(shape);
      const r = Ray(point(0, 0, -3), vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
      const is = Intersection(Math.sqrt(2), shape);
      const comps = prepareComputations(is, r);
      const color = shadeHit(w, comps);
      expect(color).toEqualColor(Color(0.87675, 0.92434, 0.82917));
    });
  });

  describe("colorAt", () => {
    it("when ray missed should be black", () => {
      const w = World.Default();
      const r = Ray(point(0, 0, -5), vector(0, 1, 0));
      const expected = colorAt(w, r);
      expect(expected).toEqualColor(Color.Black);
    });

    it("should return material color when ray hits", () => {
      const w = World.Default();
      const r = Ray(point(0, 0, -5), vector(0, 0, 1));
      const expected = colorAt(w, r);
      expect(expected).toEqualColor(Color(0.38066, 0.47583, 0.2855));
    });

    it("should return inner material colro when intersection behind ray", () => {
      const w = World.Default();
      const outer = w.objects[0];
      outer.material.ambient = 1;
      const inner = w.objects[1];
      inner.material.ambient = 1;

      const r = Ray(point(0, 0, 0.75), vector(0, 0, -1));
      const expected = colorAt(w, r);
      expect(expected).toEqualColor(inner.material.color);
    });

    describe("with mutually reflective surfaces", () => {
      it("should terminate recursion", () => {
        const w = World();
        w.lightSource = PointLight(point(0, 0, 0), Color.White);
        const lower = new Plane();
        lower.material.reflective = 1;
        lower.setTransform(translation(0, -1, 0));
        w.objects.push(lower);

        const upper = new Plane();
        upper.material.reflective = 1;
        upper.setTransform(translation(0, 1, 0));
        w.objects.push(upper);

        const r = Ray(point(0, 0, 0), vector(0, 1, 0));
        expect(() => colorAt(w, r)).not.toThrow(RangeError);
      });
    });
  });

  describe("shadows", () => {
    it("should detect no shadow when nothing is collinear with point and light", () => {
      const w = World.Default();
      const p = point(0, 10, 0);
      expect(isShadowed(w, p)).not.toBeTruthy();
    });

    it("should detect shadow when object is between point and light", () => {
      const w = World.Default();
      const p = point(10, -10, 10);
      expect(isShadowed(w, p)).toBeTruthy();
    });

    it("should detect no shadow when object is behind the light", () => {
      const w = World.Default();
      const p = point(-20, 20, -20);
      expect(isShadowed(w, p)).not.toBeTruthy();
    });

    it("should detect no shadow when object is behind the point", () => {
      const w = World.Default();
      const p = point(-2, 2, -2);
      expect(isShadowed(w, p)).not.toBeTruthy();
    });
  });

  describe("reflection", () => {
    it("should calculate color from nonreflective surface", () => {
      const w = World.Default();
      const r = Ray(point(0, 0, 0), vector(0, 0, 1));
      const shape = w.objects[1];
      shape.material.ambient = 1;
      const is = Intersection(1, shape);
      const comps = prepareComputations(is, r);
      const color = reflectedColor(w, comps);
      expect(color).toEqualColor(Color.Black);
    });

    it("should calculate color from reflective surface", () => {
      const w = World.Default();
      const shape = new Plane();
      shape.material.reflective = 0.5;
      shape.setTransform(translation(0, -1, 0));
      w.objects.push(shape);
      const r = Ray(point(0, 0, -3), vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
      const is = Intersection(Math.sqrt(2), shape);
      const comps = prepareComputations(is, r);
      const color = reflectedColor(w, comps);
      expect(color).toEqualColor(Color(0.190332, 0.237915, 0.142749));
    });

    describe("at maximum recursive depth", () => {
      it("should return black", () => {
        const w = World.Default();
        const shape = new Plane();
        shape.material.reflective = 0.5;
        shape.setTransform(translation(0, -1, 0));
        w.objects.push(shape);
        const r = Ray(point(0, 0, -3), vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2));
        const is = Intersection(Math.sqrt(2), shape);
        const comps = prepareComputations(is, r);
        const color = reflectedColor(w, comps, 0);
        expect(color).toEqualColor(Color.Black);
      });
    });
  });
});
