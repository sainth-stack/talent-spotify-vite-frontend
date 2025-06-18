import React, { useState, useEffect } from "react";
import "./styles.scss";
import Text from "components/Company/Text";
import HorizontalBar from "components/Company/HorizontalBar";
import paginationFactory from "react-bootstrap-table2-paginator";
import trashIcon from "assets/svg/trashIcon.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";
import CheckboxInput from "components/Company/CheckboxInput";
import DownloadLink from "components/Company/DownloadLink";
import BrowseFiles from "components/Company/BrowseFiles";
import { useDispatch } from "react-redux";
import UpdateDesignation from "./UpdateData";
import { t } from "i18next";
import "./styles.scss";
import {
  getDesignations,
  deleteDesignation,
  updateDesignation,
  createOrUpdateMultipleDesignations,
} from "action/DesignationAct";
import { designationApi } from "service/apiVariables";
import { getServiceUrl } from "service/api";
import axios from "axios";
import {
  createUpload,
  deleteUpload,
  getUploadsByCategory,
} from "action/UploadAct";
import { bytesToSize, LoadingIndicator, removeDuplicates, Validator, statusesActive } from "utilities";
import UploadProgress from "components/Company/UploadProgress";
import TableNormal from "components/TableNormal";
import CustomTable from "pages/vihanga/components/CustomTable";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Menu,
} from "@mui/material";
import { ArrowUpward, ArrowDownward, Edit, Delete } from "@mui/icons-material";
import FileUpload from "../../vihanga/components/filesUplode/draganddropFile";
import { Download } from "lucide-react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditSvgIcon from "assets/svg/EditSvg.svg";
import DeleteSvgIcon from "assets/svg/DeleteSvg.svg";
import { Row, Col } from "react-bootstrap";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import save from "assets/svg/save.svg";
import add from "assets/svg/add.svg";
import closeIcon from "assets/svg/closefile.svg";
import { Toast } from "service/toast";
import { FaSave } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";

const CancelToken = axios.CancelToken;
const link =
  "https://res.cloudinary.com/dbqm9svvp/raw/upload/v1688019345/talentspotifypics/Designation-Template_mtgalw.csv";
const source = CancelToken.source();

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      designationName: data[i].designationName,
      departmentName: data[i].departmentName,
      gradeName: data[i].gradeName,
      status: data[i].status,
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

