// server/routes/posts.js
import express from "express";
import { createPost, getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js"; 

const router = express.Router();

/* CREATE */
router.post("/createPost", verifyToken, upload.single("file"), createPost);

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;
