const {
  Database,
  SingletonRecordFinder,
  DummyDatabase,
  ConfigurableRecordFinder,
} = require("./database");

describe("singleton databse", function () {
  it("is a singleton", function () {
    const db1 = new Database();
    const db2 = new Database();
    expect(db1).toBe(db2);
  });

  it("calculates total population", function () {
    let rf = new SingletonRecordFinder();
    let cities = ["Seoul", "Sao Paulo"];
    let tp = rf.totalPopulation(cities);
    expect(tp).toEqual(1770000000 + 1750000000);
  });

  it("calculates total population better", function () {
    let db = new DummyDatabase();
    let rf = new ConfigurableRecordFinder(db);
    expect(rf.totalPopulation(["alpha", "gamma"])).toEqual(4);
  });
});
