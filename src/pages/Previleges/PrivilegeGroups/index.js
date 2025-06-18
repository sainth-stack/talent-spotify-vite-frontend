/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import TitleHeader from "components/TitleHeader";
import HorizontalBar from "components/Company/HorizontalBar";
import Entity from "pages/KeyResults";
import search from "../../../assets/svg/search.svg";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Text from "components/Company/Text";
import Button from "components/Company/Button";
import paginationFactory from "react-bootstrap-table2-paginator";
import Table from "components/Table";
import {
  LoadingIndicator,
  statuses,
  Role,
  Validator,
  removeDuplicates,
} from "utilities";
import {
  createPrivilegeGroup,
  deletePrivilegeGroup,
  deletePrivilegeGroupMultiple,
  getAllPrivilegesGroup,
  updatePrivilegeGroup,
  updatePrivilegesGroupActive,
  updatePrivilegesGroupInActive,
} from "action/PrivilegesGroupAct";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";
import TabsReact from "./tabs";

import GroupForm from "./GroupForm";
import ArrowOrderComponent from "pages/Objectives/ObjectivesTable/ArrowOrderComponent";
import GroupActions from "./GroupActions";
import {
  filterFinalItems,
  filterFinalItemsDelete,
  inActivefilterFinalItems,
} from "./filterItemsData";
import { previleges } from "reducer/privilegesGroup";
import { t } from "i18next";

