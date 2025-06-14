import React from "react";
import { Box } from "@mui/material";

const CardWidget = ({ children, sx = {}, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: "white",
        borderRadius: "20px",
        boxShadow: "6px 6px 54px 0px rgba(0, 0, 0, 0.05)",
        padding: "16px",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default CardWidget;
