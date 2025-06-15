import Stepper from "../../../../components/stepper";
import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import CandidateDetailsForm from "./form";
import { useParams } from "react-router-dom";
// import ReportPage from './../../../ReportPages/index';
const CandidateCreate = () => {
  const [activeStep, setActiveStep] = useState(0);
const [status,setStatus]=useState("New Applied")
  const steps = [
    { label: "Candidate Details",value:"New Applied" ,step:0},
    { label: "Psychometric Assessment",value:"Psychometric Test" ,step:1},
    { label: "Interview 1",value:'Interview 1',step:2 },
    { label: "Interview 2",value:"Interview 2", optional: true,step:3 },
    { value: "Document Upload", label: "Document Verification",step:4 },
    { label: "Offer",step:5 ,value:["Shortlisted","Offer Letter"]},
    { label: "Onboarding",step:6,value:"Onboarding" },
  ];
  const { candidateId:id  } = useParams();

  console.log("id",id)
  useEffect(()=>{
if(status){
  const step2=steps.filter((item)=>{
    if(item?.value?.length>0){
     return item.value.includes(status)
    } else {
     return item.value ===status
    }
  })?.[0]?.step;
  setActiveStep(step2)
}
  },[status])

  return (
    <div>
      <Card
        sx={{
          backgroundColor: "#FFFFFF",
          boxShadow: 0,
          borderRadius: "16px",
          marginX: "30px",
          marginTop: "30px",
          marginBottom: "30px",
          border: "1px solid #565656",
        }}
      >
        <div style={{ padding: 20 }}>
          <Stepper
            steps={steps}
            activeStep={activeStep}
            stepIconColor="#837F39"
            connectorColor="#9E9E9E"
            onStepClick={(stepIndex) => setActiveStep(stepIndex)}
          />
        </div>
      </Card>
      <CandidateDetailsForm id={id} setStatus={setStatus} />
      {/* <ReportPage candidateId={id}/> */}
    </div>
  );
};

export default CandidateCreate;
