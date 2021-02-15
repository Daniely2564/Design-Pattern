const CoordinateSystem = Object.freeze({
  cartesian: 0,
  polar: 1,
});

class Point_WrongClass {
  /** We cannot have two constructor at the same time. */
  /*
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  constructor(rho, theta) {
    this.x = rho * Math.cos(theta);
    this.y = rho * Math.sin(theta);
  }

  Instead
  */

  /**
   * How would we know which one is reffering to x and which one is referring to y?
   * @param {*} a
   * @param {*} b
   * @param {*} cs
   */
  constructor(a, b, cs = CoordinateSystem.cartesian) {
    switch (cs) {
      case CoordinateSystem.cartesian:
        this.x = a;
        this.y = b;
        break;
      case CoordinateSystem.polar:
        this.x = a * Math.cos(b);
        this.y = a * Math.sin(b);
        break;
    }
  }
}

// Applying Factory Method
// Benefit
//  - You are not restricted by the types
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static newCartesianPoint(x, y) {
    return new Point(x, y);
  }

  static newPolarPoint(rho, theta) {
    return new Point(rho * Math.cos(theta), rho * Math.sin(theta));
  }
}

let p = Point.newCartesianPoint(4, 5);
console.log(p);

let p2 = Point.newPolarPoint(5, Math.PI / 2);
console.log(p2);
