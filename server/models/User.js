const mongoose = require("mongoose");

const progressSchema = require("./Progress").schema;

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profileImage: String,
  progress: [progressSchema],
});

module.exports = mongoose.model("User", userSchema);
