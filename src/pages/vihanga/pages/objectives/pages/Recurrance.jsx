import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";

const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const Recurrence = ({ open, setOpen, setRecurrenceDetails }) => {
  const [repeat, setRepeat] = useState("Weekly");
  const [weekCount, setWeekCount] = useState("01");
  const [selectedDays, setSelectedDays] = useState(["WE"]);
  const [endType, setEndType] = useState("On this Day");
  const [endDate, setEndDate] = useState("");

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const repeatOptions = [
    { value: "Daily", label: "Daily" },
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" },
  ];

  const weekCountOptions = Array.from({ length: 4 }, (_, i) => ({
    value: (i + 1).toString().padStart(2, "0"),
    label: (i + 1).toString().padStart(2, "0"),
  }));

  const handleSave = () => {
    const dayIndexMap = {
      SU: 0,
      MO: 1,
      TU: 2,
      WE: 3,
      TH: 4,
      FR: 5,
      SA: 6,
    };

    const mappedDays = selectedDays
      .map((day) => dayIndexMap[day])
      .filter((n) => n !== undefined);

    const formatted = {
      repeat: repeat,
      every: parseInt(weekCount, 10) || 1,
      onDays: mappedDays,
      end: endType,
      endDate: endDate || null,
    };

    setRecurrenceDetails(formatted);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          width: "850px",
          padding: "20px",
        },
      }}
    >
      <DialogContent sx={{ p: 4, position: "relative" }}>
        <IconButton
          sx={{ position: "absolute", top: 16, right: 16 }}
          onClick={() => setOpen(false)}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700} mb={4}>
          Recurrence
        </Typography>

        {/* Repeat & Every */}
        <Box mb={3}>
          <Box display="flex" gap={3} alignItems="flex-start" flexWrap="wrap">
            <Box flex={1} minWidth={200}>
              <InputLabel sx={{ mb: 1 }}>Repeat</InputLabel>
              <SelectComponent
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                options={repeatOptions}
              />
            </Box>

            <Box flex={1} minWidth={200}>
              <InputLabel sx={{ mb: 1 }}>Every (week's)</InputLabel>
              <SelectComponent
                value={weekCount}
                onChange={(e) => setWeekCount(e.target.value)}
                options={weekCountOptions}
              />
            </Box>
          </Box>
        </Box>

        {/* Days Selection */}
        <Box display="flex" flexWrap="wrap" gap={4}>
          <Box flex={1} minWidth={280}>
            <Typography fontWeight={500} mb={1}>
              On
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {days.map((day) => (
                <Button
                  key={day}
                  onClick={() => toggleDay(day)}
                  variant={
                    selectedDays.includes(day) ? "contained" : "outlined"
                  }
                  sx={{
                    minWidth: 40,
                    padding: "6px",
                    borderRadius: "10px",
                    backgroundColor: selectedDays.includes(day)
                      ? "#73712A"
                      : "#fff",
                    borderColor: "#DADADA",
                    color: selectedDays.includes(day) ? "#fff" : "#000",
                    "&:hover": {
                      backgroundColor: selectedDays.includes(day)
                        ? "#73712A"
                        : "#f5f5f5",
                    },
                  }}
                >
                  {day}
                </Button>
              ))}
            </Box>
          </Box>

          {/* End Options */}
          <Box flex={1} minWidth={280}>
            <Typography fontWeight={500} mb={1}>
              End
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              <Box flex={1}>
                <SelectComponent
                  value={endType}
                  options={[{ value: "On this Day", label: "On this Day" }]}
                />
              </Box>
              <Box flex={1}>
                <InputTextComponent
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="center" gap={3} mt={"15px"}>
          <Button
            variant="outlined"
            sx={{
              px: 4,
              py: 1,
              borderRadius: "25px",
              borderColor: "#73712A",
              color: "#73712A",
              fontWeight: "bold",
              textTransform: "none",
            }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              px: 4,
              py: 1,
              borderRadius: "25px",
              backgroundColor: "#73712A",
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#5e5b21",
              },
            }}
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Recurrence;
