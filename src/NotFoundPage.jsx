import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "8rem", fontWeight: "bold", color: "#8b7e3f" }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ marginBottom: "20px" }}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button 
        variant="contained" 
        // color="#fff" 
        onClick={() => navigate("/")}
        sx={{color:"#fff", textTransform: "none", borderRadius: "10px", padding: "10px 20px",bgcolor:"#8b7e3f" }}
      >
        Go Home
      </Button>
    </Container>
  );
};

export default NotFoundPage;
