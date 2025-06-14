import React from "react";
import { Box } from "@mui/material";
import LeaveTable3 from "../TimeTracking/weeklyTimeEntries/table";
import LeaveTable2 from "../TimeTracking/weeklyTimeCard/table";

const WeeklyLeaveManagement = () => {
  return (
    <Box
    >
      <LeaveTable2 />
      <LeaveTable3 />
    </Box>
  );
};

export default WeeklyLeaveManagement;
