import React, { useState, useEffect } from "react";
import TitleHeader from "components/TitleHeader";
import "./styles.scss";
import Text from "components/Company/Text";
import HorizontalBar from "components/Company/HorizontalBar";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import paginationFactory from "react-bootstrap-table2-paginator";
import trashIcon from "assets/svg/trashIcon.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";
import CheckboxInput from "components/Company/CheckboxInput";
import DownloadLink from "components/Company/DownloadLink";
import BrowseFiles from "components/Company/BrowseFiles";
import UploadProgress from "components/Company/UploadProgress";
import { Col, Row } from "react-bootstrap";
import closeIcon from "assets/svg/closefile.svg";
import Grades from "../Grades";
import { useDispatch } from "react-redux";
import {
  deleteDepartment,
  createDepartment,
  updateDepartment,
  getDepartmentsData,
} from "action/DepartmentAct";
import {
  countriesNames,
  LoadingIndicator,
  statusesActive,
  Validator,
} from "utilities";
import Designation from "../Designations";
import { departmentApi } from "service/apiVariables";
import { getServiceUrl } from "service/api";
import axios from "axios";
import {
  createUpload,
  deleteUpload,
  getUploadsByCategory,
} from "action/UploadAct";
import { bytesToSize, removeDuplicates } from "utilities";
import { Toast } from "service/toast";
import UpdateDepartmentData from "./UpdateData";
import TableNormal from "components/TableNormal";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import CustomTable from "pages/vihanga/components/CustomTable";
import { Box, Typography, Chip, IconButton,Button,Menu, ListItemIcon,
  ListItemText,MenuItem } from '@mui/material';
import { ArrowUpward, ArrowDownward, Edit, Delete } from '@mui/icons-material';
import { Download } from "lucide-react";
import FileUpload from "../../vihanga/components/filesUplode/draganddropFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditSvgIcon from "assets/svg/EditSvg.svg";
import DeleteSvgIcon from "assets/svg/DeleteSvg.svg";
import { FaSave } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";


const CancelToken = axios.CancelToken;
const source = CancelToken.source();
export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      createdAt: data[i].createdAt || "",
      departmentName: data[i].departmentName || "",
      legalEntityId: data[i].legalEntityId || null,
      legalEntityName: data[i].legalEntityName || "",
      location: data[i].location || "",
      parentDepartment: data[i].parentDepartment || "",
      parentDepartmentId: data[i].parentDepartmentId || null,
      status: data[i].status || "",
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
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleEdit(row);
          }}
        >
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <img src={EditSvgIcon} alt="Edit" width="18" height="18" />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            sx={{
              color: "#6D6D6D",
              fontWeight: "500",
              fontSize: "14px",
              letterSpacing: "1%",
            }}
          />
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

