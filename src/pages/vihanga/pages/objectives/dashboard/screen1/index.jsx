// Dashboard1.js
import React, { useEffect, useState } from "react";
import { Box, Typography, Card } from "@mui/material";
import TaskTable3 from "./table";
import OKRCard from "./employeeDetailsCard";
import { DoughnutChartComponent3 } from "../../chats/me/chat1";
import { DoughnutChartComponent4 } from "../../chats/me/chart2";
import ToggleTabs from "../../../../components/commonSwichButtons";
import { totalQuartersData } from "pages/Objectives/ObjectivesTable/getMonthsData";
import useGetEmployees, { useGetObjectives } from "pages/Objectives/hooks/useGetEmployees";
import { useSelector } from "react-redux";
import { AuthRole, OKRperiod, removeDuplicates } from "utilities";
import { tableGenerator } from "pages/Objectives/ObjectivesTable/transformTable";
const Dashboard1 = () => {
  const currentTab = useSelector((store) => store.user.currentTab);
  const [companyInfo, setCompanyInfo] = useState({
    companyEntityName: "",
    employeeName: "",
    employeeNames: "",
    country: "",
    status: "Active",
    userId: 1,
    _id: null,
    okrPeriod: localStorage.getItem("okrPeriod") ? JSON.parse(localStorage.getItem("okrPeriod")).okrPeriod : "Q1",
    okrYear: localStorage.getItem("okrYear") ? JSON.parse(localStorage.getItem("okrYear")).okrYear : new Date().getFullYear().toString(),
  });

  const [loading, setLoading] = useState(false);
  const [topData, setTopData] = useState({});
  const { data: employeeResponse } = useGetEmployees();
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const selectedTab = JSON.parse(localStorage.getItem("selectedTab")) || null;

  const fetchEmployees = () => {
    try {
      const { data = [] } = employeeResponse || {};
      if (data?.length > 0) {
        const updatedData = data.filter(item => {
          if (selectedTab?.tab === "me") {
            return user?._id === item._id;
          } else if (selectedTab?.tab === "myteam" && (AuthRole === "HR Admin" || AuthRole === "Super Admin")) {
            return user && item.employmentInformation;
          } else {
            return user && item.employmentInformation?.lineManager === user._id || item._id === user._id;
          }
        }).map((item) => ({
          key: `${item.personalInformation.firstName} ${item.personalInformation.lastName}`,
          value: item._id,
        }));

        const nonduplicates = removeDuplicates(updatedData, "key");
        const updatedData2 = { 
          ...companyInfo,
          employeeName: nonduplicates[0]?.value || "",
          employeeNames: nonduplicates[0]?.key || "",
          okrPeriod: OKRperiod[0]?.value || "Q1",
          okrYear: window.moment(new Date()).format('YYYY')
        };

        // Initialize localStorage if empty
        if (!localStorage.getItem("okrPeriod")) {
          localStorage.setItem("okrPeriod", JSON.stringify({ okrPeriod: "Q1" }));
        }
        if (!localStorage.getItem("okrYear")) {
          localStorage.setItem("okrYear", JSON.stringify({ okrYear: new Date().getFullYear().toString() }));
        }
        if (!localStorage.getItem("userData") && nonduplicates[0]) {
          localStorage.setItem("userData", JSON.stringify({
            ownerName: nonduplicates[0].key,
            ownerId: nonduplicates[0].value,
          }));
        }

        setCompanyInfo(updatedData2);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [employeeResponse]);

  const { data: objectivesResponse, refetch } = useGetObjectives(
    currentTab,
    companyInfo.okrYear,
    companyInfo.okrPeriod
  );

  const getData = (data) => {
    const existingUser = JSON.parse(localStorage.getItem("userData")) || null;
    const filteredData = data?.filter(
      (item) => item.employeeName === (existingUser?.ownerName || companyInfo.employeeNames)
    ) || [];
    
    const result = tableGenerator(filteredData, filteredData.length, filteredData);
    const quartersData = totalQuartersData(result, companyInfo);
    setTopData(quartersData);
  };

  useEffect(() => {
    if (objectivesResponse?.data?.length > 0) {
      getData(objectivesResponse.data);
    }
  }, [objectivesResponse, companyInfo.okrYear, companyInfo.okrPeriod]);

  return (
    <Card sx={{ padding: "20px", borderRadius: "16px", backgroundColor: "#fff", margin: "20px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ backgroundColor: "#FFFCD2", padding: "4px 28px", color: "#0E0E0E", fontFamily: "Montserrat", fontWeight: 600, fontSize: "14px", borderRadius: "20px" }}>
          HI Suprabha! Your Objectives are off track to be completed by due date!
        </Typography>
        <ToggleTabs />
      </Box>

      <Box sx={{ display: "flex", width: "100%", gap: "12px", height: "294px", margin: "20px" }}>
        <Box sx={{ flex: 2 }}>
          <OKRCard companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <DoughnutChartComponent4 topData={topData}  companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />
        </Box>
        <Box sx={{ flex: 1.5 }}>
          <DoughnutChartComponent3 topData={topData}  companyInfo={companyInfo} setCompanyInfo={setCompanyInfo}/>
        </Box>
      </Box>

      <Box sx={{ margin: "10px" }}>
        <TaskTable3 data={objectivesResponse} refetchObjectives={refetch} />
      </Box>
     
    </Card>
  );
};

export default Dashboard1;