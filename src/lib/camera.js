import { Matrix, inverse, multiplyTuple } from "./matrix";
import { Ray } from "./ray";
import { point, normalize, sub } from "./tuple";
import { ColorCanvas } from "./color-canvas";
import { colorAt } from "./world";

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

  const pixelSize = halfWidth * 2 / hsize;

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

/**
 * @param {Camera} camera
 * @param {World} world
 * @returns {ColorCanvas}
 */
export const render = (camera, world, tickFn = null) => {
  const image = new ColorCanvas(camera.hsize, camera.vsize);

  // TODO: RAF
  for (let y = 0; y < camera.vsize; y++) {
    for (let x = 0; x < camera.hsize; x++) {
      const ray = rayForPixel(camera, x, y);
      const color = colorAt(world, ray);
      image.writePixel(x, y, color);

      if (tickFn) {
        tickFn(x, y);
      }
    }
  }

  return image;
};

/**
 * Async version of render with callback fn called each pixel
 */
export const renderAsync = (camera, world, cb) => {
  const image = new ColorCanvas(camera.hsize, camera.vsize);
  let itr = 0;

  for (let y = 0; y < camera.vsize; y++) {
    for (let x = 0; x < camera.hsize; x++) {
      const ray = rayForPixel(camera, x, y);
      const color = colorAt(world, ray);
      image.writePixel(x, y, color);
      itr += 1;
      cb({done: false, step: itr, color});
    }
  }

  cb({done: true, image});
}

