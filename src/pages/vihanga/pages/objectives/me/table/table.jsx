import React, { useState } from "react";
import CustomTable from "../../../../components/CustomTable/index";
import {
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button
  
} from "@mui/material";
import { Add, Edit, MoreVert } from "@mui/icons-material";
import CommentIcon from "@mui/icons-material/Comment";
import messageIcon from '../../../../../../assets/svg/messageIcon.svg';
import addButtonIcon from '../../../../../../assets/svg/addButtonIcon.svg'
import Checkbox from '@mui/material/Checkbox';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'; // or use TaskOutlined
import {mockData} from '../table/data'
import CheckIcon from '@mui/icons-material/Check'; // using simple check mark
import dropDownTable from '../../../../../../assets/svg/downArrowTable.svg'

import AddIcon from '@mui/icons-material/Add';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

import ToggleTabs from '../../../../components/commonSwichButtons'




const TaskTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedTasks, setSelectedTasks] = useState({}); // ✅

  const handleCheckboxChange = (id) => { // ✅
    setSelectedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const columns = [
    {
        id: "task",
        label: "Task",
        render: (row) => (
          <Box sx={{ display: "flex", alignItems: "center", gap:1 }}>
            <img src={dropDownTable} alt ="alt" />
<Checkbox
  checked={selectedTasks[row.id] || false}
  onChange={() => handleCheckboxChange(row.id)}
  icon={
    <Box
      sx={{
        width: 24,
        height: 24,
        backgroundColor: '#FFFFFF',
        border: '1px solid #535353',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  }
  checkedIcon={
    <Box
      sx={{
        width: 24,
        height: 24,
        backgroundColor: '#837F39',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CheckIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />
    </Box>
  }
  sx={{ padding: 0 }}
/>



            <FormatListBulletedIcon sx={{ width:"18px",height:"18px", color: "#837F39" ,cursor:"pointer"}} />
            <Typography
              fontWeight={500}
              sx={{
                fontSize: "14px",
                lineHeight: "19px",
                color: "#535353",
                fontFamily: "Work Sans",
                fontWeight:"400"
              }}
            >
              {row.task}
            </Typography>
          </Box>
        ),
      },
      
    {
      id: "status",
      label: "Progress & Status",
      render: (row) => (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={1.5}
        >
          <Box sx={{ position: "relative", width: 110, height: 11 }}>
            <LinearProgress
              variant="determinate"
              value={row.progress}
              sx={{
                height: "100%",
                borderRadius: 50,
                backgroundColor: "#E9E8E7",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#EF3838",
                  borderRadius: 95,
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                color: "#FFFFFF",
                fontWeight: "400",
                fontSize: "6.67px",
                fontFamily: "Work Sans",
              }}
            >
              {row.progress}%
            </Typography>
          </Box>
          <Chip
            label={row.dueDate}
            size="small"
            sx={{
              backgroundColor: "#EF3838",
              color: "#FFFFFF",
              height: "17px",
              borderRadius: "100px",
              fontFamily: "Work Sans",
              fontWeight: 400,
              fontSize: "10px",
              lineHeight: "100%",
              letterSpacing: "3%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </Box>
      ),
    },
    {
      id: "owner",
      label: "Owner",
      render: (row) => (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={0.5}
        >
          <Typography
            fontSize={14}
            color="#707070"
            sx={{ fontFamily: "Work Sans", fontWeight: "400" }}
          >
            {row.owner}
          </Typography>
          <Chip
            label={row.ownerRole}
            size="small"
            sx={{
              backgroundColor: "#26925F",
              color: "#fff",
              fontSize: "12px",
              height: "22px",
              padding: "0 6px",
              fontWeight: 500,
            }}
          />
        </Box>
      ),
    },

    {
      id: "priority",
      label: "Priority Level",
      render: (row) => {
        const getPriorityColor = (priority) => {
          switch (priority) {
            case "High":
              return {
                backgroundColor: "#EF3838",
                color: "#FFFFFF",
              };
            case "Medium":
              return {
                backgroundColor: "#E9C034",
                color: "#FFFFFF",
              };
            default:
              return {
                backgroundColor: "#E0E0E0",
                color: "#000",
              };
          }
        };

        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Chip
              label={row.priority}
              size="small"
              sx={{
                fontWeight: 400,
                fontSize: "14px",
                height: "23px",
                width: "73px",
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Work Sans",
                color: "#FFFFFF", // white text

                ...getPriorityColor(row.priority),
              }}
            />
          </Box>
        );
      },
    },

    {
      id: "comments",
      label: "Comments",
      render: (row) => (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap={1}
        >
          <img src={messageIcon} sx={{ fontSize: 18 }} />
          <Typography variant="body2">{row.comments}</Typography>
        </Box>
      ),
    },
    {
      id: "subTask",
      label: "Sub Task",
      render: (row) => (
        <Tooltip title="Add Subtask">
          <img src={addButtonIcon} />
        </Tooltip>
      ),
    },
    {
      id: "actions",
      label: "Action",
      render: (row) => (
        <IconButton>
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Box>
        <ToggleTabs />
      </Box>
    <Box>
      <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center" 
      p={2}
    >
      {/* Title */}
      <Typography variant="h6" fontWeight="bold">
        Tasks
      </Typography>

      {/* Buttons */}
      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: '#8A8543',
            borderRadius: 999,
            textTransform: 'none',
            '&:hover': { backgroundColor: '#7c7b3b' },
          }}
        >
          Create New Task
        </Button>
        <Button
          variant="outlined"
          startIcon={<InsertDriveFileOutlinedIcon />}
          sx={{
            borderColor: '#8A8543',
            color: '#8A8543',
            borderRadius: 999,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(138, 133, 67, 0.1)',
              borderColor: '#8A8543',
            },
          }}
        >
          Google Sheet
        </Button>
      </Box>
    </Box>
      </Box>
      <CustomTable
      columns={columns}
      data={mockData}
      page={page}
      setPage={setPage}
      rowsPerPage={rowsPerPage}
      setRowsPerPage={setRowsPerPage}
      totalPages={Math.ceil(mockData.length / rowsPerPage)}
      pagination
      

    />
      </Box>
  );
};

export default TaskTable;
