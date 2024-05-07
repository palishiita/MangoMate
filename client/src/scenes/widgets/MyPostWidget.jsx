// client/src/scenes/widgets/MyPostWidget.jsx

import {
  DeleteOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [isAudio, setIsAudio] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    // Log the current state
    console.log("User ID:", _id);
    console.log("Post Description:", post);
    console.log("Image:", image);
    console.log("Audio:", audio);
    console.log("Video:", video);
  
    // Validate input before submitting
    if (!_id || !post) {
      console.error("User ID and/or description is missing");
      return;
    }
  
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
  
    // Add only the relevant file type
    if (image) {
      formData.append("file", image);
      formData.append("picturePath", image.name);
    } else if (audio) {
      formData.append("file", audio);
      formData.append("picturePath", audio.name);
    } else if (video) {
      formData.append("file", video);
      formData.append("picturePath", video.name);
    } else {
      console.error("No media file selected");
      return;
    }
  
    // Send form data in a POST request to the server
    try {
      const response = await fetch(`http://localhost:3001/posts/createPost`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create post:", errorData.message);
        return;
      }
  
      const posts = await response.json();
      dispatch(setPosts({ posts }));
  
      // Clear input fields after a successful post
      setImage(null);
      setAudio(null);
      setVideo(null);
      setPost("");
    } catch (err) {
      console.error("Error during post creation:", err.message);
    }
  };
  
  

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.grey[200],
            borderRadius: "0.5rem",
            padding: "1rem",
          }}
        />
      </FlexBetween>

      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <Typography>{image.name}</Typography>
                  )}
                </Box>
                {image && (
                  <IconButton onClick={() => setImage(null)} sx={{ width: "15%" }}>
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      {isAudio && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".mp3,.wav"
            multiple={false}
            onDrop={(acceptedFiles) => setAudio(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!audio ? <p>Add Audio Clip Here</p> : <Typography>{audio.name}</Typography>}
                </Box>
                {audio && (
                  <IconButton onClick={() => setAudio(null)} sx={{ width: "15%" }}>
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      {isVideo && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".mp4,.avi"
            multiple={false}
            onDrop={(acceptedFiles) => setVideo(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!video ? <p>Add Video Clip Here</p> : <Typography>{video.name}</Typography>}
                </Box>
                {video && (
                  <IconButton onClick={() => setVideo(null)} sx={{ width: "15%" }}>
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography color={mediumMain} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>
            Image
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={() => setIsVideo(!isVideo)}>
          <GifBoxOutlined sx={{ color: mediumMain }} />
          <Typography color={mediumMain} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>
            Video
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={() => setIsAudio(!isAudio)}>
          <MicOutlined sx={{ color: mediumMain }} />
          <Typography color={mediumMain} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>
            Audio
          </Typography>
        </FlexBetween>

        <Button
          disabled={!post && !image && !audio && !video} // Enable if any of these are not empty
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;