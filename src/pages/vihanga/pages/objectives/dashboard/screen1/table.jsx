import React, { useState } from "react";
import CustomTable from "../../../../components/CustomTable/index";
import EditSvgIcon from "../../../../../../../src/assets/svg/EditSvg.svg";
import DeleteSvgIcon from "../../../../../../../src/assets/svg/DeleteSvg.svg";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Checkbox,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";
import addButtonIcon from "../../../../../../assets/svg/addButtonIcon.svg";
import taskIcon from "../../../../../../assets/svg/obticon.svg";
import { useDispatch } from "react-redux";
import { deleteObjectives } from "action/GoalsAct";
import { useHistory } from "react-router-dom";
import CascadedPopup from "pages/Goals/OkrDetails/CascadedPopup";
import { handleCascade } from "pages/Objectives/ObjectivesTable/handleFunctions";

const ActionMenu = ({ row, handleEdit, handleDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ position: "relative" }}>
      <IconButton onClick={handleMenuClick} size="small">
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "1rem",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            border: "1px solid #eee",
            minWidth: "200px",
          },
        }}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleEdit(row);
          }}
        >
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <img src={EditSvgIcon} alt="Edit" width="18" height="18" />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            sx={{
              color: "#6D6D6D",
              fontWeight: "500",
              fontSize: "14px",
              letterSpacing: "1%",
            }}
          />
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleDelete(row);
          }}
        >
          <ListItemIcon sx={{ minWidth: "30px" }}>
            <img src={DeleteSvgIcon} alt="Delete" width="18" height="18" />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            sx={{
              color: "#6D6D6D",
              fontWeight: "500",
              fontSize: "14px",
              letterSpacing: "1%",
            }}
          />
        </MenuItem>
      </Menu>
    </div>
  );
};

