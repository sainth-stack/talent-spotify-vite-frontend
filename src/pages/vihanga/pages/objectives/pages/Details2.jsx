import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Stepper from "pages/vihanga/components/stepper";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import FileUpload from "pages/vihanga/components/filesUplode/draganddropFile";
import BellCurveChart from "./Graph";
import { useDispatch } from "react-redux";
import {
  getKeyResultSingle,
  createkeyResult,
  updatekeyResult,
} from "action/keyResultAct";

// Date utility functions
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const parseDateFromInput = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toISOString();
};

const STEPS = [
  { label: "Objective", path: "/admin/objectives/objective" },
  { label: "KR", path: "/admin/objectives/keyresult" },
  { label: "Task", path: "/admin/objectives/task" },
];

const STATUSOPTIONS = [
  { label: "Not Started", value: "notStarted" },
  { label: "In Progress", value: "inProgress" },
  { label: "Completed", value: "completed" },
];

const KPIOPTIONS = [
  { label: "Revenue", value: "revenue" },
  { label: "User Growth", value: "usergrowth" },
  { label: "Conversion Rate", value: "conversionrate" },
];

const UNITOPTIONS = [
  { label: "Number", value: "number" },
  { label: "Percentage (%)", value: "percentage" },
  { label: "INR", value: "INR" },
  { label: "USD", value: "USD" },
  { label: "AED", value: "AED" },
];

const SOURCEOPTIONS = [{ label: "Salesforce", value: "salesforce" }];

