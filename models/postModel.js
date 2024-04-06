const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const {User} = require("./userModel")


const Post = sequelize.define("Post", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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
  featuredImage: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, 
    },
  },
  readingTime: {
    type: DataTypes.STRING,
  },
});


User.hasOne(Post, { foreignKey: "userId", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "userId" });

module.exports = Post;
