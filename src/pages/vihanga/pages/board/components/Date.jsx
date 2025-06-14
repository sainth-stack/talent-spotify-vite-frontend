import React, { useState } from "react";
import { Button, Popover, Box, GlobalStyles } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import { DateRange } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DateFilterButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* Custom global styles */}
      <GlobalStyles
        styles={{
          ".rdrMonthAndYearPickers": {
            display: "none", // Hide text dropdowns
          },
          ".rdrMonthAndYearWrapper": {
            justifyContent: "space-between",
            padding: "0 10px",
          },
          ".rdrMonthAndYearWrapper button": {
            background: "none",
            border: "none",
            fontSize: "20px",
            color: "#8a884c",
            cursor: "pointer",
          },
          ".rdrCalendarWrapper": {
            display: "flex", // Ensure months are side by side
            gap: "19px", // Gap between the two months
            borderRadius: "10.54px",
            border: "0.5px solid #cfcba3",
            overflow: "hidden",
          },
          ".rdrMonth": {
            border: "2px solid #8a884c", // Border around each month
            borderRadius: "8px", // Optional, makes the border corners rounded
            padding: "8px",
            width: "100%", // Make sure it takes full width
          },
          ".rdrDaySelected, .rdrDayStartPreview, .rdrDayEndPreview": {
            backgroundColor: "#B79B6C !important",
            color: "white !important",
          },
          ".rdrDayToday .rdrDayNumber span:after": {
            background: "#8a884c",
          },
          // Remove hover styles for the dates
          ".rdrDay:hover": {
            background: "none !important", // Remove hover background
            color: "inherit !important", // Prevent text color change
          },
        }}
      />

      <Button
        variant="outlined"
        startIcon={<CalendarToday />}
        onClick={handleClick}
        sx={{
          borderColor: "#8a884c",
          color: "#8a884c",
          borderRadius: "67px",
        }}
      >
        Filter Date
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            height: "450px",
            width: "630px", // Adjusted width to fit two months
            padding: "6px",
            gap: "8px",
            borderRadius: "10.54px",
            border: "0.5px solid #cfcba3",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={range}
          rangeColors={["#B79B6C"]}
          months={2} // Show two months side by side
          direction="horizontal"
        />

        <Box sx={{ textAlign: "center", mt: 1 }}>
          <Button
            onClick={() => {
              console.log("Apply", range);
              handleClose();
            }}
            sx={{
              color: "#8a884c",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Apply
          </Button>
          <Button
            onClick={() => {
              setRange([
                {
                  startDate: new Date(),
                  endDate: new Date(),
                  key: "selection",
                },
              ]);
              handleClose();
            }}
            sx={{
              color: "#8a884c",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Clear
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default DateFilterButton;
