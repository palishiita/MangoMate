import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChatBubbleOutlineOutlined,
  DeleteOutline,
  EditOutlined,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Typography,
  InputBase,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { setPost } from "state";
import { format } from "date-fns";
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
  const [commentsList, setCommentsList] = useState(comments);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const [replyText, setReplyText] = useState({});
  const [replyIndex, setReplyIndex] = useState(-1);
  const [repliesVisible, setRepliesVisible] = useState({});
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUserPicturePath = useSelector((state) => state.user.picturePath);
  const token = useSelector((state) => state.token);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editDescription, setEditDescription] = useState(description);
  const [editLocation, setEditLocation] = useState(location);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const postDate = format(new Date(createdAt), "dd-MM-yyyy haaa");
  const primaryColor = "#F4BB44";

  useEffect(() => {
    setCommentsList(comments);
    setEditDescription(description);
    setEditLocation(location);
  }, [comments, description, location]);

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

  const handleReplyChange = (event, index) => {
    const newText = event.target.value;
    setReplyText((prev) => ({ ...prev, [index]: newText }));
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: loggedInUserId,
        commentText: newComment,
        userPicturePath: loggedInUserPicturePath,
      }),
    });

    if (response.ok) {
      const newCommentData = await response.json();
      setCommentsList([...commentsList, newCommentData]);
      setNewComment("");
      setErrorMessage("");
    } else {
      const data = await response.json();
      setErrorMessage(data.message);
      setPopupMessage(data.message);
      setIsPopupOpen(true);
    }
  };

  const handlePostReply = async (commentId, index) => {
    const replyContent = replyText[index];

    if (!replyContent || replyContent.trim() === "") {
      console.error("Reply content is empty or undefined.");
      alert("Reply cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comments/${commentId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: loggedInUserId,
          replyText: replyContent,
          userPicturePath: loggedInUserPicturePath,
        }),
      });

      if (response.ok) {
        const replyData = await response.json();
        const updatedComments = commentsList.map((comment, i) => {
          if (comment._id === commentId) {
            return { ...comment, replies: [...(comment.replies || []), replyData] };
          }
          return comment;
        });
        setCommentsList(updatedComments);
        setReplyText((prev) => ({ ...prev, [index]: "" }));
        setErrorMessage("");
      } else {
        const data = await response.json();
        setErrorMessage(data.message);
        setPopupMessage(data.message);
        setIsPopupOpen(true);
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      alert("Failed to post reply. Please try again.");
    }
  };

  const handleEditPost = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: editDescription,
        location: editLocation,
      }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setIsEditDialogOpen(false);
    } else {
      console.error("Failed to edit post");
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setPopupMessage("");
  };

  const toggleRepliesVisibility = (index) => {
    setRepliesVisible((prev) => ({ ...prev, [index]: !prev[index] }));
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
          color: "red",
          backgroundColor: "#ffcccc",
          borderRadius: "100%",
          marginLeft: 55,
          "&:hover": {
            backgroundColor: "#ffaaaa",
          },
          padding: "5px",
        }}
        aria-label="Delete Post"
      >
        <DeleteOutline />
      </IconButton>

      <IconButton
        onClick={() => setIsEditDialogOpen(true)}
        sx={{
          color: "blue",
          backgroundColor: "#ccccff",
          borderRadius: "100%",
          marginLeft: 55,
          marginTop: 1,
          "&:hover": {
            backgroundColor: "#aaaaff",
          },
          padding: "5px",
        }}
        aria-label="Edit Post"
      >
        <EditOutlined />
      </IconButton>

      <Typography color="text.primary" sx={{ mt: "1rem" }}>
        {description}
      </Typography>

      {picturePath && picturePath.match(/\.(jpeg|jpg|png)$/) && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}

      {picturePath && picturePath.match(/\.(mp4|avi)$/) && (
        <video
          width="100%"
          height="auto"
          controls
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}

      {picturePath && picturePath.match(/\.(mp3|wav)$/) && (
        <AudioPlayer
          src={`http://localhost:3001/assets/${picturePath}`}
          style={{ marginTop: "0.75rem", width: "100%" }}
          layout="stacked-reverse"
        />
      )}

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              <img
                src={isLiked ? mangoLikedIcon : mangoUnlikedIcon}
                alt="Mango"
                style={{ width: "24px", height: "24px", color: primaryColor }}
              />
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
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          {commentsList.map((comment, index) => (
            <Box
              key={comment._id || index}
              sx={{
                backgroundColor: primaryColor,
                borderRadius: "10px",
                p: "10px",
                my: "5px",
                color: "black",
                position: "relative",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", width: "100%", backgroundColor: primaryColor }}>
                <img
                  src={comment.userPicturePath ? `http://localhost:3001/assets/${comment.userPicturePath}` : noImage}
                  alt="Profile"
                  onError={(e) => {
                    e.target.src = noImage;
                  }}
                  style={{ width: "35px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
                />
                <Typography sx={{ flexGrow: 1, color: "black" }}>{comment.commentText}</Typography>
              </Box>

              {repliesVisible[index] &&
                comment.replies &&
                comment.replies.map((reply, replyIndex) => (
                  <Box
                    key={replyIndex}
                    sx={{ display: "flex", alignItems: "center", mt: 1, pl: 4, backgroundColor: "#F0F0F0", borderRadius: "10px", p: "10px" }}
                  >
                    <img
                      src={reply.userPicturePath ? `http://localhost:3001/assets/${reply.userPicturePath}` : noImage}
                      alt="Reply Profile"
                      onError={(e) => {
                        e.target.src = noImage;
                      }}
                      style={{ width: "30px", height: "35px", borderRadius: "50%", marginRight: "10px" }}
                    />
                    <Typography sx={{ color: "black", flexGrow: 1 }}>{reply.replyText}</Typography>
                  </Box>
                ))}

              {replyIndex === index ? (
                <Box mt="1rem" display="flex" alignItems="center">
                  <InputBase
                    placeholder="Reply..."
                    value={replyText[index] || ""}
                    onChange={(e) => handleReplyChange(e, index)}
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
                    onClick={() => handlePostReply(comment._id, index)}
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
              ) : (
                <Button
                  onClick={() => setReplyIndex(index)}
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
                    alignSelf: "flex-end",
                  }}
                >
                  Reply
                </Button>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <Button
                  onClick={() => toggleRepliesVisibility(index)}
                  sx={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "#FFF",
                    color: primaryColor,
                    borderRadius: "5px",
                    fontSize: "12px",
                    padding: "5px",
                    height: "24px",
                    alignSelf: "flex-end",
                  }}
                >
                  {repliesVisible[index] ? "Hide Replies" : "Show Replies"}
                </Button>
              )}
            </Box>
          ))}

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

      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Location"
            value={editLocation}
            onChange={(e) => setEditLocation(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditPost} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isPopupOpen} onClose={handleClosePopup}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <Typography>{popupMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </WidgetWrapper>
  );
};

export default PostWidget;