const MODIFIER_NAMES = ["swap", "write", "fill"];

export class ImmutableBuffer {
  constructor(size, executor) {
    const buffer = Buffer.alloc(size);
    const modifiers = {};
    for (const prop in buffer) {
      // console.log(prop);
      if (typeof buffer[prop] !== "function") {
        continue;
      }

      if (MODIFIER_NAMES.some((m) => prop.startsWith(m))) {
        modifiers[prop] = buffer[prop].bind(buffer);
      } else {
        this[prop] = buffer[prop].bind(buffer);
      }
    }

    executor(modifiers);
  }
}

/*
1. We allocate a new Node.js Buffer (buffer) of the size specified in the _size_ constructor argument
2. We create an object literal (modifiers) to hold all the methods that can mutate the buffer
3. After that, we iterate over all the properties (own and inherited) of our internal buffer, making sure to skip all those that are not functions.
4. We try to identify if the current prop is a method that allows us to modify the buffer. We do that by trying to match its name with one of the strings in the MODIFIER_NAMES array. If we have such a method, we bind it to the buffer instance, and then we add it to the modifiers object.
5. If our method is not a modifier method, then we add it directly to the current instance (this).
6. We invoke the executor function received as input in the constructor and pass the modifiers object as an argument, which will allow executor to mutate our internal buffer.
*/
