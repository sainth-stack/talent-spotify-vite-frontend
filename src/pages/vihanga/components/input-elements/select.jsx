import React from "react";
import { TextField, MenuItem, Typography } from "@mui/material";

export const SelectComponent = ({
  id = "",
  label = "",
  value = "",
  onChange = () => {},
  required = false,
  disabled = false,
  options = [],
  fullWidth = true,
  placeholder = "",
  sx = {},
  setSelectedObject = () => {},
  labelSx = {},
}) => {
  return (
    <div style={{ marginBottom: "1rem", width: fullWidth ? "100%" : "auto" }}>
      {label && (
        <Typography
          variant="body1"
          sx={{
            marginBottom: "0.2rem",
            fontWeight: 400,
            fontFamily: "Work Sans !important",
            color: "#707070",
            fontSize: "14px",
            ...labelSx,
          }}
        >
          {label}
        </Typography>
      )}
      <TextField
        id={id}
        name={id}
        select
        value={value || ""}
        onChange={(event) =>
          onChange({ target: { name: id, value: event.target.value, id: event.target.id } })
        }
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        variant="outlined"
        SelectProps={{
          displayEmpty: true,
          renderValue: (selected) => {
            if (!selected) {
              return (
                <Typography sx={{ color: "#707070", fontSize: "14px" }}>
                  {placeholder}
                </Typography>
              );
            }
           const selectedOption = options.find((opt) => opt.value === selected);
           return selectedOption ? selectedOption.label : selected;
          },
          MenuProps: {
            PaperProps: {
              sx: {
                borderRadius: "1rem",
                border: "1px solid #fff",
                mt: 0.5,
              },
            },
          },
        }}
        sx={{
          "& .MuiSelect-select": {
            fontSize: "14px",
            color: value ? "#707070" : "#707070",
            fontWeight: 500,
            fontFamily: "Work Sans",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            height: "48px",
            "& fieldset": {
              borderColor: "#E9EAEC",
            },
            "&:hover fieldset": {
              borderColor: "#E9EAEC",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#E9EAEC",
            },
          },
          ...sx,
        }}
      >
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
              fontFamily: "Work Sans",
            }}
            onClick={() => setSelectedObject(option)}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};