export default function Departments() {
  const companyId = useSelector((store) => store.user.companyId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [, forceUpdate] = useState(false);
  const dispatch = useDispatch();
  const validator = Validator();
  const departmentObjs = [
    {
      departmentName: "",
      legalEntityName: "",
      location: "",
      parentDepartment: "",
      status: "",
      companyId,
      _id: null,
    },
  ];
  const [departmentSearch, setDepartmentSearch] = useState(departmentObjs[0]);
  const [departmentInfo, setdepartmentInfo] = useState([]);
  const [grades, setGrades] = useState([]);
  const [departmentInfoObj, setDepartmentInfoObj] = useState({});
  const [modalShow, setModalShow] = React.useState(false);
  const [searchKey] = useState("");
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [isBulkUpload, setBulkUpload] = useState(true);
  const [uploads, setUploads] = useState([]);
  const [fileName, setFileName] = useState("");
  const [legalEntities, setLegalEntities] = useState([]);
  const [parentDepartments, setParentDepartments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [uploadError, setUploadError] = useState("");
  const [visibleColumns, setVisibleColumns] = useState([
    "departmentName",
    "status",
    "legalEntityName",
    "parentDepartment",
    "location",
    "actions",
  ]);
  const statusOptions = ["Active", "Inactive"];

  const [search, setSearch] = useState("");
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const link =
    "https://res.cloudinary.com/dbqm9svvp/raw/upload/v1688019345/talentspotifypics/Department-Template_vekak5.csv";


const columns = [
  {
    id: "departmentName",
    label: "DEPARTMENT NAME",
    render: (row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          sx={{
            fontSize: "14px",
            color: "#535353",
            fontFamily: "Work Sans",
            fontWeight: "400"
          }}
        >
          {row.departmentName}
        </Typography>
        
      </Box>
    ),
  },
  {
    id: "status",
    label: t("Tasks.Status"),
    render: (row) => (
      <Box display="flex" flexDirection="column" alignItems="center">
               <Typography color={"#837F39"}>{row?.status}</Typography>
             </Box>
    ),
  },
  {
    id: "legalEntityName",
    label: "LEGAL ENTITY",
    render: (row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          sx={{
            fontSize: "14px",
            color: "#535353",
            fontFamily: "Work Sans",
            fontWeight: "400"
          }}
        >
          {row.legalEntityName}
        </Typography>
        
      </Box>
    ),
  },
  {
    id: "parentDepartment",
    label: "PARENT DEPARTMENT",
    render: (row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          sx={{
            fontSize: "14px",
            color: "#535353",
            fontFamily: "Work Sans",
            fontWeight: "400"
          }}
        >
          {row.parentDepartment}
        </Typography>
        
      </Box>
    ),
  },
  {
    id: "location",
    label: "LOCATION",
    render: (row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          sx={{
            fontSize: "14px",
            color: "#535353",
            fontFamily: "Work Sans",
            fontWeight: "400"
          }}
        >
          {row.location}
        </Typography>
        
      </Box>
    ),
  },
  {
    id: "actions",
    label: "ACTION",
    render: (row) => (
      // <Box sx={{ display: "flex", gap: 1 }}>
      //   <IconButton
      //     size="small"
      //     onClick={() => {
      //       setModalShow(true);
      //       handleObj(row);
      //     }}
      //     sx={{ 
      //       '&:hover': { 
      //         backgroundColor: 'rgba(131, 127, 57, 0.1)' 
      //       } 
      //     }}
      //   >
      //     <Edit sx={{ fontSize: 20, color: "#837F39" }} />
      //   </IconButton>
      //   <IconButton
      //     size="small"
      //     onClick={() => {
      //       handleDelete(row._id);
      //     }}
      //     sx={{ 
      //       '&:hover': { 
      //         backgroundColor: 'rgba(239, 56, 56, 0.1)' 
      //       } 
      //     }}
      //   >
      //     <Delete sx={{ fontSize: 20, color: "#EF3838" }} />
      //   </IconButton>
      // </Box>
        <ActionMenu
          row={row}
          handleEdit={(data) => {
            setModalShow(true);
            handleObj(row);
          }}
          handleDelete={handleDelete}
          sx={{ display: "flex", alignItems: "center" }}
        />
    ),
  },
];

  const handleStatusToggle = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleObj = (row) => {
    let updatedObj = data.map((depart) => {
      return { label: depart.departmentName, value: depart.departmentName };
    });
    let nonduplicates = removeDuplicates(legalEntities, "value");
    let updatedEntities = nonduplicates.map((depart) => {
      return { label: depart.value, value: depart.value };
    });
    updatedObj.unshift({ label: "--Select--", value: "" });
    updatedEntities.unshift({ label: "--Select--", value: "" });
    setDepartmentInfoObj({
      ...row,
      departments: updatedObj,
      entities: updatedEntities,
    });
  };

  const handleChangeArray = ({ target: { name, value } }, index) => {
    let updatedData = [...departmentInfo];
    updatedData[index][name] = value;
    setdepartmentInfo(updatedData);
    setError("");
  };

  const handleChangeSearch = ({ target: { name, value } }) => {
    let updatedData = { ...departmentSearch };
    updatedData[name] = value;
    setDepartmentSearch(updatedData);
    setError("");
  };

  const handleAddItem = () => {
    let updatedData = [...departmentInfo];
    updatedData.push(departmentObjs[0]);
    setdepartmentInfo(updatedData);
    setError("");
  };
  const handleRemoveItem = (index) => {
    let updatedData = [...departmentInfo];
    updatedData.splice(index, 1);
    setdepartmentInfo(updatedData);
    setError("");
  };
  const handleDelete = (id) => {
    try {
      let response = dispatch(deleteDepartment(id));
      response.then(({ success, message }) => {
        if (success) {
          fetchParentDepartments();
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
  const fetchParentDepartments = () => {
    try {
      setLoading(true);
      let response = dispatch(getDepartmentsData());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = tableGenerator(
            data[0].departments,
            data[0].departments.length
          );
          setData(result);
          let result2 = data[0].departments.map((item) => {
            return { key: item.departmentName, value: item.departmentName };
          });
          setParentDepartments(result2);
          let nonduplicates = removeDuplicates(
            data[0].entities,
            "legalEntityName"
          );
          let result3 = nonduplicates
            .filter((item) => item.companyId === companyId)
            .map((item) => {
              return { key: item.legalEntityName, value: item.legalEntityName };
            });
          setLegalEntities(result3);
          let nonduplicates2 = removeDuplicates(data[0].grades, "gradeName");
          let result4 = nonduplicates2.map((item) => {
            return { key: item.gradeName, value: item.gradeName };
          });
          setGrades(result4);
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

  const cancelUpload = () => {
    source.cancel();
  };
  useEffect(() => {
    fetchParentDepartments();
    fetchUploads();
    //eslint-disable-next-line
  }, []);

  const handleSave = () => {
    if (
      validator.current.allValid() &&
      departmentInfo[0].departmentName.length > 0 &&
      departmentInfo[0].status.length > 0 &&
      departmentInfo[0].legalEntityName.length > 0 &&
      departmentInfo[0].location.length > 0
    ) {
      try {
        let result = departmentInfo.map((entity) => {
          return { ...entity };
        });
        let response = dispatch(createDepartment(result[0]));
        response.then(({ success, message }) => {
          setLoading(true);
          if (success) {
            setLoading(false);
            fetchParentDepartments();
            setError("");
            setdepartmentInfo([]);
            setDepartmentSearch(departmentObjs[0]);
          } else {
            setLoading(false);
            setError(message);
          }
        });
      } catch (error) {
        setLoading(false);
        setError(error.toString());
      }
    } else {
      validator.current.showMessages();
      forceUpdate(true);
      Toast({
        type: "warning",
        message: "Please fill all the fields",
        time: 4000,
      });
    }
  };
  const handleFileUpload = async ({ data: departments, file, url }) => {
    setFileName(file.name);
    let reqBody = {
      category: "department",
      filename: file.name,
      loadedData: loaded,
      totalData: total,
      fileSize: bytesToSize(file.size),
      fileUrl: url,
      companyId,
    };
    let totalDepartments = [...departments];
    let finalDepartments = [];
    finalDepartments = totalDepartments.map((department) => {
      return {
        ...department,
        companyId,
      };
    });
    const duplicateDepartments = [...finalDepartments].filter((department) => {
      return (
        departments.filter(
          (dept) =>
            dept.departmentName === department.departmentName &&
            dept.legalEntityName === department.legalEntityName &&
            dept.location === department.location
        ).length > 1
      );
    });

    let duplicateIndexes = duplicateDepartments.map((department) => {
      return (
        departments.findIndex(
          (dept) =>
            dept.departmentName === department.departmentName &&
            dept.legalEntityName === department.legalEntityName &&
            dept.location === department.location
        ) + 2
      );
    });
    duplicateIndexes = duplicateIndexes.filter(
      (v, i, a) => a.findIndex((v2) => v2 === v) === i
    );
    if (duplicateIndexes.length > 0) {
      setUploadError(
        "Duplicate Departments found in the file. Please check line numbers " +
          duplicateIndexes.toString()
      );
    } else {
      setShowProgress(true);
      let result = await axios
        .post(
          getServiceUrl("production") +
            departmentApi.createOrUpdateMultipleDepartments.api,
          { data: finalDepartments },
          {
            onUploadProgress: (data) => {
              setTotal(finalDepartments.length);
              setLoaded(
                Math.round(
                  100 *
                    (data.loaded / data.total) *
                    (finalDepartments.length / 100)
                )
              );
              setProgress(Math.round((100 * data.loaded) / data.total));
            },
          }
        )
        .catch((err) => {
          reqBody.status = "failed";
          reqBody.loadedData = 0;
          reqBody.totalData = finalDepartments.length;
          const uploadResponse = dispatch(createUpload(reqBody));
          uploadResponse
            .then(({ success, message, id }) => {
              if (success) {
                setError("");
                setTimeout(() => {
                  setShowProgress(false);
                  fetchUploads();
                  fetchParentDepartments();
                }, 2000);
              } else {
                setTimeout(() => {
                  setShowProgress(false);
                  fetchUploads();
                  fetchParentDepartments();
                }, 2000);
                setError(message);
              }
            })
            .catch((error) => {
              console.log("error detected", error);
            });
        });
      if (result?.data?.success) {
        reqBody.status = "success";
        reqBody.loadedData = finalDepartments.length;
        reqBody.totalData = finalDepartments.length;
        const uploadResponse = dispatch(createUpload(reqBody));
        uploadResponse
          .then(({ success, message, id }) => {
            if (success) {
              setError("");
              setTimeout(() => {
                setShowProgress(false);
                fetchUploads();
                fetchParentDepartments();
              }, 2000);
            } else {
              setTimeout(() => {
                setShowProgress(false);
                fetchUploads();
                fetchParentDepartments();
              }, 2000);
            }
          })
          .catch((error) => {
            console.log("error detected", error);
          });
      } else {
        setTimeout(() => {
          setShowProgress(false);
          fetchUploads();
          fetchParentDepartments();
        }, 2000);
      }
    }
  };
  const fetchUploads = () => {
    try {
      setLoading(true);
      let response = dispatch(getUploadsByCategory("department"));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setUploads(data);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setUploads([]);
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

  const deleteUploadData = (id) => {
    try {
      let response = dispatch(deleteUpload(id));
      response.then(({ success, message }) => {
        if (success) {
          fetchUploads();
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

  const handleCallback = (childData) => {
    const updatedData = {
      _id: childData.id,
      legalEntityName: childData.legalEntityName,
      status: childData.status,
      location: childData.location,
      departmentName: childData.departmentName,
      parentDepartment: childData.parentDepartment,
      companyId:
        localStorage.getItem("companyId") !== null
          ? JSON.parse(localStorage.getItem("companyId"))
          : null,
    };
    let result = dispatch(updateDepartment(childData.id, updatedData));
    result.then((response) => {
      if (response.success) {
        fetchParentDepartments();
        setModalShow(false);
        setError("");
      } else {
        setError(response.message);
      }
    });
  };
  const searchLower = search.toLowerCase();

  const filteredData = data.filter((item) => {
    // Search matching
    const searchMatch = (text) =>
      text?.toString().toLowerCase().includes(searchLower);

    const matchesSearch = [
      item.companyEntityName,
      item.industry,
      item.legalEntityName,
    ].some(searchMatch);

    const matchesStatus = selectedStatus.length === 0 ||

                          selectedStatus.includes(item.status);

    return matchesSearch &&matchesStatus;
  });
  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );
    const columnsToRender = columns.filter((col) =>
    visibleColumns.includes(col.id)
  );
  return (
    <>
      <div className="bg-[#ffff] rounded-12 mh-100 p-4 ml-4">
        <div className="company-form">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p className=" text-dark font-weight-bold pb20">
              {" "}
              Department Setup{" "}
            </p>
          </div>

          <>
            <Row>
              <Col>
                <TextInput
                  stackLabel={true}
                  label="Department Name"
                  name="departmentName"
                  value={departmentSearch.departmentName}
                  onChangeText={(e) => handleChangeSearch(e)}
                />
              </Col>
              <Col>
                <SelectInput
                  label={t("Tasks.Status")}
                  placeholder="--Select--"
                  name="status"
                  options={statusesActive}
                  value={departmentSearch.status}
                  onChangeText={(e) => handleChangeSearch(e)}
                  stackLabel={true}
                />
              </Col>
              <Col>
                <SelectInput
                  label="Legal Entity"
                  placeholder="--Select--"
                  name="legalEntityName"
                  options={legalEntities}
                  value={departmentSearch.legalEntityName}
                  onChangeText={(e) => handleChangeSearch(e)}
                  stackLabel={true}
                />
              </Col>
            </Row>
            <Row className="mt-2 mb-2">
              <Col>
                <SelectInput
                  label="Parent Department"
                  placeholder="--Select--"
                  name="parentDepartment"
                  options={parentDepartments}
                  value={departmentSearch.parentDepartment}
                  onChangeText={(e) => handleChangeSearch(e)}
                  stackLabel={true}
                />
              </Col>
              <Col>
                <SelectInput
                  label="Location"
                  placeholder="--Select--"
                  name="location"
                  options={countriesNames}
                  value={departmentSearch.location}
                  onChangeText={(e) => handleChangeSearch(e)}
                  stackLabel={true}
                />
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
                <span className="align-items-center">
                  {departmentInfo.length === 0 ? (
                    <IoMdAddCircle
                      size={35}
                      color="#837F39"
                      onClick={handleAddItem}
                      className="mr-1 cursor-pointer"
                    />
                  ) : (
                    <p className="mr-4 pr-3"></p>
                  )}
                </span>
              </Col>
            </Row>
          </>
          {departmentInfo.map((entity, index) => (
            <div key={index}>
              <Text
                style={{ fontSize: "14px", fontWeight: "bold", color: "#837F39" }}
                text={`${
                  entity._id !== null ? t("Tasks.Edit") : t("Tasks.Add")
                } Department`}
              />
              <Row>
                <Col>
                  <TextInput
                    stackLabel={true}
                    label="Department Name*"
                    name="departmentName"
                    value={entity.departmentName}
                    onChangeText={(e) => handleChangeArray(e, index)}
                  />
                  {validator.current.message(
                    "departmentName",
                    entity.departmentName,
                    "required"
                  )}
                </Col>
                <Col>
                  <SelectInput
                    label="Status*"
                    placeholder="--Select--"
                    name="status"
                    options={statusesActive}
                    value={entity.status}
                    onChangeText={(e) => handleChangeArray(e, index)}
                    stackLabel={true}
                  />
                  {validator.current.message(
                    "status",
                    entity.status,
                    "required"
                  )}
                </Col>
                <Col>
                  <SelectInput
                    label="Legal Entity*"
                    placeholder="--Select--"
                    name="legalEntityName"
                    options={legalEntities}
                    value={entity.legalEntityName}
                    onChangeText={(e) => handleChangeArray(e, index)}
                    stackLabel={true}
                  />
                  {validator.current.message(
                    "legalEntityName",
                    entity.legalEntityName,
                    "required"
                  )}
                </Col>
              </Row>
              <Row className="mt-2 mb-2">
                <Col>
                  <SelectInput
                    label="Parent Department*"
                    placeholder="--Select--"
                    name="parentDepartment"
                    options={parentDepartments}
                    value={entity.parentDepartment}
                    onChangeText={(e) => handleChangeArray(e, index)}
                    stackLabel={true}
                  />
                </Col>
                <Col>
                  <SelectInput
                    label="Location*"
                    placeholder="--Select--"
                    name="location"
                    options={countriesNames}
                    value={entity.location}
                    onChangeText={(e) => handleChangeArray(e, index)}
                    stackLabel={true}
                  />
                  {validator.current.message(
                    "location",
                    entity.location,
                    "required"
                  )}
                </Col>
                <Col className="d-flex justify-content-end align-items-center">
                  <span className="align-items-center">
                    {departmentInfo.length === 1 && (
                      <>
                        <FaSave
                          size={30}
                          onClick={handleSave}
                          className="cursor-pointer"
                          style={{
                            backgroundColor: "#837F39",
                            color: "white",
                            padding: "5px",
                            borderRadius: "5px",
                            marginRight: "8px",
                          }}
                        />
                        <img
                          src={closeIcon}
                          alt="add form"
                          onClick={() => handleRemoveItem(index)}
                          className="cursor-pointer"
                        />
                      </>
                    )}
                  </span>
                </Col>
              </Row>
            </div>
          ))}
          {loading ? (
            <div className="text-center">
              <LoadingIndicator size={3} />
            </div>
          ) : (
            <div style={{marginTop:'20px'}}>
              {/* <TableNormal
                data={data.filter((item) => {
                  return (
                    item.departmentName
                      .toLowerCase()
                      .indexOf(
                        departmentSearch.departmentName.toLowerCase()
                      ) !== -1 &&
                    item.status
                      .toLowerCase()
                      .indexOf(searchKey.toLowerCase()) !== -1 &&
                    item.legalEntityName
                      .toLowerCase()
                      .indexOf(
                        departmentSearch.legalEntityName.toLowerCase()
                      ) !== -1 &&
                    item.parentDepartment
                      .toLowerCase()
                      .indexOf(
                        departmentSearch.parentDepartment.toLowerCase()
                      ) !== -1 &&
                    item.location
                      .toLowerCase()
                      .indexOf(departmentSearch.location.toLowerCase()) !==
                      -1 &&
                    item.status.indexOf(departmentSearch.status) !== -1
                  );
                })}
                columns={columns}
                paginationFactory={paginationFactory}
                searchKey={searchKey}
                keyField="_id"
              /> */}
              <CustomTable
                data={paginatedData}
                columns={columns}
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
                isCompany={true}
                statusAnchorEl={statusAnchorEl}
                setStatusAnchorEl={setStatusAnchorEl}
                statusOptions={statusOptions}
                handleStatusToggle={handleStatusToggle}
                selectedStatus={selectedStatus}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                columnsToRender={columnsToRender}
              />
            </div>
          )}
          <p className="m-0 fs14 text-center text-danger">
            {error.length > 0 ? error : ""}
          </p>
          <HorizontalBar className="pt-3 pb-3" />
             <Typography>Bulk Upload of Department </Typography>
                <div className="col-md-12 m-0 p-0 d-flex justify-content-between align-items-center">
                  <CheckboxInput
                    label="Bulk Upload of Department"
                    name="isBulkUpload"
                    value={isBulkUpload}
                    onChangeText={(e) => setBulkUpload(!isBulkUpload)}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Download sx={{ width: 20, height: 20 }} />}
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
                                          <a href={link} target="_blank" style={{color:'white'}} rel="noopener noreferrer" className="download-link p-0 m-0">{t("Company.download_template")}</a>
          
                  </Button>
          
                </div>
                {isBulkUpload && (
                  <>
                    <Box mt={2}>
                      <Typography fontWeight={500} fontSize={16}>
                        Upload File
                      </Typography>
                      <FileUpload
                        // value={formData.file}
                        onFileUpload={handleFileUpload}
                      />
                    </Box>
                  </>
          
              
                )}
          {/* <Text text="Bulk Upload of Department" />
          <div className="col-md-6 m-0 p-0 d-flex justify-content-between align-items-center">
            <CheckboxInput
              label="Bulk upload of Department"
              name="isBulkUpload"
              value={isBulkUpload}
              onChangeText={(e) => setBulkUpload(!isBulkUpload)}
            />
            <DownloadLink text="Download Template" link={link} />
          </div>
          {isBulkUpload && (
            <div className="col-md-6 m-0 p-0">
              <BrowseFiles setData={handleFileUpload} />
              {uploadError && (
                <p className="m-0 fs14 text-center text-danger">
                  {uploadError}
                </p>
              )}
              {showProgress && (
                <UploadProgress
                  filename={fileName}
                  message="10 records successfully uploading out 15"
                  status="inprogress"
                  progressWidth={progress}
                  cancelUpload={cancelUpload}
                  loaded={loaded}
                  total={total}
                />
              )}
              {uploads.length > 0 &&
                uploads.map((upload, index) => (
                  <>
                    <UploadProgress
                      deleteUpload={deleteUploadData}
                      index={index}
                      {...upload}
                    />
                    <HorizontalBar />
                  </>
                ))}
            </div>
          )} */}
          <HorizontalBar className="pt-2 pb-2 mt-5" />
          <Grades departments={parentDepartments} />
          <HorizontalBar className="pt-2 pb-2 mt-5" />
          <Designation grades={grades} departments={parentDepartments} />
          {Object.keys(departmentInfoObj).length > 0 && (
            <div>
              <UpdateDepartmentData
                show={modalShow}
                onHide={() => setModalShow(false)}
                updata={departmentInfoObj}
                handlecallback={handleCallback}
                legalEntities={legalEntities}
                departments={parentDepartments}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
