import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import CustomCheckBoxSwitch from  "../../../components/CustomCheckSwitch";
import { SelectComponent } from "../../../components/input-elements/select";
import { InputTextComponent } from "../../../components/input-elements/text";
import React, { useCallback, useState, useRef, useEffect } from "react";

import CarryoverRulesPopup from "../EligibilityCriteria/CarryoverRulesPopup";
import LeaveTypeTable from "./LeaveTypeTable";
import { appURL } from "../../../../../utilities/baseurl";
import axios from "axios";
import { Toast } from "../../../../../service/toast";
import CustomRadio from  "../../../components/CustomRadio";

const LeaveType = () => {
  const generateCandidateId = () => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    const s = now.getSeconds().toString().padStart(2, "0");
    const rand = Math.floor(Math.random() * 90 + 10); // random 2-digit

    return `${h}${m}${s}${rand}`; // e.g., "10452276"
  };
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [eligibilityOptions, setEligibilityOptions] = useState([]);
  const [loadingEligibility, setLoadingEligibility] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    code: generateCandidateId(),
    balanceBasedOn: "",
    unit: "",
    status: "",
    eligibility: "",
    carryOver: {
      carryOverDate: "",
      carryOverExpiry: false,
    },
    attachmentsRequired: false, // Added this field
  });
  const [obj, setSelectedObject] = useState({})
  
  const unitOptions = [
    { label: " hours", value: "hours" },
    { label: " days", value: "days" },
  ];


  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "In-Active", value: "inActive" },
  ];

  useEffect(() => {
    const fetchEligibilityOptions = async () => {
      setLoadingEligibility(true);
      setError(null);
      try {
        const response = await axios.get(
          `${appURL}/recruitment/eligibility-criteria`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const eligibilityData = response?.data?.data?.data || [];
        const options = eligibilityData.map((item) => ({
          label: item.eligibilityName,
          value: item.eligibilityName,
          id: item._id,
        }));
        setEligibilityOptions(options);
      } catch (err) {
        console.error("Fetch Eligibility Error:", err);
        setError(
          err.response?.data?.message || "Failed to fetch eligibility options"
        );
        Toast({
          message:
            err.response?.data?.message ||
            "Failed to fetch eligibility options",
          type: "error",
        });
      } finally {
        setLoadingEligibility(false);
      }
    };

    fetchEligibilityOptions();
  }, []);

  const formFields = [
    {
      id: "name",
      label: "Name",
      type: "text",
      component: "input",
    },
    {
      id: "icon",
      label: "Image / Icon",
      type: "file",
      component: "input",
      onChange: (e) => {
        if (e.target.files && e.target.files[0]) {
          setFormData({ ...formData, icon: e.target.files[0] });
        }
      }
    },
    {
      id: "code",
      label: "Code",
      type: "number",
      component: "input",
    },
    {
      id: "balanceBasedOn",
      label: "Balance based on (fixed entitlement / Leave grant)",
      type: "number",
      component: "input",
    },
    {
      id: "unit",
      label: "Units (Days / hours)",
      component: "radio",
      options: unitOptions,
    },
    {
      id: "status",
      label: "Status",
      component: "select",
      options: statusOptions,
    },
    {
      id: "eligibility",
      label: "Eligibility",
      component: "select",
      options: eligibilityOptions,
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

  const [anchorEl, setAnchorEl] = useState(null);
  const checkboxRef = useRef(null);

  const handleCarryoverChange = (event) => {
    const isChecked = event.target.checked;
    setFormData(prev => ({
      ...prev,
      carryOver: {
        ...prev.carryOver,
        carryOverExpiry: isChecked
      }
    }));
    setAnchorEl(isChecked ? checkboxRef.current : null);
  };

  const handleAttachmentsRequiredChange = (event) => {
    setFormData(prev => ({
      ...prev,
      attachmentsRequired: event.target.checked
    }));
  };

  const handleClosePopup = () => {
    setAnchorEl(null);
    setFormData(prev => ({
      ...prev,
      carryOver: {
        ...prev.carryOver,
        // carryOverExpiry: false
      }
    }));
  };

  const handleEdit = useCallback((selectedRow) => {
    setFormData({
      _id: selectedRow._id || "",
      name: selectedRow.name || "",
      icon: selectedRow.icon || "",
      code: selectedRow.code || generateCandidateId(),
      balanceBasedOn: selectedRow.balanceBasedOn || "",
      unit: selectedRow.unit || "",
      status: selectedRow.status || "",
      eligibility: selectedRow.eligibility || "",
      carryOver: {
        carryOverDate: selectedRow.carryOver?.carryOverDate || "",
        carryOverExpiry: selectedRow.carryOver?.carryOverExpiry || false,
      },
      attachmentsRequired: selectedRow.attachmentsRequired || false,
    });
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData || Object.keys(formData).length === 0) {
      Toast({
        message: "Please fill details before submitting",
        type: "error",
      });
      return;
    }
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      formDataToSend.append('name', formData.name);
      if (formData.icon instanceof File) {
        formDataToSend.append('icon', formData.icon);
      }
      formDataToSend.append('code', formData.code);
      formDataToSend.append('balanceBasedOn', formData.balanceBasedOn);
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('eligibility', formData.eligibility);
      formDataToSend.append('carryOverDate', formData.carryOver.carryOverDate);
      formDataToSend.append('carryOverExpiry', formData.carryOver.carryOverExpiry);
      formDataToSend.append('attachmentsRequired', formData.attachmentsRequired);
      formDataToSend.append('eligibilityId', obj.id);
      const isEditMode = Boolean(formData._id);
      const url = isEditMode
        ? `${appURL}/recruitment/leave-type?id=${formData._id}`
        : `${appURL}/recruitment/leave-type`;
  
      const companyId = localStorage.getItem("companyId") !== null
        ? JSON.parse(localStorage.getItem("companyId"))
        : null;
  
      if (!isEditMode) {
        formDataToSend.append('companyId', companyId);
      }
  
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
  
      const response = await axios[isEditMode ? 'put' : 'post'](url, formDataToSend, config);
  
      Toast({
        message: response?.data?.message ||
          (isEditMode ? "LeaveType updated successfully" : "LeaveType created successfully"),
        type: "success",
      });
  
      setFormData({
        name: "",
        icon: "",
        code: generateCandidateId(),
        balanceBasedOn: "",
        unit: "",
        status: "",
        eligibility: "",
        carryOver: {
          carryOverDate: "",
          carryOverExpiry: false,
        },
        attachmentsRequired: false,
      });
      setRefreshTable(prev => !prev);
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
          height: "100vh",
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
                marginLeft: "-17px",
              }}
            >
              Leave Type
            </Typography>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#837E3B",
                borderRadius: "2rem",
                padding: "8px 16px",
                textTransform: "none",
                fontWeight: 500,
                fontFamily: `"Work Sans"`,
                fontSize: "20px",
                "&:hover": {
                  backgroundColor: "#6f6b2f",
                },
              }}
            >
              Add Category / Leave Type
            </Button>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {loadingEligibility && (
            <Typography sx={{ mb: 2 }}>
              Loading eligibility options...
            </Typography>
          )}

          <Grid container spacing={2}>
            {formFields.map((field) => (
              <Grid item xs={12} md={6} key={field.id}>
                {field.component === "input" ? (
                  <InputTextComponent
                    sx={{
                      ...(field.id === "code" && {
                        pointerEvents: "none",
                        color: "#555",
                      }),
                    }}
                    id={field.id}
                    name={field.id}
                    label={field.label}
                    type={field.type}
                    value={formData[field.id] || ""}
                    onChange={(e) =>
                    {
                      console.log(e.target,'sdfsdjf')
                      if(e.target.name=="icon"){
                        setFormData({ ...formData, icon: e.target.files[0] })
                      } else {
                        setFormData({ ...formData, [field.id]: e.target.value })
                      }
                    }
                    }
                    disabled={
                      isSubmitting || loadingEligibility || field.id == "code"
                    }
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
                      setFormData({ ...formData, [field.id]: e.target.value,[field.name=="eligibility"? "eligibilityId":""]: e.target.id })
                    }
                    setSelectedObject={setSelectedObject}
                    options={field.options || []}
                    disabled={isSubmitting || loadingEligibility}
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
                    disabled={isSubmitting || loadingEligibility}
                  />
                ) : null}
              </Grid>
            ))}
          </Grid>

          <Box display="flex" flexDirection="column" sx={{ overflow: "auto" }}>
            <Box my={0.5} ref={checkboxRef}>
              <CustomCheckBoxSwitch
                type="checkbox"
                label="Carryover"
                checked={formData.carryOver?.carryOverExpiry || false}
                onChange={handleCarryoverChange}
              />
            </Box>
            <CarryoverRulesPopup
              anchorEl={anchorEl}
              handleClose={handleClosePopup}
            />
            <Box my={0.5}>
              <CustomCheckBoxSwitch
                type="switch"
                label="Attachments Required"
                checked={formData.attachmentsRequired || false}
                onChange={handleAttachmentsRequiredChange}
                sx={{ marginLeft: "0" }}
              />
            </Box>
          </Box>

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

      <LeaveTypeTable onEdit={handleEdit} refreshTable={refreshTable} />
    </>
  );
};

export default LeaveType;