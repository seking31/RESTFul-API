/**
 * Author: Sara King
 * Date: 7/16/2025
 * File Name: users.js
 * Description: User data
 */

// Require statement
const Collection = require("./collection");
const bcrypt = require("bcryptjs");

// Array of user objects
const users = new Collection([
  {
    id: 1,
    email: "alice@derp.com",
    password: bcrypt.hashSync("alice123", 10),
  },
  {
    id: 2,
    email: "bob@derp.com",
    password: bcrypt.hashSync("bob456", 10),
  },
  {
    id: 3,
    email: "charlie@derp.com",
    password: bcrypt.hashSync("charlie789", 10),
  },
]);

module.exports = users; // export the users collection
