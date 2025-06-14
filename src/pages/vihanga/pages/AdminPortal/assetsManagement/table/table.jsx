import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import axios from "axios";
import { Toast } from "service/toast";

import CustomTable from "../../../../components/CustomTable";
import ActionDropdown from "../../../../components/ActionDropdown/ActionDropdown";

const AssetsManagementTable = ({ onEdit ,refreshTable }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});

  const appURL1 = "http://localhost:4000/api";

  const handleDelete = async (row) => {
    setLoading(true);
    try {
     await axios.delete(`${appURL1}/delete/${row._id}`);

      Toast({ message: "Record deleted successfully", type: "success" });

      // ✅ Remove deleted row from state directly
      setData((prevData) => prevData.filter((item) => item._id !== row._id));
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

 const fetchData = async ({
  page = 0,
  limit = 10,
  search = "",
  companyId,
  empId,
  filters = {},
} = {}) => {
  setLoading(true);
  setError(null);

  try {
    const response = await axios.get("http://localhost:4000/api/allAssets", {
      params: {
        page: page + 1,
        limit,
        search,
        companyId,
        empId,
        ...filters,
      },
    });

    const result = response.data;

    const transformedData = result.flatMap(
      ({
        fullName,
        employeeId,
        position,
        workLocation,
        department,
        assets = [],
      }) =>
        assets.map(
          ({
            _id,
            assetType,
            assetNumber,
            issueDate,
            collectionDate,
          }) => ({
            _id,
            fullName,
            employeeId,
            position,
            workLocation,
            department,
            assetType,
            assetNumber,
            issueDate,
            collectionDate,
          })
        )
    );

    setData(transformedData);
    setTotalPages(response.data?.totalPages || 1);
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


  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (!sortField) return 0;
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortField, sortOrder, data]);

  useEffect(() => {
    fetchData({ page, limit: rowsPerPage, search, filters });
  }, [page, rowsPerPage, search, filters,refreshTable]);

  const renderHeaderWithSort = (label, field) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <span style={{ fontWeight: 500 }}>{label}</span>
      <SwapVertIcon
        style={{ fontSize: 16, color: "#777", cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          handleSort(field);
        }}
      />
    </Box>
  );

  const columns = [
    { id: "name", label: renderHeaderWithSort("Name", "fullName"), render: (row) => row.fullName },
    { id: "employeeId", label: renderHeaderWithSort("Employee ID", "employeeId"), render: (row) => row.employeeId },
    { id: "department", label: renderHeaderWithSort("Department", "department"), render: (row) => row.department },
    { id: "assetType", label: renderHeaderWithSort("Asset Type", "assetType"), render: (row) => row.assetType },
    { id: "assetNo", label: renderHeaderWithSort("Asset No", "assetNumber"), render: (row) => row.assetNumber },
    {
      id: "collectionDate",
      label: renderHeaderWithSort("Collection Date", "collectionDate"),
      render: (row) => new Date(row.collectionDate).toLocaleDateString(),
    },
    {
      id: "action",
      label: <span style={{ fontWeight: 500 }}>Action</span>,
      render: (row) => (
        <ActionDropdown
          row={row}
          actions={[
            {
              label: "Edit",
              icon: <BorderColorIcon fontSize="small" />,
              onClick: onEdit
            },
            {
              label: "Delete",
              icon: <DeleteIcon fontSize="small" />,
              onClick: () => handleDelete(row),
            },
          ]}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          margin: "1rem",
          bgcolor: "#fff",
          padding: "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          margin: "1rem",
          bgcolor: "#fff",
          padding: "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        margin: "1rem",
        padding: "2rem",
        bgcolor: "#fff",
        borderRadius: "1.5rem",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        paddingBottom: "70px",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            color: "#0E0E0E",
            fontWeight: "600",
            fontSize: "24px",
            fontFamily: "Montserrat",
            mb: "30px",
            pl: "22px",
          }}
        >
          Asset Management History
        </Typography>
      </Box>

      {sortedData.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
            color: "#777",
            fontSize: "18px",
          }}
        >
          No data found
        </Box>
      ) : (
        <CustomTable
          columns={columns}
          data={sortedData}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          search={search}
          setSearch={setSearch}
          onEdit={onEdit}
          totalPages={totalPages}
          pagination
        />
      )}
    </Box>
  );
};

export default AssetsManagementTable;
