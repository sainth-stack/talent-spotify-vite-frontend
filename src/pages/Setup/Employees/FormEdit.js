import React, { useState, useEffect } from "react";
import TitleHeader from "components/TitleHeader";
import "./styles.scss";
import Text from "components/Company/Text";
import HorizontalBar from "components/Company/HorizontalBar";
import TextInput from "components/Company/TextInput";
import SelectInput from "components/Company/SelectInput";
import CheckboxInput from "components/Company/CheckboxInput";
import Button from "components/Company/Button";
import { useDispatch } from "react-redux";
import {
  countriesNames,
  genders,
  getRandom,
  jobCategories,
  loginMethods,
  removeDuplicates,
  statusesActive,
} from "utilities";
import { Col, Row } from "react-bootstrap";
import { Validator } from "utilities";
import { getEmployeesAll, updateEmployee } from "action/EmployeeAct";
import { Link, useHistory } from "react-router-dom";
import { getEntities } from "action/EntityAct";
import { getDepartmentsData } from "action/DepartmentAct";
import { getDesignations } from "action/DesignationAct";
import { getAllPrivileges } from "action/PrivilegesAct";
import maleIcon from "assets/images/male.png";
import femaleIcon from "assets/images/female.png";

import { getGrades } from "action/GradeAct";
import { removeQueries } from "pages/Objectives/hooks/useGetEmployees";
import { useTranslation } from "react-i18next";

export const tableGenerator = (data, length) => {
  const items = [];
  for (let i = 0; i < length; i++) {
    items.push({
      id: i + 1,
      _id: data[i]._id,
      companyEntityName: data[i].companyEntityName,
      industry: data[i].industry,
      legalEntityName: data[i].legalEntityName,
      status: data[i].status,
      country: data[i].country,
    });
  }
  return items;
};

const maritalStatuses = [
  { key: "Single", value: "Single" },
  { key: "Married", value: "Married" },
  { key: "Divorced", value: "Divorced" },
  { key: "Widowed", value: "Widowed" },
];

const highestEducationLevels = [
  { key: "High School", value: "High School" },
  { key: "Diploma", value: "Diploma" },
  { key: "Bachelor's Degree", value: "Bachelor's Degree" },
  { key: "Master's Degree", value: "Master's Degree" },
  { key: "Doctorate", value: "Doctorate" },
];

