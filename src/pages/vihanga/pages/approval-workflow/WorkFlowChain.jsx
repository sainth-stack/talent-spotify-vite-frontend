import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Snackbar, Alert } from "@mui/material";
import { InputTextComponent } from "./../../components/input-elements/text";
import { useHistory, useLocation } from "react-router-dom";
import StepperCardGroup from "./workFlow/components/steperGroup/steperCardGroup";

const WorkFlowChain = ({ data, onChange, selected, workflowDetails }) => {
  const history = useHistory();
  const location = useLocation();
  const [newStep, setNewStep] = useState("");
  const [error, setError] = useState(null);

  // Ensure approvalChain is an object
  const approvalChain = data || {};

  // Convert to array for StepperCardGroup
  const approvalChainArray = Object.keys(approvalChain)
    .sort((a, b) => Number(a) - Number(b))
    .map((step) => approvalChain[step]);

  useEffect(() => {
    if (location.state?.newApprovers) {
      const newApprovers = location.state.newApprovers;
      const currentStep =
        location.state?.step?.toString() ||
        Object.keys(approvalChain).length.toString();
      console.log("WorkFlowChain useEffect - Adding new approvers:", {
        currentStep,
        newApprovers,
        approvalChain,
      });
      onChange({
        ...approvalChain,
        [currentStep]: newApprovers,
      });
      history.replace({ ...location, state: {} });
    }
  }, [location.state, approvalChain, onChange, history]);

  const handleAddStep = () => {
    if (!selected || !workflowDetails) {
      setError("Please complete transaction type and workflow details first");
      console.error("WorkFlowChain handleAddStep - Missing data:", {
        selected,
        workflowDetails,
      });
      return;
    }

    const navigationState = {
      selected,
      workflowDetails,
      approvalChain,
      step: Object.keys(approvalChain).length,
      isEdit: location.state?.isEdit || false,
      workflowId: location.state?.workflowId,
    };
    console.log(
      "WorkFlowChain handleAddStep - Navigating to /admin/add-approval:",
      navigationState
    );

    history.push({
      pathname: "/admin/add-approval",
      state: navigationState,
    });
  };

  const handleStepClick = (stepIndex) => {
    if (!selected || !workflowDetails) {
      setError("Please complete transaction type and workflow details first");
      console.error("WorkFlowChain handleStepClick - Missing data:", {
        selected,
        workflowDetails,
      });
      return;
    }

    const navigationState = {
      selected,
      workflowDetails,
      approvalChain,
      step: stepIndex,
      isEdit: location.state?.isEdit || false,
      workflowId: location.state?.workflowId,
    };
    console.log(
      "WorkFlowChain handleStepClick - Navigating to /admin/add-approval:",
      navigationState
    );

    history.push({
      pathname: "/admin/add-approval",
      state: navigationState,
    });
  };

  console.log("WorkFlowChain - Data:", {
    approvalChain,
    approvalChainArray,
    selected,
    workflowDetails,
    isEdit: location.state?.isEdit,
    workflowId: location.state?.workflowId,
  });

  return (
    <Box
      sx={{
        borderRadius: "16px",
        p: 4,
        backgroundColor: "#fff",
        maxWidth: "100%",
        mx: "auto",
        mt: 1.5,
      }}
    >
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Typography fontWeight="bold" fontSize="20px" mb={1}>
        Configure Approval Chain
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Define the sequence of approvers for this workflow
      </Typography>

      <Typography fontWeight="bold" mb={2}>
        Current Approval Chain
      </Typography>

      {Object.keys(approvalChain).length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 5,
            borderRadius: 3,
            border: "1px solid rgba(244, 244, 244, 1)",
            background: "rgba(255, 255, 255, 1)",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight="medium" mb={2}>
            No Approval Steps Defined Yet
          </Typography>
          <Box>
            <Button
              variant="contained"
              onClick={handleAddStep}
              sx={{
                backgroundColor: "#7a7a52",
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: "bold",
                px: 4,
                py: 1,
                mt: 2,
                "&:hover": {
                  backgroundColor: "#656544",
                },
              }}
            >
              Add First Approval Step
            </Button>
          </Box>
        </Paper>
      ) : (
        <Box>
          <StepperCardGroup
            steps={approvalChainArray}
            addStep={true}
            handleAddStep={handleAddStep}
            onStepClick={handleStepClick}
          />
        </Box>
      )}
    </Box>
  );
};

export default WorkFlowChain;
