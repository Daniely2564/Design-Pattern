import { getDbInstance as getDbFromA } from "./package-a/mydb.js";
import { getDbInstance as getDbFromB } from "./package-b/mydb.js";

const isSame = getDbFromA() === getDbFromB();

console.log(
  `Is the db instance in package-a the same ` +
    `as package-b ${isSame ? "YES" : "NO"}`
);
