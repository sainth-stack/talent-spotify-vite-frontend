import React, { useState, useEffect } from "react";
import TitleHeader from "components/TitleHeader";
import "./styles.scss";
import paginationFactory from "react-bootstrap-table2-paginator";
import trashIcon from "assets/svg/trashIcon.svg";
import exportIcon from "assets/svg/export.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";
import { Col, Row } from "react-bootstrap";
import add from "assets/svg/add.svg";
import { useDispatch } from "react-redux";
import { LoadingIndicator, statuses } from "utilities";
import { Link } from "react-router-dom";
import {
  deleteEmployee,
  deleteEmployees,
  getEmployeesAll,
} from "action/EmployeeAct";
import { Toast } from "service/toast";
import more from "assets/svg/More.svg";
import eye from "assets/svg/eye.svg";
import filter from "assets/svg/Filter.svg";
import SelectInputIcon from "components/Company/SelectInputIcon";
import TableNormal from "components/TableNormal";
import * as XLSX from "xlsx";
import { t } from "i18next";
import {
  Search as SearchIcon,
  Add as AddIcon,
  SystemUpdateAltOutlined as ExportIcon,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import CustomTable from "pages/vihanga/components/CustomTable";
import Checkbox from "@mui/material/Checkbox";
import CheckIcon from "@mui/icons-material/Check"; // using simple check mark
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditSvgIcon from "assets/svg/EditSvg.svg";
import DeleteSvgIcon from "assets/svg/DeleteSvg.svg";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      firstName: data[i].personalInformation.firstName || "",
      lastName: data[i].personalInformation.lastName || "",
      designation: data[i].employmentInformation.designation || null,
      email: data[i].contactInformation.email || "",
      department: data[i].employmentInformation.department || "",
      grade: data[i].employmentInformation.grade || "",
      personalInformation: data[i].personalInformation || "",
      employmentInformation: data[i].employmentInformation || "",
      contactInformation: data[i].contactInformation || "",
      status: data[i].employmentInformation.status,
    });
  }
  return items;
};

