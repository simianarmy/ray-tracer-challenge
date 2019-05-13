import { Matrix, inverse, multiplyTuple, transpose } from "./matrix";
import { Material } from "./material";
import { transform } from "./ray";
import { normalize, vector } from "./tuple";


class Shape {
  constructor(props) {
    props = Object.assign(props || {},
      { transformation: Matrix.identity,
        material: Material()
      });
    this.transformation = props.transformation;
    this.material = props.material;
  }

  getTransform() {
    return this.transformation;
  }

  setTransform(t) {
    this.transformation = t;
  }

  /**
   * @returns {Array[Intersection]}
   */
  intersect(ray) {
    // convert ray to object space before calculating with shape's concrete
    // implementation
    const localRay = transform(ray, inverse(this.transformation));
    return this.localIntersect(localRay);
  }

  /**
   * @returns {Vector}
   */
  normalAt(p) {
    // convert point to object space and normalize vector then calculate with
    // shape's concrete implementation
    const localPoint = multiplyTuple(inverse(this.transformation), p);
    const localNormal = this.localNormalAt(localPoint);
    // convert back to world space and normalize
    const worldNormal = multiplyTuple(transpose(inverse(this.transformation)), localNormal);
    worldNormal.w = 0;

    return normalize(worldNormal);
  }

  localNormalAt(p) {
    return vector(p.x, p.y, p.z);
  }
}

export { Shape };
