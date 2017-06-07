var mongoose = require("mongoose");
var config = require('../config')

mongoose.connect(config.mongo.url);

mongoose.set("debug", true);

module.exports.User = require("./user");
module.exports.Architects = require("./architects");
