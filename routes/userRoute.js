const { Router } = require("express");
const {registerUser, loginUser} = require("../auth/auth");
const { profileUpload } = require("../utils/imageUploads");

const router = Router();

/**
 * @swagger
 */
router.post("/register", profileUpload.single("profileImage"), registerUser);
router.post("/login", loginUser)

module.exports = router;
