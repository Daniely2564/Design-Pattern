export class Database {
  constructor(name, opt) {
    const instance = this.constructor.instance;
    if (instance) {
      return instance;
    }

    this.constructor.instance = this;
  }
}

/*
This will not work.

export class Database {
  constructor(dbName, connectionDetails) {
    //...
  }
  //...
}
*/
