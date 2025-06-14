import React, { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { InputTextComponent } from "../../../components/input-elements/text";
import axios from "axios";

const LookupsForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    meaning: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await axios.post(
        "http://localhost:4000/lookups/create",
        formData
      );
      setSuccessMsg("Lookup created successfully!");
      setFormData({ type: "", meaning: "", description: "" }); // Reset form
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to create lookup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          fontFamily: "Work Sans, sans-serif",
          mb: 2,
        }}
      >
        Lookups
      </Typography>

      {successMsg && <Alert severity="success">{successMsg}</Alert>}
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="type"
            label="Type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Enter type"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="meaning"
            label="Meaning"
            value={formData.meaning}
            onChange={handleChange}
            placeholder="Enter meaning"
          />
        </Grid>

        <Grid item xs={12}>
          <InputTextComponent
            id="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            multiline
            minRows={4}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#837F39",
              "&:hover": { backgroundColor: "#6f6b32" },
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LookupsForm;
