import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import Card1 from "./filterSection/cards/card1";
import ApprovalWorkflowCard from "./components/topSection";
import WorkflowFilterCard from "./filterSection/filterSection";
import { appURL } from "utilities";
import { useHistory } from "react-router-dom";


const ApprovalWorkFlow = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  const companyId =
  localStorage.getItem("companyId") !== null
    ? JSON.parse(localStorage.getItem("companyId"))
    : null;
  const fetchWorkflows = async () => {
    try {
      const response = await axios.get(
        `${appURL}/recruitment/workflow?companyId=${companyId}`
      );
      console.log("response", response.data.data);

      const workflowArray = response?.data?.data;

      console.log("workflowArray", workflowArray);
      if (response?.data?.success && Array.isArray(workflowArray)) {
        setWorkflows(workflowArray);
      } else {
        setError("Failed to retrieve workflows");
      }
    } catch (err) {
      setError("Error fetching workflows");
    } finally {
      setLoading(false);
    }
  };
 useEffect(() => {

   fetchWorkflows();
 }, []);

 const handleDelete = async (workflowId) => {
  try {
   const response = await axios.delete(
     `${appURL}/recruitment/workflow?id=${workflowId}&companyId=${companyId}`
   );
    if (response?.data?.success) {
      fetchWorkflows()
    }
    console.log("response", response.data);
  } catch (err) {
    console.log("error", err);
  }
 }
  const handleEdit = (workflowId) => {
    const selectedWorkflow = workflows.find(
      (workflow) => workflow._id === workflowId
    );

    if (!selectedWorkflow) {
      console.error("Workflow not found for ID:", workflowId);
      setError("Workflow not found");
      return;
    }

    history.push({
      pathname: "/admin/approval",
      state: {
        isEdit: true,
        workflowId,
        workflow: selectedWorkflow,
      },
    });
  };
  

  return (
    <Box sx={{}}>
      <ApprovalWorkflowCard />
      <WorkflowFilterCard />
      <Box sx={{ p: 3, bgcolor: "#f5f5f5" }}>
        {loading && <Box>Loading...</Box>}
        {error && <Box color="error.main">{error}</Box>}
        {!loading && !error && workflows.length === 0 && (
          <Box>No workflows found</Box>
        )}
        {!loading && !error && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {workflows.map((workflow) => (
              <Card1
                key={workflow._id}
                workflow={workflow}
                handleDelete={handleDelete}
                handleEdit={() => handleEdit(workflow._id)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};


export default ApprovalWorkFlow;