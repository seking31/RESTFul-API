const request = require("supertest");
const express = require("express");
const app = require("../src/app");

let books = [];

app.use(express.json());

beforeEach(() => {
  books = [];
});

describe("Chapter 3: API Tests", () => {
  test("should return an array of books", async () => {
    books.push({ id: 1, title: "Sample Book", author: "Author" });

    const response = await request(app).get("/api/books");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("should return a single book", async () => {
    books.push({ id: 1, title: "Sample Book", author: "Author" });

    const response = await request(app).get("/api/books/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
  });

  test("should return a 400 error if the ID is not a number", async () => {
    const response = await request(app).get("/api/books/abc");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid ID");
  });

  test("should return 404 if the book is not found", async () => {
    const response = await request(app).get("/api/books/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Not found");
  });
});

describe("Chapter 4: API Tests", () => {
  test("should return 201 when adding a new book", async () => {
    const response = await request(app)
      .post("/api/books")
      .send({ title: "Test Book", author: "Jane Doe" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title", "Test Book");
  });

  test("should return 400 when adding a book with missing title", async () => {
    const response = await request(app)
      .post("/api/books")
      .send({ author: "John Doe" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Book title is required.");
  });

  test("should return 204 when deleting a book", async () => {
    const bookId = 1;

    const deleteResponse = await request(app).delete(`/api/books/${bookId}`);

    expect(deleteResponse.status).toBe(200);
  });
});
