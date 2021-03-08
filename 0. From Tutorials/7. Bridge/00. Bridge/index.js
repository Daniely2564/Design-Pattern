// Lets say that you can render shapes in many ways
// - Pixels
// - Vectors

// Then for each shapes we need
// - Vector Circle
// - Vecor Square
// - Render Circle
// - Renderer Square .... and many more

// So intead we have a hierarchy

// Shape - Square, Circle, Triangles, ...
// Renderer - Raster, Vector, ...
// You make a bridge between one element from Shape to another element in Renderer

class VectorRenderer {
  renderCircle(radius) {
    console.log(`Drawing a circle of radius ${radius}`);
  }
}

class RasterRenderer {
  renderCircle(radius) {
    console.log(`Drawing pixels for a circle of radius ${radius}`);
  }
}

class Shape {
  constructor(renderer) {
    this.renderer = renderer;
  }
}

class Circle extends Shape {
  constructor(renderer, radius) {
    super(renderer);
    this.radius = radius;
  }

  draw() {
    this.renderer.renderCircle(this.radius);
  }

  resize(factor) {
    this.radius *= factor;
  }
}
class Square {}
class Triangle {}

let raster = new RasterRenderer();
let vector = new VectorRenderer();
let circle = new Circle(vector, 5);
circle.draw();
circle.resize(2);
circle.draw();

// The whole point is we build a bridge,
// So that we dont have to implement all of the shapes for each renderers

// Problem : What if we need to implement Square...
//  It would be still problemetic.

// Connecting two hierarchies of objects together.
// Shpare <-> Renderer
