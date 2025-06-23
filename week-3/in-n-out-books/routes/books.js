var express = require("express");
const path = require("path");
const books = require("../database/books");
var router = express.Router();

// GET books homepage view
router.get("/", function (req, res, next) {
  res.sendFile(path.join(__dirname, "..", "views", "index.ejs"));
});

// GET all books
router.get("/books", async (req, res) => {
  try {
    const allBooks = await books.find();
    res.json(allBooks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET book by ID
router.get("/books/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const book = await books.findOne({ id });

    console.log({ book });
    console.log({ id });

    res.json(book);
  } catch (error) {
    console.log({ error });
    if (error.message === "No matching item found") {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
