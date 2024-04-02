const { DataTypes } = require("sequelize");
const crypto = require("crypto");
const sequelize = require("../config/db");

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
    defaultValue: "",
  },
  readingTime: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  audioFile: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
});


module.exports = Post