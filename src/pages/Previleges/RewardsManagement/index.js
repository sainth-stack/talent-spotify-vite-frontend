/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import TitleHeader from "components/TitleHeader";
import search from "../../../assets/svg/search.svg";
import { useState } from "react";
import paginationFactory from "react-bootstrap-table2-paginator";
import Table from "components/Table";
import { LoadingIndicator, Validator, removeDuplicates } from "utilities";
import { useDispatch } from "react-redux";
import "./style.scss";
import more from "assets/svg/More.svg";
import OKRLibraryTab from "./OKRLibraryTab";
import useWindowSize from "components/UseWindowSize";
import Button from "components/Company/Button";

import { getAllOkrTab } from "action/OKRTabAct";
import { getAllPrivilegesGroup } from "action/PrivilegesGroupAct";
import { Toast } from "service/toast";
import { downloadExcel, downloadTemplate } from "./utils";
import {
  createReward,
  deleteReward,
  deleteRewards,
  getAllRewards,
  updateReward,
} from "action/RewardManagementAct";
import { t } from "i18next";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      rewardSchemeName: data[i].rewardSchemeName,
      rewardCategory: data[i].rewardCategory,
      rewardType: data[i].rewardType,
      rewardPoints: data[i].rewardPoints,
      rewardPoints2: data[i].rewardPoints2,
      rewardPoints3: data[i].rewardPoints3,
      rewardPointsType: data[i].rewardPointsType
        ? data[i].rewardPointsType
        : "Bronze",
      rewardPointsType2: data[i].rewardPointsType2
        ? data[i].rewardPointsType2
        : "Silver",
      rewardPointsType3: data[i].rewardPointsType3
        ? data[i].rewardPointsType3
        : "Gold",
      kudosEnabled: data[i].kudosEnabled,
      birthdayWishesEnabled: data[i].birthdayWishesEnabled,
      approvalRequired: data[i].approvalRequired,
      anniversaryWishesEnabled: data[i].anniversaryWishesEnabled,
      objectivesAchievementPercent: data[i].objectivesAchievementPercent,
      objectivesAchievementPoints: data[i].objectivesAchievementPoints,
      okrTemplate: data[i].okrTemplate,
      krAchievementPercent: data[i].krAchievementPercent,
      krAchievementPoints: data[i].krAchievementPoints,
      taskAchievementPercent: data[i].taskAchievementPercent,
      taskAchievementPoints: data[i].taskAchievementPoints,
      subTaskAchievementPercent: data[i].subTaskAchievementPercent,
      subTaskAchievementPoints: data[i].subTaskAchievementPoints,
      eligibilityGroup: data[i].eligibilityGroup,
      updatedAt: window.moment(data[i].updatedAt).format("MM-DD-YYYY"),
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
      groupName: data[i].groupName,
      activeGroupMembers: data[i].activeGroupMembers
        ? data[i].activeGroupMembers
        : 0,
      actualActiveGroupMembers: data[i].actualActiveGroupMembers
        ? data[i].actualActiveGroupMembers
        : 0,
      inActiveGroupMembers: data[i].inActiveGroupMembers
        ? data[i].inActiveGroupMembers
        : 0,
      activeGroupMembersCount: data[i].activeGroupMembers
        ? data[i].activeGroupMembers.length
        : 0,
      groupMembers: data[i].groupMembers ? data[i].groupMembers : [],
      excludeGroupMembers: data[i].excludeGroupMembers
        ? data[i].excludeGroupMembers
        : [],
      updatedAt: window.moment(data[i].updatedAt).format("DD-MM-YYYY"),
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
function RewardsManagement() {
  const [roleData, setRoleData] = useState({
    rewardSchemeName: "",
    rewardCategory: "",
    rewardType: "",
    rewardPointsType: "Bronze",
    rewardPoints: "",
    rewardPointsType2: "Silver",
    rewardPoints2: "",
    rewardPointsType3: "Gold",
    rewardPoints3: "",
    kudosEnabled: false,
    birthdayWishesEnabled: false,
    approvalRequired: false,
    anniversaryWishesEnabled: false,
    objectivesAchievementPercent: "",
    objectivesAchievementPoints: "",
    okrTemplate: "",
    krAchievementPercent: "",
    krAchievementPoints: "",
    eligibilityGroup: "",
    taskAchievementPercent: "",
    taskAchievementPoints: "",
    subTaskAchievementPercent: "",
    subTaskAchievementPoints: "",
    companyId:
      localStorage.getItem("companyId") !== null
        ? JSON.parse(localStorage.getItem("companyId"))
        : null,
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
  const isMobile = useWindowSize();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState("");
  const [, setError] = useState(false);
  const [data, setData] = useState([]);
  const [eligibilityGroups, setEligibilityGroups] = useState([]);
  const [okrTemplates, setOKRTemplates] = useState([]);
  const dispatch = useDispatch();
  const [, forceUpdate] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [uploads] = useState([]);
  const [fileName] = useState("");
  const [showProgress] = useState(false);
  const [progress] = useState(0);
  const [loaded] = useState(0);
  const [total] = useState(0);
  const [companyName] = useState(companyNameUser);
  const validator = Validator();

  const handleChangeSearch = ({ target: { name, value } }) => {
    let updatedData = { ...roleData };
    updatedData[name] = value;
    setRoleData(updatedData);
  };
  const handleChangeSearch2 = ({ target: { name, value } }) => {
    let updatedData = { ...roleData };
    updatedData[name] = value;
    setRoleData(updatedData);
  };
  const handleChangeSearchBoolean = ({ target: { name } }) => {
    let updatedData = { ...roleData };
    updatedData[name] = !updatedData[name];
    setRoleData(updatedData);
  };
  const handleSubmit = () => {
    if (validator.current.allValid()) {
      if (editId) {
        setLoading(true);
        let response = dispatch(updateReward(editId, roleData));
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
        setLoading(true);
        let response = dispatch(createReward(roleData));
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

  const getPrivilegesData = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllRewards());
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
  const getPrivilegesGroups = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllPrivilegesGroup());
      response.then(({ data, message }) => {
        if (data.privilegeGroups !== undefined && data.employees.length > 0) {
          let nonduplicate = removeDuplicates(
            data.privilegeGroups,
            "groupName"
          );
          nonduplicate = tableGenerator2(nonduplicate, nonduplicate.length);
          let groups = nonduplicate.map((item) => ({
            key: item.groupName,
            value: item._id,
          }));
          setEligibilityGroups(groups);
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
  const getOKRTemplates = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllOkrTab());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = removeDuplicates(data, "okrTemplateName");
          nonduplicate = tableGenerator3(nonduplicate, nonduplicate.length);
          let groups = nonduplicate.map((item) => ({
            key: item.okrTemplateName,
            value: item._id,
          }));
          setOKRTemplates(groups);
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
      rewardSchemeName: row.rewardSchemeName,
      rewardCategory: row.rewardCategory,
      rewardType: row.rewardType,
      rewardPoints: row.rewardPoints,
      rewardPointsType: row.rewardPointsType,
      rewardPoints2: row.rewardPoints2,
      rewardPointsType2: row.rewardPointsType2,
      rewardPoints3: row.rewardPoints3,
      rewardPointsType3: row.rewardPointsType3,
      kudosEnabled: row.kudosEnabled,
      birthdayWishesEnabled: row.birthdayWishesEnabled,
      approvalRequired: row.approvalRequired,
      anniversaryWishesEnabled: row.anniversaryWishesEnabled,
      objectivesAchievementPercent: row.objectivesAchievementPercent,
      objectivesAchievementPoints: row.objectivesAchievementPoints,
      okrTemplate: row.okrTemplate,
      krAchievementPercent: row.krAchievementPercent,
      krAchievementPoints: row.krAchievementPoints,
      taskAchievementPercent: row.taskAchievementPercent,
      taskAchievementPoints: row.taskAchievementPoints,
      subTaskAchievementPercent: row.subTaskAchievementPercent,
      subTaskAchievementPoints: row.subTaskAchievementPoints,
      eligibilityGroup: row.eligibilityGroup,
    });
    setEditId(row._id);
    handleShowAdd();
  };
  const handleShowAdd = () => {
    setShow(true);
  };
  const handleCancel = () => {
    setShow(false);
    emptyData();
  };

  const emptyData = () => {
    setRoleData({
      rewardSchemeName: "",
      rewardCategory: "",
      rewardType: "",
      rewardPoints: "",
      rewardPointsType: "",
      rewardPoints2: "",
      rewardPointsType2: "",
      rewardPoints3: "",
      rewardPointsType3: "",
      kudosEnabled: false,
      birthdayWishesEnabled: false,
      approvalRequired: false,
      anniversaryWishesEnabled: false,
      objectivesAchievementPercent: "",
      objectivesAchievementPoints: "",
      okrTemplate: "",
      krAchievementPercent: "",
      krAchievementPoints: "",
      taskAchievementPercent: "",
      taskAchievementPoints: "",
      subTaskAchievementPercent: "",
      subTaskAchievementPoints: "",
      eligibilityGroup: "",
    });
    setEditId(null);
    validator.current.hideMessages();
    setShow(false);
  };
  const handleDelete = (id) => {
    let response = dispatch(deleteReward(id));
    response.then(({ success, message }) => {
      if (success) {
        setError("");
        getPrivilegesDataRefresh();
      } else {
        setError(message);
      }
    });
  };

  const handleDeleteMultiple = () => {
    if (selectedUsers.length > 0) {
      let selectedIds = selectedUsers.map((item) => item._id);
      let response = dispatch(deleteRewards({ data: selectedIds }));
      response.then(({ success, message }) => {
        if (success) {
          setError("");
          getPrivilegesDataRefresh();
          // window.location.reload();
        } else {
          setError(message);
        }
      });
    } else {
      alert("Please select role...");
    }
  };

  const getPrivilegesDataRefresh = () => {
    try {
      let response = dispatch(getAllRewards());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = tableGenerator(data, data.length);
          setData(nonduplicate);
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
      dataField: "rewardSchemeName",
      text: "Scheme",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
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
            {row.rewardSchemeName}
          </p>
        );
      },
    },
    {
      dataField: "rewardCategory",
      text: "Category",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
    },
    {
      dataField: "rewardType",
      text: "Type",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
    },
    {
      dataField: "rewardPoints",
      text: "Points",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
    },
    {
      dataField: "kudosEnabled",
      text: "Kudos",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return <p>{row.kudosEnabled ? "Yes" : "No"}</p>;
      },
    },
    {
      dataField: "birthdayWishesEnabled",
      text: "Birthday",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return <p>{row.birthdayWishesEnabled ? "Yes" : "No"}</p>;
      },
    },
    {
      dataField: "approvalRequired",
      text: "Approval Required",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return <p>{row.approvalRequired ? "Yes" : "No"}</p>;
      },
    },
    {
      dataField: "anniversaryWishesEnabled",
      text: "Anniversary",
      sort: true,
      csvExport: false,
      sortCaret: (order) => {
        return (
          <span>
            <i
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
              }`}
            />
          </span>
        );
      },
      formatter: (cellContent, row) => {
        return <p>{row.anniversaryWishesEnabled ? "Yes" : "No"}</p>;
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
              className={`fa fa-caret-up upArrow ${
                order === "asc" ? "arrowActive" : "arrowInActive"
              }`}
            />
            <i
              className={`fa fa-caret-down downArrow ${
                order === "desc" ? "arrowActive" : "arrowInActive"
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

  useEffect(() => {
    getPrivilegesData();
    getPrivilegesGroups();
    getOKRTemplates();
  }, []);

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
          Reward Management
        </p>
        <div className="company-form">
          <div>
            <div className={isMobile ? "col-md-12 circle" : "col-md-7 circle"}>
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
                    text={t("objectives.Create")}
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
                title="rewardManagement"
                data={
                  data.length > 0
                    ? data.filter((item) => {
                        return (
                          item.rewardSchemeName
                            .toLowerCase()
                            .indexOf(searchText.toLowerCase()) !== -1
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
                handleChangeSearch2={handleChangeSearch2}
                objectives={objectives}
                validator={validator}
                downloadExcel={() => downloadExcel(data, roleData)}
                downloadTemplate={downloadTemplate}
                handleCancel={handleCancel}
                setObjectives={setObjectives}
                handleSubmit={handleSubmit}
                handleChangeSearchBoolean={handleChangeSearchBoolean}
                isMobile={isMobile}
                showProgress={showProgress}
                fileName={fileName}
                progress={progress}
                loaded={loaded}
                total={total}
                uploads={uploads}
                eligibilityGroups={eligibilityGroups}
                okrTemplates={okrTemplates}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default RewardsManagement;
