const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  order: { type: Number, required: true },
});

module.exports = mongoose.model("Video", videoSchema);
