import React, { useState } from "react";
import CustomTable from "../../../../components/CustomTable/index";
import { attendanceData } from "./data";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Box, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import MobileLeaveCard from "../../../../components/MobileLeaveCard/MobileLeaveCard";

const getStatusColor = (status) => {
  switch (status) {
    case "Rejected":
      return "#DB5930";
    case "Approved":
      return "#84823F";

    default:
      return "#000";
  }
};

const LeaveTable4 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 960px

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedData = [...attendanceData].sort((a, b) => {
    if (!sortField) return 0;
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const columns = [
    {
      id: "day",
      label: (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Day</span>
          <SwapVertIcon
            style={{
              fontSize: 16,
              color: sortField === "date" ? "#000" : "#777",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSort("date");
            }}
          />
        </Box>
      ),
      sortable: false,
    },
    {
      id: "date",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Date</span>
          <SwapVertIcon
            style={{
              fontSize: 16,
              color: sortField === "date" ? "#000" : "#777",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSort("date");
            }}
          />
        </div>
      ),
      sortable: false,
    },
    {
      id: "timeIn",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Time in</span>
          <SwapVertIcon style={{ fontSize: 16, color: "#777" }} />
        </div>
      ),
      sortable: false,
    },
    {
      id: "timeOut",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Time out</span>
          <SwapVertIcon style={{ fontSize: 16, color: "#777" }} />
        </div>
      ),
      sortable: false,
    },
    {
      id: "hours",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Hours</span>
          <SwapVertIcon style={{ fontSize: 16, color: "#777" }} />
        </div>
      ),
      sortable: false,
    },
    {
      id: "method",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Source</span>
          <SwapVertIcon style={{ fontSize: 16, color: "#777" }} />
        </div>
      ),
      sortable: false,
    },
    {
      id: "status",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Status</span>
          <SwapVertIcon style={{ fontSize: 16, color: "#777" }} />
        </div>
      ),
      sortable: false,
      render: (row) => (
        <span style={{ color: getStatusColor(row.status), fontWeight: 500 }}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <div>
          <Typography
            sx={{
              color: "#0E0E0E",
              fontWeight: 600,
              fontSize: isMobile ? "15px" : isTablet ? "20px" : "24px",
              fontFamily: "Montserrat",
              marginBottom: isMobile ? "15px" : isTablet ? "20px" : "30px",
              paddingRight: "22px",
            }}
          >
            TimeSheet History
          </Typography>
        </div>
        <div>
          <Button
            sx={{
              backgroundColor: "#837F39",
              color: "#FFFFFF",
              fontWeight: "500",
              fontFamily: "Work Sans",
              marginRight: "20px",
              borderRadius: "20px",
              textTransform: "capitalize",
              margin:isMobile?"0":""
            }}
          >
            Total:53h 12m
          </Button>
        </div>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            color: "#707070",
            fontFamily: "Work Sans",
            fontWeight: "500",
            fontSize: isMobile ? "15px" : isTablet ? "20px" : "24px",

            marginBottom: "50px",
            marginLeft: "22px",
          }}
        >
          <Typography>week : 06 feb 2025 </Typography>
        </div>
      </div>
      {isMobile ? (
        <Box>
          {sortedData.map((row, index) => {
            const customFields = [
              { key: "day", label: "Day" },
              { key: "dateString", label: "Date" },
              { key: "timeIn", label: "Time In" },
              { key: "timeOut", label: "Time Out" },
              { key: "hours", label: "Hours" },
              { key: "method", label: "Source" },
            ];

            return (
              <MobileLeaveCard
                key={index}
                row={row}
                fields={customFields}
                // onEdit={() => handleEdit(row)}
                // onDelete={() => handleDelete(row)}
              />
            );
          })}
        </Box>
      ) : (
        <CustomTable
          columns={columns}
          data={sortedData}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={Math.ceil(attendanceData.length / rowsPerPage)}
          pagination
        />
      )}
    </Box>
  );
};

export default LeaveTable4;
