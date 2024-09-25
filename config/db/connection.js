const mongoose = require("mongoose");
require("dotenv").config();

module.exports.connect = function connectToDb() {
  mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "Koneksi ke MongoDB gagal:"));
  db.once("open", () => {
    console.log("Terhubung ke MongoDB");
  });
};
