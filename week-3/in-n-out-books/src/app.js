// Sara King
// June 15, 2025
// app.js
// book application express server

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const app = express();

var indexRouter = require("../routes/index");
var booksRouter = require("../routes/books");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", booksRouter);

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

module.exports = app;
