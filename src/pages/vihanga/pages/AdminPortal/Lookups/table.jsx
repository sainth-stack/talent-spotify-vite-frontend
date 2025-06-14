import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Checkbox,
  TextField,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import CustomTable from "../../../components/CustomTable/index";

const LookupsTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4000/lookups/lookups");
        const lookupsArray = Array.isArray(res.data.data) ? res.data.data : [];

        const enrichedData = lookupsArray.map((item) => ({
          id: item._id || item.id,
          code: item.code || "",
          meaning: item.meaning || "",
          description: item.description || "",
          tag: item.tag || "",
          from: item.from || "",
          to: item.to || "",
          enabled: item.enabled || false,
        }));

        setData(enrichedData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch lookups.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      if (!sortField) return 0;
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [data, sortField, sortOrder, page, rowsPerPage]);

  const cellStyle = {
    border: "1px solid #e0e0e0",
    borderRadius: "5px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  };

  const renderCellInput = (value) => (
    <Box sx={cellStyle}>
      <TextField
        variant="standard"
        fullWidth
        multiline
        value={value || ""}
        InputProps={{
          disableUnderline: true,
          style: {
            whiteSpace: "normal",
            wordBreak: "break-word",
          },
        }}
        sx={{
          textarea: {
            fontSize: "14px",
            lineHeight: "1.4",
          },
        }}
      />
    </Box>
  );

  const columns = [
    {
      id: "code",
      label: "Code",
      render: (row) => (
        <Box
          sx={{
            backgroundColor: "#F4F4F4",
            borderRadius: "8px",
            padding: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            marginLeft: "30px",
            marginRight: "30px",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            variant="standard"
            fullWidth
            multiline
            value={row.code}
            InputProps={{
              disableUnderline: true,
              style: {
                whiteSpace: "normal",
                wordBreak: "break-word",
              },
            }}
            sx={{
              input: {
                padding: "6px",
                fontSize: "14px",
                lineHeight: "1.4",
              },
            }}
          />
        </Box>
      ),
    },
    {
      id: "meaning",
      label: "Meaning",
      render: (row) => renderCellInput(row.meaning),
    },
    {
      id: "description",
      label: "Description",
      render: (row) => renderCellInput(row.description),
    },
    {
      id: "tag",
      label: "Tag",
      render: (row) => renderCellInput(row.tag),
    },
    {
      id: "from",
      label: "From",
      render: (row) => (
        <Box sx={cellStyle}>
          <TextField
            type="date"
            variant="standard"
            value={row.from}
            InputProps={{ disableUnderline: true }}
            fullWidth
          />
        </Box>
      ),
    },
    {
      id: "to",
      label: "To",
      render: (row) => (
        <Box sx={cellStyle}>
          <TextField
            type="date"
            variant="standard"
            value={row.to}
            InputProps={{ disableUnderline: true }}
            fullWidth
          />
        </Box>
      ),
    },
    {
      id: "enabled",
      label: "Enabled",
      render: (row) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Checkbox
            checked={row.enabled}
            onChange={() => {}}
            sx={{
              color: "#837F39",
              "&.Mui-checked": {
                color: "#837F39",
              },
            }}
          />
        </Box>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      render: () => (
        <Box display="flex" justifyContent="center" gap={1}>
          <IconButton size="small">
            <AddIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        margin: "1rem",
        padding: "2rem",
        bgcolor: "#fff",
        borderRadius: "1.5rem",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <CustomTable
          columns={columns}
          data={sortedData}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={Math.ceil(data.length / rowsPerPage)}
          pagination
        />
      )}
    </Box>
  );
};

export default LookupsTable;
