var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/me_and_you_app");

mongoose.set("debug", true);

// module.exports.**** = require("./****");
// module.exports.**** = require("./****");
module.exports.User = require("./user");