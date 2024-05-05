import {
  ChatBubbleOutlineOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Typography, InputBase, Button } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import mangoUnlikedIcon from "./mango-unliked.png"; // Import the mango-unliked icon
import mangoLikedIcon from "./mango-liked.png"; // Import the mango-liked icon

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
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState(""); // State to store the new comment
  const [replyIndex, setReplyIndex] = useState(-1); // State to store the index of the comment being replied to
  const [replyText, setReplyText] = useState(""); // State to store the reply text
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const primaryColor = "#F4BB44"; // Mango color

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

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleReplyChange = (event) => {
    setReplyText(event.target.value);
  };

  const handlePostComment = () => {
    // Logic to post comment
    console.log("New comment:", newComment);
    // You can send the new comment to the backend here
    setNewComment(""); // Clear the comment input field after posting
  };

  const handleReply = (index) => {
    setReplyIndex(index);
  };

  const handlePostReply = () => {
    // Logic to post reply
    console.log("Reply to comment at index", replyIndex, ":", replyText);
    // You can send the reply text and index to the backend here
    setReplyIndex(-1); // Reset the reply index
    setReplyText(""); // Clear the reply input field
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color="text.primary" sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
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
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box
              key={`${name}-${i}`}
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
              <Typography>{comment}</Typography>
              {/* Reply Input */}
              {replyIndex === i && (
                <Box mt="1rem" display="flex" alignItems="center">
                  <InputBase
                    placeholder="Reply..."
                    value={replyText}
                    onChange={handleReplyChange}
                    sx={{ flexGrow: 1, mr: "1rem", borderRadius: "10px", backgroundColor: "#E0E0E0", p: "0.5rem", fontSize: "14px" }}
                  />
                  <Button variant="contained" onClick={handlePostReply} sx={{ backgroundColor: primaryColor, color: "white", borderRadius: "5px", fontSize: "12px", height: "30px", py: 0 }}>POST</Button>
                </Box>
              )}
              {/* Reply Button */}
              {replyIndex !== i && (
                <Button onClick={() => handleReply(i)} sx={{ position: "absolute", bottom: "10px", right: "10px", backgroundColor: "#FFF", color: primaryColor, borderRadius: "5px", fontSize: "12px", padding: "5px", height: "24px" }}>Reply</Button>
              )}
            </Box>
          ))}
          {/* Comment Input */}
          <Box mt="1rem" display="flex" alignItems="center">
            <InputBase
              placeholder="Add a comment..."
              value={newComment}
              onChange={handleCommentChange}
              sx={{ flexGrow: 1, mr: "1rem", borderRadius: "10px", backgroundColor: "#E0E0E0", p: "0.5rem", fontSize: "14px" }}
            />
            <Button variant="contained" onClick={handlePostComment} sx={{ backgroundColor: primaryColor, color: "white", borderRadius: "5px", fontSize: "12px", height: "30px", py: 0 }}>POST</Button>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
