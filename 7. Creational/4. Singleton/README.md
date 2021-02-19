## Singleton

Enforces the presence of only one instance of a class and centralize its access. There are few reasons for using a single instance across all the components of the application.

- for sharing stateful information
- For optimizing resource usage
- To synchronize access to a resource

#### Example

A typical **Database** class, which provides access to a database:

```javascript
// Database.js
export class Database {
  constructor(dbName, connectionDetails) {
    //...
  }
  //...
}
```

Typical database class does not need to make a new **Database** instance for each request. Plus, a **Database** instance may store some stateful information, such as the list of pending transactions. Therefore, we usually want to configure and instantiate one single **Database** instance at the start of our application and let every component use that single shared **Database** instance.

```javascript
import { Database } from "./Database.js";

export const dbInstance = new Database("my-app-db", {
  url: "localhost:5432",
  username: "usr",
  password: "password",
});
```

By simply exporting a new instance of our **Database** class, we can already assume that within the current package, we will have only one instance of the _dbInstance_ module. This is possible because Node.js will cache the module, making sure not to execute its code at every import.

We can easily obtain a shared instance of the _dbInstance_ module with the following line of code.

```javascript
import { dbInstance } from "./dbInstance.js";
```

### Caveat

The module is cached using its full path as the lookup key, so it is only guaranteed to be a singleton within the current package. In fact, each package may have its own set of private dependencies inside its **node_modules** directory, which might result in multiple instances of the same package and therefore of the same module, resulting in our singleton not really being unique anymore!

#### Example

The following lines of code would be in its `package.json` file:

```json
{
  "name": "mydb",
  "version": "2.0.0",
  "type": "module",
  "main": "dbInstance.js"
}
```

Next, consider two package (package-a and package-b), both of which have a single file called `index.js` containing the following code:

```javascript
import { dbInstance } from "mydb";

export function getDbInstance() {
  return dbInstance;
}
```

Both package-a and package-b have a dependency on the _mydb_ package. However, package-a depends on version 1.0.0 of the _mydb_ package, while package-b depends on version 2.0.0 of the same package.

Given the structure we described

```
app/
`-- node_modules
    |-- package-a
    |   `-- node_modules
    |       `-- mydb
    `-- package-b
        `-- node_modules
            `-- mydb
```

In this case, a typical package manager such as _npm_ or _yar_ would not "hoist" the dependency to the _top_ node_modules directory, but it will instead install a private copy of each package in a attemp to fix the version incompatibility.

Consider the following `index.js` file.

```javascript
import { getInstance as getDbFromA } from "package-a";
import { getInstance as getDbFromB } from "package-b";

const isSame = getDbFromA() === getDbFromB();

console.log(
  `Is the db instance in package-a the same ` +
    `as package-b ${isSame ? "YES" : "NO"}`
);
```

The result is **NO**. The **package-a** and **package-b** will load two different instances of the _dbInstance_ object because the _mydb_ module will resolve to a different directory, depending on the package it required from.

```javascript
global.dbInstance = new Database("my-app-db", {
  /*...*/
});
```

This guarantees that the instance is only shared across the entire application and not just the same package.

※ If you are creating a package that is going to be used by third parties, tyr to keep it stateless to avoid the issues we've discussed in this section.
