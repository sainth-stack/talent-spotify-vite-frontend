import React from "react";
import AddApprovalHeader from "./addApprovalHeader";
import SelectCard from "./bodySection";
import { useLocation } from "react-router-dom"; 

const AddApprovalStep = () => {
  const location = useLocation(); 

  return (
    <div>
      <AddApprovalHeader />
    
      <SelectCard
        selected={location.state?.selected}
        workflowDetails={location.state?.workflowDetails}
        approvalChain={location.state?.approvalChain}
        step={location.state?.step || 0}
        isEdit={location.state?.isEdit}
        workflowId={location.state?.workflowId}
      />
    </div>
  );
};

export default AddApprovalStep;
