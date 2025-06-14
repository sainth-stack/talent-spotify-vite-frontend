import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.offline"; // Optional, if you need offline tiles

import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";

// Fix for Leaflet default marker issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const CustomMap = ({ latitude = 37.7749, longitude = -122.4194 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 960px

  const mapRef = useRef(null); // for DOM reference

  useEffect(() => {
    if (!mapRef.current) return;

    // Setup default marker icon globally
    const defaultIcon = L.icon({
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
      shadowAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = defaultIcon;

    // Initialize map
    const map = L.map(mapRef.current).setView([latitude, longitude], 13);

    const offlineLayer = L.tileLayer.offline(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
        subdomains: ["a", "b", "c"],
      }
    );

    offlineLayer.addTo(map);

    // Offline caching controls
    const control = L.control.savetiles(offlineLayer, {
      zoomlevels: [13, 16],
      confirm: (layer, successCallback) => {
        if (window.confirm("Cache tiles for offline use?")) {
          successCallback();
        }
      },
      confirmRemoval: (layer, successCallback) => {
        if (window.confirm("Remove cached tiles?")) {
          successCallback();
        }
      },
    });
    control.addTo(map);

    // Add marker and popup with latitude and longitude
    const marker = L.marker([latitude, longitude]).addTo(map);
    marker
      .bindPopup(
        `
         <div style=" padding: 10px; border-radius: 8px;">
      <b>Latitude:</b> ${latitude}<br/>
      <b>Longitude:</b> ${longitude}
    </div>
      `
      )
      .openPopup();

    // Cleanup on unmount
    return () => map.remove();
  }, [latitude, longitude]);

  return (
    <Paper
      sx={{
        padding: isMobile ? ".3px" : "2rem",
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        Location Map
      </Typography>
      <Box
        id="map"
        ref={mapRef}
        sx={{
          height: { xs: 300, md: 400 }, // 300px height on mobile, 400px on desktop
          width: "100%",
          borderRadius: 2,
          overflow: "auto",
          border: "1px solid #ccc",
        }}
      />
    </Paper>
  );
};

export default CustomMap;
