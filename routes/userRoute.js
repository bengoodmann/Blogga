const { Router } = require("express");
const {
  registerUser,
  loginUser,
  changePassword,
  requestForPasswordReset,
  resetPassword,
  emailVerification,
} = require("../auth/auth");
const { profileUpload } = require("../utils/imageUploads");
const {
  userProfileView,
  profileEdit,
  changeProfilePicture,
  createAboutPage,
  deleteUser,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/authenticator");

const router = Router();

/**
 * @swagger
 */
router.post("/register", registerUser);

/**
 * @swagger
 */
router.post("/login", loginUser);

/**
 * @swagger
 */
router.get("/verify/:token", emailVerification);

/**
 * @swagger
 */
router.post("/profile/change-password", verifyToken, changePassword);

/**
 * @swagger
 */
router.post("/request-password-reset", requestForPasswordReset);

/**
 * @swagger
 */
router.post("/password-reset-done/:token", resetPassword);

/**
 * @swagger
 */
router.get("/profile/:userId", verifyToken, userProfileView);

/**
 * @swagger
 */
router.put("/profile/:userId/edit", verifyToken, profileEdit);

/**
 * @swagger
 */
router.post("/profile/:userId/edit-about", verifyToken, createAboutPage);

/**
 * @swagger
 */
router.post(
  "/profile/:userId/update-profile-picture",
  verifyToken,
  profileUpload.single("profileImage"),
  changeProfilePicture
);

/**
 * @swagger
 */
router.delete("/profile/:userId", verifyToken, deleteUser)

module.exports = router;
