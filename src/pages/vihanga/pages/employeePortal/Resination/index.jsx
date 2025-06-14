import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import dayjs from "dayjs";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import Header from './../../board/components/Header';
import FileUploadCustom from "pages/vihanga/components/filesUplode/draganddropFile";
import CalendarView from "pages/vihanga/components/Calendar/CalendarView";
import CalendarPage from "../TeamLeave";


const ResignationForm = () => {
  const [lastWorkingDate, setLastWorkingDate] = useState(dayjs());
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


  

  return (
    <Box
      sx={{
        paddingBottom: "70px",
        margin: "1rem",
        bgcolor: "#fff",
        padding: "2rem",
        borderRadius: "1.5rem",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      <Header text="Resignation Form" />
      <Typography sx={{ marginTop: "20px" }}>
        Please fill out the following form to submit your resignation.
      </Typography>

      <Grid container spacing={3} mt={2}>
        {/* Full Name */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <InputTextComponent id="fullName" />
          </Stack>
        </Grid>

        {/* Employee ID */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <label htmlFor="employeeId" className="form-label">
              Employee ID
            </label>
            <InputTextComponent id="employeeId" />
          </Stack>
        </Grid>

        {/* Reason for Resignation */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <label htmlFor="resignationReason" className="form-label">
              Reason for Resignation
            </label>
            <InputTextComponent id="resignationReason" multiline rows={4} />
          </Stack>
        </Grid>

        {/* Last Date of Working */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <label htmlFor="lastWorkingDate" className="form-label">
              Last Date of Working
            </label>
            <InputTextComponent id="lastWorkingDate" type="date" />
          </Stack>
        </Grid>

        {/* File Upload */}
        <Grid item xs={12}>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              sx={{
                mt: 2,
                fontWeight: "600",
                color: "rgba(14, 14, 14, 1)"
              }}
            >
              Upload attachments
            </Typography>
            <Typography sx={{ fontSize:"10px" }}>
              Please sign the document manually and then upload it.
            </Typography>
            <FileUploadCustom
              sx={{
                border: "1.5px dashed #99965E",
              }}
              onFileUpload={handleFileChange}
              file={file}
              hideLabel // Optional: Add this to suppress internal label
            />
          </Box>
        </Grid>

        {/* Buttons */}
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            variant="outlined"
            sx={{
              textTransform: "capitalize",

              color: "#7a7a52",
              borderColor: "#7a7a52",
              borderRadius: "60px",
              "&:hover": {
                Color: "#7a7a52", // keep the same on hover
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "capitalize",

              backgroundColor: "#7a7a52",
              borderRadius: "60px",
              "&:hover": {
                backgroundColor: "#7a7a52", // keep the same on hover
              },
            }}
          >
            Submit Resignation
          </Button>
        </Grid>
      </Grid>


      
      {/* <CalendarPage/> */}
      
    </Box>
  );
};

export default ResignationForm;
