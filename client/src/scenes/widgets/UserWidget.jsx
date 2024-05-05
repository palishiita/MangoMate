//client/src/scenes/widgets/UserWidget.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Divider, TextField, Button, useTheme } from '@mui/material';
import { ManageAccountsOutlined, LocationOnOutlined, WorkOutlineOutlined } from '@mui/icons-material';
import UserImage from 'components/UserImage';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';

const UserWidget = ({ userId, picturePath }) => {
  const navigate = useNavigate();
  const { palette } = useTheme();  // Destructure the theme to access color palettes
  const token = useSelector(state => state.token);
  const loggedInUserId = useSelector(state => state.user._id);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    location: '',
    occupation: ''
  });

  const getUser = useCallback(async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
    setFormData({
      firstName: data.firstName,
      lastName: data.lastName,
      location: data.location,
      occupation: data.occupation
    });
  }, [userId, token]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
      console.log("Saving changes with data:", formData);
      try {
          const response = await fetch(`http://localhost:3001/users/${userId}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(formData)
          });
          if (!response.ok) {
              throw new Error('Failed to update user details');
          }
          const updatedUser = await response.json();
          setUser(updatedUser);
          setEditMode(false);
          console.log('Update successful', updatedUser);
      } catch (error) {
          console.error('Failed to save changes:', error);
      }
    };


  if (!user) return null;

  return (
    <WidgetWrapper>
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          {editMode ? (
            <Box>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                sx={{ marginBottom: 3, height: 46, input: { height: 24 } }}
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                sx={{ marginBottom: 3, height: 46, input: { height: 24 } }}
              />
            </Box>
          ) : (
            <Box>
              <Typography variant="h4" color={palette.neutral.dark} fontWeight="500">
                {user.firstName} {user.lastName}
              </Typography>
            </Box>
          )}
        </FlexBetween>
        {loggedInUserId === userId && (
          <ManageAccountsOutlined onClick={() => setEditMode(!editMode)} />
        )}
      </FlexBetween>

      <Divider />

      <Box p="1rem 0">
        {editMode ? (
          <>
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 3, height: 46, input: { height: 24 } }}
            />
            <TextField
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 3, height: 46, input: { height: 24 } }}
            />
            <Box display="flex" justifyContent="center" mt={2}>
              <Button onClick={saveChanges} variant="contained">Save</Button>
            </Box>
          </>
        ) : (
          <>
            <Box display="flex" alignItems="center" gap="1rem">
              <LocationOnOutlined fontSize="large" sx={{ color: palette.primary.main }} />
              <Typography>{user.location}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap="1rem">
              <WorkOutlineOutlined fontSize="large" sx={{ color: palette.primary.main }} />
              <Typography>{user.occupation}</Typography>
            </Box>
          </>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;