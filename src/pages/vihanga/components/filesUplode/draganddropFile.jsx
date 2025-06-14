import React, { useState } from "react";
import {
  Box,
  Button,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import img1 from '../../../../assets/images/UploadIcon.png';

const FileUploadCustom = ({ label, sx = {}, onFileUpload, link = '' }) => {
  

   const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 960px

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log("File selected:", selectedFile);
    if (
      selectedFile &&
      ["image/jpeg", "image/png", "application/pdf"].includes(selectedFile.type) &&
      selectedFile.size <= 50 * 1024 * 1024
    ) {
      setFile(selectedFile);
      console.log(selectedFile);
      onFileUpload(selectedFile);
    } else {
      alert("Invalid file. Please select a JPEG, PNG, or PDF under 50MB.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    handleFileChange({ target: { files: [droppedFile] } });
  };

  return (
    <Box>
      <label
        style={{
          color: "#707070",
          fontFamily: "Work Sans",
          fontWeight: "400",
          fontSize: "14px",
        }}
      >
        {label}
      </label>
      <Box
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        sx={{
          border: isMobile ? "1.5px dashed #99965E" : "1px dashed #99965E",
          borderRadius: "10px",
          padding: isMobile ? "13px" : "20px",
          textAlign: "center",
          cursor: "pointer",
          width: "100%",
          height: isMobile ? "180px" : "170px",
          margin: "auto",
          backgroundColor: "#FFFFFF",
          ...sx,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: isMobile ? "5px" : "22px",
          }}
        >
          <img
            src={img1}
            alt="uploadIcon"
            style={{ width: "69px", height: "60px", color: "#99965E" }}
          />
          <Box sx={{ fontFamily: "Work Sans", fontWeight: "500" }}>
            <Typography
              variant="body1"
              mt={1}
              sx={{ fontSize: isMobile ? "13px" : "20px", color: "#060606" }}
            >
              Choose a file or drag & drop it here
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: isMobile ? "10px" : "16px", color: "#707070" }}
            >
              JPEG, PNG, PDF, up to 50MB
            </Typography>
          </Box>
        </Box>
        <br />
        <input
          type="file"
          accept="image/jpeg, image/png, application/pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-upload2"
        />
        <label htmlFor="file-upload2">
          <Button
            variant="outlined"
            component="span"
            sx={{
              borderColor: "#99965E",
              color: "#99965E",
              borderRadius: "30px",
              fontSize: "16px",
              fontWeight: "500",
              fontFamily: "Work Sans",
              width: "168px",
              height: "47px",
              backgroundColor: "white",
              textTransform: "capitalize",
              "&:hover": {
                border: "1px solid #99965E",
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Browse File
          </Button>
        </label>
      </Box>
      {file && (
        <Typography
          variant="body2"
          mt={2}
          sx={{
            fontSize: "20px",
            fontWeight: "400",
            fontFamily: "Work Sans",
            textAlign: "start",
          }}
        >
          Selected File: {file.name}
        </Typography>
      )}
      {link && (
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: "primary.main",
            textDecoration: "underline",
            fontFamily: "Work Sans",
            fontSize: "16px",
            marginTop: "5px",
            "&:hover": {
              color: "primary.dark",
            },
          }}
        >
          Click Here
        </Link>
      )}
    </Box>
  );
};

export default FileUploadCustom;
