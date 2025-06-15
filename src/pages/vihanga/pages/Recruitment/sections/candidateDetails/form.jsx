import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Grid,
  Typography,
  Box,
  Card,
  Button,
  Avatar,
  Link,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { InputTextComponent } from "../../../../components/input-elements/text";
import { SelectComponent } from "../../../../components/input-elements/select";
import AddIcon from '../../../../../../assets/svg/addIcon.svg'
import FileUploadCustom from "../../../../components/filesUplode/draganddropFile";
import InterviewerCard from "./fotter";
import axios from "axios";
import { Toast } from "../../../../../../service/toast";
import { appURL, PsychometricURL, removeDuplicates, UiURL } from "utilities";
import { getDesignations } from  "../../../../../../action/DesignationAct";
import { getDepartmentsData } from "../../../../../../action/DepartmentAct";
import { useDispatch } from "react-redux";

import html2pdf from "html2pdf.js";
import { useLocation } from "react-router-dom";
import { hiringOptions } from  "../../../../../../utils/const";


const CandidateDetailsForm = ({ id, setStatus }) => {
  const generateCandidateId = () => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    const s = now.getSeconds().toString().padStart(2, "0");
    const rand = Math.floor(Math.random() * 90 + 10); // random 2-digit

    return `${h}${m}${s}${rand}`; // e.g., "10452276"
  };
  const companyId = localStorage.getItem("companyId") !== null
    ? JSON.parse(localStorage.getItem("companyId"))
    : null;
  const [formData, setFormData] = useState({
    candidateId: generateCandidateId(),
    candidateName: "",
    status: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    location: "",
    source: "",
    department: "",
    designation: "",
    status: 'New Applied',
    companyId: companyId,
    interviewer1: {
      name: '',
      email: '',
      id: '',
      feedbackId: ""
    },
    interviewer2: {
      name: '',
      email: '',
      id: '',
      feedbackId: ""
    },
    reportingManager: {
      name: '',
      email: '',
      id: ''
    },
    projectName: "",
    grossSalary: "",
    noticePeriod: "",
    probationPeriod: "",
    moveToTalentPool: ""
  });

  const pdfRef = useRef();

  const location = useLocation();

  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState("");
  const [existingResume, setExistingResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackId, setFeedbackId] = useState();
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false)
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [error, setError] = useState('')
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const companyId = JSON.parse(localStorage.getItem("companyId"));
        const response = await axios.get(
          `${appURL}/employees/getEmployees/${companyId}`
        );

        const employees = response?.data?.data;

        const options = employees.map((emp) => ({
          value:
            `${emp.personalInformation?.firstName} ${emp.personalInformation?.lastName}`.trim(),
          label:
            `${emp.personalInformation?.firstName} ${emp.personalInformation?.lastName}`.trim(),
          key: emp._id,
          email: emp?.contactInformation?.email,
          gender:emp?.personalInformation?.gender,
          image:emp?.personalInformation?.profilePicture
        }));

        setEmployeeOptions(options);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchDepartments();
    fetchDesignations();
    fetchEmployees();
  }, []);

  

  const candidateDataFromState = location.state?.candidateData;
  const Candidate_Id = candidateDataFromState ? candidateDataFromState.candidateId : null;
  const candidateId = Candidate_Id || id;

  useEffect(() => {
    if (candidateId) {
      const fetchCandidate = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `${appURL}/recruitment/getCandidateById?_id=${candidateId}`
          );

          const candidateData = response?.data?.data?.[0];
          setFeedbackId(candidateData?.candidateId);
          setFormData({
            showDocuments: candidateData?.documents?.length > 0,
            candidateId: candidateData?.candidateId || generateCandidateId(),
            candidateName: candidateData?.candidateName || "",
            status: candidateData?.status || "",
            email: candidateData?.email || "",
            phone: candidateData?.phone || "",
            dob: candidateData?.dob,
            gender: candidateData?.gender || "",
            location: candidateData?.location || "",
            source: candidateData?.source || "",
            department: candidateData?.department || "",
            designation: candidateData?.designation || "",
            interviewer1: candidateData?.interviewer1 || "",
            interviewer2: candidateData?.interviewer2 || "",
            reportingManager: candidateData?.reportingManager || "",
            projectName: candidateData?.projectName || "",
            grossSalary: candidateData?.grossSalary || "",
            noticePeriod: candidateData?.noticePeriod || "",
            probationPeriod: candidateData?.probationPeriod || "",
            moveToTalentPool: candidateData?.moveToTalentPool || "",
            nextSuitableRole: candidateData?.nextSuitableRole || ""
          });
          setStatus(candidateData?.status);
          
          if (candidateData?.image) {
            setExistingPhoto(candidateData.image);
          }
          if (candidateData?.resume) {
            setExistingResume(candidateData.resume);
          }
        } catch (error) {
          console.error("Error fetching candidate:", error);
        } finally {
          setLoading(false);
        }
      };

      const fetchCandidateData = async () => {
        try {
          const response = await axios.get(
            `${PsychometricURL}/users/user-results?candidateId=${candidateId}`
          );
          setShowFeedback(response?.data?.candidateId);
        } catch (error) {
          console.error("Error fetching candidate data:", error);
        }
      };
      fetchCandidateData();
      fetchCandidate();
    }
  }, [candidateId]);

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

  const navigate = useNavigate();

  const onBack = () => {
  
      navigate( "/admin/previlages/RecruitmentManagement")
   
  };

  const handleInputChange = (e) => {
    const { id, value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id || name]: value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setExistingPhoto("");
    }
  };

  const handleResumeUpload = (file) => {
    setResumeFile(file);
    setExistingResume("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true)
      const formDataToSend = new FormData();
      const user = JSON.parse(localStorage.getItem("user"));
      // formDataToSend.append("hr", user?.email);
      formDataToSend.append("hr", "interviewtesting345@yopmail.com");
      if (formData.status === "Offer Letter") {
        if (!formData.grossSalary || !formData.noticePeriod || !formData.probationPeriod) {
          Toast({ message: "Please fill all required fields for Offer Letter", type: "error" });
          return;
        }
      }

      // Flatten form data including nested objects
      Object.entries(formData).forEach(([key, value]) => {
        if (
          (key === "interviewer1" || key === "interviewer2" || key === "reportingManager") &&
          typeof value === "object" &&
          value !== null
        ) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            formDataToSend.append(`${key}[${subKey}]`, subValue || "");
          });
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Append files if they exist
      if (photoFile) {
        formDataToSend.append("photo", photoFile);
      }
      if (resumeFile) {
        formDataToSend.append("resume", resumeFile);
      }

      const url = `${appURL}/recruitment/candidates`;
      const method = id ? "put" : "post";

      const response = await axios[method](url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Toast({ 
        message: response?.data?.message || `Candidate ${id ? "updated" : "created"} successfully`, 
        type: "success" 
      });

      setLoading(false)
     
       navigate( "/admin/previlages/RecruitmentManagement")
     
    } catch (error) {
      setLoading(false)
      Toast({ 
        message: error.response?.data?.message || error?.message?.message || `Candidate ${id ? "updation" : "creation"} failed`, 
        type: "error" 
      });
      console.error("Submission error:", error.response?.data || error.message);
    }
  };

  const handleInterview = (opt, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: {
        name: opt.label,
        email: opt.email,
        id: opt.key,
        gender:opt.gender,
        image:opt.img
      },
    }));
  };

  const pdfContentRef = useRef(null);

  useEffect(() => {
    window.onload = () => {
      if (pdfContentRef.current) {
        html2pdf().from(pdfContentRef.current).save("candidate_report.pdf");
      }
    };
  }, []);

  return (
    <>
      <Card
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          marginX: "30px",
          marginTop: "30px",
          boxShadow: "none",
        }}
      >
        <Box sx={{ paddingX: { lg: "40px" }, marginTop: "20px" }}>
          <Box
            display="flex"
            alignItems="center"
            sx={{ marginBottom: "50px", padding: "0px" }}
          >
            <Box
              onClick={onBack}
              sx={{ background: "none", cursor: "pointer", padding: "0px" }}
            >
              <ArrowBackIosIcon
                sx={{ fontSize: 35, color: "#000000", background: "none" }}
              />
            </Box>
            <Typography
              fontWeight="700"
              sx={{
                marginLeft: "8px",
                fontSize: "32px",
                fontFamily: "Work Sans",
                color: "#0E0E0E",
                padding: "0px",
              }}
            >
              Candidate Details
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <InputTextComponent
                  id="candidateId"
                  label="Candidate ID"
                  value={formData.candidateId}
                  onChange={handleInputChange}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <InputTextComponent
                  id="candidateName"
                  label="Candidate Name"
                  value={formData.candidateName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid
                item
                sx={{
                  width: "158px",
                  height: "158px",
                  border: "1.22px dashed #99965E",
                  borderRadius: "19.45px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12.15px",
                  bgcolor: "#FFFFFF",
                  cursor: "pointer",
                  marginLeft: { lg: "100px", sm: "60px" },
                  marginTop: { lg: "-70px", md: "-50px", sm: "-60px" },
                  padding: "10px !important",
                  position: "relative",
                }}
              >
                <>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id="photo-upload"
                    onChange={handlePhotoUpload}
                  />
                  <label
                    htmlFor="photo-upload"
                    style={{ padding: "0px", height: "100%" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        padding: "0px",
                        position: "relative",
                      }}
                    >
                      {photoFile || existingPhoto ? (
                        <>
                          <img
                            src={
                              photoFile
                                ? URL.createObjectURL(photoFile)
                                : existingPhoto
                            }
                            alt="Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "19.45px",
                            }}
                          />
                          <EditOutlinedIcon
                            sx={{
                              position: "absolute",
                              top: "-6px",
                              right: "-0.5rem",
                              backgroundColor: "#fff",
                              borderRadius: "50%",
                              padding: "3px",
                              fontSize: "2rem",
                              color: "#000",
                              zIndex: 10,
                              cursor: "pointer",
                              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <img
                            src={AddIcon}
                            alt="Add"
                            style={{
                              color: "#837F39",
                              width: "37px",
                              height: "37px",
                            }}
                          />
                          <Typography
                            sx={{
                              color: "#99965E",
                              fontSize: "21px",
                              fontWeight: "500",
                              fontFamily: "Work Sans",
                            }}
                          >
                            Add Photo
                          </Typography>
                        </>
                      )}
                    </Box>
                  </label>
                </>
              </Grid>

              <Grid item xs={4}>
                <InputTextComponent
                  id="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <InputTextComponent
                  id="phone"
                  label="Phone No."
                  type="number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <InputTextComponent
                  id="dob"
                  label="Date of Birth"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange}
                  disableFutureDate={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <SelectComponent
                  id="gender"
                  label="Gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                />
              </Grid>
              <Grid item xs={4}>
                <InputTextComponent
                  id="location"
                  label="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <InputTextComponent
                  id="source"
                  label="Source"
                  value={formData.source}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <SelectComponent
                  id="department"
                  label="Department"
                  value={formData.department}
                  onChange={handleInputChange}
                  options={departments}
                />
              </Grid>
              <Grid item xs={4}>
                <SelectComponent
                  id="designation"
                  label="Designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  options={designations}
                />
              </Grid>

              <Grid item xs={4}>
                <InputTextComponent
                  id="projectName"
                  label="Project Name"
                  value={formData.projectName}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={4}>
                <SelectComponent
                  id="reportingManager"
                  label="Reporting Manager"
                  setSelectedObject={(opt) => handleInterview(opt, "reportingManager")}
                  value={formData.reportingManager?.name || ""}
                  options={employeeOptions}
                />
              </Grid>

              <Grid item xs={4}>
                <SelectComponent
                  id="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={hiringOptions}
                />
              </Grid>

              {formData.status === "Rejected" && (
                <Grid item xs={4}>
                  <SelectComponent
                    id="moveToTalentPool"
                    label="Move to Talent Pool?"
                    value={formData.moveToTalentPool}
                    onChange={handleInputChange}
                    options={[
                      { value: "Yes", label: "Yes" },
                      { value: "No", label: "No" },
                    ]}
                  />
                </Grid>
              )}

{formData.status === "Rejected" && (
                <Grid item xs={4}>
                  <SelectComponent
                    id="nextSuitableRole"
                    label="Suitable Designation"
                    value={formData.nextSuitableRole}
                    onChange={handleInputChange}
                    options={designations}
                  />
                </Grid>
              )}

              {["Interview 1"].includes(formData.status) && (
                <Grid item xs={4}>
                  <SelectComponent
                    id="interviewer1"
                    label="Select Interviewer 1"
                    setSelectedObject={(opt) => handleInterview(opt, "interviewer1")}
                    value={formData.interviewer1?.name || ""}
                    options={employeeOptions}
                  />
                </Grid>
              )}

              {["Interview 2"].includes(formData.status) && (
                <Grid item xs={4}>
                  <SelectComponent
                    id="interviewer2"
                    label="Select Interviewer 2"
                    setSelectedObject={(opt) => handleInterview(opt, "interviewer2")}
                    value={formData.interviewer2?.name || ""}
                    options={employeeOptions}
                  />
                </Grid>
              )}

              {formData.status === "Offer Letter" && (
                <>
                  <Grid item xs={4}>
                    <InputTextComponent
                      id="grossSalary"
                      label="Gross Salary"
                      type="number"
                      value={formData.grossSalary}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputTextComponent
                      id="noticePeriod"
                      label="Notice Period (days)"
                      type="number"
                      value={formData.noticePeriod}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <InputTextComponent
                      id="probationPeriod"
                      label="Probation Period (days)"
                      type="number"
                      value={formData.probationPeriod}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Box sx={{ mt: 2, mb: 2 }}>
              <FileUploadCustom
                label="Resume"
                onFileUpload={handleResumeUpload}
                file={resumeFile}
              />
              {existingResume && (
                <Link
                  href={existingResume}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "primary.main",
                    textDecoration: "underline",
                    fontFamily: "Work Sans",
                    fontSize: "16px",
                    marginTop: "5px",
                    "&:hover": {
                      color: "primary.dark",
                    },
                  }}
                >
                  Click Here
                </Link>
              )}
            </Box>
            {showFeedback && (
              <a
                href={`${UiURL}/admin/previlages/ReportPages/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#1976d2",
                  textDecoration: "underline",
                  fontFamily: "Work Sans",
                  fontSize: "16px",
                  marginTop: "5px",
                  display: "inline-block",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#115293")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#1976d2")}
              >
                Psychometric Review Report
              </a>
            )}

            {formData?.showDocuments && (
              <div>
                <a
                  href={`${UiURL}/candidate/document-upload?candidateId=${id}&round=documentupload`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#1976d2",
                    textDecoration: "underline",
                    fontFamily: "Work Sans",
                    fontSize: "16px",
                    marginTop: "5px",
                    display: "inline-block",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#115293")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#1976d2")}
                >
                  Documents Upload Overview
                </a>
              </div>
            )}

            {["Offer Letter"].includes(formData.status) && (
              <div>
                <a
                  href={`${UiURL}/admin/previlages/AppointmentLetter/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#1976d2",
                    textDecoration: "underline",
                    fontFamily: "Work Sans",
                    fontSize: "16px",
                    marginTop: "5px",
                    display: "inline-block",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#115293")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#1976d2")}
                >
                  Offer Letter
                </a>
              </div>
            )}

            <InterviewerCard formData={formData}employeeOptions={employeeOptions}/>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2} mb={2}>
              <Button
                onClick={onBack}
                sx={{
                  borderRadius: "136px",
                  border: "1.37px solid rgba(131, 127, 57, 1)",
                  width: "107px",
                  color: "#837F39",
                  fontFamily: "Work Sans, sans-serif",
                  fontWeight: "500",
                  textTransform: "capitalize",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                sx={{
                  borderRadius: "136px",
                  background: "#837F39",
                  color: "white",
                  width: "161px",
                  textTransform: "capitalize",
                  color: "#FFFFFF",
                  fontFamily: "Work Sans, sans-serif",
                  fontWeight: "500",
                  "&:hover": {
                    background: "#99965E",
                    color: "#FFFFFF",
                    border: "1px solid #837F39",
                  },
                }}
              >
                {loading ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                  >
                    <CircularProgress
                      size={24}
                      thickness={5}
                      sx={{ color: "#ffffff" }}
                    />
                  </Box>
                ) : id ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </Button>
            </Box>
          </form>
        </Box>
      </Card>
    </>
  );
};

export default CandidateDetailsForm;