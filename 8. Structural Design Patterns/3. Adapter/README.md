# Adapter

Allows us to access the functionality of an object using different interface.

#### Real-life example

- Device that allows you to plug a USB Tyep-A cable into a USB Type-C port.

Generally an adapter converts an object with a given interface so that it chttps://www.fastify.io/an be used in a context where a different interface is expected.

The **Adapter pattern** is used to take the interface of an object(the **adaptee**) and make it compatible with another interface that is expected by a given client.

@import "../../src/img/Adapter Diagram.PNG"

In the figure, the adapter is essentially a wrapper for the adaptee, exposing a different interface. The diagram highlights that the operations of the adapter can also be a composition of one or more method invocations on the adaptee.

## Using LevelUP through the filesystem API

We will build an adapter around the LevelUP API, transforming it into an interface that is compatible with the core fs module. In particular, we will make sure that every call to **readFile()** and **writeFile()** will translate into calls to **db.get()** and **db.put()**. This way we can use a LevelUP database as a storage backend for simple filesystem operations.

#### fs-adapter.js

We will export the **createFsAdapter()** factory that we are going to use to build the adapter.

```javascript
import { resolve } from "path";

export function createFsAdapter(db) {
  return {
    readFile(filename, options, callback) {
      // ...
    },
    writeFile(filename, contents, options, callback) {
      // ...
    },
  };
}
```

Next we will implement the readFile() function inside the factory and ensure that its interface is compatible with the one of the original function from the **fs** module:

```javascript
readFile(filename, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  } else if (typeof options === "string") {
    options = { encoding: options };
  }

  db.get(
    resolve(filename),
    {
      valueEncoding: options.encoding,
    },
    (err, value) => {
      if (err) {
        if (err.type === "NotFoundError") {
          err = new Error(`ENOENT, open "${filename}"`);
          err.code = "ENOENT";
          err.errno = 34;
          err.path = filename;
        }

        return callback && callback(err);
      }
      callback && callback(null, value);
    }
  );
}
```

```javascript
writeFile(filename, contents, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  } else if (typeof options === "string") {
    options = { encoding: options };
  }

  db.put(
    resolve(filename),
    contents,
    {
      valueEncoding: options.encoding,
    },
    callback
  );
}
```

We don't have a perfect wrapper in this case. We ignore some options such as file permissions _(options.mode)_ and we are not forwarding any error that we receive from the database as is.

Our new adapter is now ready. If we now write a small test module, we can try to use it:

```javascript
import fs from "fs";

fs.writeFile("file.txt", "Hello!", () => {
  fs.readFile("file.txt", { encoding: "utf8" }, (err, res) => {
    if (err) {
      return console.error(err);
    }
    console.log(res);
  });
});

// try to read a missing file
fs.readFile("missing.txt", { encoding: "utf8" }, (err, res) => {
  console.error(err);
});
```

This code uses the original **fs** API to perform a few read and write operations on the filesystem, and should print something like the following.

```txt
Error: ENOENT, open "missing.txt"
Hello!
```

Now, we can try to replace the **fs** module with our adapter, as follows:

```javascript
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import level from "level";
import { createFsAdapter } from "./fs-adapter.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = level(join(__dirname, "db"), {
  valueEncoding: "binary",
});
const fs = createFsAdapter(db);
```

The program will produce the same output, except no parts of the file that we specified are read or written using the filesystem API directly. Instead, any operation performed using our adapter will be converted into an operation performed on a LevelUP database.

## In the wild

- LevelUP
  - able to run with different storage backends, from the default LevelDB to IndexedDB in the broswer.
- JugglingDB
  - multi-database ORM and multiple adapters are used to make it compatible with different databases.
- nanoSQL
  - multi-model database abstraction library that makes heavy usage of the Adapter pattern to support a variety of databases.
