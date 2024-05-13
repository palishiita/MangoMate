// server/models/Post.js
import mongoose from "mongoose";

// Schema for individual replies
const replySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userFirstName: {
    type: String,
    required: true
  },
  userLastName: {
    type: String,
    required: true
  },
  userPicturePath: String,
  replyText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Schema for individual comments
const commentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userFirstName: {
    type: String,
    required: true
  },
  userLastName: {
    type: String,
    required: true
  },
  userPicturePath: String,
  commentText: {
    type: String,
    required: true
  },
  replies: [replySchema],  // Embedding replies schema
  createdAt: {
    type: Date,
    default: Date.now  // Automatically captures the date and time of comment creation
  }
});

// Main post schema
const postSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  location: String,
  description: String,
  picturePath: String,
  userPicturePath: String,
  likes: {
    type: Map,
    of: Boolean
  },
  comments: [commentSchema],  // Embedding comments schema
  createdAt: {
    type: Date,
    default: Date.now  // Automatically captures the date and time of post creation
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;