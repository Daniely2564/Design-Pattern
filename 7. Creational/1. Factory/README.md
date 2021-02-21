## Factory

- Ability to decouple the creation of an object from one particular implementation.
- Expose "a surface area" that is much smaller than that of a class.
  - In general, a class can be extended or manipulated.
  - Factory, by just being a function, offers fewer options to the user.
    - robust and easier to understand
- enforces encapsulation by leveraging closures.

#### simple factory

```javascript
function createImage(name) {
  return new Image(name);
}
const image = createIamge("photo.jpeg");
```

vs

#### regular code

```javascript
const image = new Image(name);
```

**※ A factory gives us much more flexibility.**

```javascript
function createImage(name) {
  if (name.match(/\.jpe?g$/)) {
    return new ImageJpeg(name);
  } else if (name.match(/\.gif$/)) {
    return new ImageGif(name);
  } else if (name.match(/\.png$/)) {
    return new ImagePng(name);
  } else {
    throw new Error("Unsupported format");
  }
}
```

**※ A factory allows us to have an _encapsulation_ mechanism**

```javascript
function createPerson(name) {
  const Person = {
    setName(name) {
      if (!name) {
        throw new Error("A person must have a name");
      }
      privateProperties.name = name;
    },
    getName() {
      return privateProperties.name;
    },
  };

  person.setName(name);

  return person;
}
```

In the preceding code, we leverage a closure to create two objects : a person object, which represents the public interface returned by the factory, and a group of **privateProperties** that are inaccessible from the outside and that can be manipulated only through the interface provided by the **person** object.

Other ways to implement **encapsulation**.

- Using private class field (The hashbang # prefix syntax) introduced in Node.js 12.

```javascript
class Foo {
  #b = 15;

  get() {
    return this.#b;
  }

  increment() {
    ++this.#b;
  }
}
const obj = new Foo();

obj["#b"]; // undefined
obj.hasOwnProperty("#b"); // false
```

- Using WeakMaps.

```javascript
const privates = new WeakMap();

function Public() {
  const me = {
    // Private data goes here
  };
  privates.set(this, me);
}

Public.prototype.method = function () {
  const me = privates.get(this);
  // Do stuff with private data in `me`...
};

module.exports = Public;
```

- using node.js Symbol

```javascript
const _counter = Symbol("counter");
const _action = Symbol("action");

class Countdown {
  constructor(counter, action) {
    this[_counter] = counter;
    this[_action] = action;
  }
  dec() {
    if (this[_counter] < 1) return;
    this[_counter]--;
    if (this[_counter] === 0) {
      this[_action]();
    }
  }
}
```

- using conventions.
  - prefixing the name of a property with an underscore "\_".
  - does not prevet from reading or modifying the data
