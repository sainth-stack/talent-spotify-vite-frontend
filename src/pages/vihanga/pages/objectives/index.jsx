import React from "react";
import CreateObjectiveCard from "./pages/Create";
import Details from "./pages/Details";
import AddTaskForm from "./pages/Task";
import RecurrencePopup from "./pages/Recurrance";
import Details2 from "./pages/Details2";

import BellCurveChart from "./pages/Graph";

import TaskTable2 from "../objectives/team/table/Ctable";
import TaskTable1 from '../objectives/me/table/table';
import TaskTable3 from '../objectives/dashboard/screen1/table'
import TaskTable4 from "./dashboard/screen2/table";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {DoughnutChartComponent1 } from './chats/chat'
import {DoughnutChartComponent2} from './chats/chat2'
import {DoughnutChartComponent4} from './chats/me/chart2'
import {DoughnutChartComponent3} from './chats/me/chat1'
import {Box} from '@mui/material'
import LeaveTable2 from "../employeePortal/TimeTracking/weeklyTimeCard/table";
import LeaveTable from '../employeePortal/absencetimeoff/leaveHistory/index';
import LeaveTable3 from "../employeePortal/TimeTracking/weeklyTimeEntries/table";
import LeaveTable4 from "../employeePortal/TimeTracking/timeSheetHistiory/table";
import LeaveTable5 from "../employeePortal/documentVerification/documentSubmited/table";
import ApplyLeave from "../employeePortal/absencetimeoff/applyforLeave/ApplyforLeave";
import ExitInterView from "../employeePortal/ExitInterViewQuestions";
import DocumentUpload from './../employeePortal/DocumentUpload/index';
import DocumentForum from "../employeePortal/documentVerification/DocumentForum";
import Dashboard from '../objectives/dashboard/screen1/index'
const Objectives2 = () => {
  return (
    <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
      {/* <Dashboard />
      <ExitInterView />
      <ApplyLeave />
      <LeaveTable/>
      <LeaveTable2 />
      <LeaveTable3 />
      <LeaveTable4 />
      <LeaveTable5 /> */}
      <CreateObjectiveCard />
      {/* <Details />
      <AddTaskForm />
      <RecurrencePopup />
      <Details2 />
      <Box sx={{display:"flex",gap:"12px"}}>
      <DoughnutChartComponent1 />
      <DoughnutChartComponent2 />
      </Box>
      <Box sx={{display:"flex",gap:"12px"}}>
      <DoughnutChartComponent3 />
      <DoughnutChartComponent4 />
      </Box>

      <TaskTable2 />
      
      <TaskTable1 />
      <TaskTable3 />
      <TaskTable4 /> */}
      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>

</LocalizationProvider> */}
    </div>
  );
};

export default Objectives2;
