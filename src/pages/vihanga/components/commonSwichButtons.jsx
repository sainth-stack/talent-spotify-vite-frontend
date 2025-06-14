import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';

const ToggleTabs = ({ onTabChange }) => {
  const history = useHistory();
  const location = useLocation();
  const [selected, setSelected] = useState(() => {
    // Initialize based on current route if on objectives page
    if (location.pathname.includes('/admin/objectives')) {
      return location.pathname.includes('myteam') ? 'team' : 'me';
    }
    return 'me'; // Default value for other pages
  });

  const handleTabChange = (tab) => {
    setSelected(tab);
    
    // Special routing for objectives page
    if (location.pathname.includes('/admin/objectives')) {
      const newPath = tab === 'team' 
        ? '/admin/objectives/myteam' 
        : '/admin/objectives';
      history.push(newPath);
    }
    
    // Call the prop callback if provided (for non-routed usage)
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <Box
      display="flex"
      bgcolor="#f8f8f8"
      borderRadius="62px"
      p='4px'
      width="fit-content"
    >
      <Button
        onClick={() => handleTabChange('me')}
        variant={selected === 'me' ? 'contained' : 'text'}
        sx={{
          backgroundColor: selected === 'me' ? '#837F39' : 'transparent',
          color: selected === 'me' ? '#FFFFFF' : '#837F39',
          borderRadius: '30px',
          textTransform: 'none',
          minWidth: '111px',
          boxShadow: 'none',
          fontWeight: 500,
          fontSize: "16px",
          fontFamily: "Work Sans",
          '&:hover': {
            backgroundColor: selected === 'me' ? '#837F39' : 'transparent',
          },
        }}
      >
        Me
      </Button>
      <Button
        onClick={() => handleTabChange('team')}
        variant={selected === 'team' ? 'contained' : 'text'}
        sx={{
          backgroundColor: selected === 'team' ? '#837F39' : 'transparent',
          color: selected === 'team' ? '#FFFFFF' : '#837F39',
          borderRadius: '30px',
          textTransform: 'none',
          minWidth: '111px',
          fontWeight: 500,
          fontSize: "16px",
          fontFamily: "Work Sans",
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: selected === 'team' ? '#7c7b3b' : 'transparent',
          },
        }}
      >
        My Team
      </Button>
    </Box>
  );
};

export default ToggleTabs;