import React, { useState, useEffect } from 'react';
import { Box, InputBase, Typography, Avatar } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.trim() === '') {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/users/search?query=${searchTerm}`);
        const users = await response.json();
        setSuggestions(users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  const handleSelectUser = (userId) => {
    navigate(`/user/${userId}`);
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <InputBase
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          width: '100%',
          backgroundColor: '#f1f1f1',
          borderRadius: '4px',
          padding: '8px',
        }}
      />
      {suggestions.length > 0 && (
        <Box sx={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '4px',
          zIndex: 10,
        }}>
          {suggestions.map(user => (
            <Box
              key={user._id}
              onClick={() => handleSelectUser(user._id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f1f1f1',
                }
              }}
            >
              <Avatar src={`http://localhost:3001/assets/${user.picturePath}`} alt={user.name} sx={{ marginRight: '8px' }} />
              <Typography>{user.name}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;