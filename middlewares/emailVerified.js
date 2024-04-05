const User = require("../models/userModel");

const isEmailVerified = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user || !user.isVerified) {
      return res.status(403).json({ error: "Kindly verify your email" });
    }
    next();
  } catch (error) {
    console.error("Error checking email verification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = isEmailVerified;
