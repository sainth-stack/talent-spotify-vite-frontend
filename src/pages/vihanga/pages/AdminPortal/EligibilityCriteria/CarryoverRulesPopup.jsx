import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { InputTextComponent } from  "../../../components/input-elements/text";
import CustomCheckBoxSwitch from  "../../../components/CustomCheckSwitch";
import { SelectComponent } from  "../../../components/input-elements/select";

const CarryoverRulesPopup = ({ anchorEl, handleClose }) => {
  const open = Boolean(anchorEl);

  const carryOverMonths = [
    { label: "1st of January", value: "01" },
    { label: "1st of February", value: "02" },
    { label: "1st of March", value: "03" },
    { label: "1st of April", value: "04" },
    { label: "1st of May", value: "05" },
    { label: "1st of June", value: "06" },
    { label: "1st of July", value: "07" },
    { label: "1st of August", value: "08" },
    { label: "1st of September", value: "09" },
    { label: "1st of October", value: "10" },
    { label: "1st of November", value: "11" },
    { label: "1st of December", value: "12" },
  ];

  const [formData, setFormData] = useState({
    carryOverMonth: "01",
    durationValue: 30,
    durationUnit: "days",
  });

  const [expires, setExpires] = useState(true);
  const [resetNegativeBalance, setResetNegativeBalance] = useState(false);

  if (!open) return null; 

  return (
    <Box
      sx={{
        position: "relative",
        top:  -10, 
        left: 30,
         zIndex: 1300, 
        borderRadius: "8px",
        boxShadow: "0px 0.1px 0px rgba(0,0,0,0.2)",
        width: "600px",
        padding: "8px",
        border: "1px solid #D3D3D3",
        backgroundColor: "#fff", 
      }}
    >
      <Box sx={{ p: 1 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.2rem" }}>
            Carryover Rules
          </Typography>
          <Typography
            onClick={handleClose}
            sx={{
              cursor: "pointer",
              fontSize: "18px",
              color: "#707070",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                color: "#ff4d4f",
                transform: "scale(1.1)",
              },
            }}
          >
            ✕
          </Typography>
        </Box>

        {/* Carryover Date */}
        <Typography sx={{ fontSize: "14px", color: "#707070", mb: 1 }}>
          What should the carryover date be?
        </Typography>
        <Box sx={{ display: "flex" }}>
          <SelectComponent
            id="carryOverMonth"
            name="carryOverMonth"
            label={carryOverMonths.label}
            value={formData.carryOverMonth}
            onChange={(e) =>
              setFormData({ ...formData, carryOverMonth: e.target.value })
            }
            options={carryOverMonths}
            sx={{ width: "30%" }}
          />
        </Box>

        {/* Expiry Logic */}
        <Typography sx={{ fontSize: "14px", color: "#707070", mb: 1 }}>
          Does the carryover amount Expire?
        </Typography>
        <Box sx={{}}>
          <CustomCheckBoxSwitch
            label="No, it never expires"
            type="checkbox"
            checked={!expires}
            onChange={() => setExpires(false)}
            sx={{ fontSize: "14px" }}
          />
          <CustomCheckBoxSwitch
            label="Yes, it expires after a period of time"
            type="checkbox"
            checked={expires}
            onChange={() => setExpires(true)}
            sx={{ fontSize: "14px" }}
          />
          {expires && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <InputTextComponent
                id="durationValue"
                name="durationValue"
                type="number"
                label=""
                value={formData.durationValue}
                onChange={(e) =>
                  setFormData({ ...formData, durationValue: e.target.value })
                }
                sx={{ width: "70px" }}
              />
              <SelectComponent
                id="durationUnit"
                name="durationUnit"
                label=""
                value={formData.durationUnit}
                onChange={(e) =>
                  setFormData({ ...formData, durationUnit: e.target.value })
                }
                options={[
                  { label: "Days", value: "days" },
                  { label: "Weeks", value: "weeks" },
                  { label: "Months", value: "months" },
                  { label: "Years", value: "years" },
                ]}
                sx={{ minWidth: "100px" }}
              />
            </Box>
          )}
        </Box>

        {/* Reset Balance */}
        <CustomCheckBoxSwitch
          label="Reset negative balance to 0 hours on carry over date"
          type="checkbox"
          checked={resetNegativeBalance}
          onChange={() => setResetNegativeBalance(!resetNegativeBalance)}
          sx={{ fontSize: "14px" }}
        />
      </Box>
    </Box>
  );
};

export default CarryoverRulesPopup;
