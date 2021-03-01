import { StackCalculator } from "./stackCalculator.js";

const safeCalculatorHandler = {
  get: (target, property) => {
    if (property === "divide") {
      // proxied method
      return function () {
        // additional validation logic
        const divisor = target.peekValue();
        if (divisor === 0) {
          throw Error("Division by 0");
        }
        // if valid delegates to the subject
        return target.divide();
      };
    }

    // delegate methods and properties
    return target[property];
  },
};

const calculator = new StackCalculator();
const safeCalculator = new Proxy(calculator, safeCalculatorHandler);