export const tableGenerator = (data, length) => {
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
function PrivilegeGroups() {
  const roleData = useSelector((store2) => store2.previlage.privilegeGroup);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState("");
  const [, setError] = useState(false);
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const dispatch = useDispatch();
  const [, forceUpdate] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const validator = Validator();

  const handleChangeSearch = ({ target: { name, value, label } }) => {
    let updatedData = { ...roleData };
    updatedData[name] = value;
    dispatch(previleges(updatedData));
  };
  const handleChangeGroupMembers = (index) => {
    return ({ target: { name, value } }) => {
      let updatedData = [...roleData.groupMembers];
      let updatedDatas = { ...roleData };
      let activeGroupMembers = [...roleData.activeGroupMembers];
      if (name === "categoryName" && value === "Designation") {
        let categories = employees
          .filter(
            (item) => item.employmentInformation.designation !== undefined
          )
          .map((item) => ({
            value: item.employmentInformation.designation,
            key: item.employmentInformation.designation,
          }));
        let nonduplicate = removeDuplicates(categories, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Department") {
        let categories = employees
          .filter((item) => item.employmentInformation.department !== undefined)
          .map((item) => ({
            value: item.employmentInformation.department,
            key: item.employmentInformation.department,
          }));
        let nonduplicate = removeDuplicates(categories, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Grade") {
        let categories = employees
          .filter((item) => item.employmentInformation.grade !== undefined)
          .map((item) => ({
            value: item.employmentInformation.grade,
            key: item.employmentInformation.grade,
          }));
        let nonduplicate = removeDuplicates(categories, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Hire Date") {
        let hireDateOptions = [
          { key: "<", value: "<" },
          { key: ">", value: ">" },
          { key: "==", value: "==" },
        ];
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: hireDateOptions,
          categoryName: value,
        };
      }
      if (name === "categoryValue") {
        if (updatedData[index]["categoryName"] === "Designation") {
          let activeMembers = employees.filter(
            (item) => item.employmentInformation.designation === value
          );
          updatedDatas.activeGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.activeGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
        } else if (updatedData[index]["categoryName"] === "Department") {
          let activeMembers = employees.filter(
            (item) => item.employmentInformation.department === value
          );
          updatedDatas.activeGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.activeGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
        } else if (updatedData[index]["categoryName"] === "Grade") {
          let activeMembers = employees.filter(
            (item) => item.employmentInformation.grade === value
          );
          updatedDatas.activeGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.activeGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
        } else if (updatedData[index]["categoryName"] === "Hire Date") {
          updatedData[index] = { ...updatedData[index], categoryValue: value };
        }
      }
      if (
        name === "categoryValueText" &&
        updatedData[index]["categoryName"] === "Hire Date"
      ) {
        if (updatedData[index].categoryValue.length > 0) {
          let activeMembers = employees.filter((item) => {
            if (updatedData[index].categoryValue === "<") {
              return (
                window
                  .moment(item.employmentInformation.hireDate)
                  .format("DD-MM-YYYY") <
                window.moment(value).format("DD-MM-YYYY")
              );
            } else if (updatedData[index].categoryValue === ">") {
              return (
                window
                  .moment(item.employmentInformation.hireDate)
                  .format("DD-MM-YYYY") >
                window.moment(value).format("DD-MM-YYYY")
              );
            } else if (updatedData[index].categoryValue === "==") {
              return (
                window
                  .moment(item.employmentInformation.hireDate)
                  .format("DD-MM-YYYY") ==
                window.moment(value).format("DD-MM-YYYY")
              );
            }
          });
          updatedDatas.activeGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.activeGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
          };
        } else {
          alert("Please select category value!");
        }
      }
      updatedDatas.groupMembers = updatedData;
      filterFinalItems(
        activeGroupMembers,
        updatedDatas,
        updatedDatas.groupMembers,
        dispatch
      );
    };
  };
  const handleChangeExcludeGroupMembers = (index) => {
    return ({ target: { name, value } }) => {
      let updatedData = [...roleData.excludeGroupMembers];
      let updatedDatas = { ...roleData };
      let activeGroupMembers = [...roleData.inActiveGroupMembers];
      if (name === "categoryName" && value === "Designation") {
        let categories = employees
          .filter(
            (item) => item.employmentInformation.designation !== undefined
          )
          .map((item) => ({
            value: item.employmentInformation.designation,
            key: item.employmentInformation.designation,
          }));
        let nonduplicate = removeDuplicates(categories, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Department") {
        let categories = employees
          .filter((item) => item.employmentInformation.department !== undefined)
          .map((item) => ({
            value: item.employmentInformation.department,
            key: item.employmentInformation.department,
          }));
        let nonduplicate = removeDuplicates(categories, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Grade") {
        let categories = employees
          .filter((item) => item.employmentInformation.grade !== undefined)
          .map((item) => ({
            value: item.employmentInformation.grade,
            key: item.employmentInformation.grade,
          }));
        let nonduplicate = removeDuplicates(categories, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Hire Date") {
        let hireDateOptions = [
          { key: "<", value: "<" },
          { key: ">", value: ">" },
          { key: "==", value: "==" },
        ];
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: hireDateOptions,
          categoryName: value,
        };
      } else if (name === "categoryName" && value === "Email") {
        let emails = [...updatedDatas.activeGroupMembers].map((item) => ({
          value: item.contactInformation.email,
          key: item.contactInformation.email,
        }));
        let nonduplicate = removeDuplicates(emails, "value");
        updatedData[index] = {
          ...updatedData[index],
          categoryValues: nonduplicate,
          categoryName: value,
        };
      }
      if (name === "categoryValue") {
        if (updatedData[index]["categoryName"] === "Designation") {
          let activeMembers = employees.filter(
            (item) => item.employmentInformation.designation === value
          );
          updatedDatas.inActiveGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.inActiveGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
          updatedData[index].categoryValueText = value;
          updatedData[index][name] = value;
        } else if (updatedData[index]["categoryName"] === "Department") {
          let activeMembers = employees.filter(
            (item) => item.employmentInformation.department === value
          );
          updatedDatas.inActiveGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.inActiveGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
          updatedData[index].categoryValueText = value;
          updatedData[index][name] = value;
        } else if (updatedData[index]["categoryName"] === "Grade") {
          let activeMembers = employees.filter(
            (item) => item.employmentInformation.grade === value
          );
          updatedDatas.inActiveGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.inActiveGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
          updatedData[index].categoryValueText = value;
          updatedData[index][name] = value;
        } else if (updatedData[index]["categoryName"] === "Hire Date") {
          updatedData[index] = { ...updatedData[index], categoryValue: value };
          updatedData[index][name] = value;
        } else if (updatedData[index]["categoryName"] === "Email") {
          let activeMembers = employees.filter(
            (item) => item.contactInformation.email === value
          );
          updatedDatas.inActiveGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.inActiveGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
            categoryValue: value,
          };
          updatedData[index].categoryValueText = value;
          updatedData[index][name] = value;
        }
      }
      if (
        name === "categoryValueText" &&
        updatedData[index]["categoryName"] === "Hire Date"
      ) {
        if (updatedData[index].categoryValue.length > 0) {
          let activeMembers = employees.filter((item) => {
            if (updatedData[index].categoryValue === "<") {
              return (
                window
                  .moment(item.employmentInformation.hireDate)
                  .format("DD-MM-YYYY") <
                window.moment(value).format("DD-MM-YYYY")
              );
            } else if (updatedData[index].categoryValue === ">") {
              return (
                window
                  .moment(item.employmentInformation.hireDate)
                  .format("DD-MM-YYYY") >
                window.moment(value).format("DD-MM-YYYY")
              );
            } else if (updatedData[index].categoryValue === "==") {
              return (
                window
                  .moment(item.employmentInformation.hireDate)
                  .format("DD-MM-YYYY hh:mm") ==
                window.moment(value).format("DD-MM-YYYY hh:mm")
              );
            }
          });
          updatedDatas.inActiveGroupMembers = [
            ...activeGroupMembers,
            ...activeMembers,
          ];
          let nonduplicate = removeDuplicates(
            updatedDatas.inActiveGroupMembers,
            "_id"
          );
          activeGroupMembers = nonduplicate;
          updatedData[index] = {
            ...updatedData[index],
            categoryValueText: value,
          };
        } else {
          alert("Please select category value!");
        }
      }
      updatedDatas.excludeGroupMembers = updatedData;
      inActivefilterFinalItems(
        activeGroupMembers,
        updatedDatas,
        updatedDatas.excludeGroupMembers,
        dispatch
      );
    };
  };
  const handleSubmit = () => {
    if (validator.current.allValid()) {
      if (editId) {
        let finalInActiveMembers =
          roleData.inActiveGroupMembers &&
          roleData.inActiveGroupMembers.length > 0
            ? [...roleData.inActiveGroupMembers].map((item) => item._id)
            : [];
        let finalActiveMembers =
          finalInActiveMembers.length > 0
            ? [...roleData.activeGroupMembers].filter(
                (item) => !finalInActiveMembers.includes(item._id)
              )
            : roleData.activeGroupMembers;
        const finalData = {
          ...roleData,
          actualActiveGroupMembers: roleData.activeGroupMembers,
          activeGroupMembers: finalActiveMembers,
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        setLoading(true);
        let response = dispatch(updatePrivilegeGroup(editId, finalData));
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
        let finalInActiveMembers =
          roleData.inActiveGroupMembers &&
          roleData.inActiveGroupMembers.length > 0
            ? [...roleData.inActiveGroupMembers].map((item) => item._id)
            : [];
        let finalActiveMembers =
          finalInActiveMembers.length > 0
            ? [...roleData.activeGroupMembers].filter(
                (item) => !finalInActiveMembers.includes(item._id)
              )
            : roleData.activeGroupMembers;
        const finalData = {
          ...roleData,
          actualActiveGroupMembers: roleData.activeGroupMembers,
          activeGroupMembers: finalActiveMembers,
          companyId:
            localStorage.getItem("companyId") !== null
              ? JSON.parse(localStorage.getItem("companyId"))
              : null,
        };
        setLoading(true);
        let response = dispatch(createPrivilegeGroup(finalData));
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

  const getPrivilegesData = () => {
    try {
      setLoading(true);
      let response = dispatch(getAllPrivilegesGroup());
      response.then(({ data, message }) => {
        if (data.privilegeGroups !== undefined && data.employees.length > 0) {
          let nonduplicate = removeDuplicates(
            data.privilegeGroups,
            "groupName"
          );
          nonduplicate = tableGenerator(nonduplicate, nonduplicate.length);
          setData(nonduplicate);
          setEmployees(data.employees);
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
      let response = dispatch(getAllPrivilegesGroup());
      response.then(({ data, message }) => {
        if (data.privilegeGroups !== undefined && data.employees.length > 0) {
          let nonduplicate = removeDuplicates(
            data.privilegeGroups,
            "groupName"
          );
          nonduplicate = tableGenerator(nonduplicate, nonduplicate.length);
          setData(nonduplicate);
          setEmployees(data.employees);
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
    let privilegeGroup = {
      groupName: row.groupName,
      groupMembers: row.groupMembers,
      excludeGroupMembers: row.excludeGroupMembers,
      activeGroupMembers: row.activeGroupMembers,
    };
    dispatch(previleges(privilegeGroup));
    setEditId(row._id);
  };
  const handleEditCopy = (row) => {
    let privilegeGroup = {
      groupName: row.groupName,
      groupMembers: row.groupMembers,
      excludeGroupMembers: row.excludeGroupMembers,
      activeGroupMembers: row.activeGroupMembers,
    };
    dispatch(previleges(privilegeGroup));
  };

  const emptyData = () => {
    let privilegeGroup = {
      groupName: "",
      groupMembers: [
        {
          categoryName: "",
          categoryValues: [],
          categoryValue: "",
          categoryValueText: "",
        },
      ],
      excludeGroupMembers: [
        {
          categoryName: "",
          categoryValues: [],
          categoryValue: "",
          categoryValueText: "",
        },
      ],
      activeGroupMembers: [],
    };
    dispatch(previleges(privilegeGroup));
    setEditId(null);
    validator.current.hideMessages();
  };

  const handleAdd = () => {
    setEditId(null);
    emptyData();
  };
  const handleDelete = (id) => {
    let response = dispatch(deletePrivilegeGroup(id));
    response.then(({ success, message }) => {
      if (success) {
        setError("");
        getPrivilegesDataRefresh();
      } else {
        setError(message);
      }
    });
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
      dataField: "groupName",
      text: "Group Name",
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
    },
    {
      dataField: "description",
      text: "User Type",
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
    },
    {
      dataField: "descriptions",
      text: "Sonic Of Dynamic",
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
    },
    {
      dataField: "activeGroupMembersCount",
      text: "Active Membership",
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
    },
    {
      dataField: "updatedAt",
      text: "Last Modified",
      sort: true,
      csvExport: false,
      sortCaret: (order, column) => {
        return <ArrowOrderComponent order={order} />;
      },
    },
    {
      dataField: "_id",
      text: t("Tasks.Action"),

      formatter: (cellContent, row) => {
        return (
          <div>
            <GroupActions
              handleEdit={handleEdit}
              handleEditCopy={handleEditCopy}
              handleDelete={handleDelete}
              row={row}
            />
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
  }, []);
  return (
    <>
      <TitleHeader name="Admin Portal - Privileges " />
      <div className="bg-light-primary rounded-12 mh-100 p-4 m-4">
        <p className="title text-dark font-weight-bold pb20">
          Privilege Groups
        </p>
        <div className="company-form">
          <Row>
            <Col md={5}>
              <div className="d-flex justify-content-between mt-5">
                <label className="label fs13 col-md-4 col-xs-12 col-sm-12">
                  Group Name
                </label>
                <div className="input-group col-lg-10 col-xs-12 col-sm-12 p-0 nav-item search-bar ml-5 border h43">
                  <div className="input-group-append searchInput-icon searchInput-icon2 ">
                    <img
                      src={search}
                      alt="search-icon"
                      className="searchIcon"
                    />
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
                <Button
                  text="Create"
                  handleClick={() => handleAdd()}
                  className="mt-0 bg-green border-grey text-white"
                />
              </div>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center">
              <LoadingIndicator size={3} />
            </div>
          ) : (
            <Table
              title="objectives"
              data={data.filter((item) => {
                return (
                  item.groupName
                    .toLowerCase()
                    .indexOf(searchText.toLowerCase()) !== -1 ||
                  item.activeGroupMembersCount == searchText ||
                  item.updatedAt.indexOf(searchText) !== -1
                );
              })}
              columns={columns}
              paginationFactory={paginationFactory}
              selectRow={selectRow}
            />
          )}

          {employees.length > 0 && (
            <GroupForm
              roleData={roleData}
              handleChangeSearch={handleChangeSearch}
              handleAdd={handleAdd}
              handleChangeGroupMembers={handleChangeGroupMembers}
              handleChangeExcludeGroupMembers={handleChangeExcludeGroupMembers}
              dispatch={dispatch}
              handleSubmit={handleSubmit}
              filterFinalItems={filterFinalItems}
              filterFinalItemsDelete={filterFinalItemsDelete}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default PrivilegeGroups;