const ActionMenu = ({ row, handleEdit, handleDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ position: "relative" }}>
      <IconButton onClick={handleMenuClick} size="small">
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "1rem",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            border: "1px solid #eee",
            minWidth: "200px",
          },
        }}
      >
        <MenuItem>
          <Link
            to={{
              pathname: "/admin/setups/employeeEdit",
              state: { data: row },
            }}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ListItemIcon sx={{ minWidth: "30px" }}>
              <img src={EditSvgIcon} alt="Edit" width="18" height="18" />
            </ListItemIcon>
            <Typography>Edit</Typography>
          </Link>
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleDelete(row._id);
          }}
        >
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <img src={DeleteSvgIcon} alt="Delete" width="18" height="18" />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            sx={{
              color: "#6D6D6D",
              fontWeight: "500",
              fontSize: "14px",
              letterSpacing: "1%",
            }}
          />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default function Employees() {
  const [loading, setLoading] = useState(false);
  const [, setError] = useState(false);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const displayOpts = {
    firstName: true,
    lastName: true,
    designation: true,
    email: true,
    department: true,
    grade: true,
  };
  const displayOpts2 = {
    active: true,
    inactive: false,
  };
  const [searchKey, setSearchKey] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [displayOptions, setDisplayOptions] = useState(displayOpts);
  const [displayOptions2, setDisplayOptions2] = useState(displayOpts2);
  const [visibleColumns, setVisibleColumns] = useState([
    "firstName",
    "lastName",
    "designation",
    "email",
    "department",
    "grade",
    "actions",
  ]);
  const statusOptions = ["Active", "Inactive"];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [data, setData] = useState([]);
  const legalEntities = [];
  const parentDepartment = [];
  const locations = [];
  for (var i = 0; i < data.length; i++) {
    legalEntities.push({
      key: data[i].legalEntityName,
      value: data[i].legalEntityName,
    });
    parentDepartment.push({
      key: data[i].parentDepartment,
      value: data[i].parentDepartment,
    });
    locations.push({
      key: data[i].location,
      value: data[i].location,
    });
  }

  const searchLower = search.toLowerCase();
  const filteredData = data.filter((item) => {
    const companyInfo = item.employmentInformation;

    // Search matching
    const searchMatch = (text) =>
      text?.toString().toLowerCase().includes(searchLower);

    const matchesSearch = [
      item.title,
      item.description,
      item.grade,
      item.status,
      item.firstName,
      item.lastName,
    ].some(searchMatch);

    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(item.status);

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const onChangeText = ({ target: { name, value } }) => {
    let updatedData = { ...displayOptions };
    updatedData[name] = value;
    setDisplayOptions(updatedData);
    setError("");
  };
  const handleStatusToggle = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };
  const onChangeText2 = ({ target: { name, value } }) => {
    let updatedData = { ...displayOptions2 };
    updatedData[name] = value;
    setDisplayOptions2(updatedData);
    setError("");
  };


  const handleCheckboxChange = (row) => {
    setSelectedUsers((prevSelectedUsers) => {
      const isSelected = prevSelectedUsers.some((user) => user.id === row.id);
      if (isSelected) {
        return prevSelectedUsers.filter((user) => user.id !== row.id);
      } else {
        return [...prevSelectedUsers, row];
      }
    });
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedUsers([...filteredData]);
    } else {
      setSelectedUsers([]);
    }
  };

  const columns = (paginatedData) => {
    const selectedOnPageCount = paginatedData.filter((row) =>
      selectedUsers.some((selected) => selected.id === row.id)
    ).length;
    const allOnPageSelected =
      selectedOnPageCount === paginatedData.length && paginatedData.length > 0;
    const someOnPageSelected =
      selectedOnPageCount > 0 && selectedOnPageCount < paginatedData.length;

    return [
      {
        id: "firstName",
        label: "FIRST NAME",
        width: 160,
        headerCheckbox: true,
        renderHeader: () => {
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Checkbox
                checked={allOnPageSelected}
                indeterminate={someOnPageSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                icon={
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #535353",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                }
                checkedIcon={
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#837F39",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 18, color: "#FFFFFF" }} />
                  </Box>
                }
                indeterminateIcon={
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#837F39",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <RemoveIcon sx={{ fontSize: 18, color: "#FFFFFF" }} />
                  </Box>
                }
              />
              <Typography
                sx={{
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  color: "rgba(0, 0, 0, 0.87)",
                  fontWeight: "600",
                }}
              >
                FIRST NAME
              </Typography>
            </Box>
          );
        },
        render: (row) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Checkbox
              checked={selectedUsers.some(user => user.id === row.id)}
              onChange={() => handleCheckboxChange(row)}
              icon={
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #535353",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              }
              checkedIcon={
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: "#837F39",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckIcon sx={{ fontSize: 18, color: "#FFFFFF" }} />
                </Box>
              }
              sx={{ padding: 0 }}
            />
            <Link
              to={{
                pathname: "/admin/setups/employeeEdit",
                state: { data: row },
              }}
              style={{ textDecoration: "none" }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#535353",
                  fontFamily: "Work Sans",
                  fontWeight: "400",
                  "&:hover": { color: "#837F39" },
                }}
              >
                {row.firstName}
              </Typography>
            </Link>
          </Box>
        ),
      },
      {
        id: "lastName",
        label: "LAST NAME",
        render: (row) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Link
              to={{
                pathname: "/admin/setups/employeeEdit",
                state: { data: row },
              }}
              style={{ textDecoration: "none" }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#535353",
                  fontFamily: "Work Sans",
                  fontWeight: "400",
                  "&:hover": { color: "#837F39" },
                }}
              >
                {row.lastName}
              </Typography>
            </Link>
          </Box>
        ),
      },
      {
        id: "designation",
        label: "DESIGNATION",
        render: (row) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#535353",
                fontFamily: "Work Sans",
                fontWeight: "400",
              }}
            >
              {row.designation}
            </Typography>
          </Box>
        ),
      },
      {
        id: "email",
        label: "EMAIL ADDRESS",
        render: (row) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#535353",
                fontFamily: "Work Sans",
                fontWeight: "400",
              }}
            >
              {row.email}
            </Typography>
          </Box>
        ),
      },
      {
        id: "department",
        label: "DEPARTMENT",
        render: (row) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#535353",
                fontFamily: "Work Sans",
                fontWeight: "400",
              }}
            >
              {row.department}
            </Typography>
          </Box>
        ),
      },
      {
        id: "grade",
        label: "GRADE",
        render: (row) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#535353",
                fontFamily: "Work Sans",
                fontWeight: "400",
              }}
            >
              {row.grade}
            </Typography>
          </Box>
        ),
      },
      {
        id: "actions",
        label: "Actions",
        render: (row) => (
          <ActionMenu
            row={row}
            handleDelete={handleDelete}
            sx={{ display: "flex", alignItems: "center" }}
          />
        ),
      },
    ];
  }

  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,
    onSelect: (row) => {
      let totalData = [...selectedUsers];
      let filterData = totalData.findIndex((item) => item._id === row._id);
      if (filterData < 0) {
        totalData.push(row);
        setSelectedUsers(totalData);
      } else {
        totalData.splice(filterData, 1);
        setSelectedUsers(totalData);
      }
    },
    onSelectAll: (isSelected) => {
      if (isSelected) {
        setSelectedUsers(data);
      } else {
        setSelectedUsers([]);
      }
    },
  };
  const handleDelete = (id) => {
    try {
      let response = dispatch(deleteEmployee(id));
      response.then(({ success, message }) => {
        if (success) {
          refreshData();
          setError("");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const handleBulkDelete = (id) => {
    try {
      if (selectedUsers.length > 0) {
        setLoading(true);
        let response = dispatch(deleteEmployees({ data: selectedUsers }));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            refreshData();
            setError("");
          } else {
            setLoading(false);
            setError(message);
          }
        });
      } else {
        Toast({ message: "Please Select Users", type: "warning", time: 4000 });
      }
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const fetchEmployees = () => {
    try {
      setLoading(true);
      let response = dispatch(getEmployeesAll());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = tableGenerator(data, data.length);
          setData(result);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);
  const refreshData = () => {
    try {
      let response = dispatch(getEmployeesAll());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = tableGenerator(data, data.length);
          setData(result);
          setError("");
        } else if (data.length === 0) {
          setData([]);
          setError("No Data Found!");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error.toString());
    }
  };
  const columnsToRender = columns(paginatedData).filter((col) =>
    visibleColumns.includes(col.id)
  );

  const downloadExcelTotalData = (data) => {
    if (data.length > 0) {
      const finData = data.map((item, index) => {
        return {
          "S.No": index + 1,
          firstName: item.firstName,
          lastName: item.lastName,
          gender: item.personalInformation.gender,
          email: item.email,
          employeeNumber: item.employmentInformation.employeeNumber,
          legalEntity: item.employmentInformation.legalEntity,
          department: item.department,
          location: item.employmentInformation.location,
          lineManager: item.employmentInformation.lineManager,
          role: item.employmentInformation.role,
          designation: item.employmentInformation.designation,
          grade: item.employmentInformation.grade,
          departmentHead: item.employmentInformation.departmentHead,
          hireDate: window
            .moment(item?.employmentInformation.hireDate)
            .format("YYYY-MM-DD"),
          dateOfBirth: window
            .moment(item?.personalInformation.dateOfBirth)
            .format("YYYY-MM-DD"),
          status: item.status,
        };
      });
      const worksheet = XLSX.utils.json_to_sheet(finData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "OKRLibrary" + Date.now() + ".xlsx");
    } else {
      Toast({ message: "No Data Found!", type: "warning", time: 4000 });
    }
  };
  return (
    <>
      <div className="bg-[#ffff] rounded-12 mh-100 p-2 ml-4">
        <div className="company-form">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <p className=" text-dark font-weight-bold pb10"> Employees List</p>
            <Box sx={{ display: "flex", gap: 2 }}>
              {selectedUsers.length > 0 && (
                <Button
                  variant="contained"
                  sx={{
                    height: "34px",
                    borderRadius: "100px",
                    backgroundColor: "#837F39",
                    "&:hover": {
                      backgroundColor: "#837F39",
                    },
                    color: "white",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "11px",
                  }}
                  onClick={handleBulkDelete}
                >
                  Delete ({selectedUsers.length})
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<AddIcon sx={{ width: 20, height: 20 }} />}
                sx={{
                  // width: "160px",
                  height: "34px",
                  borderRadius: "100px",
                  border: "1px solid #837F39",

                  gap: "8px",
                  backgroundColor: "#837F39",
                  color: "#FFFFFF",
                  fontWeight: 500,
                  fontSize: "11px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#837F39",
                    color: "#FFFFFF",
                  },
                }}
              >
                <Link
                  to="/admin/setups/employeeform"
                  className="text-decoration-none text-white"
                >
                  Add New Employee
                </Link>
              </Button>
            </Box>
          </div>

          {/* <div className="d-flex justify-content-between align-items-center">
            <div className="input-group col-lg-6 col-xs-12 col-sm-12 p-0 nav-item search-bar">
              <div className="input-group-append searchInput-icon ">
                <img src={search} alt="search-icon" className="searchIcon" />
              </div>
              <input
                type="text"
                className="bg-light outline-none searchInput text-dark fs14"
                placeholder="Search Objective by Due date, Owner or Success Metrics"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
            </div>
            <div className="col-lg-6">
              <Row>
                <Col>
                  <div className="dropdown actionDropdown">
                    <button
                      className="btn dropdown-toggle bg-green text-white text-capitalize p-2 circle border fs16 w-100"
                      type="button"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {t("objectives.Action")}
                    </button>
                    <div
                      className="dropdown-menu m-1"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <button
                        className="dropdown-item text-capitalize fs16"
                        onClick={() => handleBulkDelete()}
                      >
                        <img src={trashIcon} alt="delete table icon" />
                        &nbsp;{t("objectives.Delete")}
                      </button>
                      <button
                        className="dropdown-item text-capitalize fs16"
                        style={{ gap: "5px", marginBottom: "2px" }}
                        onClick={() => downloadExcelTotalData(data)}
                      >
                        <img
                          src={exportIcon}
                          style={{ marginLeft: "5px" }}
                          alt="export table icon"
                        />
                        &nbsp;Export as Excel
                      </button>
                    </div>
                  </div>
                </Col>
                <Col>
                  <SelectInputIcon
                    label=""
                    icon={eye}
                    style={{ backgroundImage: "none", textAlign: "center" }}
                    placeholder={t("objectives.Display Options")}
                    name="action"
                    options={statuses}
                    checkboxOptions={checkboxOptions}
                  />
                </Col>
                <Col>
                  <SelectInputIcon
                    label=""
                    icon={filter}
                    style={{ backgroundImage: "none", textAlign: "center" }}
                    placeholder={t("Tasks.Status")}
                    name="status"
                    options={statuses}
                    checkboxOptions={filterOptions}
                    onChangeText={(e) => onChangeText2(e)}
                  />
                </Col>
              </Row>
            </div>
          </div> */}
          {loading ? (
            <div className="text-center">
              <LoadingIndicator size={3} />
            </div>
          ) : (
            <CustomTable
              columns={columns(paginatedData)}
              data={paginatedData || []}
              pagination={true}
              page={page}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              totalCount={data.length}
              setPage={setPage}
              onRowsPerPageChange={(newRowsPerPage) => {
                setRowsPerPage(newRowsPerPage);
                setPage(0);
              }}
              search={search}
              setSearch={setSearch}
              rowsPerPageOptions={[5, 8, 10, 20]}
              selectedItems={selectedStatus}
              setSelectedItems={setSelectedStatus}
              isEmployee={true}
              setVisibleColumns={setVisibleColumns}
              visibleColumns={visibleColumns}
              columnsToRender={columnsToRender}
              statusAnchorEl={statusAnchorEl}
              setStatusAnchorEl={setStatusAnchorEl}
              statusOptions={statusOptions}
              handleStatusToggle={handleStatusToggle}
              selectedStatus={selectedStatus}
              handleEmployeeExport={() => downloadExcelTotalData(data)}
            />
          )}
        </div>
      </div>
    </>
  );
}
