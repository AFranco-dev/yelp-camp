// DEPENDENCIES
const express = require("express");
const path = require("path");

// EXPRESS VARS
const app = express();
const port = 3000;

// EXPRESS APP
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.send("Hello from YelpCamp Home");
});

app.listen(port, console.log(`Listening on port ${port}`));
