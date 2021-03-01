const fs = require("fs");
const path = require("path");

// Low Level Module
class Database {
  constructor() {
    const instance = this.constructor.instance;
    if (instance) {
      return instance;
    }
    this.constructor.instance = this;

    console.log(`Initializing database`);
    this.capitals = {};

    let lines = fs
      .readFileSync(path.join(__dirname, "capitals.txt"))
      .toString()
      .split("\r\n");

    for (let i = 0; i < lines.length / 2; i++) {
      this.capitals[lines[2 * i]] = parseInt(lines[2 * i + 1]);
    }
  }

  getPopulation(city) {
    return this.capitals[city];
  }
}

// High Level Module
class SingletonRecordFinder {
  totalPopulation(cities) {
    return cities
      .map((city) => new Database().getPopulation(city))
      .reduce((x, y) => x + y, 0);
  }
}

// This High Level Module would not be dependent on Low Level Module
class ConfigurableRecordFinder {
  constructor(database = new Database()) {
    this.database = database;
  }
  totalPopulation(cities) {
    return cities
      .map((city) => this.database.getPopulation(city))
      .reduce((x, y) => x + y, 0);
  }
}

// We only use it for the purpose of testing
class DummyDatabase {
  constructor() {
    this.capitals = {
      alpha: 1,
      beta: 2,
      gamma: 3,
    };
  }
  getPopulation(city) {
    return this.capitals[city];
  }
}

exports.SingletonRecordFinder = SingletonRecordFinder;
exports.Database = Database;
exports.ConfigurableRecordFinder = ConfigurableRecordFinder;
exports.DummyDatabase = DummyDatabase;

// Singleton Can be a problem if you take direct dependency on it.
