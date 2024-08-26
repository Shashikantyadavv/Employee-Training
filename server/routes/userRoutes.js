const express = require("express");
const {
  getUserDetails,
  getUserProgress,
  updateUserProgress,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateToken, getUserDetails);
router.get("/progress", authenticateToken, getUserProgress);
router.post("/progress", authenticateToken, updateUserProgress);

module.exports = router;
