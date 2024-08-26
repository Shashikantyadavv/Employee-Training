const upload = require("../middleware/multerConfig");
const Video = require("../models/Video");

// Fetch all videos in order
const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ order: 1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a new video with file upload
const addVideo = async (req, res) => {
  const { title, order, description } = req.body;
  const videoFile = req.file;

  try {
    const newVideo = new Video({
      title,
      description,
      url: videoFile ? videoFile.path.replace(/\\/g, "/") : "",
      order: Number(order),
    });

    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getAllVideos, addVideo };
