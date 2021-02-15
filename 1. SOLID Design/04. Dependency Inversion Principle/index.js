const Relationship = Object.freeze({
  parent: 0,
  child: 1,
  sibling: 2,
});

class Person {
  constructor(name) {
    this.name = name;
  }
}

// Abstraction for Low Module classes
class RelationshipBrowser {
  constructor() {
    if (this.constructor.name === "RelationshipBrowser") {
      throw new Error("RelationshipBrowser is abstract");
    }
  }

  findAllChildrenOf(name) {}
}

// Low Level Module
class Relationships extends RelationshipBrowser {
  constructor() {
    super();
    this.data = [];
  }
  addParentAndChild(parent, child) {
    this.data.push({
      from: parent,
      type: Relationship.parent,
      to: child,
    });
  }

  findAllChildrenOf(name) {
    return this.data
      .filter((r) => r.from.name === name && r.type === Relationship.parent)
      .map((r) => r.to);
  }
}

// High Level Module
class Research {
  // Find all children of John
  /*
  constructor(relationships) {
      let relations = relationships.data; <- this would be problemetic if low module like relationships.data changes.
      for (let rel of relations.filter(
        (r) => r.from.name === "John" && r.type === Relationship.parent
      )) {
        console.log(`John has a child named ${rel.to.name}`);
      }

      We should be able to gather results from outside of this reaserch modules.
  }
  */
  constructor(broswer) {
    for (let p of broswer.findAllChildrenOf("John")) {
      console.log(`John has a child called ${p.name}`);
    }
  }
}

let parent = new Person("John");
let child1 = new Person("Chris");
let child2 = new Person("Matt");

let rels = new Relationships();
rels.addParentAndChild(parent, child1);
rels.addParentAndChild(parent, child2);

new Research(rels);
