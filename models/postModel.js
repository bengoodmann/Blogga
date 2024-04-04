const { DataTypes } = require("sequelize");
const crypto = require("crypto");
const sequelize = require("../config/db");
const path = require("path");

const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.UUIDV4,
    defaultValue: () => crypto.randomUUID(),
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    maxlength: 50,
    validate: { len: [1, 50] },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  postImage: {
    type: DataTypes.STRING,
  },
  readingTime: {
    type: DataTypes.STRING,
  },
});

module.exports = Post;
