import { Matrix, inverse,  multiplyTuple, transpose } from "./matrix";
import { Material } from "./material";
import { transform } from "./ray";
import { normalize, vector } from "./tuple";

const uuidv1 = require("uuid/v1");

class Shape {
  constructor(props) {
    props = Object.assign(props || {},
      { transformation: Matrix.identity,
        material: Material(),
        parent: null
      });
    this.transformation = props.transformation;
    this.material = props.material;
    this.parent = props.parent;
    this.id = uuidv1();
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
    const localPoint = this.worldToObject(p);
    const localNormal = this.localNormalAt(localPoint);

    return this.normalToWorld(localNormal);
  }

  localNormalAt(p) {
    return vector(p.x, p.y, p.z);
  }

  /**
   * Converts point from world space to object space
   * @param {Point} p
   * @returns {Point}
   */
  worldToObject(p) {
    if (this.parent) {
      p = this.parent.worldToObject(p);
    }

    return multiplyTuple(inverse(this.transformation), p);
  }

  /**
   * Converts normal from object to world space
   * @param {Vector} n
   * @returns {Vector}
   */
  normalToWorld(n) {
    let normal = multiplyTuple(transpose(inverse(this.transformation)), n);
    normal.w = 0;
    normal = normalize(normal);

    if (this.parent) {
      normal = this.parent.normalToWorld(normal);
    }

    return normal;
  }
}

export { Shape };
