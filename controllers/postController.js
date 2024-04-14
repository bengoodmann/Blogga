const { calculate } = require("calculate-readtime");
const path = require("path");
const Post = require("../models/postModel");
const User = require("../models/userModel");

const allPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    if (posts.length === 0) {
      return res.status(404).json({ error: "No posts found" });
    }
    return res.status(200).json({ posts });
  } catch (error) {
    console.log("Error occurred while fetching posts", error);
    return res
      .status(500)
      .json({ error: "An internal error has occurred while fetching posts" });
  }
};

const createPost = async (req, res, u) => {
  try {
    const user = req.user.id;
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({ error: "A blog post must have a title" });
    }
    if (!content) {
      return res
        .status(400)
        .json({ error: "I don't know why you left the content out" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "A featured image is required" });
    }
    const featuredImage = `/posts_images/${req.file.filename}`;

    const readtime = calculate(content);

    const newPost = await Post.create({
      title,
      content,
      readingTime: readtime,
      featuredImage,
      userId: user,
    });
    return res.status(201).json({ newPost });
  } catch (error) {
    console.log("Error occurred creating post", error);
    return res
      .status(500)
      .json({ error: "An internal error has occurred while creating post" });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post is not found" });
    }
    return res.status(200).json({ post });
  } catch (error) {
    console.log("Error occurred while fetching post", error);
    return res
      .status(500)
      .json({ error: "An internal error has occurred while fetching post" });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({
      where: { id: postId, userId: req.user.id },
    });
    if (!post) {
      return res.status(404).json({ message: "Post is not found" });
    }
    await post.destroy();
    return res.status(204).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error occurred while deleting post", error);
    return res.status(500).json({
      error: "An internal error has occurred while deleting post",
    });
  }
};

const updatePost = async (req, res) => {
  const user = req.user.id;
  const { title, content } = req.body;
  const postId = req.params.id
  const post = await Post.findOne({where: {id: postId, userId: user}})
  if(!post){
    return res.status(404).json({message: "Post is not found"})
  }
  const readtime = calculate(content);
  post.title = title || post.title
  post.content = content || post.content
  post.readingTime = readtime
  await post.save()
  return res.status(200).json({message: "Post update successfully"})
};

module.exports = { allPosts, createPost, getPostById, deletePost, updatePost };
