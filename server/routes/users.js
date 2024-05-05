// server/routes/users.js
import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, location, occupation } = req.body;

  try {
      const updatedUser = await User.findByIdAndUpdate(id, {
          $set: {
              firstName,
              lastName,
              location,
              occupation
          }
      }, { new: true }); // {new: true} ensures the returned document is the updated one

      res.json(updatedUser);
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Failed to update user' });
  }
});

export default router;
