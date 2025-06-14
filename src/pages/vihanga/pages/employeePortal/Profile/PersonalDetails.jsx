import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";

const PersonalDetails = ({ data = {}, onChange }) => {
  const formFields = [
    {
      id: "aadharNumber",
      label: "Aadhar Number",
      type: "text",
      component: "input",
    },
    {
      id: "passportNumber",
      label: "Passport Number",
      type: "text",
      component: "input",
    },
  ];

  const handleChange = (name, value) => {
    if (onChange) {
      onChange({
        target: {
          name,
          value,
        },
      });
    }
  };

  return (
    <Box
      sx={{
padding:"1rem",
        borderRadius: "16px",
        paddingBottom: "10px",
        backgroundColor: "#fff",
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
      Personal Details
      </Typography>
      <Box
        sx={{
          paddingBottom: "70px",
          margin: "1rem",
          bgcolor: "#fff",
          padding: ".5rem",
          borderRadius: "1.5rem",
        }}
      >
        <Grid container spacing={2}>
          {formFields.map((field) => (
            <Grid item xs={12} md={6} key={field.id}>
              {field.component === "input" ? (
                <InputTextComponent
                  id={field.id}
                  label={field.label}
                  type={field.type}
                  value={data[field.id] || ""}
                  onChange={(event) => {
                    console.log("value ----", event.target.value);
                    handleChange(field.id, event.target.value);
                  }}
                  {...(field.id === "address" && {
                    multiline: true,
                    minRows: 5,
                  })}
                />
              ) : (
                <SelectComponent
                  id={field.id}
                  label={field.label}
                  value={data[field.id] || ""}
                  onChange={(event) =>
                    handleChange(field.id, event.target.value)
                  }
                  options={field.options || []}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default PersonalDetails;
