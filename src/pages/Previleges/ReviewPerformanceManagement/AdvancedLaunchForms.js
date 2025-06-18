import SelectInput from "components/Company/SelectInput";
import useGetEmployees from "pages/Objectives/hooks/useGetEmployees";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import TextInput from "components/Company/TextInput";
import { LoadingIndicator } from "utilities";
import TableNormal from "components/TableNormal";
import Select from "react-select";
import more from "assets/svg/More.svg";
import trashIcon from "assets/svg/trashIcon.svg";
import editTableIcon from "assets/svg/editTableIcon.svg";
import { useDispatch } from "react-redux";
import { getAllTemplates } from "action/TemplatesAct";
import paginationFactory from "react-bootstrap-table2-paginator";
import Button from "components/Company/Button";
import {
  createForm,
  deleteForm,
  getAllForms,
  updateForm,
} from "action/AdvancedLaunchFormAct";
import ViewEmployeesPopup from "./ViewEmployeesPopup";

export default function AdvancedLaunchForms() {
  const [templateInfo, setTemplateInfo] = useState({
    formType: "",
    formTemplate: "",
    launchDate: null,
    reviewPeriodStartDate: null,
    reviewPeriodEndDate: null,
    toEmployee: "",
    employeesDetails: [],
    templateName: "",
    formName: "",
    selfAndManager: [],
    peers: [],
  });
  const {
    data: employeeResponse,
    message,
    success,
    isLoading,
  } = useGetEmployees();
  const [empData, setEmpData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEmployees, setShowEmployees] = useState(false);
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [, setSelectedDefault] = useState("");
  const [selectedPeers, setSelectedPeers] = useState("");
  const [defaultEmp, setDefaultEmp] = useState("");
  const [peers, setPeers] = useState([]);
  const formTypes = [
    {
      key: "Advanced Review Management",
      value: "Advanced Review Management",
    },
  ];
  const [formTemplates, setFormTemplates] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading && employeeResponse && employeeResponse.data.length > 0) {
      let employeeData =
        employeeResponse &&
        employeeResponse.data.length > 0 &&
        employeeResponse.data.map((item) => {
          return {
            key:
              item.personalInformation.firstName +
              " " +
              item.personalInformation.lastName,
            label:
              item.personalInformation.firstName +
              " " +
              item.personalInformation.lastName,
            value: item._id,
            role: item.employmentInformation.role,
          };
        });
      setEmpData(employeeData);
    }
  }, [isLoading, employeeResponse]);
  const handleInput = ({ target: { name, value } }) => {
    setTemplateInfo({ ...templateInfo, [name]: value });
  };

  useEffect(() => {
    let peers = empData.filter(
      (item) => item.value !== templateInfo.toEmployee
    );
    let defaults = empData.filter(
      (item) => item.value === templateInfo.toEmployee
    );
    empData.map((item) => {
      if (item.value === templateInfo.toEmployee) {
        let emp = employeeResponse.data.filter((itemchild) => {
          if (itemchild._id === item.value) {
            return true;
          }
        });
        let manager = employeeResponse?.data.filter(
          (item) => emp[0].employmentInformation.lineManager === item._id
        );
        defaults.push({
          key:
            manager[0].personalInformation.firstName +
            " " +
            manager[0].personalInformation.lastName,
          label:
            manager[0].personalInformation.firstName +
            " " +
            manager[0].personalInformation.lastName,
          role: manager[0].employmentInformation.role,
          value: manager[0]._id,
        });
      }
    });
    setPeers(peers);
    setDefaultEmp(defaults);
  }, [templateInfo.toEmployee]);

  const handleEdit = (row) => {
    setTemplateInfo(row);
    setShowForm(true);
    let updatedPeers = row.peers.map((item) => {
      let employee = employeeResponse?.data.filter(
        (itemChild) => itemChild._id === item
      );
      return {
        key:
          employee[0].personalInformation.firstName +
          " " +
          employee[0].personalInformation.lastName,
        label:
          employee[0].personalInformation.firstName +
          " " +
          employee[0].personalInformation.lastName,
        role: employee[0].employmentInformation.role,
        value: item,
      };
    });
    setSelectedPeers(updatedPeers);
  };

  const handleDelete = (id) => {
    setLoading(true);
    let response = dispatch(deleteForm(id));
    response.then(({ success, message, data }) => {
      if (success) {
        getLaunchForms();
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  const getLaunchForms = () => {
    setLoading(true);
    let response = dispatch(getAllForms());
    response.then(({ success, message, data }) => {
      if (success) {
        setData(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  const getTemplates = () => {
    setLoading(true);
    let response = dispatch(getAllTemplates());
    response.then(({ success, message, data }) => {
      if (success) {
        let updatedData = data.map((item) => {
          return {
            key: item.templateName,
            value: item._id,
          };
        });
        setFormTemplates(updatedData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };
  const columns = [
    {
      dataField: "formName",
      text: "Form Name",
      sort: true,
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
      formatter: (cellContent, row) => {
        return <p>{row.formName}</p>;
      },
    },
    {
      dataField: "templateName",
      text: "NAME",
      sort: true,
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
      formatter: (cellContent, row) => {
        return <p>{row.templateName}</p>;
      },
    },
    {
      dataField: "toEmployeeName",
      text: "Employee Name",
      sort: true,
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
      formatter: (cellContent, row) => {
        return <p>{row.toEmployeeName}</p>;
      },
    },
    {
      dataField: "launchDate",
      text: "Launch Date",
      sort: true,
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
      formatter: (cellContent, row) => {
        return <p>{row.launchDate}</p>;
      },
    },
    {
      dataField: "action",
      text: "ACTION",
      formatter: (cellContent, row) => {
        return (
          <div className="d-flex flex-wrap">
            <div className="dropdown actionDropdown">
              <button
                className="dropdown-toggle d-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img src={more} alt={more} style={{ height: 15 }} />
              </button>
              <div
                className="dropdown-menu text-left "
                aria-labelledby="dropdownMenuButton"
              >
                <button
                  className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                  onClick={() => handleEdit(row)}
                >
                  <img src={editTableIcon} alt="edit table icon" />
                  &nbsp;Edit
                </button>
                <button
                  className="btn btn-default dropdown-item text-capitalize text-left justify-content-start"
                  onClick={() => handleDelete(row._id)}
                >
                  <img src={trashIcon} alt="edit table icon" />
                  &nbsp;Delete
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

  const handleSubmit = () => {
    setLoading(true);
    templateInfo.selfAndManager = defaultEmp.map((item) => item.value);
    templateInfo.peers = selectedPeers.map((item) => item.value);
    templateInfo.templateName = formTemplates.filter(
      (item) => item.value === templateInfo.formTemplate
    )[0].key;
    let response = dispatch(createForm(templateInfo));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        getLaunchForms();
        setTemplateInfo({
          formType: "",
          formTemplate: "",
          launchDate: null,
          reviewPeriodStartDate: null,
          reviewPeriodEndDate: null,
          employees: "",
          templateName: "",
          formName: "",
        });
        setShowForm(false);
      } else {
        setLoading(false);
      }
    });
  };

  const handleUpdate = () => {
    setLoading(true);
    let id = templateInfo._id;
    delete templateInfo.__v;
    delete templateInfo.createdAt;
    delete templateInfo.updatedAt;
    delete templateInfo._id;
    templateInfo.selfAndManager = defaultEmp.map((item) => item.value);
    templateInfo.peers = selectedPeers.map((item) => item.value);
    templateInfo.templateName = formTemplates.filter(
      (item) => item.value === templateInfo.formTemplate
    )[0].key;
    console.log("templateInfo", templateInfo);
    let response = dispatch(updateForm(id, templateInfo));
    response.then(({ success, message }) => {
      if (success) {
        setLoading(false);
        getLaunchForms();
        setTemplateInfo({
          formType: "",
          formTemplate: "",
          launchDate: null,
          reviewPeriodStartDate: null,
          reviewPeriodEndDate: null,
          employees: "",
          templateName: "",
        });
        setShowForm(false);
      } else {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getTemplates();
    getLaunchForms();
  }, []);
  const filterData = (data) => {
    let filterData = data.filter((item) => {
      if (searchKey) {
        return (
          item.formName.toLowerCase().includes(searchKey.toLowerCase()) ||
          item.templateName.toLowerCase().includes(searchKey.toLowerCase()) ||
          item.toEmployeeName.toLowerCase().includes(searchKey.toLowerCase())
        );
      } else {
        return item;
      }
    });
    return filterData;
  };
  return (
    <div className="p-4">
      <h5>Advanced Launch Forms</h5>
      <div className="m-0 p-0 mt-3 col-12 d-flex align-items-center">
        <TextInput
          label="Launch Form Name"
          name="searchKey"
          value={searchKey}
          onChangeText={(e) => setSearchKey(e.target.value)}
          className="form-control custom-input" // Custom class for consistent styling
        />

        <Button
          text="Create"
          className="bg-green border text-white"
          handleClick={() => setShowForm(!showForm)}
        />
      </div>

      {loading ? (
        <div className="text-center">
          <LoadingIndicator size={3} />
        </div>
      ) : (
        !showForm && (
          <TableNormal
            data={filterData(data)}
            columns={columns}
            paginationFactory={paginationFactory}
            searchKey={searchKey}
            selectRow={selectRow}
            keyField="_id"
          />
        )
      )}

      {showForm && (
        <div className="mt-2">
          <div className="row">
            <p className="col-sm-12 col-md-3">Form Name:</p>
            <div className="col-9">
              <TextInput
                label=""
                placeholder="Enter Form Name"
                name="formName"
                value={templateInfo.formName}
                onChangeText={handleInput}
                className="form-control custom-input"
              />
            </div>
          </div>

          <div className="row">
            <p className="col-sm-12 col-md-3">Form Type:</p>
            <div className="col-9">
              <SelectInput
                placeholder="Please select a form type..."
                name="formType"
                options={formTypes}
                value={templateInfo.formType}
                onChangeText={handleInput}
                //  className="form-control custom-input"
              />
            </div>
          </div>

          <div className="row">
            <p className="col-sm-12 col-md-3">Form Template:</p>
            <div className="col-9">
              <SelectInput
                placeholder="Please select a form template..."
                name="formTemplate"
                options={formTemplates}
                value={templateInfo.formTemplate}
                onChangeText={handleInput}
                // className="form-control custom-input"
              />
            </div>
          </div>

          <div className="row">
            <p className="col-sm-12 col-md-3">Launch Date:</p>
            <div className="col-9">
              <TextInput
                label=""
                placeholder="Enter Launch Date"
                name="launchDate"
                dateType={"date"}
                value={templateInfo.launchDate}
                onChangeText={handleInput}
                className="form-control custom-input"
              />
            </div>
          </div>

          <div className="row">
            <p className="col-sm-12 col-md-3">Review Period Start Date:</p>
            <div className="col-9">
              <TextInput
                label=""
                placeholder="Enter Start Date"
                name="reviewPeriodStartDate"
                value={templateInfo.reviewPeriodStartDate}
                onChangeText={handleInput}
                dateType={"date"}
                className="form-control custom-input"
              />
            </div>
          </div>

          <div className="row">
            <p className="col-sm-12 col-md-3">Review Period End Date:</p>
            <div className="col-9">
              <TextInput
                label=""
                placeholder="Enter End Date"
                name="reviewPeriodEndDate"
                value={templateInfo.reviewPeriodEndDate}
                onChangeText={handleInput}
                dateType={"date"}
                className="form-control custom-input"
              />
            </div>
          </div>

          <div className="row">
            <p className="col-sm-12 col-md-3">To Employee:</p>
            <div className="col-9">
              <SelectInput
                placeholder="Please select a form template..."
                name="toEmployee"
                options={empData}
                value={templateInfo.toEmployee}
                onChangeText={handleInput}
              />
              <a
                href={null}
                className="link cursor-pointer usersList"
                onClick={() => setShowEmployees(!showEmployees)}
              >
                {templateInfo.employeesGroup
                  ? templateInfo.employeesDetails.length
                  : ""}
              </a>
            </div>
          </div>

          <div className="row">
            <p className="col-sm-12 col-md-3">Self and Manager:</p>
            <div className="col-9" sx={{ mt: "10px" }}>
              <SelectInput
                options={defaultEmp}
                isMulti={true}
                value={defaultEmp}
                placeholder="select..."
                className="mt-3 mb-3 "
                onChange={(option) => {
                  if (option) {
                    setSelectedDefault(option);
                  } else {
                    setSelectedDefault([]);
                  }
                }}
              />
            </div>
          </div>

          <div className="row">
            <p className="col-sm-12 col-md-3">Peers:</p>
            <div className="col-9">
              <SelectInput
                options={peers}
                isMulti={true}
                value={selectedPeers}
                placeholder="select..."
                onChange={(option) => {
                  if (option) {
                    setSelectedPeers(option);
                  } else {
                    setSelectedPeers([]);
                  }
                }}
              />
            </div>
          </div>

          <hr />

          <div>
            <div className="buttons">
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

      {showEmployees && (
        <ViewEmployeesPopup
          employees={templateInfo.employeesDetails}
          show={showEmployees}
          onHide={() => setShowEmployees(!showEmployees)}
        />
      )}
    </div>
  );
}
