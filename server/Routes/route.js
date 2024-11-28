// app/routes.js
const express = require("express");
const authController = require("../Controllers/auth.js");

const router = express.Router();

// Auth Routes
router.post("/signup", authController.postSignup);
router.post("/login", authController.postLogin);
router.post("/logout", authController.logout);

module.exports = router;
