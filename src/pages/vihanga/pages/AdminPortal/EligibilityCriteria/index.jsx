import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";

import CustomRadio from "../../../components/CustomRadio";
import { SelectComponent } from "../../../components/input-elements/select";
import { InputTextComponent } from "../../../components/input-elements/text";

import React, { useEffect, useState } from "react";
import EligibilityTable from "./EligibilityTable";
import axios from "axios";
import { Toast } from "../../../../../service/toast";
import { useCallback } from "react";
import { appURL, removeDuplicates } from "utilities";
import { getDesignations } from "../../../../../action/DesignationAct";
import { getDepartmentsData } from "../../../../../action/DepartmentAct";
import { useDispatch } from "react-redux";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";

const EligibilityCriteria = () => {
  useEffect(() => {
    const fetchCandidateOptions = async () => {
      setLoadingEligibility(true);
      setError(null);
      try {
        const response = await axios.get(`${appURL}/recruitment/candidates`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const candidateData = response.data.data.data || [];

        const uniqueDesignations = [
          ...new Set(
            candidateData.map((item) => item.designation).filter(Boolean)
          ),
        ];
        const designationOptions = uniqueDesignations.map((designation) => ({
          label: designation,
          value: designation, // Convert to snake_case for value
        }));

        // setJobRolesOptions(designationOptions);
        // setPositionOptions(designationOptions);

        const uniqueDepartments = [
          ...new Set(
            candidateData.map((item) => item.department).filter(Boolean)
          ),
        ];
        const departmentOptions = uniqueDepartments.map((department) => ({
          label: department,
          value: department, // Convert to snake_case for value
        }));
        // setDepartmentOptions(departmentOptions);

        const eligibilityOptions = candidateData.map((item) => ({
          label: item.eligibilityName || item.candidateName, // Adjust based on schema
          value: item.eligibilityName || item.candidateId, // Adjust based on schema
        }));
        setEligibilityOptions(eligibilityOptions);
      } catch (err) {
        console.error("Fetch Candidate Options Error:", err);
        setError(
          err.response?.data?.message || "Failed to fetch candidate options"
        );
        Toast({
          message:
            err.response?.data?.message || "Failed to fetch candidate options",
          type: "error",
        });
      } finally {
        setLoadingEligibility(false);
      }
    };

    fetchCandidateOptions();
  }, []); // Empty dependency array to run once on mount

  const [jobRolesOptions, setJobRolesOptions] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [eligibilityOptions, setEligibilityOptions] = useState([]);
  const [loadingEligibility, setLoadingEligibility] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      let response = dispatch(getDepartmentsData());
      response.then(({ data, message }) => {
        if (data !== undefined && data.length > 0 && data[0].departments.length > 0) {
          let result = data[0].departments
            .filter((item) => item.status === "Active")
            .map((item) => ({
              value: item.departmentName,
              label: item.departmentName,
              key: item.departmentName
            }));
          let nonduplicates = removeDuplicates(result, "value");
          setDepartmentOptions(nonduplicates);

          let result2 = data[0].grades
            .filter((item) => item.status === "Active")
            .map((item) => ({
              value: item.gradeName,
              label: item.gradeName,
              key: item.gradeName
            }));
          let nonduplicates2 = removeDuplicates(result2, "value");
          setGrades(nonduplicates2);
          setError("");
        } else if (data.length === 0) {
          setError("No Data Found!");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error.toString());
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
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
            .map((item) => ({
              value: item.designationName,
              label: item.designationName,
              key: item.designationName
            }));
          let nonduplicates = removeDuplicates(result, "value");
          setPositionOptions(nonduplicates);
          setJobRolesOptions(nonduplicates);
          setError("");
        } else if (data.length === 0) {
          setError("No Data Found!");
        } else {
          setError(message);
        }
      });
    } catch (error) {
      setError(error.toString());
      console.error("Error fetching designations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchDesignations();
  }, []);

  const [formData, setFormData] = useState({
    eligibilityName: "",
    lengthOfService: "",
    jobName: "",
    gender: "",
    grade: "",
    maritalStatus: "",
    location: "",
    probationPeriod: "",
    noticePeriod: "",
    personType: "",
    religion: "",
    position: "",
    age: "",
    hireDate: "",
    department: "",
    workType: "",
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const validateInputFormat = (value, fieldName) => {
    if (value === undefined || value === null || value === '') {
      Toast({
        message: `${fieldName} cannot be empty`,
        type: "error",
      });
      return false;
    }
  
    const stringValue = String(value).trim();
    const operatorPattern = /[><=]/; // checks for at least one of >, <, =
  
    if (!operatorPattern.test(stringValue)) {
      Toast({
        message: `${fieldName} must contain one of the symbols: >, <, =`,
        type: "error",
      });
      return false;
    }
  
    return true;
  };
  
  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    
    // For lengthOfService and age fields, validate the format
    if (fieldName === "lengthOfService" || fieldName === "age") {
      if (value === "" || validateInputFormat(value, fieldName)) {
        setFormData({ ...formData, [fieldName]: value });
      }
    } else {
      setFormData({ ...formData, [fieldName]: value });
    }
  };

  const locationOptions = [
    { label: "USA", value: "usa" },
    { label: "India", value: "india" },
    { label: "UK", value: "uk" },
  ];

  const noticePeriodOptions = [
    { label: "10 days", value: "10" },
    { label: "15 days", value: "15" },
    { label: "30 days", value: "30" },
  ];

  const personTypeOptions = [
    { label: "EMP", value: "emp" },
    { label: "Contractor", value: "contractor" },
    { label: "Intern", value: "intern" },
  ];

  const religionOptions = [
    { label: "Hindu", value: "hindu" },
    { label: "Muslim", value: "muslim" },
    { label: "Christian", value: "christian" },
    { label: "Sikh", value: "sikh" },
    { label: "Buddhist", value: "buddhist" },
    { label: "Jain", value: "jain" },
    { label: "Other", value: "other" },
  ];

  const workTypeOptions = [
    { label: "Full Time", value: "full_time" },
    { label: "Part Time", value: "part_time" },
  ];

  const formFields = [
    {
      id: "eligibilityName",
      label: "Eligibility Name",
      type: "text",
      component: "input",
    },
    {
      id: "age",
      label: "Age (e.g., >30, =27)",
      type: "text",
      component: "input",
    },
    {
      id: "lengthOfService",
      label: "Length of Service (e.g., >1, >2)",
      type: "text",
      component: "input",
    },
    {
      id: "jobName",
      label: "Job Role",
      component: "select",
      options: jobRolesOptions,
    },
    {
      id: "gender",
      label: "Gender",
      component: "radio",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ],
    },
    {
      id: "grade",
      label: "Grade",
      component: "select",
      options: grades,
    },
    {
      id: "maritalStatus",
      label: "Marital Status",
      component: "radio",
      options: [
        { label: "Married", value: "married" },
        { label: "Unmarried", value: "unmarried" },
      ],
    },
    {
      id: "location",
      label: "Location",
      component: "select",
      options: locationOptions,
    },
    {
      id: "probationPeriod",
      label: "Prohibition Period",
      component: "radio",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    },
    {
      id: "noticePeriod",
      label: "Notice Period",
      component: "select",
      options: noticePeriodOptions,
    },
    {
      id: "personType",
      label: "Person Type",
      component: "select",
      options: personTypeOptions,
    },
    {
      id: "religion",
      label: "Religion",
      component: "select",
      options: religionOptions,
    },
    {
      id: "position",
      label: "Position",
      component: "select",
      options: positionOptions,
    },
    {
      id: "hireDate",
      label: "Hire Date",
      type: "date",
      component: "input",
    },
    {
      id: "department",
      label: "Department",
      component: "select",
      options: departmentOptions,
    },
    {
      id: "workType",
      label: "Work Type",
      component: "radio",
      options: workTypeOptions,
      sx: {
        marginBottom: "-15px",
      },
    },
  ];

  const buttonConfigs = [
    {
      label: "Cancel",
      type: "button",
      variant: "contained",
      sx: {
        backgroundColor: "#FFFFFF",
        color: "#847F3B",
        fontFamily: "Work Sans",
        fontWeight: "500",
        borderRadius: "20px",
        "&:hover": {
          backgroundColor: "#FFFFFF",
        },
        "&:active": {
          backgroundColor: "#FFFFFF",
        },
      },
      onClick: () => setFormData({}),
    },
    {
      label: formData._id ? "Update" : "Submit",
      type: "submit",
      variant: "contained",
      sx: {
        backgroundColor: "#837F39",
        color: "#FFFFFF",
        fontFamily: "Work Sans",
        fontWeight: "500",
        borderRadius: "20px",
        "&:hover": {
          backgroundColor: "#837F39",
        },
        "&:active": {
          backgroundColor: "#837F39",
        },
      },
      disabled: isSubmitting,
    },
  ];

  const handleEdit = useCallback((selectedRow) => {
    setFormData({
      _id: selectedRow._id || "",
      eligibilityName: selectedRow.eligibilityName || "",
      age: selectedRow.age || "",
      lengthOfService: selectedRow.lengthOfService || "",
      jobName: selectedRow.jobName || "",
      gender: selectedRow.gender || "",
      grade: selectedRow.grade || "",
      maritalStatus: selectedRow.maritalStatus || "",
      location: selectedRow.location || "",
      probationPeriod: selectedRow.probationPeriod || "",
      noticePeriod: selectedRow.noticePeriod || "",
      personType: selectedRow.personType || "",
      religion: selectedRow.religion || "",
      position: selectedRow.position || "",
      hireDate: selectedRow.hireDate || "",
      department: selectedRow.department || "",
      workType: selectedRow.workType || "",
    });
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData || Object.keys(formData).length === 0) {
      Toast({
        message: "Please fill details before submitting......",
        type: "error",
      });
      return;
    }

    // Validate lengthOfService and age formats before submission
    if (formData.lengthOfService && !validateInputFormat(formData.lengthOfService, "Length of Service")) {
      return;
    }
    if (formData.age && !validateInputFormat(formData.age, "Age")) {
      return;
    }

    console.log("Form Data Submitted:", formData);

    setIsSubmitting(true);
    setError(null);

    try {
      const isEditMode = Boolean(formData._id);

      const url = isEditMode
        ? `${appURL}/recruitment/eligibility-criteria?id=${formData._id}`
        : `${appURL}/recruitment/eligibility-criteria`;

      const method = isEditMode ? "put" : "post";

      const companyId = getItemFromLocalStorage("companyId");
      console.log("companyId at elligibikity", companyId);

      const payload = isEditMode
        ? formData
        : {
            ...formData,
            companyId,
          };

      console.log("payload at handel submit api in eeigibility", payload);

      const response = await axios[method](url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      Toast({
        message:
          response?.data?.message ||
          (isEditMode
            ? "Eligibility updated successfully"
            : "Eligibility created successfully"),
        type: "success",
      });

      console.log("API Response:", response.data);
      setFormData({});
      setRefreshTable((prev) => !prev);
    } catch (err) {
      console.error("API Error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while submitting the form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          margin: "20px",
          borderRadius: "16px",
          paddingBottom: "10px",
          backgroundColor: "#fff",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Box sx={{ padding: "30px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "8px 16px",
            }}
          >
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: "600",
                fontFamily: `"Montserrat"`,
                color: "#0E0E0E",
                marginBottom: "1rem",
                marginLeft: "-17px",
              }}
            >
              Eligibility Criteria
            </Typography>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Grid container spacing={2}>
            {formFields.map((field) => (
              <Grid item xs={12} md={6} key={field.id}>
                {field.component === "input" ? (
                  <InputTextComponent
                    id={field.id}
                    name={field.id}
                    label={field.label}
                    type={field.type}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(e, field.id)}
                    disabled={isSubmitting}
                    {...(field.id === "address" && {
                      multiline: true,
                      minRows: 5,
                    })}
                  />
                ) : field.component === "select" ? (
                  <SelectComponent
                    id={field.id}
                    name={field.id}
                    label={field.label}
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    options={field.options || []}
                    disabled={isSubmitting}
                  />
                ) : field.component === "radio" ? (
                  <CustomRadio
                    label={field.label}
                    name={field.id}
                    options={field.options || []}
                    color="#837F39"
                    direction="row"
                    value={formData[field.id] || ""}
                    onChange={(value) =>
                      setFormData({ ...formData, [field.id]: value })
                    }
                    disabled={isSubmitting}
                  />
                ) : null}
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={4} mb={2}>
            {buttonConfigs.map((btn, index) => (
              <Button
                key={index}
                type={btn.type}
                variant={btn.variant}
                sx={btn.sx}
                onClick={btn.onClick}
                disabled={isSubmitting && btn.type === "submit"}
              >
                {isSubmitting && btn.type === "submit" ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress
                      size={16}
                      thickness={5}
                      sx={{ color: "#ffffff" }}
                    />
                    Submitting...
                  </Box>
                ) : (
                  btn.label
                )}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      <EligibilityTable onEdit={handleEdit} refreshTable={refreshTable} />
    </>
  );
};

export default EligibilityCriteria;