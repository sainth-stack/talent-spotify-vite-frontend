import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Button,useTheme, useMediaQuery } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomTable from "../../../../components/CustomTable/index";
import axios from "axios";
import { Toast } from "../../../../../../service/toast";
import { appURL } from "utilities";
import moment from "moment";
import ActionDropdown from "../../../../components/ActionDropdown/ActionDropdown";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import ArrowDownwardOutlinedIcon from "../../../../../../assets/svg/ExportSvg.svg";
import { exportToCSV, exportToExcel, exportToPDF } from "utilities/ExportFunctions";
import MobileLeaveCard from "../../../../components/MobileLeaveCard/MobileLeaveCard";
const getStatusColor = (status) => {
  switch (status) {
    case "Waiting for approval":
      return "#FFD700";
    case "Cancel":
      return "#D32F2F";
    case "Approved":
      return "#808000";
    default:
      return "#000";
  }
};

const LeaveTable = ({ onEdit, refreshTable }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 960px

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const companyId = getItemFromLocalStorage("companyId");
  const userRoleId = getItemFromLocalStorage("user");
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${appURL}/recruitment/leaves`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search,
          companyId,
          empId: userRoleId._id,
          ...filters,
        },
      });
      setData(response.data?.data?.data || []);

      setTotalPages(response?.data?.data?.totalPages);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
      Toast({
        message: err.response?.data?.message || "Failed to fetch data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    setLoading(true);
    try {
      await axios.delete(`${appURL}/recruitment/leaves?id=${row._id}`);
      Toast({
        message: "Record deleted successfully",
        type: "success",
      });
      fetchData();
    } catch (err) {
      console.error("Delete Error:", err);
      Toast({
        message: err.response?.data?.message || "Failed to delete record",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, search, filters, refreshTable]);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const columns = [
    {
      id: "from",
      sortable: true,
      label: (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Date</span>
        </Box>
      ),
      render: (row) => (
        <span style={{ color: "#707070", fontWeight: 500 }}>
          {row.from && row.to
            ? `${moment(row.from).format("D MMM YYYY")} - ${moment(
                row.to
              ).format("D MMM YYYY")}`
            : "N/A"}
        </span>
      ),

      render: (row) => (
        <span style={{ color: "#707070", fontWeight: 500 }}>
          {row.from && row.to
            ? `${moment(row.from).format("D MMM YYYY")} - ${moment(
                row.to
              ).format("D MMM YYYY")}`
            : "N/A"}
        </span>
      ),
    },
    {
      id: "absenceType",
      label: (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Type</span>
        </Box>
      ),
      sortable: true,
    },
    {
      id: "durationOfAbsence",
      sortable: true,
      label: (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Duration</span>
        </Box>
      ),
      render: (row) => (
        <span style={{ color: "#707070", fontWeight: 500 }}>
          {row.durationOfAbsence || "N/A"}
        </span>
      ),
    },
    {
      id: "status",
      sortable: true,
      label: (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ fontWeight: 500 }}>Status</span>
        </Box>
      ),
      render: (row) => (
        <span style={{ color: getStatusColor(row.status), fontWeight: 500 }}>
          {row.status || "N/A"}
        </span>
      ),
    },
    {
      id: "action",
      label: <span style={{ fontWeight: 500 }}>Action</span>,
      sortable: false,
      render: (row) => (
        <ActionDropdown
          row={row}
          actions={[
            {
              label: "Edit",
              icon: <BorderColorIcon fontSize="small" />,
              onClick: onEdit,
            },
            {
              label: "Delete",
              icon: <DeleteIcon fontSize="small" />,
              onClick: handleDelete,
            },
          ]}
        />
      ),
    },
  ];

  const handleExport = async (item) => {
    try {
      const response = await axios.get(`${appURL}/recruitment/leaves`, {
        responseType: "json",
        params: {
          companyId,
          empId: userRoleId._id,
        },
      });

      if (response?.data?.success) {
        // Extract the leave types array from nested response
        const rawData = response.data.data.data;

        // Optional: format rawData to your export fields
        const formattedData = rawData.map((entry) => ({
          AbsenceType: entry.absenceType || "",
          HalfDay: entry.halfDay ? "Yes" : "No",
          Note: entry.note || "",
          From: entry.from ? new Date(entry.from).toLocaleDateString() : "",
          To: entry.to ? new Date(entry.to).toLocaleDateString() : "",
          DurationOfAbsence: entry.durationOfAbsence || "",
          CompanyID: entry.companyId || "",
          EmployeeID: entry.empId || "",
          CreatedAt: entry.createdAt
            ? new Date(entry.createdAt).toLocaleDateString()
            : "",
          UpdatedAt: entry.updatedAt
            ? new Date(entry.updatedAt).toLocaleDateString()
            : "",
        }));
        // Export according to selected format
        switch (item.format) {
          case "csv":
            exportToCSV(formattedData);
            break;
          case "excel":
            exportToExcel(formattedData);
            break;
          case "pdf":
            exportToPDF(formattedData);
            break;
          default:
            alert(`Unknown export format: ${item.format}`);
            return;
        }

        Toast({
          message: `Exported as ${item.format.toUpperCase()}`,
          type: "success",
        });
      } else {
        alert("Failed to fetch export data.");
      }
    } catch (err) {
      console.error("Export Error:", err);
      Toast({
        message: err.response?.data?.message || "Failed to export data",
        type: "error",
      });
    }
  };

  const menuItemsExportOptions = [
    { text: "Export as CSV", format: "csv", icon: ArrowDownwardOutlinedIcon },
    {
      text: "Export as Excel",
      format: "excel",
      icon: ArrowDownwardOutlinedIcon,
    },
    { text: "Export as PDF", format: "pdf", icon: ArrowDownwardOutlinedIcon },
  ];

  return (
    <Box>
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
        Leave History
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {isMobile ? (
        <>
          {sortedData.map((row, index) => {
             const customFields = [
           
               { key: "date", label: "Date" },
               { key: "absenceType", label: "Type" },
               { key: "durationOfAbsence", label: "Duration" },
               { key: "status", label: "Status" },
             ];
            return (
              <MobileLeaveCard
              key={index}
              row={row}
              onEdit={onEdit}
              fields={customFields}
              onDelete={handleDelete}
            />
           )
          })}
        </>
      ) : (
        <CustomTable
          onExport={handleExport}
          columns={columns}
          data={sortedData}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={totalPages}
          loading={loading}
          pagination
          menuItemsExportOptions={menuItemsExportOptions}
          onEdit={onEdit}
          onDelete={handleDelete}
          search={search}
          setSearch={setSearch}
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </Box>
  );
};

export default LeaveTable;
