const { Router } = require("express");
const { allPosts, createPost } = require("../controllers/postController");
const {postUpload}  = require("../utils/imageUploads");
const verifyToken = require("../middlewares/authenticator");

const router = Router();

/**
 * @swagger
 *
 */
router.get("", allPosts);

/**
 * @swagger
 */
router.post("", verifyToken, postUpload.single("featuredImage"), createPost);

module.exports = router;
