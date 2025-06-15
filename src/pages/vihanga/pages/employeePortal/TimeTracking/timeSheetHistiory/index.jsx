import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LeaveTable4 from "./table";
import CustomMap from "../../../../components/MapView/CustomMap";
import CustomSwitchButton from "../../../../components/SwitchButton/CustomSwitch";
import CustomButton from "../../../../components/Button/CustomButton";

const TimeSheetHistory = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 960px

  const [selectedSwitch, setSelectedSwitch] = useState("geo");
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTrackLocation = () => {
    setLoading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 5;
        }
        return prev;
      });
    }, 100);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setLoading(false);
          clearInterval(interval);
          setProgress(100);
        },
        (err) => {
          console.error("Error getting location:", err);
          setLoading(false);
          clearInterval(interval);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000,
        }
      );
    } else {
      console.error("Geolocation not supported in this browser.");
      setLoading(false);
      clearInterval(interval); // Clear the interval if geolocation isn't supported
    }
  };

  return (
    <Box>
      <MapViewForTimeHistory
        position={position}
        selectedSwitch={selectedSwitch}
        setSelectedSwitch={setSelectedSwitch}
        loading={loading}
        progress={progress} // Pass the dynamic progress to the map view
        onTrackLocation={handleTrackLocation}
      />
      <Box
        sx={{
          paddingBottom: "70px",
          margin: isMobile ? "1rem .5rem" : "1rem",
          bgcolor: "#fff",
          padding: isMobile ? ".5rem" : "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.5px 0px rgba(0,0,0,0.2)",
        }}
      >
        <LeaveTable4 />
      </Box>
    </Box>
  );
};

export default TimeSheetHistory;

const MapViewForTimeHistory = ({
  position,
  selectedSwitch,
  setSelectedSwitch,
  loading,
  progress,
  onTrackLocation,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 960px

  return (
    <Box
      sx={{
        paddingBottom: isMobile ? "30px" : "70px",
        margin: isMobile ? "1rem .5rem" : "1rem",
        bgcolor: "#fff",
        padding: isMobile ? "10px" : "2rem",

        borderRadius: "1.5rem",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      <Typography
        sx={{
          fontSize: isMobile ? "10px" : isTablet ? "20px" : "32px",

          fontWeight: "600",
          fontFamily: `"Montserrat"`,
          color: "#0E0E0E",
        }}
      >
        Geo Location Time Entry
      </Typography>

      <Typography
        sx={{
          marginTop: "20px",
          fontSize: isMobile ? "5px" : isTablet ? "10px" : "15px",
        }}
      >
        Clock in out based on your physical location.
      </Typography>

      <CustomSwitchButton
        iconExists={false}
        options={[
          { label: "Manual / Bio", value: "manual" },
          { label: "Geo", value: "geo" },
        ]}
        activeOption={selectedSwitch}
        onChange={(value) => {
          setSelectedSwitch(value);
          console.log("Selected:", value);
        }}
        sx={{
          marginTop: isMobile ? ".3rem" : "",
        }}
      />

      <Typography
        sx={{
          fontSize: isMobile ? "15px" : isTablet ? "20px" : "25px",
          fontWeight: "600",
          fontFamily: `"Montserrat"`,
          color: "#0E0E0E",
          marginTop: isMobile ? "1rem" : "2rem",
        }}
      >
        Location Services
      </Typography>

      <Typography
        sx={{
          marginTop: isMobile ? "10px" : "20px",
          fontSize: isMobile ? "10px" : isTablet ? "15px" : "24px",
        }}
      >
        Please allow location access when prompted. Your location is only used
        to verify presence at work.
      </Typography>

      {/* Track Location Button */}

      {/* Map or Loading Text */}
      <Box sx={{ marginTop: "30px" }}>
        {loading ? (
          <>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 12,
                backgroundColor: "#f0f0f0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#85803c",
                },
              }}
            />
            <Typography sx={{ marginTop: "10px", textAlign: "center" }}>
              Getting your location...
            </Typography>
          </>
        ) : position ? (
          <Box
            sx={{
              paddingBottom: "70px",
              margin: isMobile ? "" : "1rem",
              padding: isMobile ? "" : "2rem",
              bgcolor: "#fff",
              borderRadius: "1.5rem",
              boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
            }}
          >
            <CustomMap
              latitude={position.latitude}
              longitude={position.longitude}
            />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={onTrackLocation}
                sx={{
                  backgroundColor: "#85803c",
                  textTransform: "none",
                  fontSize: "16px",
                  borderRadius: "1rem",
                  "&:hover": {
                    backgroundColor: "#85803c",
                  },
                }}
              >
                Track My Location
              </Button>
            </Box>

            <Typography
              sx={{
                marginTop: isMobile ? ".5rem" : "",
              }}
            >
              No location yet. Click "Track My Location".
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};