const TaskTable3 = ({ data, isLoading, refetchObjectives }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [multipleObjectives, setMultipleObjectives] = useState(false);
  const [objectiveId, selectedObjectiveId] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState();

  const [selectedStatus, setSelectedStatus] = useState([
    "OnTrack",
    "AtRisk",
    "OffTrack",
  ]);
  const [visibleColumns, setVisibleColumns] = useState([
    "Objective",
    "Progress",
    "owner",
    "weight",
    "status",
    "actions",
    "Add KR",
  ]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [isCompanyOKRsFilterActive, setIsCompanyOKRsFilterActive] =
    useState(false);
  const [orderModalShow4, setOrderModalShow4] = useState(false);

  const getProgressLabel = (progress) => {
    if (progress >= 80)
      return { label: "OnTrack", color: "white", backgroundColor: "#4CAF50" };
    if (progress >= 50)
      return { label: "AtRisk", color: "white", backgroundColor: "#FFC107" };
    return { label: "OffTrack", color: "white", backgroundColor: "#F44336" };
  };

  const mappedData =
    data?.data?.map((item) => ({
      id: item._id,
      task: item.objective || "N/A",
      description: item.dimension || "N/A",
      progress: parseInt(item.progressStatus) || 0,
      dueDate: item.dueDate
        ? new Date(item.dueDate).toLocaleDateString()
        : "N/A",
      owner: item.owner || "N/A",
      ownerRole: item.employeeName || "N/A",
      weight: item.weight || 0,
      status: item.approvalRequired || false,
      type: "objective",
      isAlignedToCompany: item.isAlignedToCompany || false,
      children:
        item.children?.map((kr) => ({
          id: kr._id,
          objectiveId: item._id,
          task: kr.keyResultName || "N/A",
          description: kr.dimension || "N/A",
          progress: parseFloat(kr.percent) || 0,
          dueDate: kr.targetDate
            ? new Date(kr.targetDate).toLocaleDateString()
            : "N/A",
          owner: kr.owner || "N/A",
          ownerRole: "Key Result",
          weight: kr.weight || 0,
          status: kr.approvalRequired || false,
          isAlignedToCompany: kr.isAlignedToCompany || false,
          type: "keyresult",
          children:
            kr.children?.map((task) => ({
              id: task._id,
              objectiveId: item._id,
              keyResultId: kr._id,
              task: task.title || "N/A",
              description: task.description || "N/A",
              progress: task.progressStatus || 0,
              dueDate: task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "N/A",
              owner: task.assignTo?.[0] || "N/A",
              ownerRole: "Task",
              weight: 0,
              status: task.status || "N/A",
              type: "task",
            })) || [],
        })) || [],
    })) || [];

  const searchLower = search.toLowerCase();

  const filteredData = mappedData.filter((item) => {
    const searchMatch = (text) =>
      text?.toString().toLowerCase().includes(searchLower);

    const matchesObjective = [
      item.task,
      item.description,
      item.owner,
      item.ownerRole,
    ].some(searchMatch);

    const matchesNested = item.children?.some((kr) => {
      const krMatch = [kr.task, kr.description, kr.owner].some(searchMatch);
      const taskMatch = kr.children?.some((task) =>
        [task.task, task.description, task.owner].some(searchMatch)
      );
      return krMatch || taskMatch;
    });

    const matchesSearch = matchesObjective || matchesNested;

    const { label } = getProgressLabel(item.progress);
    const matchesStatus = selectedStatus.includes(label);

    const passesCompanyOKRFilter =
      !isCompanyOKRsFilterActive ||
      item.isAlignedToCompany === true ||
      item.children?.some((kr) => kr.isAlignedToCompany === true);

    return matchesSearch && matchesStatus && passesCompanyOKRFilter;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const handleCheckboxChange = (row) => {
    setSelectedTasks((prev) => {
      const isSelected = prev.some((item) => item.id === row.id);
      if (isSelected) {
        return prev.filter((item) => item.id !== row.id);
      } else {
        return [...prev, row];
      }
    });
  };

  const handleEdit = (row) => {
    const { type, id, objectiveId, keyResultId } = row || {};
    const fullRow = paginatedData?.find((item) => item.id === row.id);

    if (!type || !id) {
      console.error("Missing required fields in row:", row);
      return;
    }

    const basePath = "/admin/objectives";
    const params = new URLSearchParams({ isEdit: "true" });
    const routeState = { rowData: row };

    let pathname = "";

    switch (type) {
      case "objective":
        pathname = `${basePath}/objective`;
        params.append("objectiveId", id);
        break;
      case "keyresult":
        if (!objectiveId) {
          console.error("Missing objectiveId for keyresult");
          return;
        }
        pathname = `${basePath}/details`;
        params.append("objectiveId", objectiveId);
        params.append("keyResultId", id);
        break;
      case "task":
        if (!objectiveId || !keyResultId) {
          console.error("Missing IDs for task", { objectiveId, keyResultId });
          return;
        }
        pathname = `${basePath}/task`;
        params.append("objectiveId", objectiveId);
        params.append("keyResultId", keyResultId);
        params.append("taskId", id);
        break;
      default:
        console.error("Unknown type:", type);
        return;
    }

    history.push({
      pathname,
      search: params.toString(),
      state: routeState,
    });
  };

  const handleDelete = (row) => {
    try {
      const response = dispatch(
        deleteObjectives({
          data: [row.id],
        })
      );
      response.then(({ success, message }) => {
        if (success) {
          refetchObjectives();
        } else {
          console.error(message);
        }
      });
    } catch (error) {
      console.error(error.toString());
    }
  };

  const handleParentWithChildrenSelection = (parentRow) => {
    setSelectedTasks((prev) => {
      const parentSelected = prev.some((item) => item.id === parentRow.id);

      if (parentSelected) {
        return prev.filter(
          (item) =>
            item.id !== parentRow.id &&
            !parentRow.children?.some((child) => child.id === item.id)
        );
      } else {
        const newSelection = [...prev, parentRow];
        if (parentRow.children) {
          parentRow.children.forEach((child) => {
            if (!newSelection.some((item) => item.id === child.id)) {
              newSelection.push(child);
            }
          });
        }
        return newSelection;
      }
    });
  };

  const transformedTasks = selectedTasks.map((task, index) => ({
    id: index + 1,
    _id: task.id,
    employeeName: task.owner,
    okrPeriod: "Q1",
    objective: task.task,
    dueDate: formatDate(task.dueDate),
    weight: task.weight,
    rewardPoints: 0,
    owner: task.owner,
    progressStatus: String(task.progress),
    employeeReferenceId: "6274e23696bf9824e441be16",
    updatedAt: new Date().toISOString(),
    children: task.children,
    cascaded: false,
    dimension: task.description,
    objectiveStatus: "Create",
    IndividualNames: [],
    IndividualProgress: [],
    eachPercentage: [],
    randomColors: [],
  }));

  function formatDate(inputDate) {
    if (!inputDate) return "";
    const [month, day, year] = inputDate.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    return date
      .toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, " ");
  }

  const handleBulkDelete = () => {
    try {
      if (selectedTasks.length > 0) {
        const response = dispatch(deleteObjectives({ data: transformedTasks }));
        response.then(({ success, message }) => {
          if (success) {
            setSelectedTasks([]);
            refetchObjectives();
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      id: "Objective",
      label: "Objective",
      width: 300,
      headerCheckbox: true,
      renderHeader: (selectedCount, totalCount, onSelectAll) => {
        const allSelected = selectedCount === totalCount && totalCount > 0;
        const someSelected = selectedCount > 0 && selectedCount < totalCount;

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              icon={
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #535353",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              }
              checkedIcon={
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: "#837F39",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckIcon sx={{ fontSize: 18, color: "#FFFFFF" }} />
                </Box>
              }
              indeterminateIcon={
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: "#837F39",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 18, color: "#FFFFFF" }} />
                </Box>
              }
            />
            <Typography
              sx={{
                fontFamily: "Montserrat",
                fontSize: "16px",
                color: "rgba(0, 0, 0, 0.87)",
                fontWeight: "600",
              }}
            >
              Objective
            </Typography>
          </Box>
        );
      },
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "start", gap: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <Checkbox
              checked={selectedTasks.some((item) => item.id === row.id)}
              onChange={() =>
                row.children
                  ? handleParentWithChildrenSelection(row)
                  : handleCheckboxChange(row)
              }
              icon={
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #535353",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              }
              checkedIcon={
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: "#837F39",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckIcon sx={{ fontSize: 18, color: "#FFFFFF" }} />
                </Box>
              }
              sx={{ padding: 0 }}
            />
            <img src={taskIcon} alt="icon" />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <Box
              component="button"
              sx={{
                fontSize: "16px",
                lineHeight: "19px",
                color: "#0E0E0E",
                fontFamily: "Work Sans",
                fontWeight: "600",
                maxWidth: 200,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "left",
                textDecoration: "none",
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: 0,
                "&:hover": {
                  textDecoration: "none",
                },
              }}
              onClick={() => {
                if (row.type === "objective") {
                  history.push(
                    `/admin/objectives/objective?objectiveId=${row.id}`
                  );
                } else if (row.type === "keyresult") {
                  history.push(
                    `/admin/objectives/details?objectiveId=${row.objectiveId}&keyResultId=${row.id}`
                  );
                } else if (row.type === "task") {
                  history.push(
                    `/admin/objectives/task?objectiveId=${row.objectiveId}&keyResultId=${row.keyResultId}&taskId=${row.id}`
                  );
                }
              }}
            >
              {row.task}
            </Box>
            <Typography
              sx={{
                fontSize: "14px",
                lineHeight: "19px",
                color: "#535353",
                fontFamily: "Work Sans",
                fontWeight: "400",
                maxWidth: 200,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {row.description}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: "Progress",
      label: "Progress",
      width: 160,
      render: (row) => {
        const { label, color, backgroundColor } = getProgressLabel(
          row.progress
        );
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap={1.5}
          >
            <Box sx={{ display: "flex", gap: "5px" }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: backgroundColor,
                  fontFamily: "Work Sans",
                }}
              >
                {row.progress}%
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color,
                  padding: "5px",
                  backgroundColor,
                  borderRadius: "50px",
                  fontFamily: "Work Sans",
                }}
              >
                {label}
              </Typography>
            </Box>
            <Box sx={{ position: "relative", width: 110, height: 11 }}>
              <LinearProgress
                variant="determinate"
                value={row.progress}
                sx={{
                  height: "100%",
                  borderRadius: 50,
                  backgroundColor: "#E0E0E0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor,
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
                  fontSize: "10px",
                  fontFamily: "Work Sans",
                }}
              >
                {row.progress}%
              </Typography>
            </Box>
            <Chip
              label={row.dueDate || "--"}
              size="small"
              sx={{
                backgroundColor: color,
                color: "#FFFFFF",
                height: "17px",
                borderRadius: "100px",
              }}
            />
          </Box>
        );
      },
    },
    {
      id: "weight",
      label: "Weight",
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <Chip
            label={`${row.weight}%`}
            size="small"
            sx={{
              backgroundColor: "#C5FFE4",
              color: "#26925F",
              fontSize: "14px",
              height: "22px",
              minWidth: "3rem",
              fontWeight: 600,
            }}
          />
        </Box>
      ),
    },
    {
      id: "owner",
      label: (
        <Box
          display="flex"
          justifyContent="center"
          width="100%"
          sx={{ textAlign: "center" }}
        >
          Owner
        </Box>
      ),
      width: 180,
      render: (row) => (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
          gap={0.5}
          sx={{ textAlign: "center" }}
        >
          {row?.owner?.split(" ").length > 1 ? (
            <>
              <Typography
                component="span"
                sx={{
                  fontSize: "16px",
                  fontFamily: "Work Sans",
                  color: "#707070",
                  fontWeight: "400",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {row.owner.split(" ")[0]}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontSize: "12px",
                  fontFamily: "Work Sans",
                  fontWeight: "400",
                  color: "#707070",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {row.owner.split(" ").slice(1).join(" ")}
              </Typography>
            </>
          ) : (
            <Typography
              sx={{
                width: "100%",
                textAlign: "center",
                fontFamily: "Work Sans",
                color: "#707070",
              }}
            >
              {row?.owner || "--"}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: "status",
      label: "Approve/Reject",
      width: 150,
      render: (row) => {
        const getStatusColor = (status) => {
          switch (status) {
            case "Submit":
              return { backgroundColor: "#26925F", color: "#FFFFFF" };
            case "Draft":
              return { backgroundColor: "#FFA500", color: "#FFFFFF" };
            case "Approval Pending":
              return { backgroundColor: "#847f3b", color: "#FFFFFF" };
            case "Approval Required":
              return { backgroundColor: "#9E9E9E", color: "#FFFFFF" };
            default:
              return { backgroundColor: "#E0E0E0", color: "#000" };
          }
        };

        return (
          <Box display="flex" justifyContent="center" width="100%">
            <Chip
              label={row?.status || "--"}
              size="small"
              sx={{
                fontWeight: 400,
                fontSize: "14px",
                height: "23px",
                borderRadius: "100px",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                "& .MuiChip-label": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                },
                ...(row.status ? getStatusColor(row.status) : {}),
              }}
            />
          </Box>
        );
      },
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <ActionMenu
          row={row}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          sx={{ display: "flex", alignItems: "center" }}
        />
      ),
    },
    {
      id: "Add KR",
      label: "Add KR",
      width: 80,
      render: (row) => {
        const handleClick = () => {
          if (row.type === "objective") {
            history.push(`/admin/objectives/details?objectiveId=${row.id}`);
          } else if (row.type === "keyresult") {
            history.push(
              `/admin/objectives/task?objectiveId=${row.objectiveId}&keyResultId=${row.id}`
            );
          }
        };

        const getTooltipTitle = () => {
          if (row.type === "objective") return "Add Key Result";
          if (row.type === "keyresult") return "Add Task";
          return "Add";
        };

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tooltip title={getTooltipTitle()}>
              <img
                src={addButtonIcon}
                alt="Add"
                style={{ cursor: "pointer" }}
                onClick={handleClick}
              />
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const columnsToRender = columns.filter((col) =>
    visibleColumns.includes(col.id)
  );
  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      {orderModalShow4 && (
        <CascadedPopup
          show={orderModalShow4}
          onHide={() => {
            setOrderModalShow4(false);
            // refreshData();
          }}
          selectedObjective={
            multipleObjectives ? objectiveId : selectedObjective
          }
          // handleCallback={handlecallback}
        />
      )}
      <CustomTable
        columns={columns}
        data={paginatedData || []}
        pagination={true}
        page={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalCount={mappedData.length}
        setPage={setPage}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
        rowsPerPageOptions={[5, 8, 10, 20]}
        columnsToRender={columnsToRender}
        setVisibleColumns={setVisibleColumns}
        visibleColumns={visibleColumns}
        loading={isLoading}
        search={search}
        setSearch={setSearch}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        handleBulkDelete={handleBulkDelete}
        selectedCount={selectedTasks.length}
        totalCountChecked={filteredData.length}
        selectedItems={selectedTasks}
        filteredData={filteredData}
        setSelectedItems={setSelectedTasks}
        onSelectAll={(select) => {
          if (select) {
            setSelectedTasks(filteredData);
          } else {
            setSelectedTasks([]);
          }
        }}
        isCompanyOKRsFilterActive={isCompanyOKRsFilterActive}
        setIsCompanyOKRsFilterActive={setIsCompanyOKRsFilterActive}
        handleCascade={() =>
          handleCascade(
            setMultipleObjectives,
            selectedTasks,
            selectedObjectiveId,
            setOrderModalShow4
          )
        }
      />
    </Box>
  );
};

export default TaskTable3;
