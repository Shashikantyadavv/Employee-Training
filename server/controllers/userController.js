const User = require("../models/User");

// Get User Details
const getUserDetails = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get User Progress
const getUserProgress = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate("progress.videoId");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.progress);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update User Progress
const updateUserProgress = async (req, res) => {
  const { userId, videoId, progress, lastWatched, current } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingProgress = user.progress.find(
      (p) => p.videoId.toString() === videoId
    );

    if (existingProgress) {
      existingProgress.progress = progress;
      existingProgress.lastWatched = lastWatched;
      existingProgress.current = current;
    } else {
      user.progress.push({ videoId, progress, lastWatched, current });
    }

    await user.save();
    res.json(user.progress);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUserDetails, getUserProgress, updateUserProgress };
