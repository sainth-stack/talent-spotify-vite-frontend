import { Box } from '@mui/material';
import React from 'react'
import logo from "../../../../assets/images/vihanga.png"
const PdfHeader = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            height: "40px",
            margin: "-.5rem 0 0 0",
            boxShadow: "1px 0px 0px gray",
            margin: ".5rem  0 1.5rem 0 ",
          }}
        />
      </Box>
    </>
  );
}

export default PdfHeader
