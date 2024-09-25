const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dbConnection = require("./config/db/connection");
const authRoutes = require("./routes/adminRoutes");
const dataRoutes = require("./routes/dataRoutes");
const path = require("path");

// setup
require("dotenv").config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
dbConnection.connect();

// Router
app.use("/api/admin/auth", authRoutes);
app.use("/api", dataRoutes);

// Page Loader
app.get("/kepoling/admin/dashboard", (req, res) => {
  res.render("admin");
});

app.get("/kepoling/admin/login", (req, res) => {
  res.render("login");
});

app.get("/kepoling/admin/reset-password", (req, res) => {
  res.render("reset");
});

app.get("/secret/kepoling/admin/register", (req, res) => {
  res.render("register");
});

// Start Server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

module.exports = app;
