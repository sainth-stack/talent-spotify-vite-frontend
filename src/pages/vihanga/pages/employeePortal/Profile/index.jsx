import React, { useState, useEffect } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import Stepper from "pages/vihanga/components/stepper";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PersonalDetails from "./PersonalDetails";
import BankDetails from "./BankDetails";
import FamilyInformation from "./FamilyInformation";
import DocumentInfo from "./DocumentInfo";
import CustomButton from "../../../components/Button/CustomButton";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { appURL, removeDuplicates } from "utilities";
import { hiringOptions } from "pages/vihanga/utils/const";
import { getDesignations } from "action/DesignationAct";
import { getDepartmentsData } from "action/DepartmentAct";
import { useDispatch } from "react-redux";
import { Toast } from "service/toast";

const ProfileSetup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const candidateId = urlParams.get("candidateId");
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [,setError]=useState('')
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    profile: {
      candidateId: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      joiningDate: "",
      designation: "",
      department: "",
      workingshift: "",
      emailId: "",
      status: "",
      gender: "",
      dateOfBirth: "",
      address: "",
    },
    personal: {
      aadharNumber: "",
      passportNumber: "",
    },
    bank: {
      accountNumber: "",
      ifscCode: "",
      bankName: ""
    },
    family: {
      maritalStatus: ""    
    },
    document: {
      resume: null,
      certificates: [],
    },
  });

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
          setDepartments(nonduplicates);
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
          setDesignations(nonduplicates);
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

