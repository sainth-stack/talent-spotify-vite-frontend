import React, { useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { InputTextComponent } from "../../components/input-elements/text"

const WorkFlowDetails = ({ data, onChange }) => {
  const handleChange = (field) => (event) => {
    onChange({
      ...data,
      [field]: event.target.value,
    });
  };

  return (
    <Box maxWidth="600px" mb={4} mt={5}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Workflow Details
      </Typography>
      <Typography variant="body2" mb={3} mt={2}>
        Provide a name and description for this approval workflow
      </Typography>

      <Stack spacing={3}>
        <InputTextComponent
          required
          label="Workflow Name"
          placeholder="e.g., Standard Leave Approval"
          fullWidth
          variant="outlined"
          value={data.name}
          sx={{
            fontWeight: "500",
            color:"#000"
          }}
          onChange={handleChange("name")}
        />
        <InputTextComponent
          required
          label="Description"
          placeholder="Describe the purpose and use cases for this workflow"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={data.description}
          onChange={handleChange("description")}
        />
        <InputTextComponent
          label="Condition"
          placeholder="Optional condition for the workflow"
          fullWidth
          variant="outlined"
          value={data.condition}
          onChange={handleChange("condition")}
        />
      </Stack>
    </Box>
  );
};

export default WorkFlowDetails;
