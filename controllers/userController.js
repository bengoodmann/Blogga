const path = require("path");
const fs = require("fs");
const { User, About } = require("../models/userModel");
const Post = require("../models/postModel");

const userProfileView = async (req, res) => {
  try {
    const profileId = req.params.userId;
    const user = await User.findOne({
      where: { id: profileId },
      include: [{ model: Post }, { model: About }],
      attributes: {
        exclude: [
          "id",
          "emailVerificationToken",
          "passwordChangeToken",
          "password",
        ],
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const profileEdit = async (req, res) => {
  try {
    const { name, username } = req.body;
    const profileId = req.params.userId;
    const userId = req.user;
    if (profileId === userId.id) {
      const checkUsername = await User.findOne({
        where: { username: username },
      });
      if (checkUsername) {
        return res
          .status(400)
          .json({ error: "Username is taken! Choose another one" });
      }
      const updateDetails = {
        name: name || userId.name,
        username: username || userId.username,
      };

      await User.update(updateDetails, { where: { id: userId.id } });
      return res.status(200).json({ message: "Profile edit was successful" });
    }
    return res
      .status(400)
      .json({ error: "Sorry, you can't edit another user's profile" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const changeProfilePicture = async (req, res) => {
  try {
    const profileId = req.params.userId;
    const userId = req.user.id;
    const user = await User.findOne({ where: { id: userId } });
    if (user) {
      if (profileId === userId) {
        const prv = user.profileImage;

        if (req.file) {
          const updateDetails = {
            profileImage: `/profile_images/${req.file.filename}`,
          };

          await User.update(updateDetails, { where: { id: userId } });
        }
        if (prv) {
          const imagePath = path.join(__dirname, "..", "public", prv);
          fs.unlinkSync(imagePath);
        }

        return res
          .status(200)
          .json({ message: "Profile picture updated successful" });
      }
    }
    return res.status(404).json({ error: "User is not found" });
  } catch (error) {
    console.error("Error updating user's profile picture:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const createAboutPage = async (req, res) => {
  try {
    const profileId = req.params.userId;
    const userId = req.user.id;
    const user = await User.findOne({ where: { id: userId } });
    if (user) {
      if (userId === profileId) {
        const about = await About.create({
          userId: userId,
          ...req.body,
        });
        return res.status(201).json({ about });
      }
    }
    return res.status(404).json({ error: "User is not found" });
  } catch (error) {
    console.error("Error creating about page:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const profileId = req.params.userId;
    const userId = req.user.id;
    const user = await User.findOne({ where: { id: userId } });
    if (user) {
      if (userId === profileId) {
        const posts = await Post.findAll({ where: { userId: userId } });

        const postsImage = [];
        posts.forEach((post) => {
          if (post.featuredImage) {
            postsImage.push(post.featuredImage);
          }
        });

        postsImage.forEach((imagePath) => {
          const pathImg = path.join(__dirname, "..", "public", imagePath);
          fs.unlink(pathImg, (error) => {
            if (error) {
              console.error("Error deleting image:", error);
            }
          });
        });

        if (user.profileImage) {
          const imagePath = path.join(
            __dirname,
            "..",
            "public",
            user.profileImage
          );
          fs.unlinkSync(imagePath);
        }

        await user.destroy();
        return res.status(204).end();
      }
    }
    return res.status(404).json({ error: "User is not found" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  userProfileView,
  profileEdit,
  changeProfilePicture,
  createAboutPage,
  deleteUser,
};
