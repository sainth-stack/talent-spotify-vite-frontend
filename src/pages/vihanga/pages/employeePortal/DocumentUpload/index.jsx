import React, { useState, useEffect } from "react";
import { Typography, Box, Grid, Button, IconButton, CircularProgress } from "@mui/material";
import { InputTextComponent } from "pages/vihanga/components/input-elements/text";
import { SelectComponent } from "pages/vihanga/components/input-elements/select";
import FileUploadCustom from "pages/vihanga/components/filesUplode/draganddropFile";
import FilePreview from "pages/vihanga/components/FilePreview.js/FilePreview";
import axios from "axios";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Grid2 from "@mui/material/Unstable_Grid2";
import { Toast } from "service/toast";
import { appURL } from "utilities";
import NewTopHeader from './../../../../../components/Navbar/newTopHeader';

const documentOptions = [
  { label: "Aadhaar Card", value: "AADHAAR" },
  { label: "PAN Card", value: "PAN" },
  { label: "Passport", value: "PASSPORT" },
  { label: "Driving License", value: "DL" },
  { label: "Voter ID", value: "VOTER_ID" },
  { label: "Previous Payslips", value: "PAYSLIPS" },
  { label: "Experience Letter", value: "EXPERIENCE_LETTER" },
  { label: "Utility Bill", value: "UTILITY_BILL" },
  { label: "Others", value: "OTHERS" }
];

