import React from "react";
import { InputAdornment, TextField, IconButton, Link } from "@mui/material";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/Email";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, isValid } from "date-fns";
import { UploadCloudIcon } from "lucide-react";

export const InputTextComponent = ({
  id = "",
  type = "text",
  label = "",
  value = "",
  onChange = () => {},
  required = false,
  placeholder = "",
  name = "",
  disabled = false,
  fullWidth = true,
  multiline = false,
  minRows = 1,
  sx = {},
  endIcon = false,
  disableFutureDate = false,
  InputLabelProps = {},
  allowFuture = false
}) => {
  const today = new Date();
  const fileInputRef = React.useRef(null);

  const handleDateChange = (date) => {
    if (date && isValid(date)) {
      const formattedDate = format(date, "yyyy-MM-dd");
      const fakeEvent = {
        target: {
          id: id,
          name: id,
          value: formattedDate,
        },
      };
      onChange(fakeEvent);
    } else {
      const fakeEvent = {
        target: {
          id: id,
          name: id,
          value: null,
        },
      };
      onChange(fakeEvent);
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fakeEvent = {
        target: {
          id: id,
          name: id,
          value: file,
          files: event.target.files
        },
      };
      onChange(fakeEvent);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  if (type === "file") {
    return (
      <div style={{ marginBottom: "1rem", width: "100%" }}>
        {label && (
          <Typography
            variant="body1"
            sx={{
              marginBottom: "0.3rem",
              fontFamily: "Work Sans, sans-serif",
              color: "#707070",
              fontWeight: 400,
              fontSize: "14px",
              ...sx,
            }}
          >
            {label}
          </Typography>
        )}
        <TextField
          id={id}
          type="text"
          name={name}
          value={value?.name || ""}
          disabled={true}
          fullWidth={fullWidth}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontFamily: "Work Sans, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#707070",
              borderRadius: "10px",
              height: "48px",
              "& input": {
                padding: "10px 14px",
              },
              "& fieldset": {
                borderColor: "#E9EAEC",
              },
              "&:hover fieldset": {
                borderColor: "#E9EAEC",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#E9EAEC",
              },
              "&.Mui-disabled": {
                "& .MuiOutlinedInput-input": {
                  color: "#707070",
                  WebkitTextFillColor: "#707070",
                },
                "& fieldset": {
                  borderColor: "#E9EAEC",
                },
                opacity: 1,
              },
            },
            ...sx,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleFileClick}
                  disabled={disabled}
                  sx={{ color: "#837F39" }}
                >
                  <UploadCloudIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {typeof value == "string" && value && (
          <Link
            href={value}
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
              ...sx,
            }}
          >
            Click Here
          </Link>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept="image/*"
          disabled={disabled}
        />
      </div>
    );
  }

  if (type !== "date") {
    return (
      <div style={{ marginBottom: "1rem", width: "100%" }}>
        {label && (
          <Typography
            variant="body1"
            sx={{
              marginBottom: "0.3rem",
              fontFamily: "Work Sans, sans-serif",
              color: "#707070",
              fontWeight: 400,
              fontSize: "14px",
              ...sx,
            }}
          >
            {label}
          </Typography>
        )}
        <TextField
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          fullWidth={fullWidth}
          multiline={multiline}
          minRows={minRows}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontFamily: "Work Sans, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#707070",
              borderRadius: "10px",
              alignItems: multiline ? "start" : "center",
              ...(multiline ? { minHeight: "120px" } : { height: "48px" }),
              "& textarea": {
                padding: "12px",
              },
              "& input": {
                padding: "10px 14px",
              },
              "& fieldset": {
                borderColor: "#E9EAEC",
              },
              "&:hover fieldset": {
                borderColor: "#E9EAEC",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#E9EAEC",
              },
              "&.Mui-disabled": {
                "& .MuiOutlinedInput-input": {
                  color: "#707070",
                  WebkitTextFillColor: "#707070",
                },
                "& fieldset": {
                  borderColor: "#E9EAEC",
                },
                opacity: 1,
              },
            },
            ...sx,
          }}
          InputProps={{
            endAdornment: endIcon ? (
              <InputAdornment position="end">
                {type === "email" ? (
                  <EmailIcon />
                ) : type === "number" ? (
                  <PhoneInTalkIcon />
                ) : id === "fullName" ? (
                  <SearchIcon />
                ) : null}
              </InputAdornment>
            ) : null,
          }}
        />
      </div>
    );
  }

  // For date fields
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={{ marginBottom: "1rem", width: "100%" }}>
        {label && (
          <Typography
            variant="body1"
            sx={{
              marginBottom: "0.3rem",
              fontFamily: "Work Sans, sans-serif",
              color: "#707070",
              fontWeight: 400,
              fontSize: "14px",
            }}
          >
            {label}
          </Typography>
        )}
        <DatePicker
          value={value ? new Date(value) : null}
          onChange={handleDateChange}
          disabled={disabled}
          minDate={allowFuture ? today : null}
          maxDate={disableFutureDate ? today : null}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth={fullWidth}
              required={required}
              InputLabelProps={{
                shrink: true,
                ...InputLabelProps,
              }}
              inputProps={{
                ...params.inputProps,
                readOnly: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: "Work Sans, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#707070",
                  borderRadius: "10px",
                  borderColor: "#E9EAEC",
                  height: "48px",
                  "& input": {
                    padding: "10px 14px",
                  },
                  "& fieldset": {
                    borderColor: "#E9EAEC",
                  },
                  "&:hover fieldset": {
                    borderColor: "#E9EAEC",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#E9EAEC",
                  },
                  "&.Mui-disabled": {
                    "& .MuiOutlinedInput-input": {
                      color: "#707070",
                      WebkitTextFillColor: "#707070",
                    },
                    "& fieldset": {
                      borderColor: "#E9EAEC",
                    },
                    opacity: 1,
                  },
                  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#E9EAEC",
                    },
                },
                ...sx,
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    {params.InputProps?.endAdornment}
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </div>
    </LocalizationProvider>
  );
};