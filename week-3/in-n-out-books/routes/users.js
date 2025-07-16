const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const defaultUsers = require("../database/users.js");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = req.users || defaultUsers;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await users.findOne({ email });

    const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({ message: "Authentication successful" });
  } catch (err) {
    if (err.message === "No matching item found") {
      console.log(20);
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