console.log('tesfdsjks',candidateId)
  // Fetch candidate data when component mounts
  useEffect(() => {
    if (candidateId) {
      
      const fetchCandidate = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `${appURL}/recruitment/getCandidateById?_id=${candidateId}`
          );

          const candidateData = response?.data?.data?.[0];
          
          // Map the candidate data to our form structure
          setFormData({
            profile: {
              candidateId: candidateData?.profileDetails?.candidateId || candidateData?.candidateId || "",
              firstName: candidateData?.profileDetails?.firstName || candidateData?.candidateName?.split(' ')[0] || "",
              lastName: candidateData?.profileDetails?.lastName || candidateData?.candidateName?.split(' ').slice(1).join(' ') || "",
              phoneNumber: candidateData?.profileDetails?.phoneNumber || candidateData?.phone || "",
              joiningDate: candidateData?.profileDetails?.joiningDate ? 
                new Date(candidateData.profileDetails.joiningDate).toISOString().split('T')[0] : 
                "",
              designation: candidateData?.profileDetails?.designation || candidateData?.designation || "",
              department: candidateData?.profileDetails?.department || candidateData?.department || "",
              workingshift: candidateData?.profileDetails?.workingshift || "",
              emailId: candidateData?.profileDetails?.emailId || candidateData?.email || "",
              status: candidateData?.profileDetails?.status || "onboarding",
              gender: candidateData?.profileDetails?.gender || candidateData?.gender || "",
              dateOfBirth: candidateData?.profileDetails?.dateOfBirth || candidateData?.dob || "",
              address: candidateData?.profileDetails?.address || candidateData?.location || "",
            },
            personal: {
              aadharNumber: candidateData?.personalDetails?.aadharNumber || "",
              passportNumber: candidateData?.personalDetails?.passportNumber || "",
            },
            bank: {
              accountNumber: candidateData?.bankDetails?.accountNumber || "",
              ifscCode: candidateData?.bankDetails?.ifscCode || "",
              bankName: candidateData?.bankDetails?.bankName || ""
            },
            family: {
              maritalStatus: candidateData?.familyDetails?.maritalStatus || ""    
            },
            document: {
              resume: candidateData?.resume ? { fileUrl: candidateData.resume } : null,
              certificates: candidateData?.documents?.map(doc => ({
                type: doc.type,
                fileUrl: doc.url,
                fileName: doc.fileName,
                fileSize: doc.fileSize
              })) || [],
            },
          });
          
        } catch (error) {
          console.error("Error fetching candidate:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchCandidate();
    }
    fetchDepartments()
    fetchDesignations()
  }, [candidateId]);

  const steps = [{ label: "Profile Setup" }, { label: "Personal Details" }];

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const workshiftOptions = [
    { label: "Morning Shift", value: "morning" },
    { label: "Evening Shift", value: "evening" },
    { label: "Night Shift", value: "night" },
    { label: "General Shift", value: "general" },
  ];

  const formFields = [
    {
      id: "candidateId",
      label: "Candidate ID",
      type: "text",
      component: "input",
      disabled: true
    },
    {
      id: "firstName",
      label: "First Name",
      type: "text",
      component: "input",
    },
    { id: "lastName", label: "Last Name", type: "text", component: "input" },
    {
      id: "phoneNumber",
      label: "Phone Number",
      type: "number",
      component: "input",
    },
    {
      id: "joiningDate",
      label: "Joining Date",
      type: "date",
      component: "input",
    },
    {
      id: "designation",
      label: "Designation",
      component: "select",
      options: designations, 
    },
    { id: "department", label: "Department", component: "select",      options: departments    },
    {
      id: "workingshift",
      label: "Working Shift",
      component: "select",
      options: workshiftOptions,
    },
    { id: "emailId", label: "Email ID", type: "email", component: "input" },
    {
      id: "status",
      label: "Status",
      component: "select",
      options: hiringOptions,
    },
    {
      id: "gender",
      label: "Gender",
      component: "select",
      options: genderOptions,
    },
    {
      id: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
      component: "input",
    },
    { id: "address", label: "Address", type: "text", component: "input" },
  ];

  const handleSectionChange = (sectionName) => (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [sectionName]: {
        ...prevFormData[sectionName],
        [name]: value,
      },
    }));
  };

   const handleNext = () => {
     if (activeStep < steps.length - 1) {
       setActiveStep((prev) => prev + 1);
     } else {
       handleSubmit();
     }
   };

   const handleBack = () => {
     if (activeStep > 0) {
       setActiveStep((prev) => prev - 1);
     }
   };

  const handleSubmit = async () => {
    try {
      // Structure payload to match CandidateModel schema
      const payload = {
        candidateId: formData.profile.candidateId,
        profileDetails: {
          candidateId: formData.profile.candidateId,
          firstName: formData.profile.firstName,
          lastName: formData.profile.lastName,
          phoneNumber: formData.profile.phoneNumber,
          joiningDate: formData.profile.joiningDate,
          designation: formData.profile.designation,
          department: formData.profile.department,
          workingshift: formData.profile.workingshift,
          emailId: formData.profile.emailId,
          status: formData?.profile?.status, 
          gender: formData.profile.gender,
          dateOfBirth: formData.profile.dateOfBirth,
          address: formData.profile.address,
        },
        personalDetails: {
          aadharNumber: formData.personal.aadharNumber,
          passportNumber: formData.personal.passportNumber,
        },
        bankDetails: {
          accountNumber: formData.bank.accountNumber,
          ifscCode: formData.bank.ifscCode,
          bankName: formData.bank.bankName || "", // Ensure bankName is included
        },
        familyDetails: {
          maritalStatus: formData.family.maritalStatus || "", // Ensure maritalStatus is included
        },
        documentDetails: formData.document.certificates
          .map((cert) => cert.fileUrl)
          .filter(Boolean), // Array of existing URLs
      };

      // Create FormData for file uploads
      const formDataToSend = new FormData();
      // Append fields, stringifying nested objects to match API response
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "documentDetails") {
          value.forEach((url, index) => {
            formDataToSend.append(`documentDetails[${index}]`, url);
          });
        } else if (typeof value === "object" && value !== null) {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });

      console.log("formDataToSend-----", formDataToSend);

      // Handle resume file
      if (formData.document.resume?.file) {
        formDataToSend.append("resume", formData.document.resume.file);
      }

      // Handle certificates files
      formData.document.certificates.forEach((cert, index) => {
        if (cert.file) {
          formDataToSend.append(`certificate${index}`, cert.file);
        }
      });

      const response = await axios.put(
        `${appURL}/recruitment/candidates`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API response:", response.data);
      Toast({ 
        message: "data saved successfully", 
        type: "success" 
      });
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      alert("Failed to submit data. Please try again.");
    }
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <Grid container spacing={2}>
            
            {formFields.map((field) => (
              <Grid item xs={12} md={6} key={field.id}>
                {field.component === "input" ? (
                  <InputTextComponent
                    id={field.id}
                    name={field.id}
                    label={field.label}
                    type={field.type}
                    value={formData.profile[field.id]}
                    onChange={handleSectionChange("profile")}
                    disabled={field.disabled || false}
                    {...(field.id === "address" && {
                      multiline: true,
                      minRows: 5,
                    })}
                  />
                ) : (
                  <SelectComponent
                    id={field.id}
                    name={field.id}
                    label={field.label}
                    value={formData.profile[field.id]}
                    onChange={handleSectionChange("profile")}
                    options={field.options || []}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
             
              <PersonalDetails
                data={formData?.personal}
                onChange={handleSectionChange("personal")}
              />
            </Grid>
            <Grid item xs={12}>
             
              <BankDetails
                data={formData?.bank}
                onChange={handleSectionChange("bank")}
              />
            </Grid>
            <Grid item xs={12}>
              
              <FamilyInformation
                data={formData.family}
                onChange={handleSectionChange("family")}
              />
            </Grid>
            <Grid item xs={12}>
             
              <DocumentInfo
                data={formData.document}
                onChange={handleSectionChange("document")}
              />
            </Grid>
          </Grid>
        );
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  // alert("activeStep" + activeStep);
  return (
    <>
      <Box
        sx={{
          margin: "20px",
          borderRadius: "16px",
          paddingBottom: "10px",
          backgroundColor: "#fff",
          boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        }}
      >
        <Stepper
          steps={steps}
          activeStep={activeStep}
          stepIconColor="#837F39"
          connectorColor="#9E9E9E"
          onStepClick={(stepIndex) => setActiveStep(stepIndex)}
          sx={{
            width: "100%",
            maxWidth: "1300px",
            mx: "auto",
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
          }}
        />
      </Box>

      <Box
        sx={{
          backgroundColor: activeStep === 0 ? "#fff" : "transparent",
          margin: activeStep === 0 ? "1rem" : "-1rem 0 1rem 0 ",
          padding: activeStep === 0 ? "2rem" : "0rem 1rem 0rem 1rem",
          borderRadius: "1.5rem",
          boxShadow:
            activeStep === 0 ? "0px 0.1px 0px rgba(0,0,0,0.2)" : "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {activeStep === 0 && (
          <Typography
            sx={{
              fontSize: "32px",
              fontWeight: "600",
              fontFamily: "Montserrat",
              color: "#0E0E0E",
            }}
          >
            Profile Setup
          </Typography>
        )}

        <Box mt={3}>{renderStepContent(activeStep)}</Box>

        <Box
          display="flex"
          justifyContent="flex-end"
          gap={2}
          mt="auto"
          pt={4}
          sx={{
            ...(activeStep !== 0 && {
              background: "#fff",
              paddingBottom: "1rem",
            }),
          }}
        >
          <CustomButton
            onClick={handleBack}
            disabled={activeStep === 0}
            text="Previous"
            backgroundColor="#FFFFFF"
            color="#837F39"
            IconColor="#837F39"
            fontWeight="500"
            fontSize="13px"
            border="1px solid #837F39"
            variant="contained"
            iconExists={true}
            IconProp={ArrowBackIosNewIcon}
            iconPosition="start"
            sx={{
              fontFamily: "Work Sans",
              borderRadius: "2rem",
              maxWidth: "8rem",
            }}
          />

          <CustomButton
            onClick={handleNext}
            text={activeStep === steps.length - 1 ? "Submit" : "Next"}
            backgroundColor="#837F39"
            color="#FFFFFF"
            IconColor="#FFFFFF"
            fontWeight="500"
            fontSize="13px"
            border="1px solid #837F39"
            variant="contained"
            iconExists={true}
            IconProp={ArrowForwardIosIcon}
            iconPosition="endNoRotate"
            sx={{
              fontFamily: "Work Sans",
              borderRadius: "2rem",
              maxWidth: "8rem",
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default ProfileSetup;