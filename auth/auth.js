const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { validator, loginValidate } = require("../utils/validator");

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
          const user = await User.findOne({ where: { email: email } }) || await User.findOne({where: {username: email}});
          if (!user) {
            return res
              .status(400)
              .json({ error: "The user with this email doesn't exist" });
          }
          const comparePwd = await bcrypt.compare(password, user.password);
          if (!comparePwd) {
            return res
              .status(400)
              .json({ error: "Your password is incorrect." });
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
          return res.status(200).json({token});
    } catch (error) {
        console.log("Error occurred while logging in", error)
        return res.status(500).json({error: "An internal error occurred"})
    }

};

module.exports ={ registerUser, loginUser};
