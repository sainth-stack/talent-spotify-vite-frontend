import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";

const FamilyInformation = ({ data = {}, onChange }) => {
  

 const maritalStatusOptions = [
  { label: "Single", value: "single" },
  { label: "Married", value: "married" },
  { label: "Divorced", value: "divorced" },
  { label: "Widowed", value: "widowed" },
  { label: "Separated", value: "separated" },
];


  const formFields = [
   

    {
      id: "maritalStatus",
      label: "Maritial Status",
      component: "select",
      options: maritalStatusOptions,
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
    <>
      <Box
        sx={{
          padding: "1rem",

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
          Family Information
        </Typography>
        <Box
          sx={{
            paddingBottom: "70px",
            bgcolor: "#fff",
            padding: ".5rem",
            borderRadius: "1.5rem",
            // height: "100vh",
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
                    onChange={(event) => {
                      console.log("value ----", event.target.value);
                      handleChange(field.id, event.target.value);
                    }}
                    options={field.options || []}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default FamilyInformation;
