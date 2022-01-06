// const express = require("express"); //importing express
import express from "express";
import { connectDB } from "./config/db.js";
import users from "./routes/api/users.js";
import posts from "./routes/api/posts.js";
import auth from "./routes/api/auth.js";
import profile from "./routes/api/profile.js";
import cors from "cors";
import * as path from "path";

const app = express(); //init express
app.use(cors());
connectDB();

// Init Middleware
app.use(express.json({ limit: "40000kb", extended: true }));

// Define Routes
// (❁´◡`❁)
// app.get("/", (req, res) => {
//   res.send("API Running");
// });
// @ Users
app.use("/api/users", users);

// @ Auth
app.use("/api/auth", auth);

// @ profile
app.use("/api/profile", profile);

// @ posts
app.use("/api/posts", posts);

// Serve static assets in productuion
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT; //declaring port

//Connecting Port
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
