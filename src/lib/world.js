import { point } from "./tuple";
import { PointLight } from "./light";
import { Color } from "./color";
import { Sphere } from "./sphere";
import { intersect } from "./ray";
import { scaling } from "./transformations";
import { lighting } from "./material";
import { hit, prepareComputations } from "./intersection";

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

  const s1 = Sphere();
  s1.material.color = Color(0.8, 1, 0.6);
  s1.material.diffuse = 0.7;
  s1.material.specular = 0.2;
  const s2 = Sphere();
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
    return acc.concat(intersect(obj, ray));
  }, []);

  return intersections.sort((ia, ib) => {
    return ia.t < ib.t ? -1 : (ia.t > ib.t) ? 1 : 0;
  });
};

/**
 * @param {World} world
 * @param {Object} comps
 * @returns {Color}
 */
export const shadeHit = (world, comps) => {
  return lighting(comps.object.material, world.lightSource, comps.point, comps.eyev, comps.normalv);
};

/**
 * @returns {Color}
 */
export const colorAt = (world, ray) => {
  const xs = intersectWorld(world, ray);
  const is = hit(xs);

  if (!is) {
    return Color.Black;
  }

  const comps = prepareComputations(is, ray);
  return shadeHit(world, comps);
};