export default function Designation({ grades, departments }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const [searchKey] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const [updateObj, setUpdateObj] = useState({});
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [isBulkUpload2, setBulkUpload2] = useState(true);
  const [uploads, setUploads] = useState([]);
  const [fileName, setFileName] = useState("");
  const [search, setSearch] = useState("");
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([
    "id",
    "designationName",
    "gradeName",
    "departmentName",
    "status",
    "actions",
  ]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const statusOptions = ["Active", "Inactive"];

  const validator = Validator();
  const [, forceUpdate] = useState(false);
  const [designationInfo, setDesignationInfo] = useState([]);
  const designationObj = {
    designationName: "",
    gradeName: "",
    departmentName: "",
    status: "Active",
  };

  const handleChangeArray = ({ target: { name, value } }, index) => {
    let updatedData = [...designationInfo];
    updatedData[index][name] = value;
    setDesignationInfo(updatedData);
    setError("");
  };

  const handleAddItem = () => {
    let updatedData = [...designationInfo];
    updatedData.push(designationObj);
    setDesignationInfo(updatedData);
    setError("");
  };

  const handleRemoveItem = (index) => {
    let updatedData = [...designationInfo];
    updatedData.splice(index, 1);
    setDesignationInfo(updatedData);
    setError("");
  };

  const handleSave = () => {
    if (
      validator.current.allValid() &&
      designationInfo[0].designationName.length > 0 &&
      designationInfo[0].gradeName.length > 0 &&
      designationInfo[0].departmentName.length > 0 &&
      designationInfo[0].status.length > 0
    ) {
      setLoading(true);
      const newDesignation = {
        ...designationInfo[0],
        companyId:
          localStorage.getItem("companyId") !== null
            ? JSON.parse(localStorage.getItem("companyId"))
            : null,
      };

      const body = { data: [newDesignation] };

      dispatch(createOrUpdateMultipleDesignations(body))
        .then(({ success, message }) => {
          setLoading(false);
          if (success) {
            refreshData();
            setError("");
            setDesignationInfo([]);
            Toast({
              type: "success",
              message: "Designation added successfully",
            });
          } else {
            setError(message);
          }
        })
        .catch((error) => {
          setLoading(false);
          setError(error.toString());
        });
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

const columns = [
  {
    id: "id",
    label: "S.NO",
    render: (row) => (
      <Typography
        sx={{
          fontSize: "14px",
          color: "#535353",
          fontFamily: "Work Sans",
          fontWeight: "400"
        }}
      >
        {row.id}
      </Typography>
    ),
  },
  {
    id: "designationName",
    label: "DESIGNATION NAME",
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
          {row.designationName}
        </Typography>
       
      </Box>
    ),
  },
  {
    id: "gradeName",
    label: "GRADE NAME",
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
          {row.gradeName}
        </Typography>
       
      </Box>
    ),
  },
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
    id: "actions",
    label: "ACTION",
    render: (row) => (
      // <Box sx={{ display: "flex", gap: 1 }}>
      //   <IconButton
      //     size="small"
      //     onClick={() => {
      //       setModalShow(true);
      //       handleEdit(row);
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
      //       handleDelete(row);
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
            handleEdit(row);
          }}
          handleDelete={handleDelete}
          sx={{ display: "flex", alignItems: "center" }}
        />
    ),
  },
];

  const handleEdit = (cellContent) => {
    let nonduplicatedepts = removeDuplicates(departments, "departmentName");
    let updatedObj = nonduplicatedepts.map((depart) => {
      return { label: depart.departmentName, value: depart.departmentName };
    });
    updatedObj.unshift({ label: "--Select--", value: "" });

    let nonduplicategrades = removeDuplicates(grades, "gradeName");
    let updatedObj2 = nonduplicategrades.map((depart) => {
      return { label: depart.gradeName, value: depart.gradeName };
    });
    updatedObj2.unshift({ label: "--Select--", value: "" });
    const updateOb = {
      id: cellContent.id,
      _id: cellContent._id,
      gradeName: cellContent.gradeName,
      departmentName: cellContent.departmentName,
      designationName: cellContent.designationName,
      status: cellContent.status,
      grades: updatedObj2,
      departments: updatedObj,
    };
    setUpdateObj(updateOb);
  };

  const fetchDesignations = () => {
    try {
      setLoading(true);
      let response = dispatch(getDesignations());
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
    fetchDesignations();
    fetchUploads();
    //eslint-disable-next-line
  }, []);
  const handleDelete = (data) => {
    try {
      let response = dispatch(deleteDesignation(data._id));
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
  const handleCallback = (childData) => {
    const updateDesignationData = {
      _id: childData.id,
      departmentName: childData.departmentName,
      designationName: childData.designationName,
      gradeName: childData.gradeName,
      status: childData.status,
      companyId:
        localStorage.getItem("companyId") !== null
          ? JSON.parse(localStorage.getItem("companyId"))
          : null,
    };
    let result = dispatch(
      updateDesignation(childData.id, updateDesignationData)
    );
    result.then((response) => {
      if (response.success) {
        refreshData();
        setModalShow(false);
        setError("");
      } else {
        setError(response.message);
      }
    });
  };
  const refreshData = () => {
    try {
      let response = dispatch(getDesignations());
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

  const handleFileUpload = async ({ data: designations, file, url }) => {
    setShowProgress(true);
    setFileName(file.name);
    let reqBody = {
      category: "designation",
      filename: file.name,
      loadedData: loaded,
      totalData: total,
      fileSize: bytesToSize(file.size),
      fileUrl: url,
      companyId:
        localStorage.getItem("companyId") !== null
          ? JSON.parse(localStorage.getItem("companyId"))
          : null,
    };
    let totalDepartments = [...designations];
    let totalDesignations = [];
    totalDesignations = totalDepartments.map((department) => {
      return {
        ...department,
        companyId:
          localStorage.getItem("companyId") !== null
            ? JSON.parse(localStorage.getItem("companyId"))
            : null,
      };
    });
    let result = await axios
      .post(
        getServiceUrl("production") +
          designationApi.createOrUpdateMultipleDesignations.api,
        { data: totalDesignations },
        {
          onUploadProgress: (data) => {
            setTotal(totalDepartments.length);
            setLoaded(
              Math.round(
                100 *
                  (data.loaded / data.total) *
                  (totalDepartments.length / 100)
              )
            );
            setProgress(Math.round((100 * data.loaded) / data.total));
          },
        }
      )
      .catch((err) => {
        reqBody.status = "failed";
        reqBody.loadedData = totalDepartments.length;
        reqBody.totalData = totalDepartments.length;
        const uploadResponse = dispatch(createUpload(reqBody));
        uploadResponse
          .then(({ success, message, id }) => {
            if (success) {
              setError("");
              setTimeout(() => {
                setShowProgress(false);
                fetchUploads();
                refreshData();
              }, 2000);
            } else {
              setTimeout(() => {
                setShowProgress(false);
                fetchUploads();
                refreshData();
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
      reqBody.loadedData = totalDepartments.length;
      reqBody.totalData = totalDepartments.length;
      const uploadResponse = dispatch(createUpload(reqBody));
      uploadResponse
        .then(({ success, message, id }) => {
          if (success) {
            setError("");
            setTimeout(() => {
              setShowProgress(false);
              fetchUploads();
              refreshData();
            }, 2000);
          } else {
            setTimeout(() => {
              setShowProgress(false);
              fetchUploads();
              refreshData();
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
        refreshData();
      }, 2000);
    }
  };
  const fetchUploads = () => {
    try {
      setLoading(true);
      let response = dispatch(getUploadsByCategory("designation"));
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

  const searchLower = search.toLowerCase();

  const filteredData = data.filter((item) => {
    // Search matching
    const searchMatch = (text) =>
      text?.toString().toLowerCase().includes(searchLower);

    const matchesSearch = [
      item.departmentName,
      item.gradeName,
      item.designationName,
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
  const handleStatusToggle = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };
    const columnsToRender = columns.filter((col) =>
    visibleColumns.includes(col.id)
  );
  const cancelUpload = () => {
    source.cancel();
  };
  return (
    <>
      <div>
        <div>
          <div>
            <UpdateDesignation
              show={modalShow}
              onHide={() => setModalShow(false)}
              updata={updateObj}
              handlecallback={handleCallback}
            />
          </div>
          <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#837F39" }} text="Designations" />
          <div className="d-flex justify-content-end align-items-center">
            <span className="align-items-center">
              {designationInfo.length === 0 ? (
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
          </div>

          {designationInfo.map((designation, index) => (
            <div key={index}>
              <Row className="mt-2 mb-2">
                <Col>
                  <TextInput
                    stackLabel={true}
                    label="Designation Name*"
                    name="designationName"
                    value={designation.designationName}
                    onChangeText={(e) => handleChangeArray(e, index)}
                  />
                  {validator.current.message(
                    "designationName",
                    designation.designationName,
                    "required"
                  )}
                </Col>
                <Col>
                  <SelectInput
                    label="Grade Name*"
                    placeholder="--Select--"
                    name="gradeName"
                    options={grades}
                    value={designation.gradeName}
                    onChangeText={(e) => handleChangeArray(e, index)}
                    stackLabel={true}
                  />
                  {validator.current.message(
                    "gradeName",
                    designation.gradeName,
                    "required"
                  )}
                </Col>
                <Col>
                  <SelectInput
                    label="Department Name*"
                    placeholder="--Select--"
                    name="departmentName"
                    options={departments}
                    value={designation.departmentName}
                    onChangeText={(e) => handleChangeArray(e, index)}
                    stackLabel={true}
                  />
                  {validator.current.message(
                    "departmentName",
                    designation.departmentName,
                    "required"
                  )}
                </Col>
                <Col>
                  <SelectInput
                    label="Status*"
                    placeholder="--Select--"
                    name="status"
                    options={statusesActive}
                    value={designation.status}
                    onChangeText={(e) => handleChangeArray(e, index)}
                    stackLabel={true}
                  />
                  {validator.current.message(
                    "status",
                    designation.status,
                    "required"
                  )}
                </Col>
                <Col className="d-flex justify-content-end align-items-center">
                  <span className="align-items-center">
                    {designationInfo.length === 1 && (
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
            <>
            {/* <TableNormal
              data={data.filter((item) => {
                return (
                  item.id
                    .toString()
                    .toLowerCase()
                    .indexOf(searchKey.toLowerCase()) !== -1 ||
                  item.designationName
                    .toLowerCase()
                    .indexOf(searchKey.toLowerCase()) !== -1 ||
                  item.departmentName
                    .toLowerCase()
                    .indexOf(searchKey.toLowerCase()) !== -1
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
                          </>
          )}
          <p className="m-0 fs14 text-center text-danger">
            {error.length > 0 ? error : ""}
          </p>
          <HorizontalBar className="pt-3 pb-3" />
             <Typography>Bulk Upload of Designation </Typography>
                                    <div className="col-md-12 m-0 p-0 d-flex justify-content-between align-items-center">
                                      <CheckboxInput
                                        label="Bulk Upload of Designation"
                                        name="isBulkUpload"
                                        value={isBulkUpload2}
                                        onChangeText={(e) => setBulkUpload2(!isBulkUpload2)}
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
                                    {isBulkUpload2 && (
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
          {/* <Text text="Bulk Upload of Designation" />
          <div className="col-md-6 m-0 p-0 d-flex justify-content-between align-items-center">
            <CheckboxInput
              label="Bulk upload of Designation"
              name="isBulkUpload2"
              value={isBulkUpload2}
              onChangeText={(e) => setBulkUpload2(!isBulkUpload2)}
            />
            <DownloadLink text="Download Template" link={link} />
          </div>
          {isBulkUpload2 && (
            <div className="col-md-6 m-0 p-0">
              <BrowseFiles setData={handleFileUpload} />
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
        </div>
      </div>
    </>
  );
}
