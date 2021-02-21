class ColorConsole {
  constructor() {
    if (this.constructor.name === "ColorConsole") {
      throw new Error("ColorConsole is abstract");
    }
  }
  log() {}
}

class RedConsole extends ColorConsole {
  constructor() {
    super();
  }

  log(input) {
    console.log("\x1b[31m%s\x1b[0m", input);
  }
}

class BlueConsole extends ColorConsole {
  constructor() {
    super();
  }

  log(input) {
    console.log("\x1b[34m%s\x1b[0m", input);
  }
}

class GreenConsole extends ColorConsole {
  constructor() {
    super();
  }

  log(input) {
    console.log("\x1b[32m%s\x1b[0m", input);
  }
}

export function createConsole(color) {
  switch (color) {
    case "red":
      return new RedConsole();
    case "blue":
      return new BlueConsole();
    case "green":
      return new GreenConsole();
    default:
      throw new Error("Invalid Color");
  }
}
