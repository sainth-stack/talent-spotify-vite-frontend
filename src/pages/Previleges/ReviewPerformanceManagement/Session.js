import React, { useEffect, useState } from 'react'
import SelectInput from 'components/Company/SelectInput';
import { useDispatch } from 'react-redux';
import { getAllTemplates } from 'action/TemplatesAct';
import TextInput from 'components/Company/TextInput';
import useGetEmployees from 'pages/Goals/hooks/useGetEmployees';
import { deleteSession, getAllSessions, updateSession, createSession } from 'action/SessionAct';

import more from 'assets/svg/More.svg';
import trashIcon from "assets/svg/trashIcon.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";
import paginationFactory from "react-bootstrap-table2-paginator";
import Button from 'components/Company/Button';
import { LoadingIndicator } from 'utilities';
import TableNormal from 'components/TableNormal';
import GuideLinesTab from './GuideLinesTab';
import { Link } from 'react-router-dom';
import { getAllPrivilegesGroup } from 'action/PrivilegesGroupAct';
import Select from "react-select";

import "./style.scss";

const SessionTab = () => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [, setRatingScales] = useState([]);
  const [previlegeGroups, setPrivilegeGroups] = useState([]);
  const [previlegeGroupsData, setPrivilegeGroupsData] = useState([]);
  const [data, setData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedOwners, setSelectedOwners] = useState("");
  const dispatch = useDispatch();
  const [templateInfo, setTemplateInfo] = useState({
    templateName: "",
    sessionName: "",
    sessionOwners: "",
    sessionStartDate: null,
    sessionEndDate: null,
    employees: [],
    employeesGroup: "",
    performance: []
  });
  const [empData, setEmpData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { data: employeeResponse, message, success, isLoading } = useGetEmployees();

  useEffect(() => {
    if (!isLoading && employeeResponse && employeeResponse.data.length > 0) {
      let employeeData = employeeResponse && employeeResponse.data.length > 0 && employeeResponse.data.map((item) => {
        let obj = {
          key: item.personalInformation.firstName + " " + item.personalInformation.lastName,
          value: item._id,
          role: item.employmentInformation.role
        }
        obj.label = obj.key;
        return obj;
      });
      setEmpData(employeeData);
    }
  }, [isLoading, employeeResponse])
  const getTemplates = () => {
    setLoading(true);
    let response = dispatch(getAllTemplates());
    response.then(({ success, message, data }) => {
      if (success) {
        let updatedData = data.map(item => ({ key: item.templateName, value: item._id, ratingScale: item.ratingScale }))
        setTemplates(updatedData);
        setRatingScales(data)
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }
  const getPrevilegeGroups = () => {
    setLoading(true);
    let response = dispatch(getAllPrivilegesGroup());
    response.then(({ success, message, data }) => {
      if (success) {
        let { privilegeGroups } = data;
        let updatedData = privilegeGroups.map(item => ({ key: item.groupName, value: item._id }))
        setPrivilegeGroups(updatedData);
        setPrivilegeGroupsData(privilegeGroups);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }
  const getSessions = () => {
    setLoading(true);
    let response = dispatch(getAllSessions());
    response.then(({ success, message, data }) => {
      if (success) {
        setData(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }
  const columns = [
    {
      dataField: "sessionName",
      text: "NAME",
      sort: true,
      sortCaret: (order, column) => {
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
          <Link to={"/admin/calibration/" + row._id}>
            {row.sessionName}
          </Link>
        );
      },
    },
    {
      dataField: "action",
      text: "ACTION",
      formatter: (cellContent, row) => {
        return (
          <div className="d-flex flex-wrap">
            <div className="dropdown actionDropdown">
              <button className="dropdown-toggle d-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src={more} alt={more} style={{ height: 15 }} />
              </button>
              <div className="dropdown-menu text-left " aria-labelledby="dropdownMenuButton">
                <button className="btn btn-default dropdown-item text-capitalize text-left justify-content-start" onClick={() => handleEdit(row)}><img src={editTableIcon} alt="edit table icon" />&nbsp;Edit</button>
                <button className="btn btn-default dropdown-item text-capitalize text-left justify-content-start" onClick={() => handleDelete(row._id)}><img src={trashIcon} alt="edit table icon" />&nbsp;Delete</button>
              </div>
            </div>
          </div>
        );
      },
    }
  ]
  const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    onSelect: (row) => {
      let totalData = [...selectedUsers];
      let filterData = totalData.findIndex(item => item._id === row._id);
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
    }
  };

  const handleEdit = (row) => {
    let obj = {
      ...row,
      sessionStartDate: window.moment(row.sessionStartDate).format("YYYY-MM-DD"),
      sessionEndDate: window.moment(row.sessionEndDate).format("YYYY-MM-DD"),
      sessionOwners: row.sessionOwners.map(item => {
        let findEmp = empData.find(emp => emp.value === item);
        return findEmp;
      })
    };
    setSelectedOwners(obj.sessionOwners);
    setTemplateInfo(obj);
    setShowForm(true);
  }

  const handleDelete = (id) => {
    setLoading(true);
    let response = dispatch(deleteSession(id));
    response.then(({ success, message, data }) => {
      if (success) {
        getSessions();
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }
  useEffect(() => {
    getTemplates();
    getSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    getPrevilegeGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm])
  const handleInput = ({ target: { name, value } }) => {
    setTemplateInfo({ ...templateInfo, [name]: value });
  }

  const handleSubmit = () => {
    setLoading(true);
    let sessionOwners = selectedOwners.map(item => item.value);
    templateInfo.sessionOwners = sessionOwners;
    let { activeGroupMembers = [] } = previlegeGroupsData.find(item => item._id === templateInfo.employeesGroup);
    templateInfo.employees = activeGroupMembers.map(item => item._id);
    let response = dispatch(createSession(templateInfo));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        getSessions();
        setTemplateInfo({
          templateName: "",
          sessionName: "",
          sessionOwners: [],
          sessionStartDate: null,
          sessionEndDate: null,
          employees: [],
          employeesGroup: "",
          performance: []
        })
        setShowForm(false);
      } else {
        setLoading(false);
      }
    });
  }

  const handleUpdate = () => {
    setLoading(true);
    let id = templateInfo._id;
    delete templateInfo.__v;
    delete templateInfo.createdAt;
    delete templateInfo.updatedAt;
    delete templateInfo._id;
    let sessionOwners = selectedOwners.map(item => item.value);
    templateInfo.sessionOwners = sessionOwners;
    let { activeGroupMembers = [] } = previlegeGroupsData.find(item => item._id === templateInfo.employeesGroup);
    templateInfo.employees = activeGroupMembers.map(item => item._id);
    let response = dispatch(updateSession(id, templateInfo));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        getSessions();
        setTemplateInfo({
          templateName: "",
          sessionName: "",
          sessionOwners: [],
          sessionStartDate: null,
          sessionEndDate: null,
          employees: [],
          employeesGroup: "",
          performance: []
        })
        setShowForm(false);
      } else {
        setLoading(false);
      }
    });
  }

  return (
    <div className='p-4'>
      <h5>Sessions</h5>
      <div className="mt-3 col-6 d-flex align-items-center">
        <TextInput label="Session Name" name="searchKey"
          value={searchKey}
          onChangeText={(e) => setSearchKey(e.target.value)}
          className=" form-control" />

        <Button
          text="Create"
          className="bg-green border text-white"
          handleClick={() => setShowForm(!showForm)}
        />
      </div>

      {loading ? <div className="text-center"><LoadingIndicator size={3} /></div> :
        <TableNormal
          data={data}
          columns={columns}
          paginationFactory={paginationFactory}
          searchKey={searchKey}
          selectRow={selectRow}
          keyField="_id"
        />}


      {showForm && (
        <div className="ml-3" >
          <p>Define the Session details:</p>
          <div className="row">
            <p className="col-sm-12 col-md-3 fs-14">Template:</p>
            <div className="col-sm-12 col-md-9">
              <SelectInput
                placeholder="Please select a template..."
                name="templateName"
                options={templates}
                value={templateInfo.templateName}
                onChangeText={handleInput}
              />
            </div>
          </div>
          <div className="row">
            <p className="col-sm-12 col-md-3 fs-14">Session Name:</p>
            <div className="col-9 m-0 p-0 mt-2">
              <TextInput
                label=""
                placeholder="Enter Session Name"
                name="sessionName"
                value={templateInfo.sessionName}
                onChangeText={handleInput}
                inputStyle={"ml-3"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-9 mt-2">
              <TextInput
                label="Session Start Date"
                dateType="date"
                placeholder="Enter Session Start Date"
                name="sessionStartDate"
                value={templateInfo.sessionStartDate}
                onChangeText={handleInput}
                labelStyle={"fs14 m-0 p-0"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-9 mt-2">
              <TextInput
                label="Session End Date"
                dateType="date"
                placeholder="Enter Session End Date"
                name="sessionEndDate"
                value={templateInfo.sessionEndDate}
                onChangeText={handleInput}
                labelStyle={"fs14 m-0 p-0"}
              />
            </div>
          </div>
          <div className="row">
            <p className="col-sm-12 col-md-3 fs-14">Session Owners:</p>
            <div className="col-9">
              <Select
                options={empData}
                isMulti={true}
                value={selectedOwners}
                placeholder="Please select a template..."
                className='mt-2 mb-2 col-md-8'
                onChange={(option) => {
                  if (option) {
                    setSelectedOwners(option);
                  } else {
                    setSelectedOwners([]);
                  }
                }}
              />
            </div>
          </div>

          <div className="row">
            <p className="col-sm-12 col-md-3 fs-14">Employees Group:</p>
            <div className="col-sm-12 col-md-9">
              <SelectInput
                placeholder="Please select employees..."
                name="employeesGroup"
                options={previlegeGroups}
                value={templateInfo.employeesGroup}
                onChangeText={handleInput}
              />
            </div>
          </div>
          <GuideLinesTab templates={templates} performance={templateInfo.performance} setTemplateInfo={(performance) => setTemplateInfo({
            ...templateInfo,
            performance
          })} />

          <hr />
          <div>
            <div className="buttons ">
              <Button
                text="Cancel"
                className="bg-white border-grey"
                handleClick={() => setShowForm(false)}
              />
              <Button
                text={`${!!templateInfo._id ? "Update" : "Save"}`}
                className="bg-green border text-white"
                handleClick={!!templateInfo._id ? handleUpdate : handleSubmit}
              />
            </div>
          </div>
        </div>)}
    </div>
  )
}

export default SessionTab