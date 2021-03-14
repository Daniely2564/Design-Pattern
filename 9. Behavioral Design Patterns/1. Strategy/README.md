# Strategy Pattern

The **Strategy pattern** enables an object, called the **contenxt**, to support variations in its logic by extracting the _variable_ parts into seperate, interchangeable objects called **strategies**.

The **context** implements the common logic of a family of algorithms, while a **strategy** implements the mutable parts, allowing the context to adapt its behavior depending on different factors, such as input value, a system configuration, or user preferences.

**Strategies** are usually part of a family of solutions and all of them implement same interface expected by the context.

@import "../../src/img/Strategy Diagram.PNG"

The figure shows how the context object can plug different strategies into its structure as if they were replaceable parts of a piece of machinery.

#### Example

Imagine a car; its tires can be considered its **strategy** for adapting to different road conditions. We can fit winter tirese to go on snowy roads, while we can decide to fit high-performance tires for traveling mainly on motorways for a long trip. On the one hand, we don't want to change the entire car for this to be possible, and on the other, we don't want a car with eight wheels so that it can go on every possible road.

Not only does this pattern help with separating the concerns within a given problems, but it also enables our solution to have better flexibility and adapt to different variations of the same problem.

The **Strategy pattern** is particularly useful in all those situations where supporting variations in the behavior of a component requires complex conditional lgoci (lots of _if ..else or switch_ statements) or mixing different components of the same family.

#### Example

Imagine an object called Order that represents an online order on a e-commerce website. The object has a method called **pay()** that, as it says, finalizes the order and transfers the funds from the user to the online store.

To support different payment systems, we have a couple of options

- Use an **if... else** statement in the pay() method to complete the operation based on the chosen payment option.
- Delegate the logic of the payment to a strategy object that implements the logic for the specific payment gateway selected by the user.

In the first solution, our Order object cannot support other payment methodsd unless its code is modified. Also, this can be quite complex when the number of payment options grow.

Solution : Using the **Strategy pattern** enables the _Order_ object to support a virtually unlimited number of payment methods and keeps its scope limited to only managing the details of the user, the purchased items, and relative price while delegating the job of completing the payment to another object.

## Multi-format configuration objects

```javascript
import { promises as fs } from "fs";
import objectPath from "object-path";

export class Config {
  // (1)
  constructor(formatStrategy) {
    this.data = {};
    this.formatStrategy = formatStrategy;
  }

  // (2)
  get(configPath) {
    return objectPath.get(this.data, configPath);
  }

  // (2)
  set(configPath, value) {
    return objectPath.set(this.data, configPath, value);
  }

  // (3)
  async load(filePath) {
    console.log(`Deserializing from ${filePath}`);
    this.data = this.formatStrategy.deserialize(
      await fs.readFile(filePath, "utf-8")
    );
  }

  //(3)
  async save(filePath) {
    console.log(`Serializing to ${filePath}`);
    await fs.writeFile(filePath, this.formatStrategy.serialize(this.data));
  }
}
```

Consider an object called **Config** that holds a set of configuration parameters used by an application, such as the database URL, the listening port of the server, and so on.

The **Config** object should be able to provide a simple interface to access these parameters, but also a way to import and export the configuration using persistent storage, such as a file.

1. Constructor
   - Create an instance variable called data to hold the configuration data. We also store _formatStrategy_, which represents the component that we will use to parse and serialize the data.
2. **set()** and **get()**
   - access the configuration properties using a dotted path notation (for example, property.subProperty) by leveraging a library called [object-path](https://www.npmjs.com/package/object-path)
3. **load()** and **save()**
   - This is where we delegate, respectively, the deserialization and serialization of the data to our strategy.
   - Our logic of the _Config_ class is altered based on the _formatStrategy_ passed as an input to the constructor.

This very simple and neat design allows the **Config** object to seamlessly support different file formats when loading and saving its data. The best part is that **the logic to support those various formats is not hardcoded anywhere, so the Config class can adapt without any modification to virtually any file format, given the right strategy.**

We will create format strategies in a file called `strategies.js`.

```javascript
// strategies.js
import ini from "ini";

export const iniStrategy = {
  deserialize: (data) => ini.parse(data),
  serialize: (data) => ini.stringify(data),
};

export const jsonStrategy = {
  deserialize: (data) => JSON.parse(data),
  serialize: (data) => JSON.stringify(data, null, "  "),
};
```

We can try to load and save a sample configuration using different formats

```javascript
// index.js
import { Config } from "./config.js";
import { jsonStrategy, iniStrategy } from "./strategies.js";

async function main() {
  const iniConfig = new Config(iniStrategy);
  await iniConfig.load("samples/conf.ini");
  iniConfig.set("book.nodejs", "design patterns");
  await iniConfig.save("samples/conf_mod.ini");

  const jsonConfig = new Config(jsonStrategy);
  await jsonConfig.load("samples/conf.json");
  jsonConfig.set("book.nodejs", "design patterns");
  await jsonConfig.save("samples/conf_mod.json");
}

main();
```

Our test module reveals the core properties of the Strategy pattern. We defined only the one **Config** class, which implements the common parts of our configuration manager, by using different strategies for serializing and deserializing data, we created different **Config** class instance supporting different file formats.

**Other valid approaches**

- Creating two different strategy families
  - One for the deserialization and the other for the serialization. This would have allowed reading from a format and saving to anohter.
- Dynamically selecting the strategy
  - Depending on the extension of the file provided, the **Config** object could have maintained a map **extension** -> **strategy** and used it to select the right algorithm for the given extension.

Implementation of the pattern itself can vary.

#### Difference between the Adapter and Strategy Pattern

**Adapter Pattern**

- Does not add any behavior to the adaptee
  - It just makes it available under another interface
  - May require some extra logic to be implemented to convert one interface into another, but the logic is limited to this task only.

**Strategy pattern**

- The context and the strategy implement two different parts of an algorithm and there fore both implement some kind of logic and both are essential to build the final algorithm (when combined together).

### In the wild

**Passport.js** is an authentication framework for **Node.js**, which allows a web server to support different authentication schemes. With Passport, we can provide a _login with Facebook_ or _login with Twitter_ functionality to our web application with minimal effort.
For Passport, these are all different strategies for completing the authentication process and, as we can imagine, this allows the lbirary to support a virtually unlimited number of authentication services.
