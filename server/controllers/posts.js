//server/controllers/posts.js
import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
// server/controllers/posts.js

export const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    // Extract filename from the uploaded file
    const picturePath = req.file ? req.file.filename : req.body.picturePath;

    // Log received data for debugging
    console.log("Received Data:", { userId, description, picturePath });

    // Check if any required field is missing
    if (!userId || !description || !picturePath) {
      console.error("Missing required fields for post creation:", { userId, description, picturePath });
      return res.status(409).json({ message: "Missing required fields for post creation." });
    }

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(409).json({ message: "User not found." });
    }

    // Create a new post
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath, // Set the multimedia file path
      likes: {},
      comments: [],
    });

    // Save and return all posts
    await newPost.save();
    const posts = await Post.find();
    res.status(201).json(posts);
  } catch (err) {
    console.error("Error creating post:", err.message);
    res.status(409).json({ message: "Error creating post", error: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};