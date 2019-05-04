import { Color, add, multiply as multiplyColor, multiplyByScalar } from "./color";
import { dot, multiply, negate, normalize, reflect, sub } from "./tuple";


const DEFAULT_COLOR = Color(1, 1, 1);
const DEFAULT_AMBIENT = 0.1;
const DEFAULT_DIFFUSE = 0.9;
const DEFAULT_SPECULAR = 0.9;
const DEFAULT_SHININESS = 200;

export const Material = () => {
  return {
    color: DEFAULT_COLOR,
    ambient: DEFAULT_AMBIENT,
    diffuse: DEFAULT_DIFFUSE,
    specular: DEFAULT_SPECULAR,
    shininess: DEFAULT_SHININESS
  };
};

/**
 * Phong Reflection Model
 *
 * @param {Material} material
 * @param {LightPoint} light
 * @param {Point} pnt
 * @param {Vector} eye
 * @param {Vector} normal
 * @returns {Color}
 */
export const lighting = (material, light, pnt, eye, normal) => {
  let ambient, diffuse, specular;

  // combine the surface color with the light's color/intensity
  const effectiveColor = multiplyColor(material.color, light.intensity);

  // find direction of light source
  const lightv = normalize(sub(light.position, pnt));

  // compute ambient contribution
  ambient = multiplyByScalar(effectiveColor, material.ambient);

  // cos angle b/w light vector and normal vector
  const lightDotNormal = dot(lightv, normal);

  // negative means light is on other side of the surfade
  if (lightDotNormal < 0) {
    diffuse = Color.Black;
    specular = Color.Black;
  } else {
    diffuse = multiplyByScalar(effectiveColor, material.diffuse * lightDotNormal);

    const reflectv = reflect(negate(lightv), normal);
    const reflectDotEye = dot(reflectv, eye);

    if (reflectDotEye <= 0) {
      specular = Color.Black;
    } else {
      const factor = Math.pow(reflectDotEye, material.shininess);
      specular = multiply(light.intensity, material.specular * factor);
    }
  }

  return add(add(ambient, diffuse), specular);
};
