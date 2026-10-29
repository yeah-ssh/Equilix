// index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// const session = require("express-session");
const routes = require("./Routes/route.js");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
// Comma-separated list of sites allowed to call the API
const CORS_ORIGINS = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",").map((o) => o.trim());

mongoose
  .connect(process.env.MONGO_URI)
  .catch((err) => console.error("MongoDB connection error:", err.message));

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(
  cors({
    origin: CORS_ORIGINS,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: "your_session_secret",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// Routes
app.get("/api/health", (req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});
app.use("/api", routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
