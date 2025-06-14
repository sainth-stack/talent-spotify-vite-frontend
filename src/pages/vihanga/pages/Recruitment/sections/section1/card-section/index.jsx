import { Typography, Box } from "@mui/material";
import React, { useState } from "react";
import CustomCard from "../../../../../components/Cards/index";
import CardWidget from "../../../../../components/Cards/CardWidget";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AppShortcutIcon from "@mui/icons-material/AppShortcut";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import FeedBackPopPup from "./../../feedBack/FeedBackPopPup";

const Icons = {
  briefCaseIcon: BusinessCenterOutlinedIcon,
  barChartIcon: BarChartOutlinedIcon,
  appShortcutIcon: AppShortcutIcon,
  assignmentIcon: AssignmentOutlinedIcon,
};

export const SectionCards = ({ summaryData, loading, onCardClick }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState([]);
  const [popupTitle, setPopupTitle] = useState("");

  const handleCardClick = (data, title) => {
    setPopupData(data);
    setPopupTitle(title);
    setIsPopupOpen(true);
    onCardClick(data, title);
  };

  return (
    <>
      <Box>
        <Typography sx={{ fontSize: "2rem", fontFamily: "Work Sans" }}>
          Welcome Back, Suprabha Patra!
        </Typography>
        {loading ? (
          <Typography>Loading summary...</Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "20px",
              gap: "24px",
              fontFamily: "Work Sans",
            }}
          >
            <CardWidget
              sx={{ width: "100%" }}
              onClick={() =>
                handleCardClick(summaryData.newCandidate, "New Candidate")
              }
            >
              <CustomCard
                icon={Icons.briefCaseIcon}
                text="New Candidate"
                count={summaryData.newCandidate.length || 0}
              />
            </CardWidget>

            <CardWidget
              sx={{ width: "100%" }}
              onClick={() =>
                handleCardClick(summaryData.inProgress, "In Progress")
              }
            >
              <CustomCard
                icon={Icons.barChartIcon}
                text="In Progress"
                count={summaryData.inProgress.length || 0}
              />
            </CardWidget>

            <CardWidget
              sx={{ width: "100%" }}
              onClick={() =>
                handleCardClick(
                  summaryData.waitingForFeedback,
                  "Waiting For Feedback"
                )
              }
            >
              <CustomCard
                icon={Icons.appShortcutIcon}
                text="Waiting For Feedback"
                count={summaryData.waitingForFeedback.length || 0}
              />
            </CardWidget>

            <CardWidget
              sx={{ width: "100%" }}
              onClick={() =>
                handleCardClick(summaryData.offerReleased, "Offer Released")
              }
            >
              <CustomCard
                icon={Icons.assignmentIcon}
                text="Offer Released"
                count={summaryData.offerReleased.length || 0}
              />
            </CardWidget>
          </Box>
        )}
        {isPopupOpen && (
          <FeedBackPopPup
            isOpen={isPopupOpen}
            setIsOpen={setIsPopupOpen}
            PoupData={popupData}
            popupTitle={popupTitle}
          />
        )}
      </Box>
    </>
  );
};
