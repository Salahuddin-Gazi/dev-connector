// const mongoose = require("mongoose");
import mongoose from "mongoose";
// const config = require("config");
import config from "config";
const db = config.get("mongoURI");

export const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("Mongo DB Connected ....");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
