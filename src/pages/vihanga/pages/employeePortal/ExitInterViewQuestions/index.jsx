import React, { useState } from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";

const ExitInterView = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState("");
  const [existingResume, setExistingResume] = useState("");

  const [formData, setFormData] = useState({
    normalDate: "",
    employeeName: "",
    empStartDate: "",
    empEndDate: "",
    position: "",
    note: "",
    halfDay: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const durationOptions = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
  ];

   
  // Define fields in an array
  const formFields = [
    { id: "normalDate", label: "Date", type: "date", component: "input" },
    {
      id: "employeeName",
      label: "Employee Name",
      type: "text",
      component: "input",
    },
    {
      id: "position",
      label: "Position",
      component: "select",
      options: durationOptions,
    },
    {
      id: "empStartDate",
      label: "Employment Start Date",
      type: "date",
      component: "input",
    },
    {
      id: "empEndDate",
      label: "Employment End Date",
      type: "date",
      component: "input",
    },
  ];

 

  return (
    <>
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
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 16px",
            }}
          >
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: "600",
                fontFamily: `"Montserrat"`,
                color: "#0E0E0E",
              }}
            >
              Exit Interview Questionnaire
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {formFields.map((field) => (
              <Grid item xs={12} md={6} key={field.id}>
                {field.component === "input" ? (
                  <InputTextComponent
                    id={field.id}
                    label={field.label}
                    type={field.type}
                    value={formData[field.id]}
                    onChange={handleChange}
                  />
                ) : (
                  <SelectComponent
                    id={field.id}
                    label={field.label}
                    value={formData[field.id]}
                    onChange={handleChange}
                    options={field.options || []}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <ExitFeedback />
    </>
  );
};

export default ExitInterView;









export const ExitFeedback = () => {


  const buttonConfigs = [
    {
      label: "Cancel",
      type: "button",
      backgroundColor: "#FFFFFF",
      color: "#847F3B",
    },
    {
      label: "Submit",
      type: "submit",
      backgroundColor: "#837F39",
      color: "#FFFFFF",
    },
  ];
  
 const questions = [
   "1. What were the primary reasons for leaving the organization?",
   "2. Were there specific aspects of your job or organization’s culture contributing to your decision?",
   "3. Were there any areas where you felt unsupported or dissatisfied?",
   "4. What are your suggestions for improving the workplace or the employee experience?",
   "5. What did you like about your job?",
   "6. What were your expectations when you joined the organization and were your expectations satisfied?",
 ];

  return (
    <Box
      sx={{
        paddingBottom: "70px",
        margin: "1rem",
        bgcolor: "#fff",
        padding: "2rem",
        borderRadius: "1.5rem",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem", // spacing between inputs
      }}
    >
      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Work Sans, sans-serif",
          fontWeight: "bold",
          fontSize: "18px",
          color: "#000",
        }}
      >
        Exit Interview Questions
      </Typography>

      {/* Questions */}
      {questions.map((question, index) => (
        <InputTextComponent
          key={index}
          label={question}
          multiline={true}
          minRows={5}
          sx={{}}
        />
      ))}

      <Box display="flex" justifyContent="flex-end" gap={2} mt={4} mb={2}>
        {buttonConfigs.map((btn) => (
          <Button
            key={btn.label}
            type={btn.type}
            variant="contained"
            sx={{
              backgroundColor: btn.backgroundColor,
              color: btn.color,
              fontFamily: "Work Sans",
              fontWeight: "500",
              borderRadius: "20px",
            }}
          >
            {btn.label}
          </Button>
        ))}
      </Box>

    </Box>
  );
};

