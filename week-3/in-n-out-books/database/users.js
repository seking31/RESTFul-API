/**
 * Author: Sara King
 * Date: 7/16/2025
 * File Name: users.js
 * Description: User data with security questions
 */

const Collection = require("./collection");
const bcrypt = require("bcryptjs");

// Array of user objects with security questions
const users = new Collection([
  {
    id: 1,
    email: "alice@derp.com",
    password: bcrypt.hashSync("alice123", 10),
    securityQuestions: [{ answer: "green" }, { answer: "cat" }],
  },
  {
    id: 2,
    email: "bob@derp.com",
    password: bcrypt.hashSync("bob456", 10),
    securityQuestions: [{ answer: "blue" }, { answer: "pizza" }],
  },
  {
    id: 3,
    email: "charlie@derp.com",
    password: bcrypt.hashSync("charlie789", 10),
    securityQuestions: [{ answer: "red" }, { answer: "soccer" }],
  },
]);

module.exports = users;
