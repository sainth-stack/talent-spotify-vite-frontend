import React from "react";
import {
  Stepper as MuiStepper,
  Step as MuiStep,
  StepLabel as MuiStepLabel,
  StepConnector,
  Grid,
  Box,
  StepIconProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const Stepper = ({
  steps,
  activeStep,
  orientation = "horizontal",
  alternativeLabel = true,
  connectorColor = "#9F9F9F",
  stepIconColor = "#BEA781",
  stepIconSize = 30,
  stepIconBorderWidth = 2,
  connectorHeight = 45,
  labelPosition = "top",
  onStepClick,
  sx = {}
}) => {
  const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
    "& .MuiStepConnector-line": {
      borderColor: connectorColor,
      borderTopWidth: stepIconBorderWidth,
      marginTop: connectorHeight,
      borderTop: `4px solid ${connectorColor}`,
      borderRadius: "2px",
    },
  }));

  const CustomStepIconRoot = styled("div")(({ ownerState }) => ({
    width: stepIconSize,
    height: stepIconSize,
    borderRadius: "50%",
    border: `${stepIconBorderWidth}px solid ${
      ownerState.active || ownerState.completed ? stepIconColor : connectorColor
    }`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: onStepClick ? "pointer" : "default",

    "&::after": {
      content: '""',
      width: stepIconSize - 8,
      height: stepIconSize - 8,
      borderRadius: "50%",
      backgroundColor:
        ownerState.active || ownerState.completed
          ? stepIconColor
          : connectorColor,
    },
  }));

  const CustomStepIcon = ({ active, completed }) => {
    return <CustomStepIconRoot ownerState={{ active, completed }} />;
  };

  const handleStepClick = (index) => {
    if (onStepClick) {
      onStepClick(index);
    }
  };
console.log(activeStep)
  return (
    <Grid container direction="column" alignItems="center" paddingBottom="15px">
      <Box width="100%">
        <MuiStepper
          orientation={orientation}
          alternativeLabel={alternativeLabel}
          activeStep={activeStep}
          connector={<CustomStepConnector />}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            "& .MuiStepConnector-root": {
              top: "20px", // Adjust this value as needed
              left: "calc(-50% + 20px)", // Adjust based on your icon size
              right: "calc(50% + 20px)", // Adjust based on your icon size
            },
            "& .MuiStepConnector-line": {
              borderColor: "#7a7a52", // Your desired line color
              borderTopWidth: "2px", // Adjust line thickness
            },
          }}
        >
          {steps.map((step, index) => (
            <MuiStep key={step.label} completed={index < activeStep}>
              <MuiStepLabel
                optional={step.optional}
                StepIconComponent={() => (
                  <div onClick={() => handleStepClick(index)}>
                    <CustomStepIcon
                      active={index === activeStep}
                      completed={index < activeStep}
                    />
                  </div>
                )}
                sx={{
                  display: "flex",
                  flexDirection:
                    labelPosition === "top"
                      ? "column-reverse !important "
                      : "column",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center",
                  "&.MuiStepConnector-root": {
                    // height:'20px',
                    top: "20px",
                  },
                  "& .MuiStepLabel-label": {
                    color:
                      index === activeStep ? "#837F39 !important" : "#9F9F9F",
                    fontSize: "12px",
                    fontFamily: "Inter !important",
                    fontWeight: "500",
                    maxHeight: "20px",
                    marginBottom: "10px",
                  },
                }}
              >
                <span style={{}}>{step.label}</span>
              </MuiStepLabel>
            </MuiStep>
          ))}
        </MuiStepper>
      </Box>
    </Grid>
  );
};

export default Stepper;
