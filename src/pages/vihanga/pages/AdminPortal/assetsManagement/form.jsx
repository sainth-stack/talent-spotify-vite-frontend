import React from 'react';
import { Grid } from '@mui/material';
import { InputTextComponent } from '../../../components/input-elements/text';
import { SelectComponent } from '../../../components/input-elements/select';

export const EmployeeDetailsForm = ({ formData, handleChange }) => {

  console.log("EmployeeDetailsForm data",formData)
  const assetTypeOptions = [
    { label: 'Laptop', value: 'laptop' },
    { label: 'Mobile Phone', value: 'mobile' },
    { label: 'Monitor', value: 'monitor' },
  ];

  return (
    <>
      {/* Employee Information Section */}
     <Grid>
       <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="employeeId"
            label="Employee ID"
            value={formData.employeeId}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="department"
            label="Department"
            value={formData.department}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="position"
            label="Position"
            value={formData.position}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputTextComponent
            id="workLocation"
            label="Work Location"
            value={formData.workLocation}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Grid>
        
      </Grid>
      </Grid>

    
  
    </>
  );
};
