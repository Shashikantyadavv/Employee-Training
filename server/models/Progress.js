const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
  progress: { type: Number, default: 0 },
  lastWatched: { type: Number, default: 0 },
  current: { type: Boolean, default: false },
});

module.exports = mongoose.model("Progress", progressSchema);
