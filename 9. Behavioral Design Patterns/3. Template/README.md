# Template

Similar to the Strategy pattern. The Template pattern defines an **abstract class** that implements the skeleton (representing the common parts) of a component, where some of its steps are left undeinfed. **Subclasses** can then _fill_ the gaps in the component by implementing the missing parts, called **template methods**. The intent of this pattern is to make it possible to define a family of classes that are all variations of a family of components.

@import "../../src/img/Template Diagram.PNG"

The three concrete classes shown in the figure extend the template class and provide an implementation for **templateMethod()**, which is _abstract_ or _pure virtual_ to use C++ terminology.

In JavaScript, we don't have a formal way to define abstract calsses, so all we can do is leave the method undefined or assign it to a function that always throws an exception, indicating that the method has to be implemented.

The difference between the Template and Strategy lies in their structure and implementation. Both allow us to change the variable parts of a component while reusing the common parts.

Strategy

- allows us to do it dynamically at runtime

Template

- the complete component is determined the moment the concrete class is defined.
- more suitable in those circumstances where we want to create prepackaged variations of a component.

The choice between one pattern and the other is up to the developer, who has to consider the various pros and cons for each use case.

## A configuration manager template

Let's reimplement the **Config** object that we define in the **Strategy** pattern section, but this time using **Template**.

As in the previous version of the **Config** object, we want to have the ability to load and save a set of configuration properties using different file formats.

```javascript
import { promises as fsPromises } from "fs";
import objectPath from "object-path";

export class ConfigTemplate {
  async load(file) {
    console.log(`Deserializing from ${file}`);
    this.data = this._deserialize(await fsPromises.readFile(file, "utf-8"));
  }

  async save(file) {
    console.log(`Serializing to ${file}`);
    await fsPromises.writeFile(file, this._serialize(this.data));
  }

  get(path) {
    return objectPath.get(this.data, path);
  }

  set(path, value) {
    return objectPath.set(this.data, path, value);
  }

  _serialize() {
    throw new Error("_serailize() must be implemented");
  }

  _deserialize() {
    throw new Error("_deserialize() must be implemented");
  }
}
```

The **ConfigTemplate** class implements the common parts of the configuration management logic, namely setting and getting properties, plus loading and saving it to the disk.

However, it leaves the implementation of **\_serialize()** and **\_deserialize()** open. Since in JavaScript we cannot declare a method as abstract, we simply define them as **stubs**, throwing an error if they are invoked (in other words, if they are not overriden by a concrete subclass).

Let's now create a concrete class using our template, for example, one thatallows us to load and save the configuration using the JSON format:

```javascript
// jsonConfig.js
import { ConfigTemplate } from "./configTemplate.js";

export class JsonConfig extends ConfigTemplate {
  _deserialize(data) {
    return JSON.parse(data);
  }

  _serialize(data) {
    return JSON.stringify(data, null, " ");
  }
}
```

The implementation of **IniConfig** class supporting the **.ini** format using the same template class.

```javascript
// iniConfig.js
import { ConfigTemplate } from "./ConfigTemplate.js";
import ini from "ini";

export class IniConfig extends ConfigTemplate {
  _deserialize(data) {
    return ini.parse(data);
  }

  _serialize(data) {
    return ini.stringify(data);
  }
}
```

Now we can use our concrete configuration manager classes to load and save some configuration data:

```javascript
import { JsonConfig } from "./jsonConfig.js";
import { IniConfig } from "./iniConfig.js";

async function main() {
  const jsonConfig = new JsonConfig();
  await jsonConfig.load("samples/conf.json");
  jsonConfig.set("nodejs", "design patterns");
  await jsonConfig.save("samples/conf_mod.json");

  const iniConfig = new IniConfig();
  await iniConfig.load("samples/conf.ini");
  iniConfig.set("nodejs", "design patterns");
  await iniConfig.save("samples/conf_mod.ini");
}
main();
```

With minimal effort, the Template pattern allowed us to obtain a new fully working configuration manager by reusing the logic and the interface inherited from the parent template class and providing only the implementation of a few abstract methods.
