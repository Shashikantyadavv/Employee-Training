const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(verified.userId);
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Only admins can perform this action" });
  }
};

module.exports = { authenticateToken, checkAdmin };
