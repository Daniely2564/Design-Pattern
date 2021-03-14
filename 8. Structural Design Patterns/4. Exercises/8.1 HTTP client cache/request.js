const { request } = require("https");

module.exports = function (url) {
  return new Promise((resolve, reject) => {
    const req = request(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });

    req.on("error", (err) => reject(err));

    req.end();
  });
};
