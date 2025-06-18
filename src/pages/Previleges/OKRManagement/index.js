/* eslint-disable react-hooks/exhaustive-deps */
import { OKRTab } from "./OKRTab";
import React, { useEffect } from "react";
import TitleHeader from "components/TitleHeader";
import search from "../../../assets/svg/search.svg";
import { useState } from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import Table from "components/Table";
import {
  LoadingIndicator,
  Validator,
  removeDuplicates,
  bytesToSize,
} from "utilities";
import { getKeyResults } from "action/keyResultAct";
import { getObjectives } from "action/UserAct";
import { useDispatch } from "react-redux";
import "./style.scss";
import more from "assets/svg/More.svg";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import OKRLibraryTab from "./OKRLibraryTab";
import useWindowSize from "components/UseWindowSize";
import {
  createOkrLibrary,
  deleteOkrLibraries,
  deleteOkrLibrary,
  getAllOkrLibrary,
  updateOkrLibary,
} from "action/OKRLibraryAct";
import Button from "components/Company/Button";

import {
  createOkrTab,
  createObjectivesAndKeyResults,
  deleteOkrTab,
  deleteOkrTabs,
  getAllOkrTab,
  updateOkrTab,
} from "action/OKRTabAct";
import { getAllPrivilegesGroup } from "action/PrivilegesGroupAct";
import { Toast } from "service/toast";
import {
  downloadExcel,
  downloadExcel2,
  downloadTemplate,
  downloadTemplate2,
} from "./utils";
import {
  createUpload,
  deleteUpload,
  getUploadsByCategory,
} from "action/UploadAct";
import TransferTab from "./TransferTab";
import { t } from "i18next";
//import { useTranslation } from "react-i18next";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      okrIndustry: data[i].okrIndustry,
      okrFunction: data[i].okrFunction,
      okrCategory: data[i].okrCategory,
      objectiveKeyResults: data[i].objectiveKeyResults,
      isActive: data[i].isActive,
      exportOKRLibrary: data[i].exportOKRLibrary,
      updatedAt: window.moment(data[i].updatedAt).format("MM-DD-YYYY hh:mm:ss"),
    });
  }
  return items;
};
export const tableGenerator2 = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      okrTemplateName: data[i].okrTemplateName,
      startDate: window.moment(data[i].startDate).format("YYYY-MM-DD"),
      endDate: window.moment(data[i].endDate).format("YYYY-MM-DD"),
      eligibilityGroup: data[i].eligibilityGroup,
      includingKeyResults: data[i].includingKeyResults,
      highValueRange: data[i].highValueRange,
      instructionsToUsers: data[i].instructionsToUsers,
      lowValueRange: data[i].lowValueRange,
      midValueRange: data[i].midValueRange,
      isExportOKRs: data[i].isExportOKRs,
      updatedAt: window.moment(data[i].updatedAt).format("MM-DD-YYYY hh:mm:ss"),
    });
  }
  return items;
};
export const tableGenerator3 = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      groupName: data[i].groupName,
      groupMembers: data[i].groupMembers,
      excludeGroupMembers: data[i].excludeGroupMembers,
      actualActiveGroupMembers: data[i].actualActiveGroupMembers,
      activeGroupMembers: data[i].activeGroupMembers,
      inActiveGroupMembers: data[i].inActiveGroupMembers,
    });
  }
  return items;
};
function OKRManagement() {
  const [roleData, setRoleData] = useState({
    okrIndustry: "",
    okrFunction: "",
    okrCategory: "",
    isActive: false,
    exportOKRLibrary: false,
  });
  const companyNameUser =
    localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user")).company
      : null;
  const initialData = [
    {
      objectiveID: 1,
      name: "",
      type: "obj",
      okrFunction: "",
      okrCategory: "",
      keyResults: [{ objectiveID: 1, name: "", type: "kr" }],
    },
  ];
  const [objectives, setObjectives] = useState(initialData);
  const [okrData, setOKRData] = useState({
    okrTemplateName: "",
    instructionsToUsers: "",
    startDate: null,
    endDate: null,
    highValueRange: [{ min: "", max: "" }],
    midValueRange: [{ min: "", max: "" }],
    lowValueRange: [{ min: "", max: "" }],
    eligibilityGroup: [""],
    isExportOKRs: true,
    includingKeyResults: false,
    okrLibrary: "",
  });
  const isMobile = useWindowSize();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [editId, setEditId] = useState("");
  const [editId1, setEditId1] = useState("");
  const [, setError] = useState(false);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const dispatch = useDispatch();
  const [, forceUpdate] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsers1, setSelectedUsers1] = useState([]);
  const [value, setValue] = useState(0);
  const [objectives2, setObjectives2] = useState([]);
  const [, setObjectives3] = useState([]);
  const [keyResults2, setKeyResults2] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [uploads2, setUploads2] = useState([]);
  const [fileName, setFileName] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [companyName] = useState(companyNameUser);
  const validator = Validator();

  const handleChangeSearch = ({ target: { name, value } }) => {
    let updatedData = { ...roleData };
    updatedData[name] = value;
    setRoleData(updatedData);
  };
  const handleChangeSearchBoolean = ({ target: { name } }) => {
    let updatedData = { ...roleData };
    updatedData[name] = !updatedData[name];
    setRoleData(updatedData);
  };
  const handleChangeSearch2 = ({ target: { name, value } }) => {
    let updatedData = { ...okrData };
    updatedData[name] = value;
    setOKRData(updatedData);
  };
  const handleChangeSearch3 = ({ target: { name } }) => {
    let updatedData = { ...okrData };
    updatedData[name] = !updatedData[name];
    setOKRData(updatedData);
  };
  const handleChangeRages = (e, title) => {
    let updatedData = { ...okrData };
    updatedData[e.target.name][0][title] = e.target.value;
    setOKRData(updatedData);
  };
  const handlechangeObjective = (e, index) => {
    const data = [...objectives];
    data[index].name = e.target.value;
    setObjectives(data);
  };
  const handlechangeKeyResults = (e, index1, index2) => {
    const data = [...objectives];
    data[index1].keyResults[index2].name = e.target.value;
    setObjectives(data);
  };
  const handleSubmit = () => {
    if (
      validator.current.allValid() &&
      objectives.filter(
        (item) =>
          item.okrFunction !== undefined &&
          item.okrFunction.length > 0 &&
          item.okrCategory !== undefined &&
          item.okrCategory.length > 0
      ).length > 0
    ) {
      if (editId) {
        const finalData = {
          ...roleData,
          okrIndustry: companyName,
          objectiveKeyResults: objectives,
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        setLoading(true);
        let response = dispatch(updateOkrLibary(editId, finalData));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setError("");
            getPrivilegesDataRefresh();
            emptyData();
          } else {
            setLoading(false);
            setError(message);
          }
        });
      } else {
        const finalData = {
          ...roleData,
          okrIndustry: companyName,
          objectiveKeyResults: objectives,
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        setLoading(true);
        let response = dispatch(createOkrLibrary(finalData));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setError("");
            getPrivilegesDataRefresh();
            emptyData();
          } else {
            setLoading(false);
            setError(message);
          }
        });
      }
    } else {
      validator.current.showMessages();
      forceUpdate(true);
      Toast({
        message: "OKR Function/OKR Category is required!",
        time: 4000,
        type: "warning",
      });
    }
  };
  const handleChangeEligibilityGroup = (e, index) => {
    const data = { ...okrData };
    if (data.eligibilityGroup[0] === "") {
      data.eligibilityGroup[0] = e.target.value;
      setOKRData(data);
    } else {
      data.eligibilityGroup[index] = e.target.value;
      setOKRData(data);
    }
  };
  const handleAddOkrTab = () => {
    const updateData = { ...okrData };
    updateData.eligibilityGroup.push("");
    setOKRData(updateData);
  };
  const handleDeleteOkrTab = (index) => {
    const updateData = { ...okrData };
    if (updateData.eligibilityGroup.length > 1) {
      updateData.eligibilityGroup.splice(index, 1);
    } else {
      updateData.eligibilityGroup.splice(index, 1);
      updateData.eligibilityGroup.push("");
    }
    setOKRData(updateData);
  };
  const handlesubmit2 = () => {
    if (validator.current.allValid()) {
      if (editId1) {
        const finalData = {
          ...okrData,
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        setLoading(true);
        let response = dispatch(updateOkrTab(editId1, finalData));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setError("");
            getPrivilegesDataRefresh1();
            emptyData2();
          } else {
            setLoading(false);
            setError(message);
          }
        });
      } else {
        const finalData = {
          ...okrData,
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        setLoading(true);
        let response = dispatch(createOkrTab(finalData));
        response.then(({ success, message }) => {
          if (success) {
            setLoading(false);
            setError("");
            getPrivilegesDataRefresh1();
            emptyData2();
          } else {
            setLoading(false);
            setError(message);
          }
        });
      }
    } else {
      validator.current.showMessages();
      forceUpdate(true);
    }
  };

  const importObjectives = (objectivesData) => {
    if (Object.keys(objectivesData).length !== 0) {
      let response = dispatch(
        createObjectivesAndKeyResults({ data: objectivesData })
      );
      response.then(({ success, message }) => {
        if (success) {
          setLoading(false);
          setError("");
        } else {
          setLoading(false);
          setError(message);
        }
      });
    }
  };

  const getPrivilegesData = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllOkrLibrary());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = tableGenerator(data, data.length);
          setData(nonduplicate);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setError("No Data Found!");
          setData([]);
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
  const getPrivilegesData1 = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllOkrTab());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = removeDuplicates(data, "okrTemplateName");
          nonduplicate = tableGenerator2(data, data.length);
          setData1(nonduplicate);
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

  const getPrivelegeGroups = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllPrivilegesGroup());
      response.then(({ data, message }) => {
        if (data !== undefined && data.privilegeGroups.length > 0) {
          let nonduplicate = removeDuplicates(
            data.privilegeGroups,
            "groupName"
          );
          nonduplicate = tableGenerator3(nonduplicate, nonduplicate.length);
          let groupNames = nonduplicate.map((item) => ({
            value: item.groupName,
            key: item.groupName,
          }));
          setData2(groupNames);
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

  const getPrivilegesDataRefresh = () => {
    try {
      let response = dispatch(getAllOkrLibrary());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = tableGenerator(data, data.length);
          setData(nonduplicate);
          setError("");
        } else if (data.length === 0) {
          setError("No Data Found!");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error.toString());
    }
  };

  const getPrivilegesDataRefresh1 = () => {
    try {
      let response = dispatch(getAllOkrTab());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = tableGenerator2(data, data.length);
          setData1(nonduplicate);
          setError("");
        } else if (data.length === 0) {
          setError("No Data Found!");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error.toString());
    }
  };
  const getObjectivesData = () => {
    try {
      let user =
        localStorage.getItem("user") !== null
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      let userData =
        localStorage.getItem("userData") !== null
          ? JSON.parse(localStorage.getItem("userData"))
          : null;
      setLoading(true);
      let response = dispatch(getObjectives(user.role, userData.ownerId));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setObjectives2(data);
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
  const getKeyResultsData = () => {
    try {
      setLoading(true);
      let response = dispatch(getKeyResults());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setKeyResults2(data);
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
  const handleEdit = (row) => {
    setRoleData({
      okrIndustry: row.okrIndustry,
      okrFunction: row.okrFunction,
      okrCategory: row.okrCategory,
      isActive: row.isActive,
      exportOKRLibrary: row.exportOKRLibrary,
    });
    setObjectives(row.objectiveKeyResults);
    setEditId(row._id);
    handleShowAdd();
  };
  const handleEdit1 = (row) => {
    setOKRData({ ...row });
    setEditId1(row._id);
    handleShowAdd1();
  };
  const handleShowAdd = () => {
    setShow(true);
  };
  const handleShowAdd1 = () => {
    setShow1(true);
  };
  const handleCancel = () => {
    setShow(false);
    emptyData();
  };
  const handleCancel1 = () => {
    setShow1(false);
    emptyData();
  };

  const emptyData = () => {
    setRoleData({
      okrIndustry: "",
      okrFunction: "",
      okrCategory: "",
      isActive: false,
      exportOKRLibrary: false,
    });
    setObjectives(initialData);
    setEditId(null);
    validator.current.hideMessages();
    setShow(false);
  };
  const emptyData2 = () => {
    setOKRData({
      okrTemplateName: "",
      instructionsToUsers: "",
      startDate: null,
      endDate: null,
      highValueRange: [{ min: "", max: "" }],
      midValueRange: [{ min: "", max: "" }],
      lowValueRange: [{ min: "", max: "" }],
      eligibilityGroup: [""],
      isExportOKRs: true,
      includingKeyResults: false,
      okrLibrary: "",
    });
    setEditId1(null);
    validator.current.hideMessages();
    setShow1(false);
  };
  const handleAdd = () => {
    const updateDate = [...objectives];
    updateDate.push({
      objectiveID: updateDate.length + 1,
      name: "",
      type: "obj",
      keyResults: [
        { objectiveID: updateDate.length + 1, name: "", type: "kr" },
      ],
    });
    setObjectives(updateDate);
  };
  const handleDeleteObjective = (index) => {
    const data = [...objectives];
    if (data.length > 1) {
      const updateData = data.filter((item) => item !== data[index]);
      setObjectives(updateData);
    } else {
      setObjectives(initialData);
    }
  };
  const addKeyResults = (index1) => {
    const updatedData = [...objectives];
    updatedData[index1].keyResults = [
      ...updatedData[index1].keyResults,
      { objectiveID: updatedData[index1].objectiveID, name: "", type: "kr" },
    ];
    setObjectives(updatedData);
  };
  const handleDeleteKeyResult = (index1, index2) => {
    const updatedData = [...objectives];
    if (updatedData[index1].keyResults.length > 1) {
      updatedData[index1].keyResults.splice(index2, 1);
    } else {
      updatedData[index1].keyResults.splice(index2, 1);
      updatedData[index1].keyResults.push({
        objectiveID: updatedData[index1].objectiveID,
        name: "",
        type: "kr",
      });
    }
    setObjectives(updatedData);
  };
  const handleDelete = (id) => {
    let response = dispatch(deleteOkrLibrary(id));
    response.then(({ success, message }) => {
      if (success) {
        setError("");
        getPrivilegesDataRefresh();
      } else {
        setError(message);
      }
    });
  };
  const handleDelete1 = (id) => {
    let response = dispatch(deleteOkrTab(id));
    response.then(({ success, message }) => {
      if (success) {
        setError("");
        getPrivilegesDataRefresh1();
      } else {
        setError(message);
      }
    });
  };

  const handleDeleteMultiple = () => {
    if (selectedUsers.length > 0) {
      let selectedIds = selectedUsers.map((item) => item._id);
      let response = dispatch(deleteOkrLibraries({ data: selectedIds }));
      response.then(({ success, message }) => {
        if (success) {
          setError("");
          getPrivilegesDataRefresh();
        } else {
          setError(message);
        }
      });
    } else {
      alert("Please select role...");
    }
  };
  const handleDeleteMultiple2 = () => {
    if (selectedUsers1.length > 0) {
      let selectedIds = selectedUsers1.map((item) => item._id);
      let response = dispatch(deleteOkrTabs({ data: selectedIds }));
      response.then(({ success, message }) => {
        if (success) {
          setError("");
          getPrivilegesDataRefresh1();
        } else {
          setError(message);
        }
      });
    } else {
      alert("Please select role...");
    }
  };

  const columns = [
    {
      dataField: "id",
      text: "S.No",
      csvExport: false,
      hidden: true,
    },
    {
      dataField: "_id",
      text: "_id",
      hidden: true,
    },
    {
      dataField: "okrIndustry",
      text: "Industry",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return (
          <p
            onClick={() => {
              handleEdit(row);
            }}
            className="anchorlink"
            style={{ cursor: "pointer" }}
          >
            {row.okrIndustry}
          </p>
        );
      },
    },
    {
      dataField: "isActive",
      text: "Is Active",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return <p>{row.isActive ? "Yes" : "No"}</p>;
      },
    },
    {
      dataField: "updatedAt",
      text: "Last Modified",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
    },
    {
      dataField: "_id",
      text: t("Tasks.Action"),

      formatter: (cellContent, row) => {
        return (
          <div className="d-flex flex-wrap">
            <div className="dropdown actionDropdown">
              <button
                className="dropdown-hide d-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img src={more} alt={"more"} style={{ height: 15 }} />
              </button>
              <div
                className="dropdown-menu text-left "
                aria-labelledby="dropdownMenuButton"
              >
                <button
                  className="btn btn-default text-capitalize fs-14 text-left justify-content-start"
                  onClick={() => {
                    handleEdit(row);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-default text-capitalize fs-14 text-left justify-content-start"
                  onClick={() => handleDelete(row._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      },
    },
  ];
  const columns1 = [
    {
      dataField: "id",
      text: "S.No",
      csvExport: false,
      hidden: true,
    },
    {
      dataField: "_id",
      text: "_id",
      hidden: true,
    },
    {
      dataField: "okrTemplateName",
      text: "okrTemplateName",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
    },
    {
      dataField: "startDate",
      text: "Start Date",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
    },
    {
      dataField: "endDate",
      text: "End Date",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
    },
    {
      dataField: "eligibilityGroup",
      text: "Eligibility Group",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
    },
    {
      dataField: "updatedAt",
      text: "Last Modified",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${order === "asc" ? "arrowActive" : "arrowInActive"
                }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${order === "desc" ? "arrowActive" : "arrowInActive"
                }`}
            />
          </span>
        );
      },
    },
    {
      dataField: "_id",
      text: t("Tasks.Action"),

      formatter: (cellContent, row) => {
        return (
          <div className="d-flex flex-wrap">
            <div className="dropdown actionDropdown">
              <button
                className="dropdown-hide d-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img src={more} alt={"more"} style={{ height: 15 }} />
              </button>
              <div
                className="dropdown-menu text-left "
                aria-labelledby="dropdownMenuButton"
              >
                <button
                  className="btn btn-default text-capitalize fs-14 text-left justify-content-start"
                  onClick={() => {
                    handleEdit1(row);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-default text-capitalize fs-14 text-left justify-content-start"
                  onClick={() => handleDelete1(row._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      },
    },
  ];
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
  const selectRow1 = {
    mode: "checkbox",
    clickToSelect: true,
    onSelect: (row) => {
      let totalData = [...selectedUsers1];
      let filterData = totalData.findIndex((item) => item._id === row._id);
      if (filterData < 0) {
        totalData.push(row);
        setSelectedUsers1(totalData);
      } else {
        totalData.splice(filterData, 1);
        setSelectedUsers1(totalData);
      }
    },
    onSelectAll: (isSelected1) => {
      if (isSelected1) {
        setSelectedUsers1(data);
      } else {
        setSelectedUsers1([]);
      }
    },
  };

  useEffect(() => {
    getPrivelegeGroups();
    getPrivilegesData();
    getPrivilegesData1();
    getKeyResultsData();
    getObjectivesData();
    fetchUploads();
    fetchUploads2();
  }, []);

  const fetchUploads = () => {
    try {
      setLoading(true);
      let response = dispatch(getUploadsByCategory("okrLibrary"));
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
        setTotal(0);
        setProgress(0);
        setLoaded(0);
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const fetchUploads2 = () => {
    try {
      setLoading(true);
      let response = dispatch(getUploadsByCategory("okrTab"));
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          setUploads2(data);
          setLoading(false);
          setError("");
        } else if (data.length === 0) {
          setLoading(false);
          setUploads2([]);
        } else {
          setLoading(false);
          setError(message);
        }
        setTotal(0);
        setProgress(0);
        setLoaded(0);
      });
    } catch (error) {
      setLoading(false);
      setError(error.toString());
    }
  };
  const handleFileUpload = ({ file, url, totalRecords }) => {
    setShowProgress(true);
    setFileName(file.name);
    let reqBody = {
      category: "okrLibrary",
      filename: file.name,
      loadedData: totalRecords,
      totalData: totalRecords,
      fileSize: bytesToSize(file.size),
      fileUrl: url,
    };
    reqBody.status = "success";
    reqBody.loadedData = totalRecords;
    reqBody.totalData = totalRecords;
    const uploadResponse = dispatch(createUpload(reqBody));
    uploadResponse
      .then(({ success }) => {
        if (success) {
          setError("");
          setTimeout(() => {
            setShowProgress(false);
            fetchUploads();
          }, 2000);
        } else {
          setTimeout(() => {
            setShowProgress(false);
            fetchUploads();
          }, 2000);
        }
      })
      .catch((error) => {
        console.log("error detected", error);
      });
  };
  const handleFileUpload2 = ({ file, url, totalRecords }) => {
    setShowProgress(true);
    setFileName(file.name);
    let reqBody = {
      category: "okrTab",
      filename: file.name,
      loadedData: totalRecords,
      totalData: totalRecords,
      fileSize: bytesToSize(file.size),
      fileUrl: url,
    };
    reqBody.status = "success";
    reqBody.loadedData = totalRecords;
    reqBody.totalData = totalRecords;
    const uploadResponse = dispatch(createUpload(reqBody));
    uploadResponse
      .then(({ success }) => {
        if (success) {
          setError("");
          setTimeout(() => {
            setShowProgress(false);
            fetchUploads2();
          }, 2000);
        } else {
          setTimeout(() => {
            setShowProgress(false);
            fetchUploads2();
          }, 2000);
        }
      })
      .catch((error) => {
        console.log("error detected", error);
      });
  };
  const cancelUpload = () => {
    console.log("cancelling");
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
  const deleteUploadData2 = (id) => {
    try {
      let response = dispatch(deleteUpload(id));
      response.then(({ success, message }) => {
        if (success) {
          fetchUploads2();
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


  return (
    <>
      <TitleHeader name="Admin Portal - Privileges " />
      <div
        className={
          isMobile
            ? "bg-light-primary rounded-12 "
            : "bg-light-primary rounded-12 mh-100 p-4 m-4"
        }
      >
        <p
          className={
            isMobile
              ? "title text-dark font-weight-bold text-center"
              : "title text-dark font-weight-bold pb20"
          }
        >
          OKR Management
        </p>
        <div className="company-form">
          <div>
            <Tabs
              value={value}
              textColor="primary"
              indicatorColor="primary"
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            >
              <Tab label="OKR LIBRARY" />
              <Tab label="OKR" />
              <Tab label="TRANSFER" />
            </Tabs>
          </div>
          {value === 0 && (
            <div>
              <div
                className={isMobile ? "col-md-12 circle" : "col-md-7 circle"}
              >
                <div
                  className={
                    isMobile ? "mt-3" : "d-flex justify-content-between mt-5"
                  }
                >
                  <div
                    className={
                      isMobile
                        ? "input-group col-12 circle p-0 nav-item border h43 bg-white"
                        : "input-group col-md-12 circle p-0 nav-item border h43 bg-white"
                    }
                  >
                    <input
                      style={{ borderRadius: "20px" }}
                      type="text"
                      className="outline-none border-0 col-md-11 text-dark fs14 pl-3"
                      placeholder="Search"
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      name="searchText"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                    <div className="input-group-append searchInput-icon">
                      <img
                        src={search}
                        alt="search-icon"
                        className="searchIcon"
                      />
                    </div>
                  </div>
                  <div className={isMobile ? "text-center" : ""}>
                    <Button
                      text="Create"
                      handleClick={() => handleShowAdd()}
                      className={
                        isMobile
                          ? "mt-2 bg-green border-grey text-white"
                          : "mt-0 bg-green border-grey text-white"
                      }
                    />
                  </div>
                  {selectedUsers.length > 0 && (
                    <Button
                      text={t("objectives.Delete")}
                      handleClick={() => handleDeleteMultiple()}
                      className="mt-0 bg-green border-grey text-white"
                    />
                  )}
                </div>
              </div>
              {loading ? (
                <div className="text-center">
                  <LoadingIndicator size={3} />
                </div>
              ) : (
                <Table
                  title="okrlibrary"
                  data={
                    data.length > 0
                      ? data.filter((item) => {
                        return (
                          item.okrIndustry
                            ?.toLowerCase()
                            .indexOf(searchText?.toLowerCase()) !== -1
                        );
                      })
                      : []
                  }
                  columns={columns}
                  paginationFactory={paginationFactory}
                  selectRow={selectRow}
                />
              )}
              {show && (
                <OKRLibraryTab
                  companyName={companyName}
                  roleData={roleData}
                  handleChangeSearch={handleChangeSearch}
                  objectives={objectives}
                  handlechangeObjective={handlechangeObjective}
                  handleDeleteObjective={handleDeleteObjective}
                  validator={validator}
                  handlechangeKeyResults={handlechangeKeyResults}
                  downloadExcel={() => downloadExcel(data, roleData)}
                  downloadTemplate={downloadTemplate}
                  handleDeleteKeyResult={handleDeleteKeyResult}
                  addKeyResults={addKeyResults}
                  handleAdd={handleAdd}
                  handleCancel={handleCancel}
                  setObjectives={setObjectives}
                  handleSubmit={handleSubmit}
                  handleChangeSearchBoolean={handleChangeSearchBoolean}
                  isMobile={isMobile}
                  handleFileUpload={handleFileUpload}
                  showProgress={showProgress}
                  fileName={fileName}
                  progress={progress}
                  loaded={loaded}
                  total={total}
                  uploads={uploads}
                  cancelUpload={cancelUpload}
                  deleteUploadData={deleteUploadData}
                />
              )}
            </div>
          )}
          {value === 1 && (
            <div>
              <div
                className={isMobile ? "col-md-12 circle" : "col-md-7 circle"}
              >
                <div
                  className={
                    isMobile ? "mt-3" : "d-flex justify-content-between mt-5"
                  }
                >
                  <div
                    className={
                      isMobile
                        ? "input-group col-12 circle p-0 nav-item border h43 bg-white"
                        : "input-group col-md-12 circle p-0 nav-item border h43 bg-white"
                    }
                  >
                    <input
                      style={{ borderRadius: "20px" }}
                      type="text"
                      className="outline-none border-0 col-md-11 text-dark fs14 pl-3"
                      placeholder="Search"
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      name="searchText"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                    <div className="input-group-append searchInput-icon">
                      <img
                        src={search}
                        alt="search-icon"
                        className="searchIcon"
                      />
                    </div>
                  </div>
                  <div className={isMobile ? "text-center mt-2" : ""}>
                    <Button
                      text={t("objectives.Create")}
                      handleClick={() => handleShowAdd1()}
                      className="mt-0 bg-green border-grey text-white"
                    />
                  </div>
                  {selectedUsers1.length > 0 && (
                    <Button
                      text={t("objectives.Delete")}
                      handleClick={() => handleDeleteMultiple2()}
                      className="mt-0 bg-green border-grey text-white"
                    />
                  )}
                </div>
              </div>
              {loading ? (
                <div className="text-center">
                  <LoadingIndicator size={3} />
                </div>
              ) : (
                <Table
                  title="okrlibrary"
                  data={
                    data1.length > 0
                      ? data1.filter((item) => {
                        return (
                          item.okrTemplateName
                            ?.toLowerCase()
                            .indexOf(searchText?.toLowerCase()) !== -1
                        );
                      })
                      : []
                  }
                  columns={columns1}
                  paginationFactory={paginationFactory}
                  // searchKey={searchKey}
                  selectRow={selectRow1}
                // data2={data2}
                // childData={{
                //   data,
                //   columnsChild,
                //   columnsChildTasks,
                //   searchKey,
                //   checkboxOptions,
                // }}
                />
              )}
              {show1 && (
                <OKRTab
                  handleChangeSearch2={handleChangeSearch2}
                  handleChangeSearch3={handleChangeSearch3}
                  search={search}
                  handleAdd={handleAdd}
                  data={data1}
                  validator={validator}
                  okrData={okrData}
                  roleData={roleData}
                  handleCancel={handleCancel1}
                  handleSubmit2={handlesubmit2}
                  handleChangeEligibilityGroup={handleChangeEligibilityGroup}
                  handleAddOkrTab={handleAddOkrTab}
                  handleDeleteOkrTab={handleDeleteOkrTab}
                  handleChangeRages={handleChangeRages}
                  downloadExcel={() =>
                    downloadExcel2(okrData, objectives2, keyResults2)
                  }
                  setObjectives={setObjectives3}
                  data2={data2}
                  importObjectives={importObjectives}
                  showProgress={showProgress}
                  uploads={uploads2}
                  deleteUploadData={deleteUploadData2}
                  fileName={fileName}
                  progress={progress}
                  cancelUpload={cancelUpload}
                  loaded={loaded}
                  total={total}
                  handleFileUpload={handleFileUpload2}
                  isMobile={isMobile}
                  downloadTemplate={downloadTemplate2}
                />
              )}
            </div>
          )}
          {value === 2 && <TransferTab />}
        </div>
      </div>
    </>
  );
}

export default OKRManagement;
