const ini = require("ini");

exports.iniStrategy = {
  deserialize: (data) => ini.parse(data),
  serialize: (data) => ini.stringify(data),
};

exports.jsonStrategy = {
  deserialize: (data) => JSON.parse(data),
  serialize: (data) => JSON.stringify(data, null, "  "),
};
