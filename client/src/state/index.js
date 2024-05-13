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
      if (!action.payload.post) {
        // If post is null, filter it out from the posts array
        state.posts = state.posts.filter(post => post._id !== action.payload.postId);
      } else {
        // Update the post normally
        const updatedPosts = state.posts.map(post => {
          if (post._id === action.payload.post._id) return action.payload.post;
          return post;
        });
        state.posts = updatedPosts;
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