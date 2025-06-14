import React, { useEffect, useState, useCallback } from 'react';
import { EmployeeDetailsForm } from './form';
import { Typography, Box, Grid, CircularProgress, Button, IconButton,useMediaQuery,
  useTheme, } from '@mui/material';
import { SelectComponent } from '../../../components/input-elements/select';
import { InputTextComponent } from '../../../components/input-elements/text';
import axios from 'axios';
import { Toast } from 'service/toast';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { storeEmployeeId } from '../../../../../utilities/getLocalStorageItem';
import AssetsManagementTable from './table/table';

const AssetsManagementSystem = () => { 

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px


  const [formData, setFormData] = useState({
    fullName: '', employeeId: '', department: '', position: '', workLocation: ''
  });

  const [assetForms, setAssetForms] = useState([
    {  assetType: '', assetNumber: '', issueDate: '', collectionDate: '' }
  ]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTable, setRefreshTable] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const assetTypeOptions = [
    { label: "Laptop", value: "laptop" },
    { label: "Mobile Phone", value: "mobile" },
    { label: "Monitor", value: "monitor" },
  ];  

  const handleChange = (index, e) => {
    const { id, value } = e.target;
    console.log(`handleChange: index=${index}, id=${id}, value=${value}`);
    const updatedAssets = [...assetForms];
    updatedAssets[index] = { ...updatedAssets[index], [id]: value };
    setAssetForms(updatedAssets);
  };


  const handleAssetTypeChange = (index, event) => {
    const { value } = event.target;
    const updatedAssets = [...assetForms];
    updatedAssets[index] = {
      ...updatedAssets[index],
      assetType: value || '',
    };
    setAssetForms(updatedAssets);
  };

  
  const handleAddAsset = () => {
    setAssetForms([
      ...assetForms,
      { assetType: '', assetNumber: '', issueDate: '', collectionDate: '' }
    ]);
  };

  const handleRemoveAsset = (index) => {
    setAssetForms(assetForms.filter((_, i) => i !== index));
  };

  const handleEdit = useCallback((selectedRow) => {
    console.log("selectedRow", selectedRow);
    setFormData({
      _id: selectedRow?.employeeId ? selectedRow.employeeId : '', 
      employeeId: selectedRow?.employeeId || '',
      fullName: selectedRow?.fullName || '',
      department: selectedRow?.department || '',
      position: selectedRow?.position || '',
      workLocation: selectedRow?.workLocation || ''
    });
  
    setAssetForms([
      {
        _id: selectedRow?.assetId || selectedRow?._id || '', // Use asset-specific ID
        assetType: selectedRow?.assetType || '',
        assetNumber: selectedRow?.assetNumber || '',
        issueDate: selectedRow?.issueDate?.slice(0, 10) || '',
        collectionDate: selectedRow?.collectionDate?.slice(0, 10) || ''
      }
    ]);
  
    if (selectedRow?.employeeId) {
      setSelectedEmployeeId(selectedRow.employeeId);
      storeEmployeeId(selectedRow.employeeId);
    }
  }, []);

  const handleReset = () => {
    setFormData({
      
      fullName: '',
      employeeId: '',
      department: '',
      position: '',
      workLocation: ''
    });
    setAssetForms([{  assetType: '', assetNumber: '', issueDate: '', collectionDate: '' }]);
    setSelectedEmployeeId('');
    setFormErrors({});
  };

  const appURL = 'http://localhost:4000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {}; // Add validation here if needed

   

    const payload = {
      ...formData,
      employeeId: selectedEmployeeId || formData.employeeId,
      assets: assetForms.map(asset => ({
        ...asset,
        issueDate: asset.issueDate ? new Date(asset.issueDate).toISOString() : null,
        collectionDate: asset.collectionDate ? new Date(asset.collectionDate).toISOString() : null
      }))
    };

    console.log("Submitting Payload:", payload); // 🔍 DEBUG

    setIsSubmitting(true);
    try {
      const isEditMode = Boolean(formData._id);
      const url = isEditMode
        ? `${appURL}/updateAsset/${formData._id}`
        : `${appURL}/add-asset`;
      const method = isEditMode ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: payload,
        headers: { 'Content-Type': 'application/json' },
      });

      Toast({ message: response?.data?.message || 'Submitted successfully', type: 'success' });
      handleReset();
      setRefreshTable(prev => !prev);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Submission failed';
      setError(errorMessage);
      Toast({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <>

    <Box component="form" onSubmit={handleSubmit}
     sx={{
          paddingBottom: "70px",
          margin: isMobile ? "1rem .5rem" : "1rem",
          bgcolor: "#fff",
          padding: isMobile ? ".5rem" : "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.5px 0px rgba(0,0,0,0.2)",
        }}
        >
      
      <Typography sx={{ fontSize: '32px', fontWeight: '600' }}>Asset Management System</Typography>

      
      <EmployeeDetailsForm
          formData={formData}
          handleChange={(e) => setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))}
        />

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
        <Typography variant="h6">Asset Assignment</Typography>
        <Button
          onClick={handleAddAsset}
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: '999px',
            color: '#847F3B',
            border: '1px solid #847F3B',
            '&:hover': {
              backgroundColor: '#f7f6ef',
              border: '1px solid #807D3A',
              color: '#6f6b2f'
            }
          }}
        >
          Add Asset
        </Button>
      </Box>

      {assetForms.map((asset, index) => (
        <Grid container spacing={2} mt={2} key={index}>
          <Grid item xs={12} md={3}>
         
          <SelectComponent
  label="Asset Type"
              id="assetType"
              name="assetType"
  value={asset.assetType || ""}
  onChange={(selectedOption) => handleAssetTypeChange(index, selectedOption)}
  options={assetTypeOptions}
  placeholder="Select Type"
/>

          </Grid>
          <Grid item xs={12} md={3}>
            <InputTextComponent
              id="assetNumber"
              label="Asset number"
              value={asset.assetNumber}
              onChange={(e)  => handleChange(index, e)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <InputTextComponent
              id="issueDate"
              label="Issue Date"
              type="date"
              value={asset.issueDate}
              onChange={(e) => handleChange(index, e)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <InputTextComponent
              id="collectionDate"
              label="Collection Date"
              type="date"
              value={asset.collectionDate}
              onChange={(e) => handleChange(index, e)}
            />
          </Grid>
          <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
            {index > 0 && (
              <IconButton onClick={() => handleRemoveAsset(index)}>
                <RemoveCircleOutlineIcon color="error" />
              </IconButton>
            )}
          </Grid>
        </Grid>
      ))}

      <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
        <Button
          variant="contained"
          type="button"
          sx={{ backgroundColor: '#FFFFFF', color: '#847F3B', borderRadius: '20px' }}
          onClick={handleReset}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting}
          sx={{ backgroundColor: '#837F39', color: '#FFFFFF', borderRadius: '20px' }}
        >
          {isSubmitting ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={16} thickness={5} sx={{ color: '#ffffff' }} /> Submitting...
            </Box>
          ) : (
            formData._id ? 'Update' : 'Submit'
          )}
        </Button>
      </Box>

      
    </Box>


    <Box
        sx={{
          paddingBottom: "70px",
          margin: isMobile ? "1rem .5rem" : "1rem",
          bgcolor: "#fff",
          padding: isMobile ? ".5rem" : "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 0.5px 0px rgba(0,0,0,0.2)",
        }}
      >
        <AssetsManagementTable onEdit={handleEdit} refreshTable={refreshTable} />

      </Box>
    </>

  );
};

export default AssetsManagementSystem;
