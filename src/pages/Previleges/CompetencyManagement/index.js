import React, { useState } from "react";
import TitleHeader from "components/TitleHeader";
import Button from "components/Company/Button";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import plusicon from "../../../assets/svg/plus.svg";
import Delete from "assets/svg/delete-green.svg";
import question from "../../../assets/svg/questionm.svg";
import paginationFactory from "react-bootstrap-table2-paginator";
import trashIcon from "assets/svg/trashIcon.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";
import more from 'assets/svg/More.svg';
import "./index.scss";
import { useDispatch } from "react-redux";
import { createCompetency, deleteCompetency, getAllCompetencies, updateCompetency } from "action/CompetencyAct";
import { useEffect } from "react";
import { LoadingIndicator } from "utilities";
import TableNormal from "components/TableNormal";
const PerformanceManagement = () => {
  const opt1 = [{ key: "Supervisor", value: "Supervisor" }, { key: "Mid Management", value: "Mid Management" }, { key: "Executive Management", value: "Executive Management" }]
  const opt2 = [{ key: "Behavioural", value: "Behavioural" }, { key: "Functional", value: "Functional" }]
  const opt3 = [{ key: "Department Head", value: "Department Head" }, { key: "HR", value: "HR" }, { key: "Adhoc User", value: "Adhoc User" }];
  const [competencyForm, setCompetencyForm] = useState({
    competencyName: "",
    description: "",
    startDate: null,
    endDate: null,
    competencyType: "",
    developmentActivities: [""],
    coachingActivities: [""],
    categoryActivities: "",
  })
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompetencyForm({ ...competencyForm, [name]: value });
  };
  const handleActivities = (e, index, name) => {
    const { value } = e.target;
    const list = [...competencyForm[name]];
    list[index] = value;
    setCompetencyForm({ ...competencyForm, [name]: list });
  }

  const handleSubmit = () => {
    setLoading(true);
    let response = dispatch(createCompetency(competencyForm));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        getCompetencies();
        setCompetencyForm({
          competencyName: "",
          description: "",
          startDate: null,
          endDate: null,
          competencyType: "",
          developmentActivities: [""],
          coachingActivities: [""],
          categoryActivities: "",
        })
        setShowForm(false);
      } else {
        setLoading(false);
      }
    });
  }
  const handleUpdate = () => {
    setLoading(true);
    let id = competencyForm._id;
    delete competencyForm.__v;
    delete competencyForm.createdAt;
    delete competencyForm.updatedAt;
    delete competencyForm._id;
    competencyForm.startDate = window.moment(competencyForm.startDate).format("YYYY-MM-DD");
    competencyForm.endDate = window.moment(competencyForm.endDate).format("YYYY-MM-DD");
    let response = dispatch(updateCompetency(id, competencyForm));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        getCompetencies();
        setCompetencyForm({
          competencyName: "",
          description: "",
          startDate: null,
          endDate: null,
          competencyType: "",
          developmentActivities: [""],
          coachingActivities: [""],
          categoryActivities: "",
        })
        setShowForm(false);
      } else {
        setLoading(false);
      }
    });
  }
  const getCompetencies = () => {
    setLoading(true);
    let response = dispatch(getAllCompetencies());
    response.then(({ success, message, data }) => {
      if (success) {
        let updatedData = data.map((item, index) => {
          return {
            ...item,
            startDate: window.moment(item.startDate).format("YYYY-MM-DD"),
            endDate: window.moment(item.endDate).format("YYYY-MM-DD"),
          }
        })
        setData(updatedData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }
  const handleDelete = (id) => {
    setLoading(true);
    let response = dispatch(deleteCompetency(id));
    response.then(({ success, message, data }) => {
      if (success) {
        getCompetencies();
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }
  useEffect(() => {
    getCompetencies();
  }, [])

  const handleEdit = (row) => {
    setCompetencyForm(row);
    setShowForm(true);
  }

  const columns = [
    {
      dataField: "competencyName",
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
          <p>
            {row.competencyName}
          </p>
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

  return (
    <>
      <TitleHeader name="Admin Portal - Privileges " />
      <div className="bg-light-primary rounded-12 mh-100 p-4 m-4">
        <p className="title text-dark font-weight-bold pb20">
          Competency Management
        </p>
        <div className="company-form">
          <div className="mt-3 col-6 d-flex align-items-center">
            <TextInput label="Competency Name" name="searchKey"
              value={searchKey}
              onChangeText={setSearchKey}
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
              keyField="_id"
              columns={columns}
              paginationFactory={paginationFactory}
              searchKey={searchKey}
              selectRow={selectRow}
            />}
          {showForm && (
            <>
              <div className="container">

                <div className="mt-3 col-6">
                  <TextInput label="Competency Name" name="competencyName"
                    value={competencyForm.competencyName}
                    onChangeText={handleChange}
                    className=" form-control" />
                </div>
                <div className="mt-3 col-6">
                  <TextInput label="Description" name="description"
                    value={competencyForm.description}
                    onChangeText={handleChange} className=" form-control" />
                </div>
                <div class="container m-3">
                  <div class="row mt-4 d-flex justify-content-between">
                    <div className="col-5  ">
                      Start Date
                      <input type="date" className="date" name="startDate"
                        value={competencyForm.startDate}
                        onChange={handleChange}></input>
                      <img src={question} className="pl-3" />
                    </div>
                    <div className="col-5 ">
                      End Date
                      <input type="date" className="date" name="endDate"
                        value={competencyForm.endDate}
                        onChange={handleChange}></input>
                      <img src={question} className="pl-3" />

                    </div>

                  </div>
                </div>
                <div className="col-6  p-0 m-3">

                  <SelectInput options={opt2} label="Competency Type" name="competencyType"
                    value={competencyForm.competencyType}
                    onChangeText={handleChange} style={{ width: "20px", paddingLeft: 0 }} />
                </div>

                <div className="row mt-4 m-3">
                  {competencyForm.developmentActivities.map((item, index) => (
                    <>
                      <div className="col-6 p-0">
                        <TextInput label="Development Activities" name="developmentActivities" value={item} onChangeText={(e) => handleActivities(e, index, "developmentActivities")} className=" form-control" />

                      </div>{" "}
                      <div class="col-2">
                        <img src={plusicon} onClick={() => {
                          const list = [...competencyForm.developmentActivities];
                          list.push("");
                          setCompetencyForm({ ...competencyForm, developmentActivities: list });
                        }} />
                        {competencyForm.developmentActivities.length !== 1 && <img src={Delete} onClick={() => {
                          const list = [...competencyForm.developmentActivities];
                          list.splice(index, 1);
                          setCompetencyForm({ ...competencyForm, developmentActivities: list });
                        }} />}
                      </div>
                    </>
                  ))}
                </div>
                <div className="row mt-4 m-3">
                  {competencyForm.coachingActivities.map((item, index) => (
                    <>
                      <div className="col-6 p-0">
                        <TextInput options={opt3} label="Coaching Activities" value={item} name="coachingActivities" onChangeText={(e) => handleActivities(e, index, "coachingActivities")} className=" form-control" />

                      </div>{" "}
                      <div class="col-2">
                        <img src={plusicon} onClick={() => {
                          const list = [...competencyForm.coachingActivities];
                          list.push("");
                          setCompetencyForm({ ...competencyForm, coachingActivities: list });
                        }} />
                        {competencyForm.coachingActivities.length !== 1 && <img src={Delete} onClick={() => {
                          const list = [...competencyForm.coachingActivities];
                          list.splice(index, 1);
                          setCompetencyForm({ ...competencyForm, coachingActivities: list });
                        }} />}
                      </div>
                    </>
                  ))}
                </div>
                <div className="row mt-3 m-3">
                  <div className="col-6  p-0">

                    <SelectInput options={opt1} label="Category Activities" name="categoryActivities"
                      value={competencyForm.categoryActivities}
                      onChangeText={handleChange} style={{ width: "20px", paddingLeft: 0 }} />
                  </div>
                </div>
              </div>
              <hr />
              <div>
                <div className="buttons ">
                  <Button
                    text="Cancel"
                    className="bg-white border-grey"
                    handleClick={() => setShowForm(false)}
                  />
                  <Button
                    text={`${!!competencyForm._id ? "Update" : "Save"}`}
                    className="bg-green border text-white"
                    handleClick={!!competencyForm._id ? handleUpdate : handleSubmit}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PerformanceManagement;
