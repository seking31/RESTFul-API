const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Ajv = require("ajv");
const createError = require("http-errors");

const ajv = new Ajv({ allErrors: true, strict: false });
const defaultUsers = require("../database/users.js");

// JSON Schema for validation
const securityQuestionsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      answer: { type: "string" },
    },
    required: ["answer"],
    additionalProperties: false,
  },
};

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
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/:email/verify-security-question", async (req, res) => {
  try {
    const { email } = req.params;
    const users = req.users || defaultUsers;

    console.log(email);

    const validate = ajv.compile(securityQuestionsSchema);
    const isValid = validate(req.body);

    if (!isValid) {
      console.error("Bad Request: Invalid request body", validate.errors);
      return res.status(400).json({
        message: "Invalid request body",
        errors: validate.errors,
      });
    }

    const user = await users.findOne({ email });
    if (!user || !user.securityQuestions) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const submittedAnswers = req.body.map((q) => q.answer);
    const storedAnswers = user.securityQuestions.map((q) => q.answer);

    const allMatch =
      submittedAnswers.length === storedAnswers.length &&
      submittedAnswers.every((ans, i) => ans === storedAnswers[i]);

    if (!allMatch) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res
      .status(200)
      .json({ message: "Security questions successfully answered" });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
