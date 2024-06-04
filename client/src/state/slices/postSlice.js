// src/state/slices/postSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [], // Initialize with an empty array or existing posts if needed
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setPost: (state, action) => {
      const updatedPost = action.payload;
      const index = state.posts.findIndex(post => post._id === updatedPost._id);
      if (index !== -1) {
        state.posts[index] = updatedPost;
      } else {
        state.posts.push(updatedPost);
      }
    },
  },
});

export const { setPosts, setPost } = postSlice.actions;
export default postSlice.reducer;
