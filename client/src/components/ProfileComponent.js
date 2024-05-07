// client/src/components/ProfileComponent.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails } from '../state/index';  // Adjust path as needed

const ProfileComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);  // Adjust to your state structure
  const token = useSelector(state => state.auth.token);  // Adjust if token is stored elsewhere

  // Initialize form data with current user's values
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    location: user?.location || '',
    occupation: user?.occupation || ''
  });

  // Update form data as the user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Save the profile data and update posts
  const handleSave = async () => {
    dispatch(updateUserDetails(formData));  // Update Redux store

    // Ensure the user ID is available
    if (user?._id) {
      await updatePostsWithNewDetails(user._id, formData);
    } else {
      console.error('User ID not available for updating posts');
    }
  };

  // Function to update the old posts
  const updatePostsWithNewDetails = async (userId, newDetails) => {
    try {
      const response = await fetch('http://localhost:3001/posts/updateUserPosts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Ensure valid token for the request
        },
        body: JSON.stringify({ userId, ...newDetails }),
      });
      if (!response.ok) throw new Error('Failed to update posts');
      console.log('Posts updated successfully');
    } catch (error) {
      console.error('Error updating posts:', error);
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Occupation:
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="button" onClick={handleSave}>Save</button>
      </form>
    </div>
  );
};

export default ProfileComponent;
