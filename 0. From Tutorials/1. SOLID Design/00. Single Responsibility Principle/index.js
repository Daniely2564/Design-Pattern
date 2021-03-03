const fs = require("fs");

// A class should only have one primary responsibility
class Journal {
  constructor() {
    this.entries = {};
  }

  addEntry(text) {
    let c = ++Journal.count;
    let entry = `${c}: ${text}`;
    this.entries[c] = entry;
    return c;
  }

  removeEntry(index) {
    delete this.entries[index];
  }

  toString() {
    return Object.values(this.entries).join("\n");
  }

  /** PROBLEMETIC */
  //   save(filename) {
  //     fs.writeFileSync(filename, this.toString());
  //   }

  //   load(filename){
  //       //
  //   }

  //   loadFromUrl(url){
  //       //
  //   }
}

Journal.count = 0;

let j = new Journal();
j.addEntry("I cried today");
j.addEntry("I ate a bug.");

// Question. Where do we save this journal then? We might think to have it inside of the class.
// We Could add all of the classes as above. But it can be a problem and the class has more than one responsibilities

// Example: If you have something for serialization

class PersistenceManager {
  preprocess(journal) {
    //
  }

  saveToFile(journal, filename) {
    fs.writeFileSync(filename, journal.toString());
  }
}

let p = new PersistenceManager();
let filename = "c:/temp/ournal.txt";
p.saveToFile(j, filename);

// God Object. Object has all of the functionalities and it is difficult to debug and so on..
