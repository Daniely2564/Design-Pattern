import { StackCalculator } from "./stackCalculator.js";
import { createSafeCalculator, SafeCalculator } from "./safeCalculator.js";

const calculator = new StackCalculator();
const safeCalculator = new SafeCalculator(calculator);

calculator.putValue(3);
calculator.putValue(2);
console.log(calculator.multiply());

safeCalculator.putValue(2);
console.log(safeCalculator.multiply());

calculator.putValue(0);
console.log(calculator.divide());

safeCalculator.clear();
safeCalculator.putValue(4);
safeCalculator.putValue(0);
console.log(safeCalculator.divide());

/** Alternative Way using factory function */
const safeCalculator2 = createSafeCalculator(calculator);
