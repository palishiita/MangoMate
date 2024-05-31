// server/controllers/posts.js
import Post from '../models/Post.js';
import User from '../models/User.js';
import { predictComment } from '../ml-model/predict.js';

/* CREATE POST */
export const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const picturePath = req.file ? req.file.filename : req.body.picturePath;

    if (!userId || !description || !picturePath) {
      return res.status(400).json({ message: "Missing required fields for post creation." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Error creating post", error: err.message });
  }
};

/* READ POST */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find().lean();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).lean();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* LIKE POST */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const { userId } = req.body;
    const isLiked = post.likes.get(userId) || false;

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    await post.save(); 
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ADD COMMENT TO POST */
export const addCommentToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, commentText } = req.body;

    if (!commentText) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    const isToxic = await predictComment(commentText);
    if (isToxic) {
      return res.status(400).json({ message: "The following comment violates terms and conditions of the app." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      userId,
      userFirstName: user.firstName,
      userLastName: user.lastName,
      commentText,
      userPicturePath: user.picturePath,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
};

/* ADD REPLY TO COMMENT */
export const addReplyToComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId, replyText } = req.body;

    if (!replyText) {
      return res.status(400).json({ message: "Reply text is required." });
    }

    const isToxic = await predictComment(replyText);
    if (isToxic) {
      return res.status(400).json({ message: "The following reply violates terms and conditions of the app." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const reply = {
      userId,
      userFirstName: user.firstName,
      userLastName: user.lastName,
      replyText,
      userPicturePath: user.picturePath,
      createdAt: new Date(),
    };

    comment.replies.push(reply);
    await post.save();
    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ message: "Error adding reply", error: err.message });
  }
};

/* DELETE POST */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post", error: err.message });
  }
};

export default {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  addCommentToPost,
  addReplyToComment,
  deletePost,
};