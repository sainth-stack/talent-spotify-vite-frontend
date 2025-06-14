import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Stepper from "pages/vihanga/components/stepper";
import FileUpload from "../../../components/filesUplode/draganddropFile";
import { createObjective, updateObjective } from "action/GoalsAct";
import Progress from "../components/pages/Progress";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";

const STEPS = [
  { label: "Objective", path: "/admin/objectives/objective" },
  { label: "KR", path: "/admin/objectives/details" },
  { label: "Task", path: "/admin/objectives/task" },
];

const DIMENSION_OPTIONS = [
  { label: "People", value: "People" },
  { label: "Financial", value: "Financial" },
  { label: "Operations", value: "Operations" },
  { label: "Strategy", value: "Strategy" },
  { label: "Process/Governance/System", value: "Process/Governance/System" },
];

const OWNER_OPTIONS = [{ label: "Super Admin", value: "Super Admin" }];

const useQuery = () => new URLSearchParams(useLocation().search);

export default function ObjectiveForm() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const query = useQuery();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const objectiveId = query.get("objectiveId");
  const { rowData } = location.state || {};
  const [isEditMode, setIsEditMode] = useState(false);
  const isEdit = query.get("isEdit") === "true";

  const [formData, setFormData] = useState(() => {
    const savedData = sessionStorage.getItem("objectiveFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          objective: "",
          weight: "",
          owner: "Super Admin",
          dueDate: "",
          dimension: "",
          progress: "0",
          file: "",
        };
  });

  useEffect(() => {
    if (isEdit && rowData) {
      setIsEditMode(true);
      setFormData({
        objective: rowData.task || "",
        weight: rowData.weight || "",
        owner: rowData.owner || "Super Admin",
        dueDate: rowData.dueDate || "",
        dimension: rowData.description || "",
        progress: rowData.progress?.toString() || "0",
        file: "",
      });
    } else {
      const savedData = sessionStorage.getItem("objectiveFormData");
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
    }
  }, [isEdit, rowData]);

  useEffect(() => {
    const currentPath = location.pathname;
    const stepIndex = STEPS.findIndex((step) => step.path === currentPath);
    setActiveStep(stepIndex !== -1 ? stepIndex : 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!isEditMode) {
      sessionStorage.setItem("objectiveFormData", JSON.stringify(formData));
    }
  }, [formData, isEditMode]);

  useEffect(() => {
    const isValid =
      formData.objective.trim() !== "" &&
      String(formData.weight).trim() !== "" &&
      formData.dimension.trim() !== "";
    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleFileChange = useCallback((file) => {
    setFormData((prev) => ({ ...prev, file }));
  }, []);

  const handleAddKrClick = useCallback(
    (e) => {
      e.preventDefault();
      if (!isFormValid) return;
      history.push("/admin/objectives/details");
    },
    [isFormValid, history]
  );

  const handleSaveObjective = useCallback(() => {
    if (!isFormValid) return;
    setLoading(true);

    const payload = {
      objective: formData.objective,
      weight: String(formData.weight).trim(),
      owner: formData.owner,
      dueDate: formData.dueDate,
      dimension: formData.dimension,
      progress: formData.progress,
      file: formData.file?.name || formData.file,
      employeeName: "Super Admin",
      employeeReferenceId: "6274e23696bf9824e441be16",
      okrPeriod: "Q1",
    };

    const handleSuccess = (data) => {
      if (!isEditMode) {
        sessionStorage.removeItem("objectiveFormData");
      }
      history.push(
        `/admin/objectives/details?objectiveId=${data._id || objectiveId}`
      );
    };

    const handleError = (error) => {
      console.error(
        `Error ${isEditMode ? "updating" : "saving"} objective:`,
        error
      );
      setLoading(false);
    };

    if (isEditMode && objectiveId) {
      dispatch(updateObjective(objectiveId, payload))
        .then(({ success }) => success && handleSuccess({ _id: objectiveId }))
        .catch(handleError);
    } else {
      dispatch(createObjective(payload))
        .then(({ success, data }) => success && handleSuccess(data))
        .catch(handleError);
    }
  }, [formData, isFormValid, isEditMode, objectiveId, dispatch, history]);

  const handleBackClick = useCallback(() => {
    history.push("/admin/objectives");
  }, [history]);

  return (
    <div>
      {/* Stepper with conditional disable */}
      <Box
        mt={"20px"}
        sx={{
          width: "100%",
          borderRadius: "16px",
          paddingBottom: "10px",
          backgroundColor: "#fff",
          boxShadow: 1,
          pointerEvents: isFormValid ? "auto" : "none",
          opacity: isFormValid ? 1 : 0.5,
        }}
      >
        <Stepper
          steps={STEPS}
          activeStep={activeStep}
          stepIconColor="#837F39"
          connectorColor="#9E9E9E"
          onStepClick={(stepIndex) => {
            if (isFormValid) {
              history.push(STEPS[stepIndex].path);
            }
          }}
        />
      </Box>

      <div
        className="card p-3"
        style={{ borderRadius: "20px", marginTop: "20px" }}
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
            {isEditMode ? "Edit Objective" : "Create Objective"}
          </Typography>

          <form>
            <Box mb={3}>
              <Typography component="label">Objective*</Typography>
              <InputTextComponent
                value={formData.objective}
                onChange={(e) => handleInputChange("objective", e.target.value)}
                fullWidth
              />
            </Box>

            <Box mb={3}>
              <Typography component="label">Weight*</Typography>
              <InputTextComponent
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                fullWidth
                type="number"
              />
            </Box>

            <Box display="flex" gap={3} mb={3}>
              <Box flex={1}>
                <Typography component="label">Owner</Typography>
                <SelectComponent
                  value={formData.owner}
                  onChange={(e) => handleInputChange("owner", e.target.value)}
                  options={OWNER_OPTIONS}
                  fullWidth
                />
              </Box>
              <Box flex={1}>
                <Typography component="label">Due Date</Typography>
                <InputTextComponent
                  type="date"
                  value={formData.dueDate || ""}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  fullWidth
                  placeholder="dd/mm/yyyy"
                />
              </Box>
            </Box>

            <Box mb={3}>
              <Typography component="label">Dimension*</Typography>
              <SelectComponent
                value={formData.dimension}
                onChange={(e) => handleInputChange("dimension", e.target.value)}
                options={DIMENSION_OPTIONS}
                fullWidth
              />
            </Box>

            <Progress
              value={formData.progress}
              onChange={(e) =>
                handleInputChange("progress", Number(e.target.value))
              }
            />

            <Box mt={2}>
              <Typography fontWeight={500} fontSize={16}>
                Upload File
              </Typography>
              <FileUpload
                value={formData.file}
                onFileUpload={handleFileChange}
              />
            </Box>

            <Box display="flex" justifyContent="center" gap={2} mt={4}>
              <Button
                variant="outlined"
                onClick={handleSaveObjective}
                disabled={!isFormValid || loading}
                sx={{
                  color: "#73712A",
                  borderColor: "#73712A",
                  borderRadius: "30px",
                  padding: "12px 30px",
                  fontWeight: "bold",
                  "&:disabled": { opacity: 0.7 },
                }}
              >
                {loading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Objective"
                  : "Save Details"}
              </Button>

              {!isEditMode && (
                <Button
                  variant="contained"
                  onClick={handleAddKrClick}
                  disabled={!isFormValid}
                  sx={{
                    backgroundColor: "#73712A",
                    borderRadius: "30px",
                    padding: "12px 30px",
                    fontWeight: "bold",
                    "&:disabled": { opacity: 0.7 },
                    "&:hover": { backgroundColor: "#5a581f" },
                  }}
                >
                  Add KR
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </div>
    </div>
  );
}
