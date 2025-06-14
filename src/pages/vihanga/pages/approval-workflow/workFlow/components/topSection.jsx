import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useHistory } from "react-router-dom"; // 🔹 Import useNavigate

const ApprovalWorkflowCard = () => {
  const history = useHistory();// 🔹 Initialize navigate

  const handleNewWorkflowClick = () => {
    history.push("/admin/approval"); // 🔹 Navigate on button click
  };

  return (
    <Card
      sx={{
        borderRadius: "20px",
        backgroundColor: "#ffffff",
        p: 2,
        height: "8rem",
        m: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
      }}
    >
      <CardContent sx={{ padding: "0 !important" }}>
        <Typography
          sx={{
            fontFamily: "Montserrat",
            fontSize: "32px",
            color: "#0E0E0E",
            marginBottom: "15px",
            paddingTop: "24px",
          }}
          fontWeight="600"
        >
          Approval Workflow
        </Typography>
        <Typography
          sx={{
            color: "#707070",
            fontSize: "16px",
            fontFamily: "Work Sans",
            fontWeight: "500",
            paddingBottom: "65px",
          }}
        >
          Configure and manage approval chain for different transactions types
        </Typography>
      </CardContent>

      <Button
        variant="contained"
        startIcon={<AddIcon sx={{ height: "24px", width: "24px" }} />}
        onClick={handleNewWorkflowClick} // 🔹 Add onClick
        sx={{
          backgroundColor: "#837F39",
          borderRadius: "999px",
          fontFamily: "Work Sans",
          color: "#FFFFFF",
          px: 3,
          textTransform: "none",
          fontWeight: 500,
          "&:hover": {
            backgroundColor: "#75702d",
          },
        }}
      >
        New Work Flow
      </Button>
    </Card>
  );
};

export default ApprovalWorkflowCard;
