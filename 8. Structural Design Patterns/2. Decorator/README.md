# Decorator

Structural design pattern that consists in dynamically augmenting the behavior of an existing object. It's different from classical inheritance, because behavior is not added to all the objects of the samle class, but only to the instances that are explicitly decorated.

Implmentation-wise, it is similar to the Proxy pattern, but instead of enhancing or modifying the behavior of the existing interface of an object, it augments it with new functionalities.

## Techniques for implementing decorators

Although proxy and decorator are conceptually two different patterns with different intents, they practically share the same implementation strategies.

This time we want to use the **Decorator pattern** to be able to take an instance of our **_StackCalculator_** class and "decorate it" so that it also exposes a new method called add(), which we can use to perform additions between two numbers. We will also use the decorator to intercept all the calls to the divide() method and implement the same division-by-zero check

### Composition

Using composition, the decorated component is wrapped around a new object that usually inherits from it. The decorator in this case simply needs to define the new methods, while delgating the existing ones to original component.

```javascript
class EnhancedCalculator {
  constructor(calculator) {
    this.calculator = calculator;
  }

  // new method
  add() {
    const addend2 = this.getValue();
    const addend1 = this.getValue();
    const result = addend1 + addend2;
    this.putValue(result);
    return result;
  }

  // modified method
  divide() {
    // additional validation logic
    const divisor = this.calculator.peekValue();
    if (divisor === 0) {
      throw Error("Division by 0");
    }

    // if valid, delegates to the subject
    return this.calculator.divide();
  }

  // delegated methods
  putValue(value) {
    return this.calculator.putValue(value);
  }

  getValue() {
    return this.calculator.getValue();
  }

  peekValue() {
    return this.calculator.peekValue();
  }

  clear() {
    return this.calculator.clear();
  }

  multiply() {
    return this.calculator.multiply();
  }
}

const calculator = new StackCalculator();
const enhancedCalculator = new EnhancedCalculator(calculator);

enhancedCalculator.putValue(4);
enhancedCalculator.putValue(3);
console.log(enhancedCalculator.add());
enhancedCalculator.putValue(2);
console.log(enhancedCalculator.multiply());
```

This is very similar to the Proxy composition.

We created the new add() method and enhanced the behvaior of the original divide() method. Finally we delegated the rest of the methods to the origial subject.

## Object augmentation

**Object decoration** can also be achieved by simply attaching new methods directly to the decorated object (monkey patching), as follows:

```javascript
function patchCalculator(calculator) {
  // new method
  calculator.add = function () {
    const addend2 = calculator.getValue();
    const addend1 = calculator.getValue();
    const result = addend1 + addend2;
    calculator.putValue(result);
    return result;
  };

  // modified method
  const divideOrig = calculator.divide;
  calculator.divide = () => {
    // additional validation logic
    const divisor = calculator.peekValue();
    if (divisor === 0) {
      throw Error("Division by 0");
    }

    // if valid delegates to the subject
    return divideOrig.apply(calculator);
  };

  return calculator;
}

const calculator = new StackCalculator();
const enhancedCalculator = patchCalculator(calculator);
```

Here, **calculator** and **enhancedCalculator** reference the same object (calculator == enhancedCalculator). This is because patchCalculator() is mutating the original calculator object and then returning it. You can confirm this by invoking calculator.add() or calculator.divide().

## Decorating with the Proxy object

It is possible to implement object decoration by using the **Proxy** object. A generic example might look like this.

```javascript
const enhancedCalculatorHandler = {
  get(target, property) {
    if (property === "add") {
      // new method
      return function add() {
        const addend2 = target.getValue();
        const addend1 = target.getValue();
        const result = addend1 + addend2;
        target.putValue(result);
        return result;
      };
    } else if (property === "divide") {
      // modified method
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

    // delegated methods and properties
    return target[property];
  },
};

const calculator = new StackCalculator();
const enhancedCalculator = new Proxy(calculator, enhancedCalculatorHandler);
```

If we were to compare these different implementations, the same caveats discussed during the analysis of the Proxy pattern would also apply for the decorator.

## Decorating a LevelUP database

### Introducing LevelUP and LevelDB

