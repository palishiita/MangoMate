// client/src/scenes/widgets/PostWidget.jsx
import {
  ChatBubbleOutlineOutlined,
  ShareOutlined,
  DeleteOutline
} from "@mui/icons-material";
import { Box, IconButton, Typography, InputBase, Button } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import React, { useState, useEffect } from 'react'
import { format } from 'date-fns';
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import mangoUnlikedIcon from "./mango-unliked.png";
import mangoLikedIcon from "./mango-liked.png";
import noImage from "./no-image.jpg";


const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyIndex, setReplyIndex] = useState(-1);
  const [replyText, setReplyText] = useState("");
  const [commentsList, setCommentsList] = useState(comments); 
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUserPicturePath = useSelector((state) => state.user.picturePath);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const postDate = format(new Date(createdAt), "dd-MM-yyyy haaa");
  const primaryColor = "#F4BB44";

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };


  const deletePost = async () => {
    const url = `http://localhost:3001/posts/${postId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      // Post deleted successfully
    } else {
      console.error("Failed to delete post");
    }
  };

  const handleCommentChange = (event) => setNewComment(event.target.value);
  
  const handleReplyChange = (event) => setReplyText(event.target.value);

  useEffect(() => {
    setCommentsList(comments); // Update comments when props change
  }, [comments]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: loggedInUserId,
        commentText: newComment,
        userPicturePath: loggedInUserPicturePath  // Send current user's picture path
      }),
    });

    if (response.ok) {
      const newCommentData = await response.json();
      setCommentsList([...commentsList, newCommentData]);  // Update comments list with the new comment
      setNewComment('');
    } else {
      console.error('Failed to post comment');
    }
  };

  const handleReply = (index) => setReplyIndex(index);
  const handlePostReply = () => {
    // Add your backend reply posting logic here
    setReplyIndex(-1);
    setReplyText("");
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={`${location} • Posted ${postDate}`}
        userPicturePath={userPicturePath}
      />

      <IconButton
        onClick={deletePost}
        sx={{
          color: "red",             // This sets the color of the icon itself
          backgroundColor: "#ffcccc", // Light red background color
          borderRadius: "100%",       // Makes the button round
          marginLeft: 55,
          "&:hover": {
            backgroundColor: "#ffaaaa",
          },
          padding: "5px"            // Adjust padding to ensure the icon fits well within the circle
        }}
        aria-label="Delete Post"
      >
        <DeleteOutline />
      </IconButton>

      
      <Typography color="text.primary" sx={{ mt: "1rem" }}>
        {description}
      </Typography>

      {/* Display Image */}
      {picturePath && picturePath.match(/\.(jpeg|jpg|png)$/) && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}

      {/* Display Video */}
      {picturePath && picturePath.match(/\.(mp4|avi)$/) && (
        <video
          width="100%"
          height="auto"
          controls
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}

      {/* Display Audio */}
      {picturePath && picturePath.match(/\.(mp3|wav)$/) && (
        <AudioPlayer
          src={`http://localhost:3001/assets/${picturePath}`}
          style={{ marginTop: "0.75rem", width: "100%" }}
          layout="stacked-reverse"
        />
      )}

      {/* Likes and Comments Section */}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              <img src={isLiked ? mangoLikedIcon : mangoUnlikedIcon} alt="Mango" style={{ width: "24px", height: "24px", color: primaryColor }} />
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {/* Comments Section */}      
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: primaryColor,
                borderRadius: "10px",
                p: "10px",
                my: "5px",
                color: "text.primary",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box display="flex" alignItems="center">
                <img
                  src={userPicturePath}
                  alt="Profile"
                  style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px" }}
                  onError={(e) => {
                      console.error("Error loading image at: ", e.target.src); // Check what src was attempted
                      e.target.onerror = null;
                      e.target.src = noImage;
                  }}
                
                />

                <Typography>{comment.text}</Typography>
              </Box>

              {replyIndex === index && (
                <Box mt="1rem" display="flex" alignItems="center">
                  <InputBase
                    placeholder="Reply..."
                    value={replyText}
                    onChange={handleReplyChange}
                    id={`replyText-${index}`} // Unique ID, especially important if multiple on the page
                    name="replyText" // Name attribute for form handling
                    sx={{
                      flexGrow: 1,
                      mr: "1rem",
                      borderRadius: "10px",
                      backgroundColor: "#E0E0E0",
                      p: "0.5rem",
                      fontSize: "14px",
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handlePostReply}
                    sx={{
                      backgroundColor: primaryColor,
                      color: "white",
                      borderRadius: "5px",
                      fontSize: "12px",
                      height: "30px",
                      py: 0,
                    }}
                  >
                    POST
                  </Button>
                </Box>
              )}
              {replyIndex !== index && (
                <Button
                  onClick={() => handleReply(index)}
                  sx={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    backgroundColor: "#FFF",
                    color: primaryColor,
                    borderRadius: "5px",
                    fontSize: "12px",
                    padding: "5px",
                    height: "24px",
                  }}
                >
                  Reply
                </Button>
              )}
            </Box>
          ))}
          {/* Comment Input */}
          <Box display="flex" alignItems="center" mt="1rem">
            <InputBase
              placeholder="Add a comment..."
              value={newComment}
              onChange={handleCommentChange}
              sx={{
                flexGrow: 1,
                mr: "1rem",
                borderRadius: "10px",
                backgroundColor: "#E0E0E0",
                p: "0.5rem",
                fontSize: "14px",
              }}
            />
            <Button
              variant="contained"
              onClick={handlePostComment}
              sx={{
                backgroundColor: primaryColor,
                color: "white",
                borderRadius: "5px",
                fontSize: "12px",
                height: "30px",
                py: 0,
              }}
            >
              POST
            </Button>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;