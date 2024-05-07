// server/routes/posts.js
import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import Post from "../models/Post.js";  // Import your Post model (adjust path as necessary)

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch('/updateUserPosts', verifyToken, async (req, res) => {
  const { userId, firstName, lastName, location } = req.body;

  if (!userId || !firstName || !lastName || !location) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Update the posts' fields, assuming they have the necessary fields
    const updatedPosts = await Post.updateMany(
      { userId },
      { $set: { userFirstName: firstName, userLastName: lastName, userLocation: location } }
    );
    
    if (updatedPosts.modifiedCount === 0) {
      return res.status(404).json({ message: 'No posts found for the user' });
    }

    res.json({ message: 'Posts updated successfully', updatedPosts });
  } catch (err) {
    res.status(500).json({ message: 'Error updating posts', error: err.message });
  }
});

export default router;