import { Camera, rayForPixel, render } from "./camera";
import { Color } from "./color";
import { ColorCanvas } from "./color-canvas";
import { Matrix, multiply } from "./matrix";
import { point, vector } from "./tuple";
import { rotationY, translation, viewTransform } from "./transformations";
import { World, colorAt } from "./world";

describe("Camera", () => {
  it("constructor should create properties from args", () => {
    const hsize = 160;
    const vsize = 120;
    const fov = Math.PI / 2;
    const c = Camera(hsize, vsize, fov);
    expect(c.hsize).toBe(hsize);
    expect(c.vsize).toBe(vsize);
    expect(c.fov).toBe(fov);
    expect(c.transform).toEqualMatrix(Matrix.identity);
  });

  it("should calculate pixel size for a horizontal canvas", () => {
    const c = Camera(200, 125, Math.PI / 2);
    expect(c.pixelSize).toEqualFloat(0.01);
  });

  it("should calculate pixel size for a vertical canvas", () => {
    const c = Camera(125, 200, Math.PI / 2);
    expect(c.pixelSize).toEqualFloat(0.01);
  });

  describe("rayForPixel", () => {
    it("should construct ray through center of canvas", () => {
      const c = Camera(201, 101, Math.PI / 2);
      const r = rayForPixel(c, 100, 50);
      expect(r.origin).toEqualPoint(point(0, 0, 0));
      expect(r.direction).toEqualVector(vector(0, 0, -1));
    });

    it("should construct ray through corner of canvas", () => {
      const c = Camera(201, 101, Math.PI / 2);
      const r = rayForPixel(c, 0, 0);
      expect(r.origin).toEqualPoint(point(0, 0, 0));
      expect(r.direction).toEqualVector(vector(0.66519, 0.33259, -0.66851));
    });

    it("should construct ray when camera is transformed", () => {
      const c = Camera(201, 101, Math.PI / 2);
      c.transform = multiply(rotationY(Math.PI / 4), translation(0, -2, 5));
      const r = rayForPixel(c, 100, 50);
      expect(r.origin).toEqualPoint(point(0, 2, -5));
      expect(r.direction).toEqualVector(vector(Math.sqrt(2) / 2, 0, -Math.sqrt(2) / 2));
    });
  });

  describe("render", () => {
    it("should render default world", () => {
      const w = World.Default();
      const c = Camera(11, 11, Math.PI / 2);
      const from = point(0, 0, -5);
      const to = point(0, 0, 0);
      const up = vector(0, 1, 0);
      c.transform = viewTransform(from, to, up);
      const image = render(c, w);
      expect(image.getPixel(5, 5)).toEqualColor(Color(0.38066, 0.47583, 0.2855));
    });
  });
});
