// client/src/slices/index.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.posts = [];  // Clearing posts on logout as well
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const { type, postId, commentId, comment, reply } = action.payload;
      if (type === 'update') {
        state.posts = state.posts.map(p => p._id === postId ? { ...p, ...action.payload.post } : p);
      } else if (type === 'delete') {
        state.posts = state.posts.filter(p => p._id !== postId);
      } else if (type === 'addComment') {
        state.posts = state.posts.map(p => {
          if (p._id === postId) {
            return { ...p, comments: [...p.comments, comment] };
          }
          return p;
        });
      } else if (type === 'addReply') {
        state.posts = state.posts.map(p => {
          if (p._id === postId) {
            const updatedComments = p.comments.map(c => {
              if (c._id === commentId) {
                return { ...c, replies: [...c.replies, reply] };
              }
              return c;
            });
            return { ...p, comments: updatedComments };
          }
          return p;
        });
      }
    },
    updateUserDetails: (state, action) => {
      if (state.user) {
        const { firstName, lastName, location, occupation } = action.payload;
        state.user = {
          ...state.user,
          firstName: firstName || state.user.firstName,
          lastName: lastName || state.user.lastName,
          location: location || state.user.location,
          occupation: occupation || state.user.occupation,
        };
      } else {
        console.error("No user to update");
      }
    },
  },
});

export const { 
  setMode, 
  setLogin, 
  setLogout, 
  setFriends, 
  setPosts, 
  setPost, 
  updateUserDetails 
} = authSlice.actions;

export default authSlice.reducer;