import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import moment from "moment";
import ActionDropdown from  "../../components/ActionDropdown/ActionDropdown";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";

const getStatusColor = (status) => {
  switch (status) {
    case "Waiting for approval":
      return "#FFD700";
    case "Cancel":
      return "#D32F2F";
    case "Approved":
      return "#808000";
    default:
      return "#000";
  }
};

const MobileLeaveCard = ({
  row,
  onEdit,
  onDelete,
  cardStyle = {},
  textColor = "#707070",
  statusField = "status",
  dateFields = { from: "from", to: "to" },
  // fields is an array of { key, label } for all fields to render
  fields = [
    { key: "date", label: "Date" },
    { key: "type", label: "Type" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
  ],
}) => {
  // Get the value for a field key, with special handling for date range if key is "date"
  const getFieldValue = (key) => {
    if (key === "date" && dateFields.from && dateFields.to) {
      const fromVal = row[dateFields.from];
      const toVal = row[dateFields.to];
      if (fromVal && toVal) {
        return `${moment(fromVal).format("D MMM YYYY")} - ${moment(
          toVal
        ).format("D MMM YYYY")}`;
      }
      return null;
    }
    return row[key] ?? null;
  };

  const renderRow = (label, value, customColor = textColor) => (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      key={label}
    >
      <Typography variant="body1" fontWeight={500} color="#827d3b">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} color={customColor}>
        {value}
      </Typography>
    </Box>
  );


  console.log("row", row);
  return (
    <Card
      sx={{
        mb: "1rem",
        borderRadius: "1.5rem",
        boxShadow: "0px 0.5px 0px rgba(0,0,0,0.2)",
        backgroundColor: "#fff",
        border: "1px solid #e0e0e0",
        ...cardStyle,
      }}
    >
      {(onEdit || onDelete) && (
        <Box display="flex" justifyContent="flex-end">
          <ActionDropdown
            row={row}
            actions={[
              ...(onEdit
                ? [
                    {
                      label: "Edit",
                      icon: <BorderColorIcon fontSize="small" />,
                      onClick: onEdit,
                    },
                  ]
                : []),
              ...(onDelete
                ? [
                    {
                      label: "Delete",
                      icon: <DeleteIcon fontSize="small" />,
                      onClick: onDelete,
                    },
                  ]
                : []),
            ]}
          />
        </Box>
      )}

      <CardContent
        sx={{ display: "flex", flexDirection: "column", gap: "7px", p: "10px" }}
      >
        {fields.map(({ key, label }) => {
          const value = getFieldValue(key);
          if (value === null || value === undefined) return null; // skip empty fields

          // If this is the status field, apply color based on status
          const color =
            key === statusField ? getStatusColor(row[statusField]) : textColor;

          return renderRow(label, value, color);
        })}
      </CardContent>
    </Card>
  );
};

export default MobileLeaveCard;
