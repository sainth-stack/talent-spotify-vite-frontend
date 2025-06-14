import React, { useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Checkbox,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material";
import {
  CloseOutlined as CrossIcon,
  FilterListOutlined as FilterIcon,
  SystemUpdateAltOutlined as ExportIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomButton from "../../../../../components/Button/CustomButton";
import FilterComponent from "./filter";
import { useLocation } from "react-router-dom";
const TableHeader = ({
  stage,
  setStage,
  search,
  setSearch,
  selectedItems,
  setSelectedItems,
  menuItemsStage = [],
  menuItemsExportOptions = [],
  onExport,
  setPage,
  filters,
  setFilters
}) => {

  const location = useLocation();
  const allowedRoutes = ["leave-type", "apply-leave", "eligibitity-criteria"];
 const shouldShowFilters = allowedRoutes.some((route) =>
   location.pathname.includes(route)
 );
  
  const [exportAnchorEl, setExportAnchorEl] = React.useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = React.useState(null);

  const handleClickExport = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleCloseExport = () => {
    setExportAnchorEl(null);
  };

  const handleClickFilter = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterAnchorEl(null);
  };

  const handleCheckboxChange = (itemText) => {
    setSelectedItems(itemText);
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      candidateId: "",
      candidateName: "",
      department: "",
      position: "",
      stage: "",
      fromDate: "",
      toDate: ""
    });
  };

  const applyFilters = () => {
    handleCloseFilter();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: !shouldShowFilters ? "space-between" : "flex-end",

        alignItems: "center",
        width: "100%",
        padding: "16px 24px 16px 24px",
      }}
    >
      {!shouldShowFilters && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <CustomButton
              iconPosition="start"
              iconExists={true}
              IconProp={FilterIcon}
              key={"filters"}
              text={"Filter"}
              fontSize={"12px"}
              variant={"outlined"}
              color={"#000"}
              onClick={handleClickFilter}
              sx={{
                px: 2,
                py: 1,
                fontWeight: 550,
                border: "1px solid #85803c",
                borderRadius: "5rem",
                height: "34px",
                fontFamily: "Work Sans",
                fontSize: "12px",
              }}
            />

            <FilterComponent
              filterAnchorEl={filterAnchorEl}
              handleCloseFilter={handleCloseFilter}
              filters={filters}
              handleFilterChange={handleFilterChange}
              resetFilters={resetFilters}
              applyFilters={applyFilters}
            />
          </Box>
        </>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <TextField
          placeholder="Search here.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: 240,
            border: "1px solid #837F39",
            borderRadius: "5rem",
            "& fieldset": { border: "none" },
            height: "34px",
            "& .MuiInputBase-root": {
              height: "34px",
              px: 1.5,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#85803c" }} />
              </InputAdornment>
            ),
            sx: {
              "& input": {
                p: 0,
              },
            },
          }}
        />

        <CustomButton
          iconPosition="start"
          iconExists={true}
          onClick={handleClickExport}
          IconProp={ExportIcon}
          key={"export"}
          text={"Export"}
          variant={"outlined"}
          color={"#000"}
          sx={{
            px: 2,
            py: 1,
            fontWeight: 550,
            border: "1px solid #85803c",
            borderRadius: "5rem",
            height: "34px",
            fontFamily: "Work Sans",
            fontSize: "12px",
          }}
        />

        <Menu
          anchorEl={exportAnchorEl}
          open={Boolean(exportAnchorEl)}
          onClose={handleCloseExport}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            sx: {
              borderRadius: "1rem",
              border: "1px solid #fff",
              mt: 0.5,
            },
          }}
        >
          {menuItemsExportOptions?.map((item, index) => (
            <MenuItem key={index} onClick={() => onExport(item)}>
              <ListItemIcon sx={{ minWidth: "30px" }}>
                <img src={item?.icon} alt="Edit" width="18" height="18" />
              </ListItemIcon>
              <ListItemText
                primary={item?.text}
                sx={{
                  color: "#6D6D6D",
                  fontWeight: "500",
                  fontSize: "14px",
                  letterSpacing: "1%",
                }}
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default TableHeader;