export default function FormEdit(props) {
  const { state } = props.location;
  const validator = Validator();
  const dispatch = useDispatch();
  let personalInformation = {
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: null,
    profilePicture: maleIcon,
    maritalStatus: "",
    highestEducationLevel: "",
    religion: "",
    homeAddress: "",
  };
  let contactInformation = {
    email: "",
    loginMethod: "",
    mobileNumber: "",
    whatsappNumber: "",
    isSameWhatsapp: false,
    workEmail: "",
  };
  let employmentInformation = {
    hireDate: null,
    employeeNumber: "",
    status: "",
    inactiveDate: null,
    legalEntity: "",
    department: "",
    location: "",
    lineManager: "",
    jobCategory: "",
    role: "",
    designation: "",
    grade: "",
    departmentHead: "No",
  };
  const [formData, setFormData] = useState({
    personalInformation: {
      ...personalInformation,
      ...state.data.personalInformation,
    },
    contactInformation: {
      ...contactInformation,
      ...state.data.contactInformation,
    },
    employmentInformation: {
      ...employmentInformation,
      ...state.data.employmentInformation,
      departmentHead:
        state.data.employmentInformation.departmentHead === "Yes"
          ? true
          : false,
    },
  });
  const [, setLoading] = useState(false);
  const [, setError] = useState(false);
  const [, forceUpdate] = useState(false);
  const [, setData] = useState([]);
  const [style3] = useState(150);
  const [style2] = useState(140);
  const [legalEntities, setLegalEntities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [grades, setGrades] = useState([]);
  const [lineManagers, setLineManagers] = useState([]);
  const [roles, setRoles] = useState([]);
  const history = useHistory();

  const [checkStyle] = useState({
    width: 300,
    mt: 10,
    ml: 20,
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [countryCode2, setCountryCode2] = useState("+91");
  const handleChange = ({ target: { name, value } }, objectName) => {
    let updatedData = { ...formData };
    updatedData[objectName][name] = value;
    setFormData(updatedData);
    setError("");
  };

  const handleChangePicture = (e) => {
    let originalFileName = e.target.files[0].name;
    let fileName = originalFileName.split(".")[0] + "_" + getRandom(9);
    const data = new FormData();
    data.append("file", e.target.files[0]);
    data.append("upload_preset", "ma7nge92");
    data.append("public_id", "talentspotifypics/" + fileName);
    fetch("https://api.cloudinary.com/v1_1/dbqm9svvp/image/upload", {
      method: "post",
      body: data,
    })
      .then((responce) => responce.json())
      .then((data) => {
        handleChange(
          { target: { name: "profilePicture", value: data.url } },
          "personalInformation"
        );
      })
      .catch((err) => console.log(err));
  };

  const getPrivilegesDataRefresh = () => {
    try {
      let response = dispatch(getAllPrivileges());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let nonduplicate = removeDuplicates(data, "role");
          let updatedData = nonduplicate.map((item) => {
            return { key: item.role, value: item.role };
          });
          setRoles(updatedData);
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

  const fetchEntities = () => {
    try {
      setLoading(true);
      let response = dispatch(getEntities());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = data
            .filter((item) => item.status === "Active")
            .map((item) => {
              return { key: item.legalEntityName, value: item.legalEntityName };
            });
          let nonduplicates = removeDuplicates(result, "value");
          setLegalEntities(nonduplicates);
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
  const fetchDepartments = () => {
    try {
      setLoading(true);
      let response = dispatch(getDepartmentsData());
      response.then(({ data, message }) => {
        if (
          data !== undefined &&
          data.length > 0 &&
          data[0].departments.length > 0
        ) {
          let result = data[0].departments
            .filter((item) => item.status === "Active")
            .map((item) => {
              return { key: item.departmentName, value: item.departmentName };
            });
          let nonduplicates = removeDuplicates(result, "value");
          setDepartments(nonduplicates);
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

  const fetchDesignations = () => {
    try {
      setLoading(true);
      let response = dispatch(getDesignations());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = data
            .filter((item) => item.status === "Active")
            .map((item) => {
              return { key: item.designationName, value: item.designationName };
            });
          let nonduplicates = removeDuplicates(result, "value");
          setDesignations(nonduplicates);
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

  const fetchGrades = () => {
    try {
      setLoading(true);
      let response = dispatch(getGrades());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let result = data
            .filter((item) => item.status === "Active")
            .map((item) => {
              return { key: item.gradeName, value: item.gradeName };
            });
          let nonduplicates = removeDuplicates(result, "value");
          setGrades(nonduplicates);
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
  const handleSave = () => {
    if (validator.current.allValid()) {
      try {
        let response = dispatch(
          updateEmployee(state.data._id, {
            ...formData,
            employmentInformation: {
              ...formData.employmentInformation,
              departmentHead: formData.employmentInformation.departmentHead
                ? "Yes"
                : "No",
            },
          })
        );
        response.then(({ success, message }) => {
          setLoading(true);
          if (success) {
            setLoading(false);
            setError("");
            setFormData({
              personalInformation,
              contactInformation,
              employmentInformation,
            });
            removeQueries();
            history.push("/admin/setups/employees");
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
    }
  };

  const fetchEmployees = () => {
    try {
      setLoading(true);
      let response = dispatch(getEmployeesAll());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0) {
          let activeEmployees = data.filter(
            (item) => item.employmentInformation.status === "Active"
          );
          setData(activeEmployees);
          const lineManagers2 = activeEmployees.map((item) => {
            return {
              key:
                item.personalInformation.firstName +
                " " +
                item.personalInformation.lastName,
              value: item._id,
            };
          });
          lineManagers2.push({ key: "None", value: "" });
          let nonduplicates = removeDuplicates(lineManagers2, "key");
          setLineManagers(nonduplicates);
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
    fetchEntities();
    fetchDepartments();
    fetchDesignations();
    fetchGrades();
    fetchEmployees();
    getPrivilegesDataRefresh();
    //eslint-disable-next-line
  }, []);

  const { t } = useTranslation();
  return (
    <>
      <TitleHeader name="Admin Portal - Dashboard" />
      <div className="bg-white rounded mh-100 p-4 m-4">
        <p className="title text-dark font-weight-bold pb20">Employees Setup</p>
        <div className="company-form">
          <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#837F39" }} text="PERSONAL INFORMATION" />
          <img
            src={
              formData.personalInformation.profilePicture
                ? formData.personalInformation.profilePicture
                : formData.personalInformation.gender === "Male"
                ? maleIcon
                : femaleIcon
            }
            className="profilelogo"
            alt=""
          />
          <input
            type="file"
            id="choosefile"
            className="d-none"
            onChange={handleChangePicture}
          />
          <div className="p-relative">
            <label htmlFor="choosefile">
              <i className="fa fa-pencil editpencil" />
            </label>
          </div>
          <Row className="mt-2 mb-2 p-2">
            <Col>
              <TextInput
                label="First Name*"
                name="firstName"
                value={formData.personalInformation.firstName}
                style={style3}
                onChangeText={(e) => handleChange(e, "personalInformation")}
              />
            </Col>

            <Col>
              <TextInput
                label="Last Name*"
                name="lastName"
                value={formData.personalInformation.lastName}
                style={style3}
                onChangeText={(e) => handleChange(e, "personalInformation")}
              />
            </Col>
          </Row>

          <Row className="mt-2 mb-2 p-2">
            <Col>
              <SelectInput
                label="Gender"
                placeholder="--Select--"
                name="gender"
                style={style3}
                options={genders}
                value={formData.personalInformation.gender}
                onChangeText={(e) => handleChange(e, "personalInformation")}
              />
            </Col>

            <Col>
              <TextInput
                label="Date of Birth*"
                dateType="date"
                name="dateOfBirth"
                value={window
                  .moment(formData.personalInformation.dateOfBirth)
                  .format("YYYY-MM-DD")}
                style={style3}
                onChangeText={(e) => handleChange(e, "personalInformation")}
              />
            </Col>
          </Row>
          <Row className="mt-2 mb-2 p-2">
            <Col>
              <SelectInput
                label="Marital Status"
                placeholder="--Select--"
                name="maritalStatus"
                style={style3}
                options={maritalStatuses}
                value={formData.personalInformation.maritalStatus}
                onChangeText={(e) => handleChange(e, "personalInformation")}
              />
            </Col>
            <Col>
              <SelectInput
                label="Highest Education Level"
                placeholder="--Select--"
                name="highestEducationLevel"
                style={style3}
                options={highestEducationLevels}
                value={formData.personalInformation.highestEducationLevel}
                onChangeText={(e) => handleChange(e, "personalInformation")}
              />
            </Col>
            <Col>
              <TextInput
                label="Religion"
                name="religion"
                value={formData.personalInformation.religion}
                style={style3}
                onChangeText={(e) => handleChange(e, "personalInformation")}
              />
            </Col>
          </Row>
          <Row className="mt-2 mb-2 p-2">
            <Col>
              <TextInput
                label="Home Address"
                name="homeAddress"
                value={formData.personalInformation.homeAddress}
                onChangeText={(e) => handleChange(e, "personalInformation")}
              />
            </Col>
            <Col></Col>
            <Col></Col>
          </Row>
          <HorizontalBar className="pt-3 pb-3" />
          <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#837F39" }} text="CONTACT INFORAMTION" />
          <div>
            <Row className="mt-2 mb-2 p-2">
              <Col>
                <TextInput
                  label="Email Address*"
                  name="email"
                  dateType="email"
                  value={formData.contactInformation.email}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
              <Col>
                <SelectInput
                  label="Login Method*"
                  placeholder="--Select--"
                  name="loginMethod"
                  options={loginMethods}
                  value={formData.contactInformation.loginMethod}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>
            <Row className="mt-3 mb-3 p-2">
              <Col>
                <TextInput
                  label="Mobile No*"
                  name="mobileNumber"
                  dateType="number"
                  isCountry={true}
                  countryCode={countryCode}
                  onChangeCountry={(e) => setCountryCode(e.target.value)}
                  value={formData.contactInformation.mobileNumber}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
              <Col>
                <TextInput
                  label="Whatsapp No*"
                  name="whatsappNumber"
                  dateType="number"
                  isCountry={true}
                  countryCode={countryCode2}
                  onChangeCountry={(e) => setCountryCode2(e.target.value)}
                  value={formData.contactInformation.whatsappNumber}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
            </Row>
            <Row className="mt-3 mb-3 p-2">
              <Col>
                <CheckboxInput
                  className="checkBox"
                  label="Same as Whatsapp No"
                  name="isSameWhatsapp"
                  value={formData.contactInformation.isSameWhatsapp}
                  style={checkStyle}
                  onChangeText={(e) => {
                    handleChange(e, "contactInformation");
                    if (e.target.value) {
                      handleChange(
                        {
                          target: {
                            name: "whatsappNumber",
                            value: formData.contactInformation.mobileNumber,
                          },
                        },
                        "contactInformation"
                      );
                      setCountryCode2(countryCode);
                    }
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <TextInput
                  label="Work Email"
                  name="workEmail"
                  dateType="email"
                  value={formData.contactInformation.workEmail}
                  onChangeText={(e) => handleChange(e, "contactInformation")}
                />
              </Col>
              <Col></Col>
            </Row>
          </div>
          <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#837F39" }} text="EMPLOYMENT INFORMATION" />
          <Row className="mt-2 mb-2 p-2">
            <Col>
              <TextInput
                label="Hire Date*"
                dateType="date"
                name="hireDate"
                value={window
                  .moment(formData.employmentInformation.hireDate)
                  .format("YYYY-MM-DD")}
                style={style3}
                onChangeText={(e) => handleChange(e, "employmentInformation")}
              />
            </Col>

            <Col>
              <TextInput
                label="Employee No*"
                name="employeeNumber"
                value={formData.employmentInformation.employeeNumber}
                style={style2}
                onChangeText={(e) => handleChange(e, "employmentInformation")}
              />
            </Col>
            <Col>
              <SelectInput
                label={t("Tasks.Status")}
                placeholder="--Select--"
                name="status"
                style={style2}
                options={statusesActive}
                value={formData.employmentInformation.status}
                onChangeText={(e) => {
                  handleChange(e, "employmentInformation");
                  handleChange(
                    { target: { name: "inactiveDate", value: null } },
                    "employmentInformation"
                  );
                }}
              />
            </Col>
          </Row>
          <Row className="mt-2 mb-2 p-2">
            <Col>
              <TextInput
                label="Inactive Date"
                dateType="date"
                name="inactiveDate"
                value={window
                  .moment(formData.employmentInformation.inactiveDate)
                  .format("YYYY-MM-DD")}
                style={style3}
                disabled={formData.employmentInformation.status !== "Inactive"}
                onChangeText={(e) => handleChange(e, "employmentInformation")}
              />
            </Col>

            <Col>
              <SelectInput
                label="Legal Entity"
                placeholder="--Select--"
                name="legalEntity"
                style={style2}
                options={legalEntities}
                value={formData.employmentInformation.legalEntity}
                onChangeText={(e) => handleChange(e, "employmentInformation")}
              />
            </Col>
            <Col>
              <SelectInput
                label="Department"
                placeholder="--Select--"
                name="department"
                style={style2}
                options={departments}
                value={formData.employmentInformation.department}
                onChangeText={(e) => handleChange(e, "employmentInformation")}
              />
            </Col>
          </Row>

          <Row className="mt-2 mb-2 p-2">
            <Col>
              <SelectInput
                label="Location"
                placeholder="--Select--"
                name="location"
                style={style3}
                options={countriesNames}
                value={formData.employmentInformation.location}
                onChangeText={(e) => handleChange(e, "employmentInformation")}
              />
            </Col>
            <Col>
              <SelectInput
                label="Line Manager"
                placeholder="--Select--"
                name="lineManager"
                style={style3}
                options={lineManagers}
                value={formData.employmentInformation.lineManager}
                onChangeText={(e) => handleChange(e, "employmentInformation")}
              />
            </Col>
            <Col>
              <SelectInput
                label="Job Category"
                placeholder="--Select--"
                name="jobCategory"
                style={style3}
                options={jobCategories}
                value={formData.employmentInformation.jobCategory}
                onChangeText={(e) => handleChange(e, "employmentInformation")}
              />
            </Col>
          </Row>
          <Row className="mt-2 mb-2 p-2">
            <Col>
              <SelectInput
                label="Role"
                placeholder="--Select--"
                name="role"
                style={style3}
                options={roles}
                value={formData.employmentInformation.role}
                onChangeText={(e) => handleChange(e, "employmentInformation")}
              />
            </Col>
            <Col>
              <SelectInput
                label="Designation"
                placeholder="--Select--"
                name="designation"
                style={style3}
                options={designations}
                value={formData.employmentInformation.designation}
                onChangeText={(e) => handleChange(e, "employmentInformation")}
              />
            </Col>
            <Col>
              <SelectInput
                label="Grade"
                placeholder="--Select--"
                name="grade"
                style={style3}
                options={grades}
                value={formData.employmentInformation.grade}
                onChangeText={(e) => handleChange(e, "employmentInformation")}
              />
            </Col>
          </Row>
          <Row className="mt-2 mb-2 pl-4 ml-1">
            {formData.employmentInformation.departmentHead}
            <CheckboxInput
              label="Department Head"
              name="departmentHead"
              value={formData.employmentInformation.departmentHead}
              onChangeText={(e) => {
                handleChange(e, "employmentInformation");
              }}
            />
          </Row>
          <div className="col-md-6 m-0 p-0">
            <div className="pt-3 m-0">
              <Link to="/admin/setups/employees">
                <Button text="Cancel" className="bg-white" style={{ border: "1px solid #837F39" }} />
              </Link>
              <Button
                text="Update"
                className=""
                style={{ backgroundColor: "#837F39", color: "white" }}
                handleClick={handleSave}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