**[LevelUP](https://www.npmjs.com/package/levelup)** is a Node.js wrapper around Google's **LevelDB**, a key-value store originally uilt to implement IndexedDB in the Chrome broswer, but it's much more than that. LevelDB has been defined as the "Node.js of database" because ot its minimalism and extensibility. LevelDB provides fast performance and only the most basic set of features, allowing developers to build any kind of database on top of it.

LevelUP, a wrapper for LevelDB, evolved to support several kinds of backends, from in-memory stores, to other NoSQL databases such as Riak and Redis, to web storage engines suc has IndexedDB and localStorage, allowing us to use the same API on both the server and the client.

### Implementing a LevelUP plugin

Show how to create a simple plugin for LevelUP using the Decorator pattern, and the object augmentation technique.

> For convinience, we will use the [**level** package](https://www.npmjs.com/package/level), which bundles both **levelup** and the default adapter called **leveldown**, which uses LevelDB as the backend.

What we wnat to build is a plugin for LevelUP that allows us to receive notifications every time an object with a certain pattern is saved into the database.

**Example.**

If we subscribe to a pattern such as `{a:1}`, we want to receieve a notification when object such as `{a: 1, b:3}` or `{a: 1, c: 'x'}` are saved into the database.

Plugin.

```javascript
export function levelSubscribe(db) {
  db.subscribe = (pattern, listener) => {
    // (1)
    db.on("put", (key, val) => {
      // (2)
      const match = Object.keys(pattern).every((k) => pattern[k] === val[k]); // (3)

      if (match) {
        listener(key, val); // (4)
      }
    });
  };

  return db;
}
```

Implementation

1. We decorated the _db_ object with a new method named subscribe(). We simply attach the method directly to the provided _db_ instance (object augmentation)
2. We listen for any put operation performed on the database.
3. We perform a very simple pattern-matching algorithm, which verifies that all the properties in the provided pattern are also available in the data being inserted.
4. If we have a match, we notify the listener.

Let's now write some code to try out our new plugin.

```javascript
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import level from "level";
import { levelSubscribe } from "./level-subscribe.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const dbPath = join(__dirname, "db");
const db = level(dbPath, { valueEncoding: "json" }); // (1)
levelSubscribe(db); // (2)

db.subscribe({ doctype: "tweet", language: "en" }, (k, val) =>
  console.log(val)
); // (3)

db.put("1", {
  // (4)
  doctype: "tweet",
  text: "Hi",
  language: "en",
});

db.put("2", {
  doctype: "company",
  name: "ACME co.",
});
```

1. Initialize our LevelUP database, choosing the directory where the files are stored and the default encoding for the values.
2. Attach our plugin.
3. **subscribe()** method, where we specify that we are interested in all the objects with _doctype_: 'tweet' and _language_: 'en'
4. We save some values in the database using **put**. The first call triggers the callback associated with our subscription and we should see the stored object printed to the console. This is because, in this case, the object matches the subscription. The second call does not generate any output because the stored object does not match the subscription criteria.

This example shows a real application of the Decorator pattern in its simplest implementation, which is **object augmentation**. It may look like a trivial pattern, but it has undoubted power if used appropriately.

> For simplicity, our plugin works only in combination with **put** operations, but it can be easily expanded to work even with batch operations ([levelup-batch](https://github.com/Level/levelup#batch))

### In the wild

For more examples of how decorators are used in the real world, you can inspect the code of some more LevelUP plugins:

- [level-inverted-index](https://github.com/dominictarr/level-inverted-index)
  - This is a plugin that adds inverted indexes to a LevelUP database, allowing us to perform simple text searches across the values stored in the database.
- [levelplus](https://github.com/eugeneware/levelplus)
  - This is a plugin that adds atomic updates to a LevelUP database.

Aside from LevelUP plugins

- [json-socket](https://www.npmjs.com/package/json-socket)
  - Makes it easier to send JSON data over a TCP (or a Unix) socket. Designed to decorate an existing instance of _net.Socket_, which gets enriched with additional methods and behaviors.
- [fastify](https://www.fastify.io/)
  - Web application framework that exposes an API to decorate a Fastify server instance with additional functionality or configuration. With this approach, the additional functionality is made accessible to different parts of the application.
  - With this approach, the additional functionality is made accessible to differnt parts of the application.
