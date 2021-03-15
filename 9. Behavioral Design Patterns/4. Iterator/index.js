const { Matrix } = require("./matrix");

const matrix2x2 = new Matrix([
  ["11", "12"],
  ["21", "22"],
]);

const iterator = matrix2x2[Symbol.iterator]();
let iterationResult = iterator.next();

/** One Option */
/*
while (!iterationResult.done) {
  console.log(iterationResult.value);
  iterationResult = iterator.next();
}
*/

/**Second option */
for (const element of matrix2x2) {
  console.log(element);
}
