import { patchToSafeCalculator } from "./safeCalculator.js";
import { StackCalculator } from "./stackCalculator";

const calculator = new StackCalculator();
const safeCalculator = patchToSafeCalculator(calculator);
