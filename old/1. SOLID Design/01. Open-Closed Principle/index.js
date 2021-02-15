// Since js doesn't have enum, we will use what seems like an enum type
let Color = Object.freeze({
  red: "red",
  green: "green",
  blue: "blue",
});

let Size = Object.freeze({
  small: "small",
  medium: "medium",
  large: "large",
});

class Product {
  constructor(name, color, size) {
    this.name = name;
    this.color = color;
    this.size = size;
  }
}

/* Open for extension, closed for modification */
/* I might be modifying a class that might have been already tested or deployed and adding changes to it. */
/* Once you define the class, we do not modify it.*/

/* what if we had to add another method such as filterBySizeAndColor, or filterBySize*/
class ProductFilter {
  filterByColor(products, color) {
    return products.filter((p) => p.color === color);
  }
  // + Problem. The class is already closed.
  filterBySize(products, size) {
    return products.filter((p) => p.size === size);
  }

  // + Problem. The class is already closed.
  filterBySize(products, size, color) {
    return products.filter((p) => p.size === size && p.color === color);
  }
  // State Explosion : We might have to add more functionalities
  // If 3 criteria -> 7 Methods (2^3 - 1)
}

// Specification Class might not be needed cuz of the way js behave
class Specification {
  constructor() {
    if (this.constructor.name === "Specification") {
      throw new Error("Specification is abstract");
    }
  }

  isSatisfied(item) {}
}

// Specification : You create a class which defines what to filter
class ColorSpecification extends Specification {
  constructor(color) {
    super();
    this.color = color;
  }
  isSatisfied(item) {
    return item.color === this.color;
  }
}

class SizeSpecification extends Specification {
  constructor(size) {
    super();
    this.size = size;
  }
  isSatisfied(item) {
    return item.size === this.size;
  }
}
/**** Here, we learn that these specification is not related to another */
/** Later we just add more filter specification and use it */

class BetterFilter {
  filter(items, spec) {
    return items.filter((x) => spec.isSatisfied(x));
  }
}

let apple = new Product("Apple", Color.green, Size.small);
let tree = new Product("Tree", Color.green, Size.large);
let house = new Product("House", Color.blue, Size.large);

let products = [apple, tree, house];

let pf = new ProductFilter();
console.log(`Green products (old):`);
for (let p of pf.filterByColor(products, Color.green))
  console.log(` * ${p.name} is green`);

// Can we also filter by size?
// We can add anohter method.

let bf = new BetterFilter();
console.log("Green products (new)");
for (let p of bf.filter(products, new ColorSpecification(Color.green))) {
  console.log(` * ${p.name} is green`);
}

// What if we are interested in the size and color?

class AndSpecification {
  // You can also add things like OrSpecification, XOR Specification
  constructor(...specs) {
    this.specs = specs;
  }

  isSatisfied(item) {
    return this.specs.every((x) => x.isSatisfied(item));
  }
}

// We can now filter by Size and Color
console.log("Large and green products:");
let spec = new AndSpecification(
  new ColorSpecification(Color.green),
  new SizeSpecification(Size.large)
);
for (let p of bf.filter(products, spec)) {
  console.log(` * ${p.name} is large and green.`);
}
