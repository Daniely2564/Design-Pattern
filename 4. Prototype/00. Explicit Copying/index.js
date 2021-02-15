// This type of copying is not very optimal
// It takes too long.

class Address {
  constructor(streetAddress, city, country) {
    this.streetAddress = streetAddress;
    this.city = city;
    this.country = country;
  }

  deepCopy() {
    return new Address(this.streetAddress, this.city, this.country);
  }

  toString() {
    return `${this.streetAddress} ${this.city}, ${this.country}`;
  }
}

class Person {
  constructor(name, address) {
    this.name = name;
    this.address = address;
  }

  deepCopy() {
    return new Person(this.name, this.address.deepCopy());
  }

  toString() {
    return `${this.name} lives at ${this.address}`;
  }
}

let john = new Person("John", new Address("123 London Road", "London", "UK"));

let jane = john.deepCopy(); // OFC this is wrong.

jane.address.streetAddress = "312 Haha Road";

console.log(john.toString());
console.log(jane.toString());
