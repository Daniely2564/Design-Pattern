# Iterator

Fundamental and important and commonly used that it's usually built into the programming language itself. All major programming languages implement the pattern in one way or another.

The **Iterator** pattern defines a cmmon interface or protocol for iterating the elements of a container, such as an array or a tree data structure. The **Iterator** pattern defines an interface to iterate over elements produced or retrieved in sequence.

## The iterator protocol

In JavaScript, the Iterator pattern is implemented through **protocols** rather than through formal constructurs, such as inheritance.

- This essentially means that the interaction between the implementer and the consumer of the Iterator pattern will communicate using interfaces and objects whose shape is agreed in advance.

The starting point for implementing the Iterator pattern is the **iterator protocol**, which defines an interface for producing a sequence of values. So, we'll call **iterator** an object implementing a _next()_ method having the following behavior:

- each time the method is called, the function returns the next element in the iteration through an object, called the **iterator result**, having two properrties
  - done
    - **done** is set to true when the iteration is complete. Otherwise, done will be _undefined_ or _false_.
  - value
    - contains the current element of the iteration and it can be left undefined if _done_ is _true_. If value is set even when done is true, then it is said that value contains the **return value** of the iteration, a value which is not part of the elements being iterated, but it's related to the iteration itself as a whle.

> We can add extra properties to the object returned by an iterator. However, those properties will be simply ignored by the built-in constructs or APIs consuming the interator.

#### Example

How to implement the iterator protocol

```javascript
const A_CHAR_CODE = 65;
const Z_CHAR_CODE = 90;

function createAlphabetIterator() {
  let currCode = A_CHAR_CODE;

  return {
    next() {
      const currChar = String.fromCodePoint(currCode);
      if (currCode > Z_CHAR_CODE) {
        return {
          done: true,
        };
      }

      currCode++;
      return { value: currChar, done: false };
    },
  };
}
```

At each invocation of the _next()_ method, we simply increment a number representing the letter's character code, convert it to a character, and then return it using the object shape defined by the iterator protocol.

> Iterators can optionally specify two additional methods: return ([value]) and throw(error).

## The iterable protocol

Defines a standardized means for an object to return an iterator. Such objects are called **iterables**.

In JavaScript, we can define an iterable by making sure it implements the **@@iterator method**, a method accessible through the built-in symbol **Symbol.iterator**.

> The **@@name** convention indicates a _well-known_ symbol according to the ES6 specification. To find out more, check [ES6 specification](https://262.ecma-international.org/6.0/#sec-well-known-symbols).

Such an **@@iterator** method should return an iterator object, which can be used to iterate over the elements represented by the iterable.

If our iterable is a class, we would have something liek the following.

```javascript
class MyIterable {
  // other methods...
  [Symbol.iterator]() {
    // return an iterator
  }
}
```

Let's build a class to manage information organized in a bidimensional matrix structure.

```javascript
// matrix.js
export class Matrix {
  constructor(inMatrix) {
    this.data = inMatrix;
  }

  get(row, column) {
    if (row >= this.data.length || column >= this.data[row].length) {
      throw new RangeError("Out of bounds");
    }
    return this.data[row][column];
  }

  set(row, column, value) {
    if (row >= this.data.length || column >= this.data[row].length) {
      throw new RangeError("Out of bounds");
    }
    this.data[row][column] = value;
  }

  [Symbol.iterator]() {
    let nextRow = 0;
    let nextCol = 0;

    return {
      next: () => {
        if (nextRow === this.data.length) {
          return { done: true };
        }
        const currVal = this.data[nextRow][nextCol];

        if (nextCol === this.data[nextRow].length - 1) {
          nextRow++;
          nextCol = 0;
        } else {
          nextCol++;
        }

        return { value: currVal };
      },
    };
  }
}
```

As we can see, the class contains the basic methods for getting and setting values in the matrix, as well as the **@@iterator** method, implemting our iterable protocol.

Now let's try using the Matrix class.

```javascript
import { Matrix } from "./matrix.js";

const matrix2x2 = new Matrix([
  ["11", "12"],
  ["21", "22"],
]);

const iterator = matrix2x2[Symbol.iterator]();

let iterationResult = iterator.next();
while (!iterationResult.done) {
  console.log(iterationResult.value);
  iterationResult = iterator.next();
}
```

## Iterators and iterables as a native JavaScript interface.

The most obvious construct accepting an iterable is the _for ... of_ loop. We've just seen in the last code sample that iterating over a JavaScript iterator is pretty standard operation, and its code is mostly boilerplace.

```javascript
for (const element of matrix2x2) {
  console.log(element);
}
```

Similarly, we can use an iterable with the destructuring assignment operation:

```javascript
const [oneOne, oneTwo, twoOne, twoTwo] = matrix2x2;
console.log(oneOne, oneTwo, twoOne, twoTwo);
```

The following are some JavaScript built-in APIs accepting iterables:

- [Map([iterable])](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/Map)
- [WeakMap([iterable])](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap/WeakMap)
- [Set([iterable])](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/Set)
- [WeakSet([iterable])](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet/WeakSet)
- [Promise.all(iterable)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [Promise.race(iterable)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
- [Array.from(iterable)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)

On the Node.js side, one notable API accepting an iterable is **[stream.Readable.from(iterable, [options])](https://nodejs.org/api/stream.html#stream_stream_readable_from_iterable_options)**, which creates a readable stream out of an iterable object.

> Note that all the APIs and syntax constructs we've just seen accept as input an iterable and not an iterator. We can leverage all the built-in APis and syntax constructs using the following code

```javascript
for (const letter of createAlphabetIterator()) {
  //...
}
```

> A trick to make sure that an array doesn't contain duplicate elements is the following `const uniqueArray = Array.from(new Set(arrayWithDuplicates))`. This also shows us how iterables offer a way for different components to talk to each other using a shared interface.
