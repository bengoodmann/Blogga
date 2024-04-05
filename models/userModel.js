const { DataTypes } = require("sequelize");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUIDV4,
    defaultValue: () => crypto.randomUUID(),
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  profileImage: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      len: [4, 30],
    },
  },
  name: {
    type: DataTypes.STRING,
    validate: {
      len: [4, 50],
    },
  },
  emailVerificationToken: {
    type: DataTypes.STRING,
    defaultValue: () => crypto.randomBytes(30).toString("hex"),
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passwordChangeToken: {
    type: DataTypes.STRING,
  },
});

User.addHook("beforeValidate", async (user, options) => {
  user.username = user.email.split("@")[0];
  const isUsername = await User.findOne({ where: { username: user.username } });
  if (isUsername) {
    user.username += crypto.randomBytes(3).toString("hex");
  }

  const hashPwd = await bcrypt.hash(user.password, 10);
  user.password = hashPwd;
});

User.addHook("afterValidate", async (user, options) => {
  user.username = `@${user.username}`;
});

module.exports = User;
