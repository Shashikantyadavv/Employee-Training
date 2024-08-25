const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// mongoose
//   .connect("mongodb://localhost:27017/training")
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

mongoose
  .connect("mongodb+srv://sashikant12rao:4RbwhEy2RRJ26c0C@cluster0.xomqr.mongodb.net/")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Video Schema
const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true }, 
  order: { type: Number, required: true }, 
});

const Video = mongoose.model("Video", VideoSchema);

const progressSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
  progress: { type: Number, default: 0 },
  lastWatched: { type: Number, default: 0 }, 
  current: {type: Boolean, default:false},
});

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" }, 
  profileImage: String,
  progress: [progressSchema],
});

const User = mongoose.model("User", UserSchema);

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });

// User Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user", 
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
    expiresIn: "1h",
  });
  res.json({ token, user });
});

// Middleware to authenticate user by token
const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token.split(" ")[1], "your_jwt_secret");
    const user = await User.findById(verified.userId);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Middleware to check admin
const checkAdmin = (req, res, next) => {
  const user = req.user; 
  if (user && user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ error: "Forbidden: Only admins can perform this action" });
  }
};

// Get User Details
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// API to get videos in order
app.get("/api/videos", async (req, res) => {
  const videos = await Video.find().sort({ order: 1 });
  res.json(videos);
});

// API to get user progress
app.get("/api/progress", authenticateToken, async (req, res) => {
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
});

// API to update user progress
app.post("/api/progress", authenticateToken, async (req, res) => {
  const { userId, videoId, progress, lastWatched, current } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingProgress = user.progress.find(
      (p) => p.videoId && p.videoId.toString() === videoId
    );

    if (existingProgress) {
      if (existingProgress.progress < 100) {
        existingProgress.progress = Math.max(existingProgress.progress, progress);
        existingProgress.lastWatched = lastWatched;
      }
    } else {
      user.progress.push({
        videoId,
        progress,
        lastWatched,
        current,
      });
    }

    await user.save();
    res.json({ message: "Progress updated successfully" });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Add a new video with file upload
app.post("/api/videos/upload", upload.single("videoFile"), async (req, res) => {
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
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
