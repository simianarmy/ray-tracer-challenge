import { point, add, sub, magnitude, normalize, multiply } from "./tuple";
import { PointLight } from "./light";
import { Color } from "./color";
import { Sphere } from "./sphere";
import { Ray } from "./ray";
import { scaling } from "./transformations";
import { lighting } from "./material";
import { hit, prepareComputations } from "./intersection";

// Maximum recursion level for colorAt, shadeHit, reflectColor
const MAX_RECURSION_DEPTH = 4;

export const World = () => {
  return {
    objects: [],
    lightSource: null
  };
};

/**
 * Handy shortcut for world object used throughout book
 */
World.Default = () => {
  let w = World();

  w.lightSource = PointLight(point(-10, 10, -10), Color(1, 1, 1));

  const s1 = new Sphere();
  s1.material.color = Color(0.8, 1, 0.6);
  s1.material.diffuse = 0.7;
  s1.material.specular = 0.2;
  const s2 = new Sphere();
  s2.setTransform(scaling(0.5, 0.5, 0.5));

  w.objects.push(s1);
  w.objects.push(s2);

  return w;
};

/**
 * Calculates all intersections of a ray in world
 * @returns {Array[Intersection]}
 */
export const intersectWorld = (world, ray) => {
  const intersections = world.objects.reduce((acc, obj, idx) => {
    return acc.concat(obj.intersect(ray));
  }, []);

  return intersections.sort((ia, ib) => {
    return ia.t < ib.t ? -1 : ia.t > ib.t ? 1 : 0;
  });
};

/**
 * @param {World} world
 * @param {Object} comps
 * @param {Number} remaining recursion limiter
 * @returns {Color}
 */
export const shadeHit = (world, comps, remaining = MAX_RECURSION_DEPTH) => {
  const shadowed = isShadowed(world, comps.overPoint);
  const surface = lighting(
    comps.object.material,
    comps.object,
    world.lightSource,
    comps.overPoint,
    comps.eyev,
    comps.normalv,
    shadowed
  );
  const reflected = reflectedColor(world, comps, remaining);

  return Color.fromPoint(add(surface, reflected));
};

/**
 * @returns {Color}
 */
export const colorAt = (world, ray, remaining = MAX_RECURSION_DEPTH) => {
  const xs = intersectWorld(world, ray);
  const is = hit(xs);

  if (!is) {
    return Color.Black;
  }

  const comps = prepareComputations(is, ray, xs);

  return shadeHit(world, comps, remaining);
};

/**
 * @returns {Boolean}
 */
export const isShadowed = (world, p) => {
  const v = sub(world.lightSource.position, p);
  const distance = magnitude(v);
  const direction = normalize(v);

  const r = Ray(p, direction);
  const xs = intersectWorld(world, r);

  const h = hit(xs);

  return h && h.t < distance;
};

/**
 * @returns {Color}
 */
export const reflectedColor = (world, comps, remaining) => {
  if (comps.object.material.reflective === 0 || remaining < 1) {
    return Color.Black;
  } else {
    const reflectRay = Ray(comps.overPoint, comps.reflectv);
    const color = colorAt(world, reflectRay, remaining - 1);

    return Color.fromPoint(multiply(color, comps.object.material.reflective));
  }
};
