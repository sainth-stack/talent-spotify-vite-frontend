import SelectInput from 'components/Company/SelectInput';
import useGetEmployees from 'pages/Objectives/hooks/useGetEmployees';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import TextInput from 'components/Company/TextInput';
import { LoadingIndicator } from 'utilities';
import TableNormal from 'components/TableNormal';
import more from 'assets/svg/More.svg';
import trashIcon from "assets/svg/trashIcon.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";
import { useDispatch } from 'react-redux';
import { deleteTemplate, getAllTemplates, createTemplate, updateTemplate } from 'action/TemplatesAct';
import paginationFactory from "react-bootstrap-table2-paginator";
import Button from 'components/Company/Button';
import { getRatingScales } from 'action/RatingScaleAct';

export default function Templates() {
  let companyObj = {
    fromEmployeeName: "",
    toEmployeeName: "",
    role: "",
    employeeName: ""
  };
  const [companyInfo, setCompanyInfo] = useState(companyObj);
  const [templateInfo, setTemplateInfo] = useState({
    templateName: "",
    description: "",
    displayOptions: [
      {
        key: "First Name",
        value: "firstName",
        isChecked: true,
      },
      {
        key: "Last Name",
        value: "lastName",
        isChecked: true,
      },
      {
        key: "Department",
        value: "department",
        isChecked: false,
      },
      {
        key: "Grade",
        value: "grade",
        isChecked: false,
      },
      {
        key: "Manager",
        value: "manager",
        isChecked: false,
      },
      {
        key: "Designation",
        value: "designation",
        isChecked: false,
      },
    ],

    displaySteps: [
      {
        key: "Self Submission (Employee)",
        value: "Submit",
        isChecked: true,
        text:''
      },
      {
        key: "Manager Review (Manager,HR)",
        value: "Manager Review",
        isChecked: true,
        text:'Submit to Manager'
      },
      {
        key: "HR Review (HR)",
        value: "HR Review",
        isChecked: true,
        text:'Submit to HR'
      },
      {
        key: "Manager SignOff",
        value: "Manager SignOff",
        isChecked: true,
        text:'Submit to Manager SignOff'
      },
      {
        key: "Employee SignOff",
        value: "Employee SignOff",
        isChecked: true,
        text:'Submit to Employee Sign Off'
      },
      {
        key: "Completed",
        value: "Completed",
        isChecked: true,
        text:'Sign Off To Complete'
      },
    ],
    percentageType: 'goal',
    ratingScale: "",
    goalPercentage: "",
    competenciesPercentage: "",
  });
  const { data: employeeResponse, message, success, isLoading } = useGetEmployees();
  const [empData, setEmpData] = useState([]);
  const [showOKRs, setShowOkrs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([])
  const [ratingScales, setRatingScales] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading && employeeResponse && employeeResponse.data.length > 0) {
      let employeeData = employeeResponse && employeeResponse.data.length > 0 && employeeResponse.data.map((item) => {
        return {
          key:
            item.personalInformation.firstName +
            " " +
            item.personalInformation.lastName,
          value: item._id,
          role: item.employmentInformation.role
        };
      });
      setEmpData(employeeData);
    }
  }, [isLoading, employeeResponse])


  useEffect(() => {
    const filterData = data.filter((item) => item.templateName.includes(searchKey))
    setFilterData(filterData)
  }, [searchKey])


  const handleChange = (e) => {
    setCompanyInfo({ ...companyInfo, [e.target.name]: e.target.value, role: empData.filter(item => e.target.name === "fromEmployeeName" && item.value === e.target.value).length > 0 ? empData.filter(item => e.target.name === "fromEmployeeName" && item.value === e.target.value)[0].role : companyInfo.role, employeeName: empData.filter(item => e.target.name === "toEmployeeName" && item.value === e.target.value).length > 0 ? empData.filter(item => e.target.name === "toEmployeeName" && item.value === e.target.value)[0].key : companyInfo.employeeName });
    setShowOkrs(false);
  };
  const handleInput = ({ target: { name, value } }) => {
    setTemplateInfo({ ...templateInfo, [name]: value });
  }

  const handleEdit = (row) => {
    setTemplateInfo(row);
    setShowForm(true);
  }


  const handleDelete = (id) => {
    setLoading(true);
    let response = dispatch(deleteTemplate(id));
    response.then(({ success, message, data }) => {
      if (success) {
        getTemplates();
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }

  const getTemplates = () => {
    setLoading(true);
    let response = dispatch(getAllTemplates());
    response.then(({ success, message, data }) => {
      if (success) {
        setData(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }
  const getRatingScalesAll = () => {
    setLoading(true);
    let response = dispatch(getRatingScales());
    response.then(({ success, message, data }) => {
      if (success) {
        const updatedRatingScales = [{ key: data[0]?.ratingScale.name + " (" + data[0]?.ratingScale?.ratingScaleTemplate + ") ", value: data[0]?._id }]
        setRatingScales(updatedRatingScales);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }

  const columns = [
    {
      dataField: "templateName",
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
            {row.templateName}
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

  const handleSubmit = () => {
    setLoading(true);
    let response = dispatch(createTemplate({ ...templateInfo, }));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        getTemplates();
        setTemplateInfo({
          templateName: "", description: "",
          displayOptions: [],
          displaySteps:[],
          ratingScale: "",
          goalPercentage: "",
          competenciesPercentage: "",
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
    let response = dispatch(updateTemplate(id, templateInfo));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        getTemplates();
        setTemplateInfo({
          templateName: "", description: "",
          displayOptions: [],
          displaySteps:[],
          ratingScale: "",
          goalPercentage: "",
          competenciesPercentage: "",
        })
        setShowForm(false);
      } else {
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    getTemplates();
    getRatingScalesAll();
  }, [])
  const handleCheckbox = (e) => {
    let displayOptions = [...templateInfo.displayOptions];
    let index = displayOptions.findIndex(item => item.value === e.target.name);
    displayOptions[index].isChecked = !displayOptions[index].isChecked;
    setTemplateInfo({ ...templateInfo, displayOptions: displayOptions });
  }
  const handleCheckboxSteps = (e) => {
    let displayOptions = [...templateInfo.displaySteps];
    let index = displayOptions.findIndex(item => item.value === e.target.name);
    displayOptions[index].isChecked = !displayOptions[index].isChecked;
    console.log(displayOptions)
    setTemplateInfo({ ...templateInfo, displaySteps: displayOptions });
  }
  return (
    <div className='p-4'>
      <h5>Templates</h5>
      <div className="mt-3 col-6 d-flex align-items-center">
        <TextInput label="Template Name" name="searchKey"
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
          data={searchKey != '' ? filterData : data}
          columns={columns}
          paginationFactory={paginationFactory}
          searchKey={searchKey}
          selectRow={selectRow}
          keyField="_id"
        />}

      {showForm && (
        <div className='mt-2'>
          <TextInput
            label="Template Name"
            placeholder="Enter Template Name"
            name="templateName"
            value={templateInfo.templateName}
            onChangeText={handleInput}
          />
          <br />
          <TextInput
            label="Description"
            placeholder="Enter Description"
            name="description"
            value={templateInfo.description}
            onChangeText={handleInput}
          />
          <br />

          <SelectInput
            label="Rating Scale"
            placeholder="Enter Rating Scale"
            name="ratingScale"
            options={ratingScales}
            value={templateInfo.ratingScale}
            onChangeText={handleInput}
          />
          <br />
          <div className='d-flex'>
            <label className={`label fs13 col-md-4 col-xs-12 col-sm-12`}>Percentage type</label>
            <div className="ml-4 d-flex" >
              <div>
                <input className="mr-2" type="radio" id="age1" name="percentageType" value="goal" onChange={handleInput} checked={templateInfo.percentageType === "goal"} />
                <label for="age1">Goals</label>
              </div>
              <div>
                <input className="ml-5 mr-2" type="radio" id="age2" name="percentageType" value="objective" onChange={handleInput} checked={templateInfo.percentageType === "objective"} />
                <label for="age2">Objectives</label>
              </div>
            </div>
          </div>

          <br />
          {templateInfo.percentageType === 'goal' ? <TextInput
            label="Goal Percentage"
            placeholder="Enter Goal Percentage"
            name="goalPercentage"
            value={templateInfo.goalPercentage}
            onChangeText={handleInput}
            dateType="number"
          /> : <TextInput
            label="Objective Percentage"
            placeholder="Enter Objective Percentage"
            name="goalPercentage"
            value={templateInfo.goalPercentage}
            onChangeText={handleInput}
            dateType="number"
          />}
          <br />
          <TextInput
            label="Competencies Percentage"
            placeholder="Enter Competencies Percentage"
            name="competenciesPercentage"
            value={templateInfo.competenciesPercentage}
            onChangeText={handleInput}
            dateType="number"
          />
          <br />
          <div className='m-3 d-flex'>
            <label className='label fs13 col-md-4' style={{display:'flex',justifyContent:'start',paddingLeft:'0px'}}>Review Steps:</label>
            <div className='d-flex ml-4' style={{gap:'10px',flexDirection:'column'}}>
            {templateInfo.displaySteps.length > 0 && templateInfo.displaySteps.map((option, index) => (
              <div>
                <input type="checkbox" name={option.value} value={option.isChecked} checked={option.isChecked} onChange={handleCheckboxSteps} /> {option.key}
              </div>
            ))}
            </div>
          </div>
          <div className='m-3 d-flex mt-5'>
            <label className='label fs13 col-md-4' style={{display:'flex',justifyContent:'start',paddingLeft:'0px'}}>Employee Display Options::</label>
           <div className='d-flex ml-4' style={{gap:'10px',flexDirection:'column'}}>
           {templateInfo.displayOptions.length > 0 && templateInfo.displayOptions.map((option, index) => (
              <div>
                <input type="checkbox" name={option.value} value={option.isChecked} checked={option.isChecked} onChange={handleCheckbox} /> {option.key}
              </div>
            ))}
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
                text={`${!!templateInfo._id ? "Update" : "Save"}`}
                className="bg-green border text-white"
                handleClick={!!templateInfo._id ? handleUpdate : handleSubmit}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
