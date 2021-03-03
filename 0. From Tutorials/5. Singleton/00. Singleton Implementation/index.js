const Singleton = require("./singleton");

let s1 = new Singleton();
let s2 = new Singleton();
console.log(s1 === s2);
