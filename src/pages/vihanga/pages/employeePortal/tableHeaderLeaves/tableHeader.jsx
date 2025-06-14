import React,{useState} from "react";
import {
  Box,
  Button,
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
  ArrowDownwardOutlined as ArrowDownwardOutlinedIcon,
} from "@mui/icons-material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CustomButton from '../../../components/Button/CustomButton'
import TuneIcon from '@mui/icons-material/Tune';
import Close from '../../../../../assets/svg/close.svg';
import Filter from '../../../../../assets/svg/filter_list.svg'
import CheckboxDropdown from "../../objectives/dashboard/tableHeader/DisplayOptions";
import displayOptions from "../../../../../assets/svg/displayOptionsIconDashboard.svg";


const TableHeader4 = ({
  stage,
  setStage,
  search,
  setSearch,
  selectedItems,
  setSelectedItems,
  menuItemsStage = [],
  menuItemsExportOptions = [],
  isCompany,
  isEmployee,
  columns,
  setVisibleColumns,
  visibleColumns=[],
  handleEmployeeExport,
    setStatusAnchorEl,
          statusAnchorEl,
          statusOptions,
          handleStatusToggle,
          selectedStatus
}) => {
  const [exportAnchorEl, setExportAnchorEl] = React.useState(null);
  const [displayAnchorEl, setDisplayAnchorEl] = useState(null);
  console.log("visibleColumns", visibleColumns,columns);
  const handleClickExport = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleCloseExport = () => {
    setExportAnchorEl(null);
  };


  const handleCheckboxChange = (itemText) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemText)
        ? prevSelected.filter((text) => text !== itemText)
        : [...prevSelected, itemText]
    );
  };

  return (
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 1rem",
    margin: ".3rem 0 1rem 0",
    width: "100%",
    flexWrap: "wrap",
    marginTop:'20px'
  }}
>
  {/* LEFT SIDE — Display Options & Status */}
  {(isEmployee || isCompany) && (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <CheckboxDropdown
        anchorEl={displayAnchorEl}
        setAnchorEl={setDisplayAnchorEl}
        options={columns.map((col) => col.label)}
        selectedOptions={visibleColumns?.map(
          (id) => columns.find((col) => col.id === id)?.label
        )}
        onToggle={(label) => {
          const column = columns.find((col) => col.label === label);
          if (!column) return;
          setVisibleColumns((prev) =>
            prev.includes(column.id)
              ? prev.filter((id) => id !== column.id)
              : [...prev, column.id]
          );
        }}
        icon={<img src={displayOptions} alt="Display Options" />}
        label="Display Options"
      />

      <CheckboxDropdown
        anchorEl={statusAnchorEl}
        setAnchorEl={setStatusAnchorEl}
        options={statusOptions}
        selectedOptions={selectedStatus}
        onToggle={handleStatusToggle}
        label="Status"
        useCustomIcons
      />
    </Box>
  )}

  {/* RIGHT SIDE — Date, Filter, Search, Export */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      mt: isEmployee || isCompany ? 0 : "10px", // Add margin-top only if no left content
      flexWrap: "wrap",
    }}
  >
    {/* Conditionally Render Date & Filter for Non-Employees/Companies */}
    {!isCompany && !isEmployee && (
      <>
        {[{ label: "Date", icon: Close }, { label: "Filter", icon: Filter }].map(
          ({ label, icon }) => (
            <Button
              key={label}
              variant="outlined"
              startIcon={<img src={icon} style={{ width: 20, height: 20 }} />}
              sx={{
                width: 151,
                height: 34,
                borderRadius: "100px",
                border: "1px solid #837F39",
                px: 2,
                backgroundColor: "#FEFEFE",
                color: "#0E0E0E",
                fontFamily: "Work Sans",
                fontWeight: 600,
                fontSize: "12px",
                textTransform: "none",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </Button>
          )
        )}
      </>
    )}

    <TextField
      placeholder="Search here.."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      sx={{
        minWidth: 294,
        border: "1px solid #837F39",
        px: 1,
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
        sx: { "& input": { padding: 0 } },
      }}
    />

    <CustomButton
      iconPosition="start"
      iconExists
      onClick={isEmployee ? handleEmployeeExport : handleClickExport}
      IconProp={ExportIcon}
      text="Export"
      variant="outlined"
      color="#000"
      sx={{
        fontWeight: 550,
        border: "1px solid #85803c",
        borderRadius: "5rem",
         height: "34px",
            "& .MuiInputBase-root": {
              height: "34px",
              px: 1.5,
            },
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
          mt: "10px",
        },
      }}
    >
      {menuItemsExportOptions?.map((item, index) => (
        <MenuItem key={index} onClick={handleCloseExport}>
          <ListItemIcon sx={{ minWidth: 30 }}>
            <img src={item?.icon} alt="option" width="18" height="18" />
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            sx={{
              color: "#6D6D6D",
              fontWeight: 500,
              fontSize: "14px",
            }}
          />
        </MenuItem>
      ))}
    </Menu>
  </Box>
</Box>


  );
};

export default TableHeader4;