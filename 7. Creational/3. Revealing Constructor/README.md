## Revealing Constructor

**Definition** : How do we reveal some private functionality of an object only at the moment of the object's creation? This is particularly useful when we want to allow an object's internals to be manipulated only during its creation phase.

- Creating objects that can be modified only at creation time
- Creating objects whose custom behavior can be defined only at creation time
- Creating objects that can be initialized only once at creation time.

```javascript
//                    (1)                (2)         (3)
const object = new SomeClass(function executor(revealedMembers) {
  // manipulation code...
});
```

As we can see from the previous code, the Revealing Constructor Pattern is made of three fundamental elements;

1. Constructor
   - Takes a function as input
2. Executor
   - Invoked at creation time and receives a subset of the object's internals as input (**revealed members**(3))
3. Revealed Members

For this pattern to work, the revealed functionality must otherwise be not accessible by the users of the object once it is created.

### Building an immutable buffer

Immutable : The property of an object by which its data or state becomes unmodifiable once it's been created.

- With immutable objects, we don't need to create **defensive copies** before passing them around to other libraries or functions. We just have to define the objects or functions that they won't be modified.
- Modifying an object can only be done by creating a new copy and make the code more maintable and easier to reason about.
- Another common use case for immutable objects is efficient change detection.
  - If we assume that every copy corresponds to a modification, then detecing a change is simple (like using triple equal ===).

### Example

```javascript
const MODIFIER_NAMES = ["swap", "write", "fill"];

export class ImmutableBuffer {
  constructor(size, executor) {
    const buffer = Buffer.alloc(size);
    const modifiers = {};
    for (const prop in buffer) {
      if (typeof buffer[prop] !== "function") {
        continue;
      }

      if (MODIFIER_NAMES.some((m) => props.startsWith(m))) {
        modifiers[prop] = buffer[prop].bind(buffer);
      } else {
        this[prop] = buffer[prop].bind(buffer);
      }
    }

    executor(modifiers);
  }
}
```

1. We allocate a new Node.js Buffer (buffer) of the size specified in the _size_ constructor argument
2. We create an object literal (modifiers) to hold all the methods that can mutate the buffer
3. After that, we iterate over all the properties (own and inherited) of our internal buffer, making sure to skip all those that are not functions.
4. We try to identify if the current prop is a method that allows us to modify the buffer. We do that by trying to match its name with one of the strings in the MODIFIER_NAMES array. If we have such a method, we bind it to the buffer instance, and then we add it to the modifiers object.
5. If our method is not a modifier method, then we add it directly to the current instance (this).
6. We invoke the executor function received as input in the constructor and pass the modifiers object as an argument, which will allow executor to mutate our internal buffer.

Our **ImmutableBuffer** is acting as a proxy between its consumers and the internal buffer object. Some of the methods of the buffer instance are exposed directly through the **ImmutableBuffer** instance, while others are provided to the executor function (the modifier methods).

※ For the purpose of the demonstration, the implementation of the immutable buffer is intentionally kept simple.

- Example, we are not exposing the size of the buffer or providing other means to intialize the buffer.

```javascript
import { ImmutableBuffer } from "./immutableBuffer.js";

const hello = "Hello!";
const immutable = new ImmutableBuffer(hello.length, ({ write }) => {
  write(hello);
});

console.log(String.fromCharCode(immutable.readInt8(0)));

// The following line will throw
// "TypeError : immutable.write is not a function"

immutable.write("Hello?");
```

※ From the previous code, the executor function uses the **write()** function (which is part of the modifier methods) to write a string into the buffer.

- The function could've used **fill()**, **writeInt8()**, **swap16()** or other method exposed in the _modifier_ object.
- The codde we've seen also demonstrates how the **Immutable Buffer** instance exposes only the methods that don't mutate the buffer, such as **readInt8()**.

### In the wild

The **Revealing Constructor** pattern offers very strong guarantees and for this reason, it's mainly used in context where we need to provide foolproof encapsulation.

- A perfect application of this pattern would be in components used by tons of developers that have to provide unopinionated interfaces and strict encapsulation.
- We could also use in our application to improve readability and simplify code sharing with other people and teams.

#### Example

One of the popular examples of the Revealing Constructor patterns in the Javascript Promise class. When we create a new _Promise_ from scratch, its constructor accepts as input an _executor_ function that will receive **resolve()** and **reject()**
