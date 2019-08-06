import { Triangle } from "./triangle";
import { Intersection } from "./intersection";
import { add, multiply } from "./tuple";

export class SmoothTriangle extends Triangle {
  constructor(p1, p2, p3, n1, n2, n3) {
    super(p1, p2, p3);

    this.n1 = n1;
    this.n2 = n2;
    this.n3 = n3;
  }

  localNormalAt(p, i) {
    return add(multiply(this.n2, i.u),
      add(multiply(this.n3, i.v),
        multiply(this.n1, 1 - i.u - i.v)));
  }

  localIntersect(ray) {
    const res = this.localIntersectHelper(ray);

    if (res) {
      return [Intersection(res.t, this, {u: res.u, v: res.v})];
    }

    return [];
  }
}
