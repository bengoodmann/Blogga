const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const crypto = require("crypto");
const { validator, loginValidate } = require("../utils/validator");
const {
  sendEmailVerification,
  sendPasswordChangeEmail,
  sendPasswordResetEmail,
} = require("../utils/emailSender");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const validatorError = validator(name, email, password);

    if (validatorError) {
      return res.status(400).json({ error: validatorError });
    }

    const user = await User.findOne({ where: { email: email } });
    if (user) {
      return res.status(400).json({ error: "A user with this email exists" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "A featured image is required" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      profileImage: req.file ? `/profile_images/${req.file.filename}` : "",
    });
    sendEmailVerification(user);
    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validatorError = loginValidate(email, password);

    if (validatorError) {
      return res.status(400).json({ error: validatorError });
    }
    const user =
      (await User.findOne({ where: { email: email } })) ||
      (await User.findOne({ where: { username: email } }));
    if (!user) {
      return res
        .status(400)
        .json({ error: "The user with this email doesn't exist" });
    }
    const comparePwd = await bcrypt.compare(password, user.password);
    if (!comparePwd) {
      return res.status(400).json({ error: "Your password is incorrect." });
    }

    const token = jwt.sign(
      {
        user: {
          id: user.id,
          email: user.email,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "31d" }
    );
    return res.status(200).json({ token });
  } catch (error) {
    console.log("Error occurred while logging in", error);
    return res.status(500).json({ error: "An internal error occurred" });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword && !newPassword) {
      return res.status(400).json({ error: "Both fields are required" });
    }
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const checkPwd = await bcrypt.compare(oldPassword, user.password);
    if (!checkPwd) {
      return res.status(400).json({ error: "You entered a wrong password" });
    }
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashNewPassword;
    await user.save();
    await sendPasswordChangeEmail(user);
    return res.status(200).json({ error: "Password changed successfully" });
  } catch (error) {
    console.log("Error occurred while changing password", error);
    return res.status(500).json({ error: "An internal error occurred" });
  }
};

const requestForPasswordReset = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res
        .status(400)
        .json({ error: "Email is required for this request" });
    }
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ error: "The user doesn't exist" });
    }
    user.passwordChangeToken = crypto.randomBytes(20).toString("hex");
    await user.save();
    await sendPasswordResetEmail(user);
    return res
      .status(200)
      .json("Check your inbox for the password reset email");
  } catch (error) {
    console.log(
      "Error occurred while trying to send a forget password request",
      error
    );
    return res.status(500).json({ error: "An internal error occurred" });
  }
};

const resetPassword = async (req, res) => {
  const token = req.params.token;
  const password = req.body.password;
  const user = await User.findOne({ where: { passwordChangeToken: token } });
  if (!user) {
    return res.status(404).json({ error: "The user doesn't exist" });
  }
  if (!password) {
    return res.status(400).json({ error: "Your new password is required" });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  user.password = hashPassword;
  await user.save();
  await sendPasswordChangeEmail(user);
  return res.status(200).json("Password was changed successfully");
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
  requestForPasswordReset,
};
