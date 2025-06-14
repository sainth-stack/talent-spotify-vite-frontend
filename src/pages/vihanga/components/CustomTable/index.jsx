import React, { useState } from "react";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Button,
  TableSortLabel,
  CircularProgress,
} from "@mui/material";
import {

  Collapse,
  Typography,
} from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useLocation } from "react-router-dom";

import TableHeader from './../../pages/Recruitment/sections/section1/table-section/header';


import {
  KeyboardArrowRight,
  KeyboardArrowDown,
} from "@mui/icons-material";


import TableHeader4 from './../../pages/employeePortal/tableHeaderLeaves/tableHeader';


import  TableHeader3  from './../../pages/objectives/dashboard/tableHeader/tableHeader';
const cellStyle = {
  padding: ".5rem",
  borderRight: "1px solid #ddd",
  fontSize: "12px",
  height: "38px",
  textAlign: "left",
  color: "#000",
};

const CustomTable = ({
  onExport,
  loading,
  columns,
  data = [],
  sx = {},
  rowsPerPageOptions = [8, 10, 15],
  pagination = true,
  onEdit,
  onDelete,
  menuItemsStage = [],
  menuItemsExportOptions = [],
  page,
  totalPages,
  rowsPerPage,
  setRowsPerPage,
  setPage,
  setSelectedItems = () => {},
  selectedItems = [],
  search = "",
  setSearch = () => {},
  visibleColumns,
  setVisibleColumns = () => {},
  columnsToRender ,
  selectedStatus,
  setSelectedStatus,
  filters,
  setFilters,
  selectedCount = 0,
  totalCountChecked = 0,
  onSelectAll = () => {},
  handleBulkDelete = () => {},
  isCompanyOKRsFilterActive,
  setIsCompanyOKRsFilterActive,
  handleCascade = () => {},
          filteredData= [],
          isCompany,
          isEmployee,
          handleEmployeeExport,
          setStatusAnchorEl,
          statusAnchorEl,
          statusOptions,
          handleStatusToggle,


}) => {
  const { tableSx, headerSx, columnSx, rowSx } = sx;
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [stage, setStage] = useState("All");
  // const [search, setSearch] = useState("");
  const [openRows, setOpenRows] = React.useState({});
   const sortedData = [...data]
    .filter((row) =>
      columns
        .filter((col) => col.id !== "actions")
        .some((col) => {
          const value = row[col.id];
          return (
            typeof value === "string" &&
            value.toLowerCase().includes(search.toLowerCase())
          );
        })
    )
    .sort((a, b) => {
      if (orderBy) {
        const aValue = a[orderBy] ?? "";
        const bValue = b[orderBy] ?? "";
        if (typeof aValue === "number") {
          return order === "asc" ? aValue - bValue : bValue - aValue;
        } else {
          return order === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
      }
      return 0;
    });
  const handleSelectAll = (shouldSelect) => {
    if (shouldSelect) {
      // Select all currently visible rows
      const newSelected = [...new Set([...selectedItems, ...sortedData])];
      setSelectedItems(newSelected);
    } else {
      // Deselect all currently visible rows
      const newSelected = selectedItems?.filter(
        selectedItem => !sortedData?.some(row => row.id === selectedItem.id)
      );
      setSelectedItems(newSelected);
    }
  };
 
 const TableHeaderCell = ({ column }) => {
     if (column?.headerCheckbox && column?.renderHeader) {
     const visibleSelectedCount = Array.isArray(selectedItems) && Array.isArray(sortedData)
  ? (sortedData || []).filter(row =>
      selectedItems?.some(item => item.id === row.id)
    ).length
  : 0;

      
      return column.renderHeader(
        visibleSelectedCount,
        sortedData.length,
        handleSelectAll
      );
    }
    if (column.sortable) {
      return (
        <TableSortLabel
          active={orderBy === column.id}
          direction={orderBy === column.id ? order : "asc"}
          onClick={() => handleSort(column.id)}
        >
          {column.label}
        </TableSortLabel>
      );
    }
    return column.label;
  };

  const toggleRow = (index) => {
    setOpenRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const location = useLocation();

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

 

  const renderHeader = () => {
    if (location.pathname.includes("/objectives/myteam") ) {
      return (
        <TableHeader7
          stage={stage}
          setStage={setStage}
          search={search}
          setSearch={setSearch}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          menuItemsStage={menuItemsStage}
          menuItemsExportOptions={menuItemsExportOptions}
          setVisibleColumns={setVisibleColumns}
          visibleColumns={visibleColumns}
          columns={columns}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          handleBulkDelete={handleBulkDelete}
           isCompanyOKRsFilterActive={isCompanyOKRsFilterActive}
        setIsCompanyOKRsFilterActive={setIsCompanyOKRsFilterActive}
        handleCascade={handleCascade}
                filteredData={filteredData}



        />
      );
    }
    if (location.pathname.includes("/objectives")) {
      return (
        <TableHeader3
          stage={stage}
          setStage={setStage}
          search={search}
          setSearch={setSearch}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          menuItemsStage={menuItemsStage}
          menuItemsExportOptions={menuItemsExportOptions}
          setVisibleColumns={setVisibleColumns}
          visibleColumns={visibleColumns}
          columns={columns}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          handleBulkDelete={handleBulkDelete}
           isCompanyOKRsFilterActive={isCompanyOKRsFilterActive}
        setIsCompanyOKRsFilterActive={setIsCompanyOKRsFilterActive}
        handleCascade={handleCascade}
                filteredData={filteredData}



        />
      );
    }

     if (location.pathname.includes("/objectives/myteam") ) {
      return (
        <TableHeader7
          stage={stage}
          setStage={setStage}
          search={search}
          setSearch={setSearch}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          menuItemsStage={menuItemsStage}
          menuItemsExportOptions={menuItemsExportOptions}
          setVisibleColumns={setVisibleColumns}
          visibleColumns={visibleColumns}
          columns={columns}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          handleBulkDelete={handleBulkDelete}
           isCompanyOKRsFilterActive={isCompanyOKRsFilterActive}
        setIsCompanyOKRsFilterActive={setIsCompanyOKRsFilterActive}
        handleCascade={handleCascade}
                filteredData={filteredData}



        />
      );
    }

    // if (
    //   [
    //     "/apply-leave",
    //     "/Recruitment",
    //     "/time-tracking",
    //     "document-verification",
    //   ].some((route) => location.pathname.includes(route))
    // ) {

    if (location.pathname.includes("/objectives")) {
      return (
        <TableHeader3
          onExport={onExport}
          stage={stage}
          setStage={setStage}
          search={search}
          setSearch={setSearch}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          menuItemsStage={menuItemsStage}
          menuItemsExportOptions={menuItemsExportOptions}
          columns={columns}
              selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          handleBulkDelete={handleBulkDelete}
           isCompanyOKRsFilterActive={isCompanyOKRsFilterActive}
        setIsCompanyOKRsFilterActive={setIsCompanyOKRsFilterActive}
        handleCascade={handleCascade}
        filteredData={filteredData}
        />
      );
    }
    if (
      location.pathname.includes("/Recruitment") ||
      location.pathname.includes("/eligibitity") ||
      location.pathname.includes("/leave-type") ||
      location.pathname.includes("/apply-leave") ||
      location.pathname.includes("/eligibitity-criteria")
    ) {
      return (
        <TableHeader
          onExport={onExport}
          stage={stage}
          setStage={setStage}
          search={search}
          setSearch={setSearch}
          setPage={setPage}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          menuItemsStage={menuItemsStage}
          menuItemsExportOptions={menuItemsExportOptions}
          filters={filters}
          setFilters={setFilters}
        />
      );
    }
    if (
     
      location.pathname.includes("/previlages/time-tracking") ||
      location.pathname.includes("/previlages/document-verification") ||
      location.pathname.includes("/previlages/time-history") || location.pathname.includes("/admin/setups/company") || location.pathname.includes("/admin/setups/employees") ||  location.pathname.includes("/previlages/time-history") || 
        location.pathname.includes("/admin/approval") ||  location.pathname.includes("/admin/setups/departments")

    ) {
      return (
        <TableHeader4
          onExport={onExport}
          stage={stage}
          setStage={setStage}
          search={search}
          setSearch={setSearch}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          menuItemsStage={menuItemsStage}
          menuItemsExportOptions={menuItemsExportOptions}
          isCompany={isCompany}
          isEmployee={isEmployee}
          columns={columns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          handleEmployeeExport={handleEmployeeExport}
             statusAnchorEl={statusAnchorEl}
                setStatusAnchorEl={setStatusAnchorEl}
                statusOptions={statusOptions}
                handleStatusToggle={handleStatusToggle}
                selectedStatus={selectedStatus}
        />
      );
    }
     else  {
      return (
        <TableHeader
          onExport={onExport}
          stage={stage}
          setStage={setStage}
          search={search}
          setSearch={setSearch}
          setPage={setPage}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          menuItemsStage={menuItemsStage}
          menuItemsExportOptions={menuItemsExportOptions}
          filters={filters}
          setFilters={setFilters}
        />
      );
    }
    return null; // If no matching header
  };

  const RenderRow = ({
    row,
    level = 0,
    indexPath = [],
    toggleRow,
    openRows,
    columns,
    lastRow // This should be columnsToRender
  }) => {
    const indexKey = indexPath.join("-");
  
    return (
      <React.Fragment key={indexKey}>
        <TableRow>
          {columns?.map((column) => (
            <TableCell 
              key={column.id} 
              sx={{ 
                width: column.width || "auto",
                borderBottom: lastRow ? "none" : "1px solid #F4F4F4",
              }}
            >
              {column.id === "actions" ? (
                column.render(row)
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  ml={`${level * 24}px`}
                  gap="20px"
                >
                  {row.children?.length > 0 && column.id === columns[0].id && (
                    <IconButton
                      size="small"
                      onClick={() => toggleRow(indexKey)}
                      sx={{ padding: 0 }}
                    >
                      {openRows[indexKey] ? (
                        <KeyboardArrowDown sx={{ color: "black" }} />
                      ) : (
                        <KeyboardArrowRight sx={{ color: "black" }} />
                      )}
                    </IconButton>
                  )}
                  {column.render ? column.render(row) : row[column.id]}
                </Box>
              )}
            </TableCell>
          ))}
        </TableRow>
  
        {row.children?.length > 0 && openRows[indexKey] && (
          <TableRow>
            <TableCell
              style={{ paddingBottom: 0, paddingTop: 0 }}
              colSpan={columns.length}
            >
              <Collapse in={openRows[indexKey]} timeout="auto" unmountOnExit>
                <Box margin={1}>
                  {row.children.map((child, childIndex) => (
                    <RenderRow
                      key={child.id}
                      row={child}
                      level={level + 1}
                      indexPath={[...indexPath, childIndex]}
                      toggleRow={toggleRow}
                      openRows={openRows}
                      columns={columns}
                    />
                  ))}
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box>
      <Box
        sx={{
          border: "1px solid #85803c",
          borderRadius: "1rem",
        }}
      >
        {renderHeader()}

        <TableContainer
          sx={{
            borderTop: "1px solid #85803c",
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                padding: 2,
              }}
            >
              <CircularProgress />
              <Box
                sx={{
                  marginTop: 2,
                  color: "#85803c",
                  fontSize: "16px",
                }}
              >
                Loading...
              </Box>
            </Box>
          ) : (
            <>
              <Table sx={{ ...tableSx }}>
                <TableHead
                  sx={{
                    ...headerSx,
                    background: "#F4F4F4",
                    borderBottom: "none",
                  }}
                >
                  <TableRow sx={{ display: "contents", ...rowSx }}>
                    {(columnsToRender?.length > 0
                      ? columnsToRender
                      : columns
                    )?.map((col) => (
                      <TableCell
                        key={col.id}
                        sx={{
                          fontSize: "16px",
                          fontWeight: 600,
                          fontFamily: "Montserrat",
                          borderBottom: "none",
                          ...columnSx,
                        }}
                      >
                        <TableHeaderCell column={col} />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                {sortedData.length === 0 ? (
                  <>
                    <TableRow>
                      <TableCell
                        colSpan={
                          columnsToRender?.length > 0
                            ? columnsToRender.length
                            : columns.length
                        }
                        sx={{
                          textAlign: "center",
                          fontSize: "16px",
                          fontFamily: "Montserrat",
                          color: "#85803c",
                          padding: "2rem",
                        }}
                      >
                        Oops! It looks like there's 
                        No data available ....!
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  sortedData.map((row, index) => (
                    <RenderRow
                      key={row.id}
                      row={row}
                      lastRow={index === sortedData.length - 1}
                      indexPath={[index]}
                      toggleRow={(key) =>
                        setOpenRows((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                      openRows={openRows}
                      columns={
                        columnsToRender?.length > 0 ? columnsToRender : columns
                      }
                    />
                  ))
                )}

                {}
              </Table>
            </>
          )}
        </TableContainer>
      </Box>
      {/* Replace the existing pagination code with this simplified version */}
      {pagination && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "1rem",
            fontFamily: "Montserrat",
            fontSize: "14px",
          }}
        >
          <Button
            variant="text"
            onClick={() => handleChangePage(null, page - 1)}
            disabled={page === 0}
            sx={{
              minWidth: "auto",
              color: page === 0 ? "#837F3980" : "#837F39",
              fontWeight: 400,
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
            Back
          </Button>

          {[...Array(totalPages).keys()]
            .slice(Math.max(0, page - 1), Math.min(totalPages, page + 2))
            .map((number) => (
              <Button
                key={number}
                onClick={() => handleChangePage(null, number)}
                sx={{
                  minWidth: "auto",
                  color: page === number ? "#fff" : "#837F39",
                  backgroundColor: page === number ? "#837F39" : "transparent",
                  fontWeight: 500,
                  fontFamily: "Montserrat",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  padding: 0,
                }}
              >
                {number + 1}
              </Button>
            ))}

          <Button
            variant="text"
            onClick={() => handleChangePage(null, page + 1)}
            disabled={page >= totalPages - 1}
            sx={{
              minWidth: "auto",
              color: page >= totalPages - 1 ? "#837F3980" : "#837F39",
              fontWeight: 400,
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            Next
            <ArrowForwardIosIcon fontSize="small" />
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CustomTable;

