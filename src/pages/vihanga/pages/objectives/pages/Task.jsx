import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Checkbox,
  InputLabel,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import FileUpload from "../../../components/filesUplode/draganddropFile";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import Stepper from "pages/vihanga/components/stepper";
import { useHistory, useLocation } from "react-router-dom";
import Recurrence from "./Recurrance";
import Progress from "../components/pages/Progress";
import { createTask, getTasksById, updateTask } from "action/TasksAct";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import CheckIcon from "@mui/icons-material/Check";
import { debounce } from "lodash";
import LottieConfettie from "assets/images/LottieConfettie.gif";
import './task.scss'


const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const AddTaskForm = () => {
  const history = useHistory();
  const location = useLocation();
  const query = useQuery();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Stepper configuration
  const steps = [{ label: "Objective" }, { label: "KR" }, { label: "Task" }];

  // State initialization
  const [activeStep, setActiveStep] = useState(2); // Default to Task step
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stepperDisabled, setStepperDisabled] = useState(false);
  const { rowData } = location.state || {};
  const [showGif, setShowGif] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    taskTitle: "",
    taskDescription: "",
    startDate: "",
    dueDate: "",
    actualCompletionDate: "",
    linkToKr: "",
    assignTo: "",
    priority: "",
    status: "",
    progressStatus: 0,
    mainTask: "",
    comments: "",
    recurrence: false,
    recurrenceDetails: "",
    progress: "0",
    file: null,
  });

  // Query parameters
  const objectiveId = query.get("objectiveId");
  const keyResultId = query.get("keyResultId");
  const isEdit = query.get("isEdit");
  const taskId = query.get("taskId");

  // User data
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
  const companyId = sessionStorage.getItem("companyId")
    ? JSON.parse(sessionStorage.getItem("companyId"))
    : null;

  // Update active step based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes("/objectives/objective")) {
      setActiveStep(0);
    } else if (currentPath.includes("/objectives/keyresult")) {
      setActiveStep(1);
    } else if (currentPath.includes("/objectives/task")) {
      setActiveStep(2);
    }
  }, [location.pathname]);

  // Check form validity and update stepper disabled state
  useEffect(() => {
    const isValid = isFormValid();
    setStepperDisabled(!isValid);
  }, [formData]);

  // Fetch task data if in edit mode and taskId is available
  useEffect(() => {
    if (isEdit && taskId) {
      fetchTaskData();
    }
  }, [isEdit, taskId]);

  const fetchTaskData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getTasksById(taskId));
      if (response.data) {
        const task = response.data;
        setFormData({
          taskTitle: task.title || "",
          taskDescription: task.description || "",
          startDate: task.startDate || "",
          dueDate: task.dueDate || "",
          actualCompletionDate: task.actualCompletionDate || "",
          linkToKr: task.linkToKr || "",
          assignTo: task.assignTo?.[0] || "",
          priority: task.priority || "",
          status: task.status || "",
          progressStatus: task.progressStatus || 0,
          mainTask: task.mainTask || "",
          comments: task.comments || "",
          recurrence: task.recurrence || false,
          recurrenceDetails: task.recurrenceDetails || "",
          progress: task.progress?.toString() || "0",
          file: task.attachments?.[0] || null,
        });
      }
    } catch (err) {
      setError(err.message || "Failed to fetch task data");
    } finally {
      setLoading(false);
    }
  };

  // Handle stepper click navigation
  const handleStepClick = (stepIndex) => {
    if (stepperDisabled) return;

    setActiveStep(stepIndex);
    if (stepIndex === 0) {
      history.push("/admin/objectives/objective");
    } else if (stepIndex === 1) {
      history.push(`/admin/objectives/details?objectiveId=${objectiveId}`);
    } else if (stepIndex === 2) {
      history.push(
        `/admin/objectives/task?objectiveId=${objectiveId}&keyResultId=${keyResultId}`
      );
    }
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);


  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate required fields
  const validateForm = () => {
    const requiredFields = {
      taskTitle: "Task title is required",
      taskDescription: "Task description is required",
      startDate: "Start date is required",
      dueDate: "Due date is required",
      priority: "Priority is required",
      status: "Status is required",
    };

    const newErrors = {};

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field] || formData[field] === "") {
        newErrors[field] = message;
      }
    });

    // Validate date sequence
    if (
      formData.startDate &&
      formData.dueDate &&
      new Date(formData.startDate) > new Date(formData.dueDate)
    ) {
      newErrors.dueDate = "Due date must be after start date";
    }

    // Validate recurrence details if recurrence is enabled
    if (formData.recurrence && !formData.recurrenceDetails) {
      newErrors.recurrenceDetails = "Recurrence details are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    const requiredFields = [
      "taskTitle",
      "taskDescription",
      "startDate",
      "dueDate",
      "priority",
      "status",
    ];
    const hasAllRequiredFields = requiredFields.every(
      (field) => formData[field] && formData[field] !== ""
    );

    const datesValid =
      !formData.startDate ||
      !formData.dueDate ||
      new Date(formData.startDate) <= new Date(formData.dueDate);
    const recurrenceValid = !formData.recurrence || formData.recurrenceDetails;

    return hasAllRequiredFields && datesValid && recurrenceValid;
  };

  // Debounced save to sessionStorage
  const debouncedSave = debounce((data) => {
    if (!isEdit) {
      sessionStorage.setItem("taskFormData", JSON.stringify(data));
    }
  }, 500);

  // Save form data to sessionStorage
  useEffect(() => {
    debouncedSave(formData);
    return () => debouncedSave.cancel();
  }, [formData]);

  const handleRecurrenceChange = (event) => {
    const checked = event.target.checked;
    setOpen(checked);
    handleChange("recurrence", checked);

    if (!checked) {
      handleChange("recurrenceDetails", "");
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const taskData = {
        title: formData.taskTitle,
        description: formData.taskDescription,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        actualCompletionDate: formData.actualCompletionDate || null,
        linkToKr: formData.linkToKr || null,
        assignTo: ["6274e23696bf9824e441be16"],
        priority: formData.priority,
        status: formData.status,
        comments: formData.comments || "",
        file: formData.file,
        krReferenceId: keyResultId,
        objectiveReferenceId: objectiveId,
        recurrence: formData.recurrence,
        recurrenceDetails: formData.recurrenceDetails || null,
        progressStatus: formData.progress,
        mainTask: formData.mainTask || null,
        companyId: companyId || '6396f7d703546500086f0200',
        userId: user?._id,
      };

      const response = isEdit
        ? await dispatch(updateTask(taskId, taskData))
        : await dispatch(createTask(taskData));

      if (response.success) {
        if(formData.progress === 100) {
          setShowGif(true);
          setRewardPoints(10); // Assuming 10 points for task completion
          setTimeout(() => {
            setShowGif(false);
            setRewardPoints(0);
          }, 5000); // Hide gif after 5 seconds
        }
        sessionStorage.removeItem("taskFormData");
        queryClient.invalidateQueries("tasks");
        history.push(
          `/admin/objectives/details?objectiveId=${objectiveId}&keyResultId=${keyResultId}`
        );
      } else {
        setError(response.message || "An error occurred");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  const handleFileChange = useCallback((file) => {
    setFormData((prev) => ({ ...prev, file }));
  }, []);

  const handleOkrClick = () => {
    history.push(
      `/admin/objectives/details?objectiveId=${objectiveId}&keyResultId=${keyResultId}`
    );
  };

  return (
    <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
         <div className={showGif ? "gif" : "dgif"}>
              <img
                src={LottieConfettie}
                className={"lottie-img"}
                alt="LottieConfettie"
              />
              <br />
              <h3>You have earned {rewardPoints} reward points</h3>
            </div>
      {open && (
        <Recurrence
          open={open}
          setOpen={setOpen}
          setRecurrenceDetails={(details) =>
            handleChange("recurrenceDetails", details)
          }
        />
      )}

      <Box
        mt={"20px"}
        sx={{
          width: "100%",
          paddingBottom: "10px",
          borderRadius: "16px",
          backgroundColor: "#fff",
          boxShadow: 1,
        }}
      >
        <Stepper
          steps={steps}
          activeStep={activeStep}
          stepIconColor="#837F39"
          connectorColor="#9E9E9E"
          onStepClick={handleStepClick}
          sx={{ width: "100%", mx: "auto", gap: "20px" }}
          disabled={stepperDisabled}
        />
      </Box>

      <Box
        mt={"20px"}
        sx={{
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "20px",
          boxShadow: 3,
        }}
      >
        <Box display="flex" alignItems="center" mb={3}>
          <ArrowBackIosIcon
            sx={{ fontSize: 32, mt: "-4px", mr: 1, cursor: "pointer" }}
            onClick={handleOkrClick}
          />
          <Typography
            sx={{
              fontSize: "32px",
              fontWeight: 700,
              fontFamily: "Montserrat",
            }}
          >
            {isEdit ? "Edit Task" : "Add Task"}
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <Typography>Loading task data...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Required Fields */}
            <Grid item xs={12}>
              <InputLabel>Task Title *</InputLabel>
              <InputTextComponent
                value={formData.taskTitle}
                onChange={(e) => handleChange("taskTitle", e.target.value)}
                error={!!errors.taskTitle}
                helperText={errors.taskTitle}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel>Task Description *</InputLabel>
              <InputTextComponent
                value={formData.taskDescription}
                onChange={(e) =>
                  handleChange("taskDescription", e.target.value)
                }
                error={!!errors.taskDescription}
                helperText={errors.taskDescription}
                multiline
                rows={4}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <InputLabel>Start Date *</InputLabel>
              <InputTextComponent
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                error={!!errors.startDate}
                helperText={errors.startDate}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <InputLabel>End Date *</InputLabel>
              <InputTextComponent
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                error={!!errors.dueDate}
                helperText={errors.dueDate}
                fullWidth
              />
            </Grid>

            {/* Optional Fields */}
            <Grid item xs={12} sm={4}>
              <InputLabel>Actual Completion Date</InputLabel>
              <InputTextComponent
                type="date"
                value={formData.actualCompletionDate}
                onChange={(e) =>
                  handleChange("actualCompletionDate", e.target.value)
                }
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Link To KR</InputLabel>
              <SelectComponent
                value={formData.linkToKr}
                onChange={(e) => handleChange("linkToKr", e.target.value)}
                options={[
                  { value: "Absence", label: "Absence" },
                  { value: "No of leads", label: "No of leads" },
                  { value: "Keyy22", label: "Keyy22" },
                ]}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Assign To</InputLabel>
              <SelectComponent
                value={formData.assignTo}
                onChange={(e) => handleChange("assignTo", e.target.value)}
                options={[{ value: "Super Admin", label: "Super Admin" }]}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Priority *</InputLabel>
              <SelectComponent
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                options={[
                  { value: "High Level", label: "High Level" },
                  { value: "Medium Level", label: "Medium Level" },
                  { value: "Low Level", label: "Low Level" },
                ]}
                error={!!errors.priority}
                helperText={errors.priority}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Status *</InputLabel>
              <SelectComponent
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                options={[
                  { value: "", label: "Select Status" },
                  { value: "notstarted", label: "notstarted" },
                  { value: "inprogress", label: "inprogress" },
                  { value: "Completed", label: "Completed" },
                ]}
                error={!!errors.status}
                helperText={errors.status}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6} marginTop="30px">
              <Box display="flex" alignItems="center">
                <Checkbox
                  checked={formData.recurrence}
                  onChange={handleRecurrenceChange}
                  icon={
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #535353",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                  }
                  checkedIcon={
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: "#837F39",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckIcon
                        sx={{
                          fontSize: 18,
                          color: "#FFFFFF",
                          alignItems: "center",
                        }}
                      />
                    </Box>
                  }
                  sx={{ padding: 0 }}
                />
                <Typography sx={{ marginLeft: 1 }}>Recurrence *</Typography>
              </Box>
              {errors.recurrenceDetails && (
                <Typography color="error" variant="caption">
                  {errors.recurrenceDetails}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>Main Task</InputLabel>
              <SelectComponent
                value={formData.mainTask}
                onChange={(e) => handleChange("mainTask", e.target.value)}
                options={[
                  {
                    value: "marketing plan",
                    label: "Marketing Plan",
                  },
                  {
                    value: "product launch",
                    label: "Product Launch",
                  },
                ]}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Progress
                value={formData.progress}
                onChange={(e) =>
                  handleInputChange("progress", Number(e.target.value))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="body1"
                fontWeight={500}
                mt={3}
                color="rgba(14, 14, 14, 1)"
              >
                Upload Files
              </Typography>
              <FileUpload
                sx={{ width: "100%" }}
                value={formData.file}
                onFileUpload={handleFileChange}
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography color="error" align="center">
                  {error}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: isFormValid() ? "#73712A" : "#cccccc",
                  color: "#fff",
                  borderRadius: "30px",
                  px: 4,
                  py: 1.5,
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: isFormValid() ? "#837F39" : "#cccccc",
                  },
                }}
                onClick={handleSubmit}
                disabled={!isFormValid() || loading}
              >
                {loading
                  ? "Processing..."
                  : isEdit
                  ? "Update Task"
                  : "Save Details"}
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </div>
  );
};

export default AddTaskForm;
