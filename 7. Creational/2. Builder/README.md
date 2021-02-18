## Builder

- simplifies the creation of complex objects by providing fluent interface which allows us to build object step by step.
- improves readability
- improves the general developer experience when creating complex objects

Imagine a **Boat** Class

```javascript
class Boat{
    constructor(hasMotr, motorCount, motorBrand, motorModel,
               hasSails,...){
        //...
    }
}
```

Invoking such a constructor would create some hard to read code and can easily cause errors

```javascript
const myBoat = new Boat(true, 2, 'Best Motor Co.', 'OM123',...);
```

**First** step to improve the design of this constructor is all arguments in a single object literal.

```javascript
class Boat{
    constructor(allParameters){
        //...
    }
}

const myBoat = new Boat({
    hasMotor:true,
    motorCount:2,
    ....
})

```

**Drawbacks**

- The first implementation seems to work better, but one drawback of using a single object literal to pass all inputs at once is that the only way to know what the actual inputs are is to look at the class documentation or even worse, into the code of the class.
- There's no enforced protocol that guides the developers toward the creation of a coherent class.
  - If we specify **hasMotor : true**, then we are required to also specify a motorCount, a motorBrand, and a motorModel.
- The **Builder Pattern** fixes even these last few flaws and provides a fluent interface that is simple to read, self-documenting and that provides guidance toward the creation of a coherent object.

Let's look at the Builder pattern for the Boat class.

```javascript
class BoatBuilder {
    withMotors(count, brand, model) {
        this.hasMotor = true;
        this.motorCount = count;
        this.motorBrand = brand;
        this.motorModel = model;
    }
    withSails(color){
        this.hullColor = color;
        reutrn this;
    }

    withCabin(){
        this.hasCabin = true;
        return this;
    }

    build(){
        return new Boat({
            hasMotor:this.hasMotor,
            motorCount:this.motorCount,
            motorBrand: this.motorBrand,
            hasSails: this.hasSails,
            sailsCount: this.sailsCount,
            sailsMaterial: this.sailsMaterial,
            sailsColor: this.sailsColor,
            hullColor: this.hullColor,
            hasCabin: this.hasCabin
        })
    }
}
```

To fully appreciate the positive impact that the Builder pattern has on the way we create our Boat objects,

```javascript
const myBoat = new BoatBuilder()
  .withMotors(2, "Best Motor Co.", "OM123")
  .withSails(1, "fabric", "white")
  .withCabin()
  .hullColor("blue")
  .build();
```

As we can see, the role of our **BoatBuilder** class is to collect all the parameters needed to create a Boat using some helper methods.

We usually have a emthod for each parameter or set of related parameters, but there is not an exact rule to that.

**General Rules**

- The main objective is to break down a complex constructor into multiple, more readable, and more manageable steps.
- Create builder methods that can set multiple related parameters at once.
- Deduce and implicitly set parameters based on the values received as input by a setter method, and in general, try to encapsulate as much parameter setting related logic into the setter methods so that the consumer of the builder interface is free.
- If necessary, you can manipulate the parameters, before passing them to the constructor of the class being built to simplify the work left to do by the builder class consumer even more.
  - type casting
  - normalization
  - extra validation

#### The Builder pattern can also be implemented directly into the target class.

- Example : We could refactor the Url class by adding an empty constructor and the setter methods for the various components, rather than creating a seperate UrlBuilder class.
- Flaw : Url instances may not be fullly set up and someone might be invoking the other functions when its not mature yet. It can be solved by adding extra validations, but at the cost of adding more complexity.

#### Example of Builder - Creating new HTTP(S) client requests with request()

Aims to simplify the creation of new requests by implementing the Builder pattern, thus providing a fluent interface to create new requests step by step.

```javascript
superagent
  .post("https://example.com/api/person")
  .send({ name: "John Doe", role: "User" })
  .set("accept", "json")
  .then((response) => {
    // deal with response.
  });
```

Interestingly, the previous code does not have **build()** or **inovke()** but it has **then()** method.
