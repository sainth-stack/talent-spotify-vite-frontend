/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import TitleHeader from "components/TitleHeader";
import HorizontalBar from "components/Company/HorizontalBar";
import search from "../../../assets/svg/search.svg";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Text from "components/Company/Text";
import Button from "components/Company/Button";
import paginationFactory from "react-bootstrap-table2-paginator";
import Table from "components/Table";
import { LoadingIndicator, Validator, removeDuplicates } from "utilities";
import {
  createPrivilege,
  deletePrivilege,
  deletePrivilegeMultiple,
  getAllPrivileges,
  updatePrivilege,
  updatePrivilegePermissionGroup,
  updatePrivilegesActive,
  updatePrivilegesInActive,
} from "action/PrivilegesAct";
import { useDispatch } from "react-redux";
import "./index.css";
import TabsReact from "./tabs";
import PrivilegeModal from "./PrivilegeModal";
import { getAllPrivilegesGroup } from "action/PrivilegesGroupAct";
import { getPrivileges } from "reducer/userSlice";
import { t } from "i18next";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      role: data[i].role,
      description: data[i].description,
      privilegeGroup: data[i].privilegeGroup,
      active: data[i].active,
      privileges: data[i].privileges,
      updatedAt: data[i].updatedAt,
    });
  }
  return items;
};
function RolesAndPreviliges() {
  const [roleData, setRoleData] = useState({
    role: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPrivilegeModal, setPrivilegeModal] = useState(false);
  const [editId, setEditId] = useState("");
  const [, setError] = useState(false);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [, forceUpdate] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [privilegeGroups, setPrivilegeGroups] = useState([]);
  const [searchDropdown, setSearchDropdown] = useState("");
  const [searchText, setSearchText] = useState("");

  const validator = Validator();
  const privilegesData = {
    employees: [
      {
        page: "Birthday Widget",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Anniversary Widget",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Dashboards",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Rewards",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "RewardsNomination",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "IHaveIdea",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Org Chart",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Objectives",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Key Results",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Reviews",
        view: false,
        edit: false,
        delete: false,
        category: "Employees",
      },
      {
        page: "Advanced Reviews",
        view: false,
        edit: false,
        delete: false,
        category: "Employees",
      },
      {
        page: "Roles and Privileges",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Dashboard - Leaderboard",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Dashboard - Tasks",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Dashboard - Reward Points",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Dashboard - Achievement",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Dashboard - OKR Progress",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Dashboard - Remaining vs Achieved",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Dashboard - Estimated vs Actual",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Dashboard - Performance Form Review Status",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Objectives - Individual",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Objectives - Team",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Objectives - Company",
        view: false,
        edit: false,
        delete: false,
      },
    ],
    goals: [
      {
        page: "Tasks",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Cascade Objectives",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Lock Objectives",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Approve Objectives",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Reject Objectives",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Unlock Objectives",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Tasks Drag and Drop",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Key Results - Target update once locked",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Key Results - Actual, comments update once locked",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Update progress on Objectives",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Goals",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Sessions",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Update Manager Progress For Cascaded",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Advanced Launch Forms",
        view: false,
        edit: false,
        delete: false,
      },
    ],
    previliges: [
      {
        page: "Roles & Privileges",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Privilege Groups",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "OKR Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Rewards Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Catalog Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Notification Settings",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Advanced Performance Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Integration Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Questionaire Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Competency Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Performance Management Templates",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Launch Forms Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Calibration Management",
        view: false,
        edit: false,
        delete: false,
      },
      {
        page: "Advanced Launch Forms Management",
        view: false,
        edit: false,
        delete: false,
      },
    ],
  };
  const [privileges, setPrivileges] = useState(privilegesData);

  const handleChangeSearch = ({ target: { name, value, label } }) => {
    let updatedData = { ...roleData };
    updatedData[name] = value;
    setRoleData(updatedData);
  };
  const handleSubmit = () => {
    if (validator.current.allValid()) {
      if (editId) {
        let finalPrivilegesCategory1 = [...privileges.employees].map(
          (item) => ({
            ...item,
            category: "Employees",
          })
        );
        let finalPrivilegesCategory2 = [...privileges.goals].map((item) => ({
          ...item,
          category: "Goals",
        }));
        let finalPrivilegesCategory3 = [...privileges.previliges].map(
          (item) => ({
            ...item,
            category: "Previleges",
          })
        );
        const finalData = {
          ...roleData,
          active: true,
          privileges: [
            ...finalPrivilegesCategory1,
            ...finalPrivilegesCategory2,
            ...finalPrivilegesCategory3,
          ],
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        if (JSON.parse(localStorage.getItem("user")).role === finalData.role) {
          dispatch(getPrivileges(finalData.privileges));
        }
        setLoading(true);
        let response = dispatch(updatePrivilege(editId, finalData));
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
        let finalPrivilegesCategory1 = [...privileges.employees].map(
          (item) => ({
            ...item,
            category: "Employees",
          })
        );
        let finalPrivilegesCategory2 = [...privileges.goals].map((item) => ({
          ...item,
          category: "Goals",
        }));
        let finalPrivilegesCategory3 = [...privileges.previliges].map(
          (item) => ({
            ...item,
            category: "Previleges",
          })
        );
        const finalData = {
          ...roleData,
          active: true,
          privileges: [
            ...finalPrivilegesCategory1,
            ...finalPrivilegesCategory2,
            ...finalPrivilegesCategory3,
          ],
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        setLoading(true);
        let response = dispatch(createPrivilege(finalData));
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
    }
  };

  const handleCallback2 = (editObject) => {
    let response = dispatch(
      updatePrivilegePermissionGroup(editObject.roleId, editObject)
    );
    response.then(({ success, message }) => {
      if (success) {
        setError("");
        getPrivilegesDataRefresh();
        setPrivilegeModal(false);
      } else {
        setError(message);
      }
    });
  };

  const changeActiveStatus = (id, status) => {
    let dataActive = data.filter((item) => item._id === id);
    if (dataActive.length > 0) {
      let response = dispatch(updatePrivilege(id, { active: status }));
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

  const getPrivilegeGroupsData = () => {
    try {
      let response = dispatch(getAllPrivilegesGroup());
      response.then(({ data, message }) => {
        if (data.privilegeGroups !== undefined) {
          let nonduplicate = removeDuplicates(
            data.privilegeGroups,
            "groupName"
          );
          let finalData = nonduplicate.map((item) => ({
            key: item.groupName,
            value: item._id,
          }));
          setPrivilegeGroups(finalData);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getPrivilegesData = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllPrivileges());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = removeDuplicates(data, "role");
          nonduplicate = tableGenerator(nonduplicate, nonduplicate.length);
          setData(nonduplicate);
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
      let response = dispatch(getAllPrivileges());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = removeDuplicates(data, "role");
          nonduplicate = tableGenerator(nonduplicate, nonduplicate.length);
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

  const handleEdit = (row) => {
    setRoleData({
      role: row.role,
      description: row.description,
    });
    let EmployeesPrivileges = row.privileges.filter(
      (item) => item.category === "Employees"
    );
    let GoalsPrivileges = row.privileges.filter(
      (item) => item.category === "Goals"
    );
    let HrPreviliges = row.privileges.filter(
      (item) => item.category === "Previleges"
    );
    setPrivileges({
      employees: EmployeesPrivileges,
      goals: GoalsPrivileges,
      previliges:
        HrPreviliges.length === 0 ? privilegesData.previliges : HrPreviliges,
    });
    setEditId(row._id);
  };

  const emptyData = () => {
    setRoleData({
      role: "",
      description: "",
    });
    setPrivileges(privilegesData);
    setEditId(null);
    validator.current.hideMessages();
  };

  const handleAdd = () => {
    setPrivilegeModal(true);
  };
  const handleDelete = (id) => {
    let response = dispatch(deletePrivilege(id));
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
      let response = dispatch(deletePrivilegeMultiple({ data: selectedIds }));
      response.then(({ success, message }) => {
        if (success) {
          setError("");
          getPrivilegesDataRefresh();
          window.location.reload();
        } else {
          setError(message);
        }
      });
    } else {
      alert("Please select role...");
    }
  };

  const handleActiveMultiple = () => {
    if (selectedUsers.length > 0) {
      let selectedIds = selectedUsers.map((item) => item._id);
      let response = dispatch(updatePrivilegesActive({ data: selectedIds }));
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

  const handleInActiveMultiple = () => {
    if (selectedUsers.length > 0) {
      let selectedIds = selectedUsers.map((item) => item._id);
      let response = dispatch(updatePrivilegesInActive({ data: selectedIds }));
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
      dataField: "role",
      text: "Role Name",
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
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
      dataField: "privilegeGroup",
      text: "Permission Group or Users",
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
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
      dataField: "active",
      text: "Active",
      formatter: (cellContent, row) => {
        return (
          <div className="d-flex flex-wrap">
            <input
              type="checkbox"
              checked={row.active ? true : false}
              onChange={(e) => changeActiveStatus(row._id, !row.active)}
            />
          </div>
        );
      },
    },
    {
      dataField: "_id",
      text: t("Tasks.Action"),

      formatter: (cellContent, row) => {
        return (
          <div className="d-flex flex-wrap">
            <button
              className="btn btn-default  text-capitalize text-left justify-content-start"
              onClick={() => {
                handleEdit(row);
              }}
            >
              {t("Tasks.Edit")}
            </button>

            <button
              className="btn btn-default text-capitalize text-left justify-content-start"
              onClick={() => handleDelete(row._id)}
            >
              {t("Tasks.Delete")}
            </button>
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
    getPrivilegeGroupsData();
  }, []);
  return (
    <>
      <TitleHeader name="Admin Portal - Previlages " />
      <div className="bg-light-primary rounded-12 mh-100 p-4 m-4">
        <p className="title text-dark font-weight-bold pb20">
          Roles & Previlages
        </p>
        <div className="company-form">
          <Row>
            <Col md={5}>
              <div className="d-flex justify-content-between mt-5">
                <label className="label fs13 col-md-4 col-xs-12 col-sm-12">
                  Role Name*
                </label>
                <div className="d-flex ml-2 col-md-8  col-xs-12 col-sm-12">
                  <input
                    style={{ borderRadius: "20px" }}
                    id="role"
                    className="form-control col-12 p-3"
                    name="role"
                    rows="5"
                    value={roleData.role}
                    onChange={handleChangeSearch}
                  />
                </div>
              </div>{" "}
              <div className="d-flex justify-content-between mt-5">
                <label className="label fs13 col-md-4 col-xs-12 col-sm-12">
                  Description*
                </label>
                <div className="d-flex ml-2 col-md-8  col-xs-12 col-sm-12">
                  <textarea
                    style={{ borderRadius: "20px" }}
                    id="description"
                    className="form-control col-12 p-3"
                    name="description"
                    rows="5"
                    value={roleData.description}
                    onChange={handleChangeSearch}
                  ></textarea>
                </div>
              </div>
            </Col>
            <Col md={7}>
              <TabsReact
                privileges={privileges}
                setPrivileges={setPrivileges}
              />
            </Col>
          </Row>

          <Button
            text={`${editId ? "Update" : "Save"}`}
            handleClick={() => handleSubmit()}
            className="bg-green border-grey text-white"
          />
          {/*<p className="m-0 fs14 text-center text-danger">{error.length > 0 ? error : ""}</p>*/}
          <HorizontalBar className="pt-3 pb-3" />
          <Text text="Grant this role to... " />
          <p>
            Select a group to which you wish to grant this role. You may want a
            group of users to manage employee records for a certain group of
            employees. For example, maybe a department manager should edit
            records within their own department.
          </p>

          <div className="mt-5">
            <Button
              text={t("Tasks.Add")}
              handleClick={() => handleAdd()}
              className="bg-green border-grey text-white"
            />
            <Button
              text="Remove"
              handleClick={() => handleDeleteMultiple()}
              className="bg-green border text-white"
            />
            <Button
              text="Make Active"
              handleClick={() => handleActiveMultiple()}
              className="bg-green border text-white"
            />
            <Button
              text="Make Inactive"
              handleClick={handleInActiveMultiple}
              className="bg-green border text-white"
            />
          </div>

          <div className="d-flex flex-row justify-content-between align-items-start col-md-6 mt-5">
            <label className="label fs14 col-md-6">
              Permission groups or users
            </label>
            <select
              style={{ borderRadius: "50px", height: "37px" }}
              onChange={(e) => setSearchDropdown(e.target.value)}
              className="custom-dropdown col-md-8"
              value={searchDropdown}
            >
              <option value="">--Select--</option>
              {privilegeGroups.map((option, index) => (
                <option value={option.key} key={index}>
                  {option.key}
                </option>
              ))}
            </select>
            <div className="input-group col-lg-10 col-xs-12 col-sm-12 p-0 nav-item search-bar ml-5">
              <div className="input-group-append searchInput-icon ">
                <img src={search} alt="search-icon" className="searchIcon" />
              </div>
              <input
                style={{ borderRadius: "20px" }}
                type="text"
                className="bg-light outline-none searchInput text-dark fs14"
                placeholder="Type Keywords here..."
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <LoadingIndicator size={3} />
            </div>
          ) : (
            <Table
              title="objectives"
              data={data.filter((item) => {
                return (
                  item.privilegeGroup
                    .toLowerCase()
                    .indexOf(searchDropdown.toLowerCase()) !== -1 &&
                  item.privilegeGroup
                    .toLowerCase()
                    .indexOf(searchText.toLowerCase()) !== -1
                );
              })}
              columns={columns}
              paginationFactory={paginationFactory}
              selectRow={selectRow}
            />
          )}
        </div>
        {showPrivilegeModal && (
          <PrivilegeModal
            show={showPrivilegeModal}
            onHide={() => setPrivilegeModal(false)}
            handlecallback={(data) => handleCallback2(data)}
            roles={data.map((item) => ({ key: item.role, value: item._id }))}
          />
        )}
      </div>
    </>
  );
}

export default RolesAndPreviliges;
