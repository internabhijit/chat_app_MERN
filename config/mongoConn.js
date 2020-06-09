const mongoose = require("mongoose");

const mode = process.env.NODE_ENV;

const config =
  mode && mode == "prod"
    ? require("../env/production")
    : require("../env/development");

mongoose.connect(config.mongoConfig, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const mongoConn = mongoose.connection;

mongoConn.on("error", (err) => console.log("Connection error:", err));
mongoConn.once("open", function (callback) {
  console.log("Successfully connected to MongoDB.");
});

module.exports = mongoConn;
