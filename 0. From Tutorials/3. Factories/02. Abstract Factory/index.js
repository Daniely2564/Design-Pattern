const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const Drink = Object.freeze({
  Tea: "tea",
  Coffee: "coffee",
});

class HotDrink {
  constructor() {
    if (this.constructor.name === "HotDrink") {
      throw new Error("HotDrink is abstract");
    }
  }
  consume() {}
}

class Tea extends HotDrink {
  consume() {
    console.log("This tea is nice with lemon!");
  }
}

class Coffee extends HotDrink {
  consume() {
    console.log("This coffee is delicius");
  }
}

class HotDrinkFactory {
  prepare(amount) {
    /* abstract */
  }
}

class TeaFactory extends HotDrinkFactory {
  prepare(amount) {
    console.log(`Put in tea bag, boil the water, pour ${amount} ml.`);
    return new Tea(); // Here you will create an instance and add required properties and functions
    /**
     * let tea = new Tea();
     * tea.attribute = whatever needs
     */
  }
}

class CoffeeFactory extends HotDrinkFactory {
  prepare(amount) {
    console.log(`Grind some beans, boil water, pour ${amount}ml`);
  }
}

// We will be breaking the open-closed principle because of the coupling
class HotDrinkMachine {
  makeDrink(type) {
    switch (type) {
      case Drink.Tea:
        return new TeaFactory().prepare(200);
      case Drink.Coffee:
        return new CoffeeFactory().prepare(50);
      default:
        throw new Error("Type not provided");
    }
  }
}

let machine = new HotDrinkMachine();
rl.question("Which drink?\n", function (answer) {
  let drink = machine.makeDrink(answer);
  drink.consume();

  rl.close();
});
