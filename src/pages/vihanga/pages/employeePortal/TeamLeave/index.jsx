import React, { useEffect, useState } from "react";
import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import CustomSwitchButton from "pages/vihanga/components/SwitchButton/CustomSwitch";
import EventCalendar from "../../../components/EventSchedular/EventSchedular";
import { customColors } from "pages/vihanga/components/EventSchedular/data";
import TableHeader2 from "../../objectives/tableHeader";
import { appURL } from "utilities";
import axios from "axios";
import { format } from "date-fns";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";

const CalendarPage = () => {



  const [selectedSwitch, setSelectedSwitch] = useState("myTeam");
  const [managerBoard, setManagerBoard] = useState("all");
  const [allEvents, setAllEvents] = useState([]);

   const companyId = getItemFromLocalStorage("companyId");
  const userRoleId = getItemFromLocalStorage("user");
  

  // Function to assign a color to an absenceType dynamically
  const getColorForAbsenceType = (absenceType) => {
    const hash = absenceType
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = hash % customColors.length;
    return customColors[colorIndex].value;
  };

  
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(`${appURL}/recruitment/leaves`, {
          params: {
            companyId,
            empId: userRoleId._id,
          },
        });
        console.log("API success:", response.data.success);
        console.log("API data:", response.data.data);

        if (response.data.success) {
          const leaves = response.data.data.data;
          console.log("leaves", leaves);
          // Map API data to event format for EventCalendar
          const events = leaves.map((leave) => {
            const startDate = new Date(leave.from);
            const endDate = new Date(leave.to);
            return {
              id: leave._id,
              title: leave.absenceType,
              start: format(
                startDate > endDate ? endDate : startDate,
                "yyyy-MM-dd"
              ),
              end: format(
                startDate > endDate ? startDate : endDate,
                "yyyy-MM-dd"
              ),
              color: getColorForAbsenceType(leave.absenceType),
              halfDay: leave.halfDay,
            };
          });
          console.log("Mapped Events:", events);
          setAllEvents(events);
        }
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };

    fetchLeaves();
  }, []);



  const [stage, setStage] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const menuItemsStage = [
    { text: "High" },
    { text: "Medium" },
    { text: "Low" },
  ];

  const menuItemsExportOptions = [
    { text: "Export as CSV", icon: "/icons/csv.png" },
    { text: "Export as PDF", icon: "/icons/pdf.png" },
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
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: 2,
        }}
      >
        <CustomSwitchButton
          iconExists={false}
          options={[
            { label: "Me", value: "me" },
            { label: "My Team", value: "myTeam" },
          ]}
          activeOption={selectedSwitch}
          onChange={(value) => {
            setSelectedSwitch(value);
            console.log("Selected:", value);
          }}
        />

        <Button
          variant="outlined"
          sx={{
            textTransform: "capitalize",
            color: "#7a7a52",
            borderColor: "#7a7a52",
            borderRadius: "60px",
            "&:hover": {
              color: "#7a7a52",
            },
          }}
        >
          Back
        </Button>
      </Box>

      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 22px",
            marginBottom: "30px",
          }}
        >
          <Typography
            sx={{
              color: "#0E0E0E",
              fontWeight: 600,
              fontSize: "32px",
              fontFamily: "Montserrat",
            }}
          >
            Team Leave
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Typography
              sx={{
                color: "#0E0E0E",
                fontWeight: 500,
                fontSize: "14px",
                fontFamily: "Montserrat",
              }}
            >
              Manager Board:
            </Typography>
            <Select
              value={managerBoard}
              onChange={(e) => setManagerBoard(e.target.value)}
              sx={{
                borderRadius: "20px",
                height: "32px",
                fontSize: "14px",
                color: "#0E0E0E",
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="teamA">Team A</MenuItem>
              <MenuItem value="teamB">Team B</MenuItem>
            </Select>
          </Box>
        </Box>
      </Box>

      <Box border="1px solid #85803c" borderRadius="1rem" pt={1} pb={1}>
        <TableHeader2
          stage={stage}
          setStage={setStage}
          search={search}
          setSearch={setSearch}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          menuItemsStage={menuItemsStage}
          menuItemsExportOptions={menuItemsExportOptions}
        />
        <EventCalendar
          events={allEvents}
          allowAdd={false}
          showToolbar={true}
          customColors={customColors}
        />
      </Box>
    </Box>
  );
};

export default CalendarPage;
