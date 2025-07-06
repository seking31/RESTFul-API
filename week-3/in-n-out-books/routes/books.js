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

    res.json(book);
  } catch (error) {
    console.log({ error });
    if (error.message === "No matching item found") {
      return res.status(404).json({ error: "Not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST new book
router.post("/books", async (req, res, next) => {
  try {
    const { title, author } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Book title is required." });
    }

    const newBook = {
      id: Math.random(),
      title,
      author: author,
    };

    books.insertOne(newBook);

    res.status(201).json(newBook);
  } catch (err) {
    console.error("Error adding book: ", err.message);
    next(err);
  }
});

// DELETE book
router.delete("/books/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const book = await books.deleteOne({ id });

    res.json(book);

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting book: ", err.message);
    next(err);
  }
});

router.put("/books/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "Invalid ID: ID must be a number." });
    }

    const { title, author } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Missing book title." });
    }

    const updatedBook = {
      title,
      author,
    };

    await books.updateOne({ id }, updatedBook);
    res.status(204).send();
  } catch (error) {
    console.error("Error updating book: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
