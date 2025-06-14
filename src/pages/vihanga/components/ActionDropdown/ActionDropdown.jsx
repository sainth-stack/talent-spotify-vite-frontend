import React, { useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const ActionDropdown = ({
  row,
  actions = [], // Array of { label, icon: ReactNode, onClick: (row) => void, disabled?, sx? }
  icon = <MoreVertIcon />, // Customize trigger icon
  iconButtonProps = {}, // extra props for IconButton
  menuProps = {}, // extra props for Menu
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    event.stopPropagation(); // prevent row click if any
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton onClick={handleOpen} {...iconButtonProps}>
        {icon}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()} // prevent menu clicks bubbling
        {...menuProps}
      >
        {actions.map(({ label, icon, onClick, disabled, sx }, idx) => (
          <MenuItem
            key={idx}
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              if (onClick) onClick(row);
            }}
            sx={sx}
          >
            {icon && <ListItemIcon sx={{ minWidth: 30 }}>{icon}</ListItemIcon>}
            <ListItemText
              primary={label}
              sx={{
                color: "#6D6D6D",
                fontWeight: 500,
                fontSize: 14,
                letterSpacing: "1%",
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ActionDropdown;
