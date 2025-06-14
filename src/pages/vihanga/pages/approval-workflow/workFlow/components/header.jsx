import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const InfoCardHeader = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  buttonColor = '#827b37',
  buttonIcon = null,
  buttonTextColor = '#FFFFFF',
  buttonBorder = 'none',
}) => {
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderRadius={2}
        sx={{
          backgroundColor: '#ffffff',
          padding: '10px 0px',
          margin: '0px 10px',
        }}
      >
        {/* Title & Subtitle */}
        <Box sx={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
          <Typography
            sx={{
              color: '#0E0E0E',
              fontWeight: 600,
              fontSize: '24px',
              fontFamily: 'Montserrat',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              color: '#707070',
              fontWeight: 500,
              fontSize: '16px',
              fontFamily: 'Work Sans',
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        {/* Button */}
        <Button
          variant="contained"
          onClick={onButtonClick}
          startIcon={buttonIcon}
          sx={{
            fontFamily: 'Work Sans',
            fontWeight: 500,
            borderRadius: '100px',
            fontSize: '16px',
            textTransform: 'none',
            px: 3,
            backgroundColor: buttonColor,
            color: buttonTextColor,
            border: buttonBorder,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: buttonColor,
              opacity: 0.9,
            },
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </Box>
  );
};

export default InfoCardHeader;