export default function KeyResultForm() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { objectiveId: paramObjectiveId, keyResultId } = useParams();
  const { state } = useLocation();

  // Get objectiveId from URL params or query string
  const urlParams = new URLSearchParams(location.search);
  const queryObjectiveId = urlParams.get("objectiveId");
  const objectiveId = paramObjectiveId || queryObjectiveId;

  const { rowData = {} } = state || {};
  const isEdit = new URLSearchParams(location.search).get("isEdit") === "true";

  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [stepperDisabled, setStepperDisabled] = useState(true);

  const [formData, setFormData] = useState({
    krName: "",
    source: "salesforce",
    status: "",
    kpi: "",
    unit: "",
    polarity: "positive",
    targetResult: "",
    actualResult: "",
    targetDate: "",
    completionDate: "",
    file: "",
  });

  // Initialize form data
  useEffect(() => {
    if (!isEdit || !objectiveId) return;

    const initializeForm = () => {
      if (rowData) {
        setFormData({
          krName: rowData.krName || rowData.task || "",
          source: rowData.source || "salesforce",
          status: rowData.status || "",
          kpi: rowData.kpi || "",
          unit: rowData.unit || "",
          polarity: rowData.polarity || "positive",
          targetResult: rowData.target || rowData.targetResult || "",
          actualResult: rowData.actual || rowData.actualResult || "",
          targetDate: rowData.targetDate
            ? formatDateForInput(rowData.targetDate)
            : "",
          completionDate: rowData.completionDate
            ? formatDateForInput(rowData.completionDate)
            : "",
          file: rowData.feedAttachment || rowData.file || null,
        });
      } else if (keyResultId) {
        const user = JSON.parse(localStorage.getItem("user")) || {};
        dispatch(getKeyResultSingle(keyResultId, user.role))
          .then(({ data }) => {
            if (data) {
              setFormData({
                krName: data.keyResultName || "",
                source: data.source || "salesforce",
                status: data.status || "",
                kpi: data.kpi || "",
                unit: data.unit || "",
                polarity: data.polarity || "positive",
                targetResult: data.target || "",
                actualResult: data.actual || "",
                targetDate: data.targetDate
                  ? formatDateForInput(data.targetDate)
                  : "",
                completionDate: data.completionDate
                  ? formatDateForInput(data.completionDate)
                  : "",
                file: "",
              });
            }
          })
          .catch((err) => setError(err.message))
          .finally(() => setLoading(false));
      }
    };

    initializeForm();
  }, [isEdit, rowData, keyResultId, dispatch, objectiveId]);

  // Validate form
  useEffect(() => {
    const isValid =
      formData.krName.trim() !== "" &&
      objectiveId &&
      formData.status !== "" &&
      formData.kpi !== "" &&
      !isNaN(Number(formData.targetResult)) &&
      formData.targetResult !== "" &&
      formData.targetDate !== "";
    setIsFormValid(isValid);
    setStepperDisabled(!isValid);
  }, [formData, objectiveId]);

  const handleInputChange = (field, value) => {
    if (field === "actualResult") {
      const targetValue = parseFloat(formData.targetResult);
      const actualValue = parseFloat(value);

      if (
        !isNaN(targetValue) &&
        !isNaN(actualValue) &&
        actualValue > targetValue
      ) {
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.krName.trim()) {
      setError("Key Result Name is required");
      return;
    }

    if (!objectiveId) {
      setError("Objective ID is required");
      return;
    }

    const targetValue = Number(formData.targetResult);
    if (isNaN(targetValue)) {
      setError("Target must be a valid number");
      return;
    }

    const actualValue = formData.actualResult
      ? Number(formData.actualResult)
      : 0;
    if (formData.actualResult && isNaN(actualValue)) {
      setError("Actual must be a valid number");
      return;
    }

    if (!formData.targetDate) {
      setError("Target Date is required");
      return;
    }

    setLoading(true);
    setError("");

    const user = JSON.parse(localStorage.getItem("user")) || {};
    const payload = {
      keyResultName: formData.krName,
      okrName: formData.krName, // Added this to fix the validation error
      source: formData.source,
      polarity: formData.polarity,
      target: targetValue,
      targetDate: parseDateFromInput(formData.targetDate),
      actual: actualValue,
      actualDate: formData.completionDate
        ? parseDateFromInput(formData.completionDate)
        : null,
      file: formData.file?.name || formData.file,
      objectiveId,
      userId: user._id,
      status: formData.status,
      kpi: formData.kpi,
      unit: formData.unit,
    };

    const action =
      isEdit && keyResultId
        ? dispatch(updatekeyResult(keyResultId, payload))
        : dispatch(createkeyResult(payload));

    action
      .then(({ success, data }) => {
        if (success) {
          if (isEdit) {
            history.goBack();
          } else {
            history.push({
              pathname: `/admin/objectives/task`,
              search: `?objectiveId=${objectiveId}&keyResultId=${data._id}`,
              state: {
                rowData: {
                  ...payload,
                  _id: data._id,
                },
              },
            });
          }
        } else {
          setError("Operation failed");
        }
      })
      .catch((err) => setError(err.message || "An error occurred"))
      .finally(() => setLoading(false));
  };

  const handleBackClick = () => {
    history.push(
      `/admin/objectives/objective${
        objectiveId ? `?objectiveId=${objectiveId}` : ""
      }`
    );
  };

  const handleFileChange = useCallback((file) => {
    setFormData((prev) => ({ ...prev, file }));
  }, []);

  const handleStepClick = (stepIndex) => {
    if (stepperDisabled) return;

    setActiveStep(stepIndex);
    const paths = [
      "/admin/objectives/objective",
      `/admin/objectives/details?objectiveId=${objectiveId}`,
      `/admin/objectives/task?objectiveId=${objectiveId}&keyResultId=${keyResultId}`,
    ];
    if (paths[stepIndex]) history.push(paths[stepIndex]);
  };

  return (
    <Box sx={{ padding: "0 20px" }}>
      <Box
        mt={"20px"}
        sx={{
          width: "100%",
          borderRadius: "16px",
          paddingBottom: "10px",
          backgroundColor: "#fff",
          boxShadow: 1,
        }}
      >
        <Stepper
          steps={STEPS}
          activeStep={activeStep}
          stepIconColor="#837F39"
          connectorColor="#9E9E9E"
          onStepClick={handleStepClick}
          disabled={stepperDisabled}
        />
      </Box>

      <Box
        sx={{
          borderRadius: "20px",
          marginTop: "20px",
          padding: "24px",
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            margin: "0 2rem",
            backgroundColor: "#fff",
            borderRadius: "10px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "30px",
            }}
          >
            <ArrowBackIosIcon
              onClick={handleBackClick}
              sx={{ fontSize: 30, color: "#000", cursor: "pointer" }}
            />
            {isEdit ? "Edit Key Result" : "Add Key Result"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Chart & Description */}
          {isEdit && rowData && (
            <Box mb={4}>
              <Typography variant="body1" color="textSecondary">
                OKR Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {rowData.task}
              </Typography>
            </Box>
          )}

          <Box mb={4}>
            <Box display="flex" alignItems="center">
              <input
                type="checkbox"
                id="alignedCheck"
                defaultChecked={isEdit && rowData?.aligned}
                disabled={loading}
              />
              <Typography
                component="label"
                htmlFor="alignedCheck"
                sx={{ color: "#837F39", fontWeight: 600, ml: 1 }}
              >
                Aligned to company objective
              </Typography>
            </Box>
            <BellCurveChart
              target={Number(formData.targetResult) || 0}
              actual={Number(formData.actualResult) || 0}
              polarity={formData.polarity}
            />
            <Box sx={{ borderBottom: "1px solid #BEA881", my: 3 }} />
          </Box>

          <Typography variant="h5" fontWeight={700} mb={2}>
            {isEdit ? "Edit Key Result" : "Add Key Result"}
          </Typography>

          <Box mb={3}>
            <Typography component="label">Key Result Name*</Typography>
            <InputTextComponent
              value={formData.krName}
              onChange={(e) => handleInputChange("krName", e.target.value)}
              fullWidth
              disabled={loading}
              error={!formData.krName.trim()}
              helperText={
                !formData.krName.trim() ? "This field is required" : ""
              }
            />
          </Box>

          <Box mb={3}>
            <Typography component="label">Source</Typography>
            <SelectComponent
              value={formData.source}
              onChange={(e) => handleInputChange("source", e.target.value)}
              options={SOURCEOPTIONS}
              fullWidth
              disabled={loading}
            />
          </Box>

          <Box display="flex" gap={3} mb={3}>
            <Box flex={1}>
              <Typography component="label">Status*</Typography>
              <SelectComponent
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                options={STATUSOPTIONS}
                fullWidth
                disabled={loading}
                error={!formData.status}
                helperText={!formData.status ? "This field is required" : ""}
              />
            </Box>
            <Box flex={1}>
              <Typography component="label">KPIs*</Typography>
              <SelectComponent
                value={formData.kpi}
                onChange={(e) => handleInputChange("kpi", e.target.value)}
                options={KPIOPTIONS}
                fullWidth
                disabled={loading}
                error={!formData.kpi}
                helperText={!formData.kpi ? "This field is required" : ""}
              />
            </Box>
          </Box>

          <Box display="flex" gap={3} mb={3}>
            <Box flex={1}>
              <Typography component="label">Unit of Measurement</Typography>
              <SelectComponent
                value={formData.unit}
                onChange={(e) => handleInputChange("unit", e.target.value)}
                options={UNITOPTIONS}
                fullWidth
                disabled={loading}
              />
            </Box>
            <Box flex={1}>
              <Typography component="label" sx={{ mb: 2 }}>
                Polarity
              </Typography>
              <RadioGroup
                row
                value={formData.polarity}
                onChange={(e) => handleInputChange("polarity", e.target.value)}
              >
                <FormControlLabel
                  value="positive"
                  control={<Radio />}
                  label="Positive"
                  disabled={loading}
                />
                <FormControlLabel
                  value="negative"
                  control={<Radio />}
                  label="Negative"
                  disabled={loading}
                />
              </RadioGroup>
            </Box>
          </Box>

          <Box display="flex" gap={3} mb={3}>
            <Box flex={1}>
              <Typography component="label">Target Result*</Typography>
              <InputTextComponent
                type="number"
                value={formData.targetResult}
                onChange={(e) =>
                  handleInputChange("targetResult", e.target.value)
                }
                fullWidth
                disabled={loading}
                error={
                  !formData.targetResult || isNaN(Number(formData.targetResult))
                }
                helperText={
                  !formData.targetResult || isNaN(Number(formData.targetResult))
                    ? "Valid number is required"
                    : ""
                }
              />
            </Box>
            <Box flex={1}>
              <Typography component="label">Actual Result</Typography>
              <InputTextComponent
                type="number"
                value={formData.actualResult}
                onChange={(e) =>
                  handleInputChange("actualResult", e.target.value)
                }
                fullWidth
                disabled={loading}
                error={
                  formData.actualResult && isNaN(Number(formData.actualResult))
                }
                helperText={
                  formData.actualResult && isNaN(Number(formData.actualResult))
                    ? "Valid number is required"
                    : ""
                }
              />
            </Box>
          </Box>

          <Box display="flex" gap={3} mb={3}>
            <Box flex={1}>
              <Typography component="label">Target Date*</Typography>
              <InputTextComponent
                type="date"
                value={formData.targetDate}
                onChange={(e) =>
                  handleInputChange("targetDate", e.target.value)
                }
                fullWidth
                disabled={loading}
                error={!formData.targetDate}
                helperText={
                  !formData.targetDate ? "This field is required" : ""
                }
              />
            </Box>
            <Box flex={1}>
              <Typography component="label">Completion Date</Typography>
              <InputTextComponent
                type="date"
                value={formData.completionDate}
                onChange={(e) =>
                  handleInputChange("completionDate", e.target.value)
                }
                fullWidth
                disabled={loading}
              />
            </Box>
          </Box>

          <Box mt={2}>
            <Typography fontWeight={500} fontSize={16}>
              Upload File
            </Typography>
            <FileUpload
              value={formData.file}
              onFileUpload={handleFileChange}
              disabled={loading}
            />
          </Box>

          <Box display="flex" justifyContent="center" gap={2} mt={4}>
            <Button
              variant="outlined"
              onClick={handleSave}
              disabled={!isFormValid || loading}
              sx={{
                color: "#73712A",
                borderColor: "#73712A",
                borderRadius: "30px",
                padding: "12px 30px",
                fontWeight: "bold",
                "&:disabled": { opacity: 0.7 },
              }}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {isEdit ? "Update Details" : "Save Details"}
            </Button>

            {!isEdit && (
              <Button
                variant="contained"
                onClick={() =>
                  history.push(
                    `/admin/objectives/task?objectiveId=${objectiveId}&keyResultId=${keyResultId}`
                  )
                }
                disabled={!isFormValid || loading}
                sx={{
                  backgroundColor: "#73712A",
                  borderRadius: "30px",
                  padding: "12px 30px",
                  fontWeight: "bold",
                  "&:disabled": { opacity: 0.7 },
                  "&:hover": { backgroundColor: "#5a581f" },
                }}
              >
                Add Task
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
