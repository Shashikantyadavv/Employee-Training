const express = require("express");
const { getAllVideos, addVideo } = require("../controllers/videoController");
const { authenticateToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig");

const router = express.Router();

router.get("/", getAllVideos);
router.post("/", authenticateToken, upload.single("videoFile"), addVideo);

module.exports = router;
