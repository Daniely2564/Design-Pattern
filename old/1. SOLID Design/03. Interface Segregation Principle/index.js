class Document {}

class Machine {
  constructor() {
    if (this.constructor.name === "Machine") {
      throw new Error("Machine is abstract!");
    }
  }

  print(doc) {}
  fax(doc) {}
  scan(doc) {}
}

class MultiFunctionPrinter extends Machine {
  print(doc) {
    //
  }
  fax(doc) {
    //
  }
  scan(doc) {
    //
  }
}

class NotImplementedError extends Error {
  constructor(name) {
    let msg = `${name} is not implemented!`;
    super(msg);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotImplementedError);
    }
  }
}

class OldFashionPrinter extends Machine {
  print(doc) {
    //
  }
  /*
        This below fax and scan violates principle of least surprise
        principle of least surprise : users should not expect any surprises. It should work as expected 
  */
  // OldFashionPrinter can't fax
  fax(doc) {}
  // OldFashionPrinter can't scan
  scan(doc) {
    //Maybe we can fix with throw statement
    // throw new Error("not implemented!"); <- Maybe We can come up with our own error
    throw new NotImplementedError(`OldFasionPrinter.scan`);
  }
}

// However this in the end is not a great way of implementing.
//  Because we are forcing the clients either leave the unused function blank or throw an error.

// ISP(Interface Segregation Principle) - You have to segregate (split up) interfaces

// Then we can simply write a Printer Class that has the minium functions needed to be a printer.
class Printer {
  constructor() {
    if (this.constructor.name === "Printer") {
      throw new Error("Printer is abstract");
    }
  }
  print() {}
}

class Scanner {
  constructor() {
    if (this.constructor.name === "Scanner") {
      throw new Error("Scanner is abstract");
    }
  }
  scan() {}
}

// What if we want to inherit two of them...
// Theres aggregate from the ../ location

let printer = new OldFashionPrinter();
printer.scan();
