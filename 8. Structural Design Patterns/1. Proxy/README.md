# Proxy

An object that controls access to another object, called the **subject**.

- The proxy and the subject have an identical interface, and this allows us to swap one for the other transparently;
- Alternative pattern is **surrogate**.

A **proxy** intercepts all or some of the operations that are meant to be executed on the subject, augmenting or complementing their behavior.

The proxy and the subject have the same interface, and how this is transparent to the client, who can use one or the other interchangeably.

The proxy forwards each operation to the subject, enhancing its behavior with additional preprocessing or postprocessing.

**※ Proxy is not between classes; the Proxy pattern involves wrapping an actual instance of the subject, thus preserving its internal state**

### Circumstances

- Data Validation :
  - The proxy validates the input before forwarding it to the subject
- Security :
  - The proxy verifies that the client is authorized to perform operation, and it passes the request to the subject only if the outcome of the check if positive
- Caching :
  - The proxy keeps an internal cache so that the proxied operations are executed on the subject only if the data is not yet present in the cache
- Lazy initialization :
  - If creating the subject is expensive, the proxy can delay it until it's really necessary
- Logging :
  - The proxy intercepts the method invocations and the relative parameters, recoding them as they happen
- Remote objects :
  - They proxy can take a remote object and make it appear local

## Techniques for implementing proxies

When _proxying_ an objcet, we can decide to intercept all of its methods or only some of them, while delegating the rest directly to the subject.

#### Example

```javascript
class StackCalculator {
  constructor() {
    this.stack = [];
  }

  putValue(value) {
    this.stack.push(value);
  }

  getValue() {
    return this.stack.pop();
  }

  peekValue() {
    return this.stack[this.stack.length - 1];
  }

  clear() {
    this.stack = [];
  }

  divide() {
    const divisor = this.getValue();
    const dividend = this.getValue();
    const result = dividend / divisor;
    this.putValue(result);
    return result;
  }

  multiply() {
    const multiplicand = this.getValue();
    const multiplier = this.getValue();
    const result = multiplier * multiplicand;
    this.putValue(result);
    return result;
  }
}
```

-- This class implements a simplified version of a stack calculator. The idea of this calculator is to keep all operands (values) in a stack. This is not too different from how the calculator applciation on your mobile phone is actually implemented

**Examples**

```javascript
const calculator = new StackCalculator();
calculator.putValue(3);
calculator.putValue(3);
console.log(calculator.multiply());
calculator.putValue(2);
console.log(calculator.multiply());
```

### Task

Leverage the **Proxy pattern** to enhance a _StackCalculator_ instance by providing a more conservative behavior for division by 0 : rather than returning _Infinity_, we will throw an explicit error.

## Object composition

Composition is a technique whereby an object is combined with another object for the purpose of the purpose of extending or using functionality.

```javascript
export class SafeCalculator {
  constructor(calculator) {
    this.calculator = calculator;
  }
  // proxied method
  divide() {
    // aditional validation logic
    const divisor = this.calculator.peekValue();
    if (divisor === 0) {
      throw Error("Division by 0");
    }

    // if valid delegates to the subject
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
```

The _safeCalculator_ object is a proxy for the original _calculator_ instance. To implement this proxy using componsition, we had to intercept the methods that we were interested in manipulating **divide()** while simply delegating the rest of them to the subject. (**putValue(), getValue(), peekValue(), clear(), and multiply()**)

An alternative implementation of the proxy presented in the preceding code fragment might just use an object literal and a factory function.

```javascript
// Alternative implementation of the proxy
export function createSafeCalculator(calculator) {
  return {
    // proxied method
    divide() {
      // additional validation logic
      const divisor = calculator.peekValue();
      if (divisor === 0) {
        throw Error("Division by 0");
      }
      // if valid delegates to the subject
      return calculator.divide();
    },
    // delegated methods
    putValue(value) {
      return calculator.putValue();
    },
    getValue() {
      return calculator.getValue();
    },
    peekValue() {
      return calculator.peekValue();
    },
    clear() {
      return calculator.clear();
    },
    multiply() {
      return calculator.multiply();
    },
  };
}
```

This implementation is simpler and more concise than the class-based one, but once again, it forces us to delegate all the methods to the subject explicitly.

※ Having to delegate many methods for complex classes can be very tedious and might make it harder to implement these techniques. One way to create a proxy that delegates most of its methods is to use a library that generates all the methods for us, such as _delegates_ ([nodejsdp.link/delegates](nodejsdp.link/delegates)).

※ A more modern and native alternative is to use the _Proxy_ object, which we will discuss later in this chapter.

## Object augmentation

**Object augmentation** (or **monkey patching**) is the simplest and the most common way of proxying just a few methods of an object. It involes modifying the subject directly by replacing a method with its proxied implementation.

In the context of our calculator example, this could be done as follows:

```javascript

```
