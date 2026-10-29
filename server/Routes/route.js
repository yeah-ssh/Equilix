// app/routes.js
const express = require("express");
const authController = require("../Controllers/auth.js");
const chatController = require("../Controllers/chat.js");

const router = express.Router();

// Auth Routes
router.post("/signup", authController.postSignup);
router.post("/login", authController.postLogin);
router.post("/logout", authController.logout);

// AI Routes
router.post("/chat", chatController.postChat);

module.exports = router;
