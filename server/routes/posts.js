// server/routes/posts.js
import express from "express";
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  addCommentToPost,
  addReplyToComment,
  deletePost,
  editPost, // Added this line
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js"; 

const router = express.Router();

/* CREATE */
router.post("/createPost", verifyToken, upload.single("file"), createPost);

/* ADDING COMMENTS TO POST */
router.post('/:postId/comments', verifyToken, addCommentToPost);

/* REPLYING TO COMMENTS*/
router.post('/:postId/comments/:commentId/replies', verifyToken, addReplyToComment);

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id", verifyToken, editPost); // Added this line

/* DELETE */
router.delete("/:id", verifyToken, deletePost);

export default router;