import { Matrix, inverse, multiplyTuple } from "./matrix";
import { Ray } from "./ray";
import { point, normalize, sub } from "./tuple";

export const Camera = (hsize, vsize, fov, transform = Matrix.identity) => {
  const halfView = Math.tan(fov / 2);
  const aspect = hsize / vsize;
  let halfWidth, halfHeight;

  if (aspect >= 1) {
    halfWidth = halfView;
    halfHeight = halfView / aspect;
  } else {
    halfWidth = halfView * aspect;
    halfHeight = halfView;
  }

  const pixelSize = (halfWidth * 2) / hsize;

  return {
    hsize,
    vsize,
    fov,
    transform,
    halfWidth,
    halfHeight,
    pixelSize
  };
};

/**
 * @returns {Ray}
 */
export const rayForPixel = (camera, px, py) => {
  const xOffset = (px + 0.5) * camera.pixelSize;
  const yOffset = (py + 0.5) * camera.pixelSize;

  const worldX = camera.halfWidth - xOffset;
  const worldY = camera.halfHeight - yOffset;

  const inverseTransform = inverse(camera.transform);
  const pixel = multiplyTuple(inverseTransform, point(worldX, worldY, -1));
  const origin = multiplyTuple(inverseTransform, point(0, 0, 0));
  const direction = normalize(sub(pixel, origin));

  return Ray(origin, direction);
};