const DocumentUpload = () => { 
  const urlParams = new URLSearchParams(window.location.search);
  const candidateId = urlParams.get("candidateId");
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reference1Name: "",
    reference1Email: "",
    reference1Phone: "",
    reference2Name: "",
    reference2Email: "",
    reference2Phone: ""
  });
  console.log(candidateData)
  const [additionalReferences, setAdditionalReferences] = useState([]);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState("");

  const fetchCandidateData = async () => {
    try {
      const response = await axios.get(
        `${appURL}/recruitment/getCandidateById?_id=${candidateId}`
      );
      console.log(response)
      setCandidateData(response?.data?.data[0]); 
      if (response?.data?.data[0]?.references?.length > 0) {
        const refs = response?.data?.data[0].references;
        setFormData({
          reference1Name: refs[0]?.name || "",
          reference1Email: refs[0]?.email || "",
          reference1Phone: refs[0]?.phone || "",
          reference2Name: refs[1]?.name || "",
          reference2Email: refs[1]?.email || "",
          reference2Phone: refs[1]?.phone || ""
        });
        if (refs.length > 2) {
          setAdditionalReferences(refs.slice(2));
        }
      }
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
 

    fetchCandidateData();
  }, [candidateId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReferenceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedReferences = [...additionalReferences];
    updatedReferences[index] = {
      ...updatedReferences[index],
      [name]: value
    };
    setAdditionalReferences(updatedReferences);
  };
  
  const handleFileUpload = (file) => {
    if (!selectedDocType) {
      Toast({ message: "Please select a document type first", type: "error" });
      return;
    }

    const newUpload = {
      id: Date.now(),
      type: selectedDocType,
      file: file,
      status: 'pending'
    };

    setUploadQueue(prev => [...prev, newUpload]);
    setSelectedDocType("");
  };

  const handleFilePreviewClose = async (fileId) => {
    try {
      setUploadQueue(prev => prev.filter(item => item.id !== fileId));
      const documentToDelete = candidateData?.documents?.find(doc => doc._id === fileId);
      if (documentToDelete) {
        await axios.delete(`${appURL}/recruitment/deleteDocument`, {
          data: {
            candidateId: candidateId,
            documentId: documentToDelete._id,
            fileName: documentToDelete.fileName
          }
        });
        setCandidateData(prev => ({
          ...prev,
          documents: prev.documents.filter(doc => doc._id !== fileId)
        }));
        Toast({ message: "Document deleted successfully", type: "success" });
        fetchCandidateData()
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      Toast({ message: "Failed to delete document", type: "error" });
    }
  };

  const handleAddReference = () => {
    setAdditionalReferences(prev => [...prev, {
      name: "",
      email: "",
      phone: ""
    }]);
  };

  const handleRemoveReference = (index) => {
    setAdditionalReferences(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      const user = JSON.parse(localStorage.getItem("user"));
      
        formDataToSend.append("hr", user?.email);
      // Process references
      const referencesToSubmit = [];
      
      if (formData.reference1Name) {
        referencesToSubmit.push({
          name: formData.reference1Name,
          email: formData.reference1Email,
          phone: formData.reference1Phone
        });
      }
      if (formData.reference2Name) {
        referencesToSubmit.push({
          name: formData.reference2Name,
          email: formData.reference2Email,
          phone: formData.reference2Phone
        });
      }
  
      referencesToSubmit.push(...additionalReferences.filter(ref => ref.name));
      formDataToSend.append("references", JSON.stringify(referencesToSubmit));
      formDataToSend.append("candidateId", candidateId);

      // Append all files from upload queue
      uploadQueue.forEach((item) => {
        formDataToSend.append("documents", item.file);
        formDataToSend.append("documentTypes", item.type);
      });
  
      const response = await axios.post(
        `${appURL}/recruitment/document-upload`,
        formDataToSend
      );
  
      if (response.data) {
        Toast({ message: "Documents uploaded successfully", type: "success" });
        // Update local state with new documents
        setCandidateData(prev => ({
          ...prev,
          documents: [...(prev.documents || []), ...(response?.data?.documents || [])],
          references: referencesToSubmit
        }));
        fetchCandidateData();
        // Reset form
        setUploadQueue([]);
      } else {
        Toast({ message: response.data.message || "Upload failed", type: "error" });
      }
    } catch (error) {
      console.error("Submission error:", error);
      Toast({ 
        message: error.response?.data?.message || "Documents upload failed", 
        type: "error" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getDocumentLabel = (value) => {
    return documentOptions.find(opt => opt.value === value)?.label || value;
  };

  const ReferenceFormFields = [
    {
      subHeading: "Reference 1",
      fields: [
        {
          id: "reference1Name",
          label: "Reference Name",
          type: "text",
          component: "input",
          value: formData.reference1Name
        },
        {
          id: "reference1Email",
          label: "Reference Email",
          type: "email",
          component: "input",
          value: formData.reference1Email
        },
        {
          id: "reference1Phone",
          label: "Reference Phone Number",
          type: "number",
          component: "input",
          value: formData.reference1Phone
        },
      ]
    },
    {
      subHeading: "Reference 2",
      fields: [
        {
          id: "reference2Name",
          label: "Reference Name",
          type: "text",
          component: "input",
          value: formData.reference2Name
        },
        {
          id: "reference2Email",
          label: "Reference Email",
          type: "email",
          component: "input",
          value: formData.reference2Email
        },
        {
          id: "reference2Phone",
          label: "Reference Phone Number",
          type: "number",
          component: "input",
          value: formData.reference2Phone
        },
      ]
    }
  ];
  
  const buttonConfigs = [
    {
      label: "Cancel",
      type: "button",
      backgroundColor: "#FFFFFF",
      color: "#847F3B",
      onClick: () => {
        setUploadQueue([]);
        setAdditionalReferences([]);
        window.close() ;
        setFormData({
          reference1Name: candidateData?.references?.[0]?.name || "",
          reference1Email: candidateData?.references?.[0]?.email || "",
          reference1Phone: candidateData?.references?.[0]?.phone || "",
          reference2Name: candidateData?.references?.[1]?.name || "",
          reference2Email: candidateData?.references?.[1]?.email || "",
          reference2Phone: candidateData?.references?.[1]?.phone || ""
        });
      }
    },
    {
      label: submitting ? <CircularProgress size={24} color="inherit" /> : "Submit",
      type: "submit",
      backgroundColor: "#837F39",
      color: "#FFFFFF",
      disabled: submitting
    }
  ];

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>;
  }

  if (!candidateData) {
    return <Box>No candidate data found</Box>;
  }
  return (
    <>
      <Box
        sx={{
          paddingBottom: "70px",
          margin: "3rem",
          bgcolor: "#fff",
          padding: "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0px 1px 1px rgba(0,0,0,0.2)",
          gap: ".5rem",
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0px",
            }}
          >
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: "600",
                fontFamily: `"Montserrat"`,
                color: "#0E0E0E",
              }}
            >
              Document Upload
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Upload Documents
            </Typography>

            <Grid container spacing={2} md={12} alignItems="start">
              <Grid item xs={12} md={5}>
                <SelectComponent
                  label="Select Document Type"
                  value={selectedDocType}
                  onChange={(e) => setSelectedDocType(e.target.value)}
                  options={documentOptions}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <FileUploadCustom
                  sx={{
                    border: "1.5px dashed #99965E",
                  }}
                  onFileUpload={handleFileUpload}
                  file={null}
                  hideLabel
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              {(uploadQueue.length > 0 ||
                candidateData.documents?.length > 0) && (
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {uploadQueue.length > 0
                    ? "Documents to be Uploaded"
                    : "Uploaded Documents"}
                </Typography>
              )}

              <Grid2 container md={12} spacing={2}>
                {uploadQueue.map((item) => (
                  <Grid2 key={item.id} sx={{ mb: 1 }} md={6}>
                    <FilePreview
                      fileName={item.file.name}
                      fileSize={`${(item.file.size / 1024).toFixed(2)} KB`}
                      fileDate={new Date().toLocaleDateString()}
                      onClose={() => handleFilePreviewClose(item.id)}
                      fileHeader={getDocumentLabel(item.type)}
                    />
                  </Grid2>
                ))}

                {candidateData.documents?.map((doc) => (
                  <Grid2 key={doc._id} sx={{ mb: 1 }} md={6}>
                    <FilePreview
                      fileName={doc.fileName}
                      fileSize={doc.fileSize}
                      fileDate={new Date(doc.uploadedAt).toLocaleDateString()}
                      onClose={() => handleFilePreviewClose(doc._id)}
                      fileHeader={getDocumentLabel(doc.type)}
                      fileUrl={doc.url}
                      showDownload
                    />
                  </Grid2>
                ))}
              </Grid2>
            </Box>
          </Box>

          <Box sx={{ padding: ".2rem" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0px",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "32px",
                  fontWeight: "600",
                  fontFamily: `"Montserrat"`,
                  color: "#0E0E0E",
                }}
              >
                References
              </Typography>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddReference}
                sx={{ color: "#837F39" }}
              >
                Add Reference
              </Button>
            </Box>

            <Grid container spacing={2}>
              {ReferenceFormFields.map((section, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {section.subHeading}
                    </Typography>
                  </Grid>

                  {section.fields.map((field) => (
                    <Grid item xs={12} md={6} key={field.id}>
                      {field.component === "input" ? (
                        <InputTextComponent
                          id={field.id}
                          name={field.id}
                          label={field.label}
                          type={field.type}
                          value={field.value}
                          onChange={handleChange}
                          endIcon={["number", "email"].includes(field.type)}
                        />
                      ) : (
                        <SelectComponent
                          id={field.id}
                          label={field.label}
                          value={field.value}
                          onChange={handleChange}
                          options={field.options || []}
                        />
                      )}
                    </Grid>
                  ))}
                </React.Fragment>
              ))}

              {additionalReferences.map((ref, index) => (
                <React.Fragment key={`additional-${index}`}>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Additional Reference {index + 1}
                      </Typography>
                      <IconButton onClick={() => handleRemoveReference(index)}>
                        <RemoveCircleOutlineIcon color="error" />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InputTextComponent
                      id={`additional-ref-name-${index}`}
                      name="name"
                      label="Reference Name"
                      type="text"
                      value={ref.name || ""}
                      onChange={(e) => handleReferenceChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InputTextComponent
                      id={`additional-ref-email-${index}`}
                      name="email"
                      label="Reference Email"
                      type="email"
                      value={ref.email || ""}
                      onChange={(e) => handleReferenceChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InputTextComponent
                      id={`additional-ref-phone-${index}`}
                      name="phone"
                      label="Reference Phone Number"
                      type="number"
                      value={ref.phone || ""}
                      onChange={(e) => handleReferenceChange(index, e)}
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>

            {candidateData.references?.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Existing References
                </Typography>
                <Grid container spacing={2}>
                  {candidateData.references.map((ref, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          border: "1px solid #eee",
                          borderRadius: "8px",
                        }}
                      >
                        <Typography>
                          <strong>Name:</strong> {ref.name}
                        </Typography>
                        <Typography>
                          <strong>Email:</strong> {ref.email}
                        </Typography>
                        <Typography>
                          <strong>Phone:</strong> {ref.phone}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Box display="flex" justifyContent="flex-end" gap={2} mt={4} mb={2}>
              {buttonConfigs.map((btn) => (
                <Button
                  key={btn.label}
                  type={btn.type}
                  variant="contained"
                  onClick={btn.onClick}
                  disabled={btn.disabled}
                  sx={{
                    backgroundColor: btn.backgroundColor,
                    color: btn.color,
                    fontFamily: "Work Sans",
                    fontWeight: "500",
                    borderRadius: "20px",
                    minWidth: "120px",
                  }}
                >
                  {btn.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DocumentUpload;