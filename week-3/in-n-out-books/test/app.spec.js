// test.spec.js
const request = require("supertest");
const app = require("../src/app");

describe.skip("GET /", () => {
  it("responds with Landing Page!", (done) => {
    request(app).get("/").expect("Landing Page!", done);
  });
});

describe("Chapter 3: API Tests", () => {
  test("Should return an array of books", async () => {
    const response = await request(app).get("/api/books");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("Should return a single book", async () => {
    const response = await request(app).get("/api/books/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
  });

  test("Should return a 400 error if the id is not a number", async () => {
    const response = await request(app).get("/api/books/abc");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid ID");
  });

  test("Should return 404 if book is not found", async () => {
    const response = await request(app).get("/api/books/999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Not found");
  });
});
