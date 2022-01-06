import auth from "../../middleware/auth.js";
import Post from "../../models/Post.js";
import Profile from "../../models/Profile.js";
import User from "../../models/User.js";
import config from "config";
import request from "request";
import { check, validationResult } from "express-validator";
import express from "express";
const router = express.Router();

//  @route  POST api/posts
//  @desc   Create a post
//  @access Private
router.post("/", auth, [check("text").not().isEmpty().withMessage("Text is required")], async (req, res) => {
  // Checking errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    // Getting the user for name & id
    const user = await User.findById(req.user.id).select("-password");
    // Creating new post
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      user: req.user.id,
    });
    const post = await newPost.save();
    res.status(200).json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//  @route  GET api/posts
//  @desc   Get the posts
//  @access Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//  @route  GET api/posts/:id
//  @desc   Get post by Id
//  @access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Checking for not valid post
    if (!post) return res.status(404).json({ msg: "Post Not Found, Try Again Later" });
    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") return res.status(404).json({ msg: "Post Not Found, Try Again Later" });
    res.status(500).send("Server Error");
  }
});

//  @route  DELETE api/posts/:id
//  @desc   Delete the post
//  @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Checking for not valid post
    if (!post) return res.status(404).json({ msg: "Post Not Found, Try Again Later" });

    // Checking the right post owner
    if (post.user.toString() !== req.user.id) return res.status(404).json({ msg: "User not authorized" });

    // delete post
    await post.remove();
    res.json({ msg: "Post deleted successfully" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") return res.status(404).json({ msg: "Post Not Found, Try Again Later" });
    res.status(500).send("Server Error");
  }
});

//  @route  PUT api/posts/likes/:id
//  @desc   Like the post
//  @access Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Check if the user liked it
    if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    // Liking the post
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//  @route  PUT api/posts/likes/:id
//  @desc   Unlike the post
//  @access Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Checking if it is not liked
    if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: "Post has not been liked yet" });
    }
    // Finding the index
    const removeIndex = post.likes.indexOf(req.user.id);
    // unlike by removing the user
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
  }
});

//  @route  POST api/posts/comment/:id // :id for the post
//  @desc   Comment the post
//  @access Private
router.post("/comment/:id", auth, [check("text").not().isEmpty().withMessage("Text is required...")], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.id);
    const newComments = {
      text: req.body.text,
      user: req.user.id,
      name: user.name,
    };
    post.comments.unshift(newComments);
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error!");
  }
});

//  @route  DELETE api/comment/:id/:comment_id // an user can comment multiple times
//  @desc   Delete a comment
//  @access Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find((comment) => comment.id === req.params.comment_id);
    // Checking the comment
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "user is not authorized" });
    }
    // Find the remove index
    const removeIndex = post.comments.indexOf(req.params.comment_id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json({ msg: "Comment deleted successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error!");
  }
});

export default router;
