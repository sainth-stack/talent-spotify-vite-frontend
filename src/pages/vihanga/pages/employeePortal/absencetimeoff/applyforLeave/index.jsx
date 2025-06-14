import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  Box,
  Button,
  Grid,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { InputTextComponent } from "../../../../../vihanga/components/input-elements/text";
import { SelectComponent } from "../../../../../vihanga/components/input-elements/select";
import FileUploadCustom from "../../../../components/filesUplode/draganddropFile";
import LeaveCards from "./cardsTopSection";
import LeaveTable from "../leaveHistory";
import axios from "axios";
import { Toast } from "../../../../../../service/toast";
import { appURL } from "utilities";
import { validateForm } from "utilities/Validator";
import { leaveFormRules } from "./validateRules";
import { getItemFromLocalStorage } from "utilities/getLocalStorageItem";
import { differenceInDays, format, isValid, parse } from "date-fns";

const ApplyforLeave = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 960px

  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(false);
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [formData, setFormData] = useState({
    absenceType: "",
    from: "",
    to: "",
    durationOfAbsence: "",
    note: "",
    halfDay: "",
  });

  const [obj,setSelectedObject]=useState({})

  const fetchLeaveTypes = async () => {
    setLoadingLeaveTypes(true);
    try {
      const companyId = getItemFromLocalStorage("companyId");

      const response = await axios.get(`${appURL}/recruitment/leave-type`, {
        params: {
          page: 1,
          limit: 100,
          companyId,
        },
      });

      setLeaveTypes(response?.data?.data?.data || []);
    } catch (err) {
      console.error("Fetch Leave Types Error:", err);
      Toast({
        message: err.response?.data?.message || "Failed to fetch leave types",
        type: "error",
      });
    } finally {
      setLoadingLeaveTypes(false);
    }
  };

  const companyId = getItemFromLocalStorage("companyId");
  const userRoleId = getItemFromLocalStorage("user");

  const fetchData = async () => {
    try {
      const response = await axios.get(`${appURL}/recruitment/summary`, {
        params: {
          companyId,
          empId: userRoleId._id,
        },
      });
      setLeaveSummary(response.data?.data?.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      Toast({
        message: err.response?.data?.message || "Failed to fetch data",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "halfDay") {
        if (checked) {
          updatedData.durationOfAbsence = "0.5";
        } else {
          updatedData.from = "";
          updatedData.to = "";
          updatedData.durationOfAbsence = "";
        }
      }

      if (name === "from" || name === "to" || name === "halfDay") {
        const fromDate = name === "from" ? value : prev.from;
        const toDate = name === "to" ? value : prev.to;

        if (
          fromDate &&
          toDate &&
          isValid(new Date(fromDate)) &&
          isValid(new Date(toDate))
        ) {
          const parsedFrom = parse(fromDate, "yyyy-MM-dd", new Date());
          const parsedTo = parse(toDate, "yyyy-MM-dd", new Date());

          if (parsedTo >= parsedFrom) {
            // Only calculate duration if dates are valid
            if (fromDate === toDate && updatedData.halfDay) {
              updatedData.durationOfAbsence = "0.5";
            } else {
              const diffDays = differenceInDays(parsedTo, parsedFrom) + 1;
              updatedData.durationOfAbsence = diffDays.toString();
            }
          } else {
            updatedData.durationOfAbsence = ""; // Clear duration if invalid
          }
        } else {
          updatedData.durationOfAbsence = ""; // Clear duration if dates are invalid
        }
      }

      return updatedData;
    });

    // Validate form on change for relevant fields
    if (
      name === "from" ||
      name === "to" ||
      name === "absenceType" ||
      name === "note"
    ) {
      const updatedFormData = {
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      };
      const errors = validateForm(updatedFormData, leaveFormRules);
      setFormErrors(errors);
    } else {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleReset = () => {
    setFormData({
      absenceType: "",
      from: "",
      to: "",
      durationOfAbsence: "",
      note: "",
      halfDay: false,
    });
    setResumeFile(null);
    setError(null);
    setFormErrors({});
  };

  const handleResumeUpload = (file) => {
    setResumeFile(file);
  };

  const handleEdit = useCallback((selectedRow) => {
    setFormData({
      _id: selectedRow?._id || "",
      absenceType: selectedRow?.absenceType || "",
      from: selectedRow?.from || "",
      to: selectedRow?.to || "",
      durationOfAbsence: selectedRow?.durationOfAbsence || "",
      note: selectedRow?.note || "",
      halfDay: selectedRow?.halfDay || false,
      attachment: selectedRow?.attachment || "",
    });
    setResumeFile(null);
    setError(null);
    setFormErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Find the selected leave type
    const selectedLeaveType = leaveTypes.find(
      (type) => type.name === formData.absenceType
    );

    // Validate form
    const errors = validateForm(formData, leaveFormRules);

    // Add attachment validation if required
    if (
      selectedLeaveType?.attachmentsRequired === "true" &&
      !resumeFile &&
      !formData.attachment
    ) {
      errors.attachment = "Document is required for this leave type";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
     const firstError = Object.values(errors)[0];
    Toast({
      message: firstError,
      type: "error",
    });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const isEditMode = Boolean(formData._id);
      const url = isEditMode
        ? `${appURL}/recruitment/leaves?id=${formData._id}`
        : `${appURL}/recruitment/leaves`;
      const method = isEditMode ? "put" : "post";

      const companyId = getItemFromLocalStorage("companyId");
      const userRoleId = getItemFromLocalStorage("user");

      let dataToSend;
      let headers = { "Content-Type": "application/json" };

      const fullFormData = {
        ...formData,
        leaveTypeId:obj?.id,
        eligibilityId:obj?.eligibilityId,
        ...(companyId && { companyId }),
        ...(userRoleId && { empId: userRoleId._id }),
      };

      if (resumeFile) {
        const formDataToSend = new FormData();
        Object.entries(fullFormData).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            formDataToSend.append(key, value);
          }
        });

        formDataToSend.append("attachment", resumeFile);

        dataToSend = formDataToSend;
        headers = {};
      } else {
        dataToSend = fullFormData;
      }

      const response = await axios({
        method,
        url,
        data: dataToSend,
        headers,
      });

      Toast({
        message:
          response?.data?.data?.message ||
          (isEditMode
            ? "Leave updated successfully"
            : "Leave created successfully"),
        type: "success",
      });

      handleReset();
      setRefreshTable((prev) => !prev);
      fetchData(); // Refresh leave summary after submission
    } catch (err) {
      console.error("API Error:", err.response || err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "An error occurred while submitting the form. Please try again.";
      setError(errorMessage);
      Toast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        "&:hover": { backgroundColor: "#f5f5f5" },
        "&:active": { backgroundColor: "#e0e0e0" },
      },
      onClick: handleReset,
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
        "&:hover": { backgroundColor: "#6f6b2f" },
        "&:active": { backgroundColor: "#5c5828" },
      },
      disabled: isSubmitting,
    },
  ];

  return (
    <Box
      sx={{
        padding: isMobile ? "10px" : "30px",
        paddingBottom: isMobile ? "30px" : "70px",
      }}
    >
      <LeaveCards leaveSummary={leaveSummary} />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          paddingBottom: "70px",
          margin: isMobile ? "1rem .5rem" : "1rem",
          bgcolor: "#fff",
          padding: isMobile ? ".5rem" : "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.5px 0px rgba(0,0,0,0.2)",
        }}
      >
        {!isMobile && (
          <Typography
            sx={{
              fontFamily: '"Work Sans", sans-serif',
              fontSize: isMobile ? "10px" : isTablet ? "20px" : "24px",
              fontWeight: 500,
              color: "#837E3B",
              textDecoration: "underline",
              textUnderlineOffset: "1px",
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: isMobile ? "20px" : isTablet ? "30px" : "50px",
              marginBottom: isMobile ? "8px" : "12px", // Added for better spacing
            }}
          >
            Leave Policy
          </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "8px 0px",
          }}
        >
          {isMobile ? (
            <Typography
              sx={{
                fontFamily: '"Work Sans", sans-serif',
                fontSize: isMobile ? "10px" : isTablet ? "20px" : "24px",
                fontWeight: 500,
                color: "#837E3B",
                textDecoration: "underline",
                textUnderlineOffset: "1px",
                display: "flex",
                justifyContent: "flex-end",
                paddingRight: isMobile ? "20px" : isTablet ? "30px" : "50px",
                marginBottom: isMobile ? "8px" : "12px", // Added for better spacing
              }}
            >
              Leave Policy
            </Typography>
          ) : (
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: 600,
                fontFamily: "Montserrat, sans-serif",
                color: "#0E0E0E",
              }}
            >
              Apply for leave
            </Typography>
          )}

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#837E3B",
              borderRadius: "20px",
              padding: isMobile
                ? "5px 10px"
                : isTablet
                ? "7px 14px"
                : "8px 16px",
              textTransform: "none",
              fontWeight: 500,
              fontFamily: '"Work Sans"',
              fontSize: isMobile ? "16px" : isTablet ? "18px" : "20px",
              "&:hover": { backgroundColor: "#6f6b2f" },
              "&:active": { backgroundColor: "#5c5828" },
            }}
            endIcon={<CalendarMonthIcon />}
          >
            Team Leave
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {loadingLeaveTypes && (
          <Typography sx={{ mb: 2 }}>Loading leave types...</Typography>
        )}

        <Grid container spacing={isMobile ? 2 : 4}>
          <Grid
            item
            xs={12}
            md={12}
            container
            spacing={isMobile ? 2 : 0}
            direction={isMobile ? "row" : "row"}
            alignItems={isMobile ? "center" : ""}

          >
            {/* Absence Type */}
            <Grid item xs={isMobile ? 7 :""} sm={6} 
            sx={{ flexWrap: "nowrap !important" }}
            >
              <SelectComponent
                id="absenceType"
                label="Absence type / Category"
                name="absenceType"
                value={formData.absenceType}
                onChange={handleChange}
                setSelectedObject={setSelectedObject}
                options={leaveTypes.map((leaveType) => ({
                  label: leaveType.name,
                  value: leaveType.name,
                  id: leaveType._id,
                  eligibilityId: leaveType.eligibilityId,
                }))}
                error={formErrors.absenceType}
              />
            </Grid>

            {/* Half Day Checkbox */}
            <Grid
              item
              xs={isMobile ? 5 : 12}
              sm={6}
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.halfDay}
                    name="halfDay"
                    onChange={handleChange}
                    sx={{
                      color: "#837F39",
                      "&.Mui-checked": { color: "#837F39" },
                      marginLeft: isMobile ? 0 : "50px",
                    }}
                  />
                }
                label={<Box sx={{ marginTop: "10px" }}>Half day</Box>}
                sx={{
                  fontFamily: "Work Sans",
                  display: "flex",
                  alignItems: "flex-start",
                }}
              />
            </Grid>
          </Grid>

          {/* From Date */}
          <Grid item xs={12} sm={6}>
            <InputTextComponent
              id="from"
              label="From"
              name="from"
              type="date"
              value={formData.from}
              onChange={handleChange}
              error={formErrors.from}
            />
          </Grid>

          {/* To Date */}
          <Grid item xs={12} sm={6}>
            <InputTextComponent
              id="to"
              label="To"
              name="to"
              type="date"
              value={formData.to}
              onChange={handleChange}
              error={formErrors.to}
            />
           
          </Grid>

          {/* Duration */}
          <Grid item xs={12} sm={6}>
            <InputTextComponent
              id="durationOfAbsence"
              label="Duration of absence"
              name="durationOfAbsence"
              value={formData.durationOfAbsence}
              disabled
            />
          </Grid>

          {/* Note */}
          <Grid item xs={12} sm={6}>
            <InputTextComponent
              id="note"
              // placeholder="Enter a description..."
              label="Note"
              name="note"
              type="text"
              value={formData.note}
              onChange={handleChange}
              multiline
              rows={5}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            marginTop: { xs: "24px", sm: "40px", md: "50px" },
            marginBottom: { xs: "12px", sm: "16px", md: "24px" },
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: "10px", sm: "15px", md: "24px" },

              fontFamily: "Montserrat",
              marginBottom: "4px",
              color: "#000000",
            }}
          >
            Upload attachments
          </Typography>
          <FileUploadCustom
            onFileUpload={handleResumeUpload}
            file={resumeFile}
            acceptedFileTypes=".pdf,.doc,.docx"
            maxFileSize={5000000}
            link={formData?.attachment}
            error={formErrors.attachment}
          />
          {formErrors.attachment && (
            <Typography color="error" variant="caption">
              {formErrors.attachment}
            </Typography>
          )}
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={4} mb={2}>
          {buttonConfigs.map((btn, index) => (
            <Button
              key={index}
              type={btn.type}
              variant={btn.variant}
              sx={btn.sx}
              onClick={btn.onClick}
              disabled={btn.disabled}
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

      <Box
        sx={{
          paddingBottom: "70px",
          margin: isMobile ? "1rem .5rem" : "1rem",
          bgcolor: "#fff",
          padding: isMobile ? ".5rem" : "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.5px 0px rgba(0,0,0,0.2)",
        }}
      >
        <LeaveTable onEdit={handleEdit} refreshTable={refreshTable} />
      </Box>
    </Box>
  );
};

export default ApplyforLeave;
