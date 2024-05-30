// server/routes/users.js
import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateUserDetails,
  searchUsers // Import the new controller function
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/search", verifyToken, searchUsers);

/* UPDATE */
router.patch("/:id", verifyToken, updateUserDetails);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
