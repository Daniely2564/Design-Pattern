const request = require("./request");

request("https://www.simplesite.com/")
  .then((data) => {
    console.log(data);
  })
  .catch((e) => console.log(e.message));
