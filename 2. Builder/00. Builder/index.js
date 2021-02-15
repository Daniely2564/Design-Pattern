const hello = "hello";
let html = [];
html.push("<p>");
html.push(hello);
html.push("</p>");

// console.log(html.join(""));

const words = ["html", "world"];
html = [];
html.push("<ul>\n");
for (let word of words) {
  html.push(`   <li>${word}</li>\n`);
}
html.push("</ul>");

// console.log(html.join(""));

class Tag {
  static get indentSize() {
    return 2;
  }

  constructor(name = "", text = "") {
    this.name = name;
    this.text = text;
    this.children = [];
  }

  toStringImpl(indent) {
    let html = [];
    let i = " ".repeat(indent * Tag.indentSize);
    html.push(`${i}<${this.name}>\n`);
    if (this.text.length > 0) {
      html.push(" ".repeat(Tag.indentSize * (indent + 1)));
      html.push(this.text);
      html.push("\n");
    }
    for (let child of this.children) {
      html.push(child.toStringImpl(indent + 1));
    }
    html.push(`${i}</${this.name}>\n`);
    return html.join("");
  }

  toString() {
    return this.toStringImpl(0);
  }

  static create(name) {
    // <- Coupling) Instead of initializing directly, you create it using the builder class
    //    This is a violation.
    return new HTMLBuilder(name);
  }
}

// Builder
//   Helps to build class more effectively

class HTMLBuilder {
  constructor(rootName) {
    this.root = new Tag(rootName);
    this.rootName = rootName;
  }

  addChild(childName, childText) {
    let child = new Tag(childName, childText);
    this.root.children.push(child);
  }

  addChildFluent(childName, childText) {
    let child = new Tag(childName, childText);
    this.root.children.push(child);
    return this;
  }

  toString() {
    return this.root.toString();
  }

  clear() {
    this.root = new Tag(this.rootName);
  }

  build() {
    return this.root;
  }
}

// let builder = new HTMLBuilder("ul");
let builder = Tag.create("ul");
for (let word of words) {
  builder.addChild("li", word);
}
console.log(builder.build().toString());

builder.clear();
builder
  .addChildFluent("li", "foo")
  .addChildFluent("li", "bar")
  .addChildFluent("li", "barz")
  .addChildFluent("li", "This is fluent!");

console.log(builder.toString());
