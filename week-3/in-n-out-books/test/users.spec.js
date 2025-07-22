const request = require("supertest");
const express = require("express");
const app = require("../src/app");
const bcrypt = require("bcryptjs");

let users = [];

beforeEach(() => {
  users = [
    {
      id: 1,
      email: "user@derp.com",
      password: bcrypt.hashSync("password123", 10),
      securityQuestions: [{ answer: "blue" }, { answer: "pizza" }],
    },
    {
      id: 2,
      email: "alice@derp.com",
      password: bcrypt.hashSync("alice123", 10),
      securityQuestions: [{ answer: "green" }, { answer: "chess" }],
    },
  ];

  app.set("users", {
    findOne: async (query) => {
      const user = users.find((u) => u.email === query.email);
      if (!user) throw new Error("No matching item found");
      return user;
    },
  });
});

describe("Chapter 6. Securing Your API Tests", () => {
  test("should return 200 and authentication successful", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "alice@derp.com",
      password: "alice123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Authentication successful"
    );
  });

  test("should return 401 with Unauthorized for invalid password", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "alice@derp.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized");
  });

  test("should return 401 with Unauthorized for nonexistent email", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "nonexistent@derp.com",
      password: "anyPassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Unauthorized");
  });

  test("should return 400 when missing email or password", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Email and password are required"
    );
  });
});

describe("Chapter Seven: API Tests", () => {
  test("should return 200 with 'Security questions successfully answered'", async () => {
    const response = await request(app)
      .post("/api/users/bob@derp.com/verify-security-question")
      .send([{ answer: "blue" }, { answer: "pizza" }]);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Security questions successfully answered"
    );
  });

  test("should return 400 with 'Bad Request' for invalid schema", async () => {
    const response = await request(app)
      .post("/api/users/alice@derp.com/verify-security-question")
      .send([{ wrongKey: "blue" }]);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid request body");
  });

  test("should return 401 with 'Unauthorized' for incorrect answers", async () => {
    const response = await request(app)
      .post("/api/users/alice@derp.com/verify-security-question")
      .send([{ answer: "wrong" }, { answer: "incorrect" }]);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});
