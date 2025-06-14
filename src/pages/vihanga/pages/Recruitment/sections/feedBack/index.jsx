import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import NewTopHeader from "./../../../../../../components/Navbar/newTopHeader";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import FileUpload from "../../../../components/filesUplode/draganddropFile";
import axios from "axios";
import { Toast } from "service/toast";
import { appURL } from "utilities";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const FeedBackReport = () => {
  const [candidateId, setCandidateId] = useState(null);
  const [candidateData, setCandidateData] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const feedbackId = urlParams.get("feedbackId");
  const round = urlParams.get("round");

  // Initialize with default values
  const defaultRatings = {
    competency1: 0,
    competency2: 0,
    competency3: 0,
    overall: 0,
  };

  const defaultRatings1 = {
    unsatisfactory: 1,
    belowAverage: 2,
    meetsRequirements: 3,
    exceedsRequirements: 4,
    farExceeds: 5,
  };

  const defaultComments = {
    competency1: "",
    competency2: "",
    competency3: "",
    overall: "",
  };

  const [ratings, setRatings] = useState(defaultRatings);
  const [ratings1, setRatings1] = useState(defaultRatings1);
  const [comments, setComments] = useState(defaultComments);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const id = urlParams.get("candidateId");
    const token = urlParams.get("token");

    if (id) {
      setCandidateId(id);
      console.log("Extracted candidateId:", id);
    }
    if (token) {
      console.log("Extracted token:", token);
    }
  }, []);


  const downloadFeedbackReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Interview Feedback Report", 14, 20);
    
    // Add candidate details
    doc.setFontSize(12);
    doc.text(`Candidate Name: ${candidateData?.candidateName || "N/A"}`, 14, 30);
    doc.text(`Position Applied: ${candidateData?.designation || "N/A"}`, 14, 38);
    doc.text(`Interview Date: ${new Date().toLocaleDateString()}`, 14, 46);
    doc.text(`Interviewer: ${round === "interview1" ? candidateData?.interviewer1?.name : candidateData?.interviewer2?.name || "N/A"}`, 14, 54);
    doc.text(`Interview Round: ${round === "interview1" ? "First Round" : "Second Round"}`, 14, 62);
    
    // Add ratings section
    doc.setFontSize(14);
    doc.text("Candidate Ratings", 14, 74);
    
    // Add rating scale
    doc.setFontSize(10);
    const ratingsScale = [
      ["1", "Far Below Average/Unsatisfactory"],
      ["2", "Below Average/Doesn't Meet All Requirements"],
      ["3", "Meets/Meets Requirements"],
      ["4", "Above Average/Exceeds Requirements"],
      ["5", "Exceptional/Far Exceeds Requirements"]
    ];
    
    autoTable(doc, {
      startY: 80,
      head: [["Rating", "Description"]],
      body: ratingsScale,
      theme: 'grid',
      headStyles: {
        fillColor: [131, 127, 57] // Matching your theme color
      }
    });
    
    // Add competency ratings
    doc.setFontSize(14);
    doc.text("Competency Ratings", 14, doc.lastAutoTable.finalY + 15);
    
    const competencyData = [
      ["Competency 1", ratings.competency1, comments.competency1],
      ["Competency 2", ratings.competency2, comments.competency2],
      ["Competency 3", ratings.competency3, comments.competency3],
      ["Overall", ratings.overall, comments.overall]
    ];
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Competency", "Rating (1-5)", "Comments"]],
      body: competencyData,
      theme: 'grid',
      headStyles: {
        fillColor: [131, 127, 57]
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 20 },
        2: { cellWidth: 'auto' }
      }
    });
    
    // Add overall impression
    doc.setFontSize(14);
    doc.text("Overall Impression and Recommendation", 14, doc.lastAutoTable.finalY + 15);
    doc.setFontSize(10);
    doc.text(comments.overall || "No overall comments provided", 14, doc.lastAutoTable.finalY + 20, { maxWidth: 180 });
    
    // Save the PDF
    doc.save(`Feedback_Report_${candidateData?.candidateName || "Candidate"}.pdf`);
  };


  useEffect(() => {
    const fetchCandidateById = async () => {
      try {
        const response = await axios.get(
          `${appURL}/recruitment/getCandidateById`,
          {
            params: { _id: candidateId },
          }
        );

        if (response.data.success) {
          const candidate = response.data.data[0];
          console.log("Candidate data:", candidate);
          setCandidateData(candidate);
        } else {
          throw new Error("Failed to fetch candidate data");
        }
      } catch (error) {
        console.error("Error fetching candidate:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (candidateId) {
      fetchCandidateById();
    } else {
      setIsLoading(false);
    }
  }, [candidateId]);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const idToFetch = feedbackId;
        if (!idToFetch) return;

        const response = await axios.get(
          `${appURL}/recruitment/feedback?feedbackId=${idToFetch}`
        );
        
        console.log("Feedback data response:", response);
        if (response.data.success && response.data.data) {
          const feedback = response.data.data;
          setFeedbackData(feedback);
          
          // Update state with fetched data
          setRatings({
            ...defaultRatings,
            ...feedback.ratings
          });
          
          setRatings1({
            ...defaultRatings1,
            ...feedback.ratings1
          });
          
          setComments({
            ...defaultComments,
            ...feedback.comments
          });
        }
      } catch (error) {
        console.error("Error fetching feedback:", error.message);
      }
    };

   if(feedbackId){
    fetchFeedbackData();
   }
  }, [feedbackId, candidateData?.feedbackId]);

  const handleRatingChange = (name, value) => {
    setRatings((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange1 = (name, value) => {
    setRatings1((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommentChange = (name, value) => {
    setComments((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    setFile(event);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      if (candidateId) {
        formData.append("candidateId", candidateId);
      }
      formData.append("feedbackId", feedbackId);
      formData.append("ratings", JSON.stringify(ratings));
      formData.append("ratings1", JSON.stringify(ratings1));
      formData.append("comments", JSON.stringify(comments));
      formData.append("round", round);

      if (file) {
        formData.append("file", file);
      }
      const response = await axios.post(
        `${appURL}/recruitment/feedback`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Toast({ message: "Feedback has been submitted successfully.", type: "success" });
        if (candidateId) {
          const refreshResponse = await axios.get(
            `${appURL}/recruitment/feedback?candidateId=${candidateId}`
          );
          if (refreshResponse.data.success) {
            setFeedbackData(refreshResponse.data.data);
          }
        }
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error.message);
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Box
        sx={{
          margin: "4rem",
          backgroundColor: "#fff",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <div>
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: "700",
                fontFamily: "Montserrat, sans-serif",
                color: "#0E0E0E",
              }}
              gutterBottom
            >
              <ArrowBackIosIcon
                sx={{ fontSize: 30, color: "#000000", mt: "-4px", mr: "16px" }}
              />
              Feedback Form
            </Typography>
          </div>

          <div onClick={() => downloadFeedbackReport()}>
            <IconButton
              sx={{
                width: "27px",
                height: "27px",
                color: "rgba(131, 127, 57, 1)",
              }}
            >
              <DownloadIcon />
            </IconButton>
          </div>
        </Box>

        {/* Basic Details Section */}
        <Box>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: "600",
              fontFamily: "Montserrat, sans-serif",
              mb: "10px",
              marginTop: "24px",
            }}
          >
            Basic Details
          </Typography>
          <Box
            display="flex"
            gap={36}
            sx={{ fontFamily: "Work Sans, sans-serif", marginTop: "24px" }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#707070",
                  fontFamily: "Work Sans, sans-serif",
                  fontWeight: "400",
                }}
              >
                Candidate Name
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#0E0E0E",
                  fontFamily: "Work Sans, sans-serif",
                }}
              >
                {candidateData?.candidateName || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#707070",
                  fontFamily: "Work Sans, sans-serif",
                }}
              >
                Position Applied
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#0E0E0E",
                  fontFamily: "Work Sans, sans-serif",
                }}
              >
                {candidateData?.designation || "N/A"}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={6} sx={{ marginTop: "32px" }}>
            <div>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#707070",
                  fontFamily: "Work Sans, sans-serif",
                  fontWeight: "400",
                }}
              >
                Date:
              </Typography>
              <input
                type="date"
                value={
                  candidateData?.appliedOn
                    ? new Date(candidateData.appliedOn)
                        .toISOString()
                        .split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
                style={{
                  width: "350px",
                  padding: "10px",
                  fontSize: "14px",
                  borderRadius: "5px",
                  border: "1px solid #E9EAEC",
                }}
                disabled
              />
            </div>
            <div>
              <Box sx={{ marginTop: "29px" }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#707070",
                    fontFamily: "Work Sans, sans-serif",
                  }}
                >
                  Interviewer Name
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#0E0E0E",
                    fontFamily: "Work Sans, sans-serif",
                  }}
                >
                  {round == "interview1"
                    ? candidateData?.interviewer1?.name
                    : candidateData?.interviewer2.name || "N/A"}
                </Typography>
              </Box>
            </div>
          </Box>

          {/* Interview Feedback Section */}
          <Box sx={{ marginTop: "24px" }}>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: "600",
                fontFamily: "Montserrat, sans-serif",
                mb: "10px",
                color: "#0E0E0E",
              }}
            >
              Interview Feedback
            </Typography>
            <Typography
              marginTop="24px"
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "#707070",
                fontFamily: "Work Sans, sans-serif",
              }}
            >
              Type of Evaluation
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#0E0E0E",
                fontFamily: "Work Sans, sans-serif",
                marginTop: "2px",
              }}
            >
              {round == "interview1" ? "First Round" : "Second Round"}
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#0E0E0E",
                fontFamily: "Work Sans, sans-serif",
                marginTop: "24px",
                marginBottom: "24px",
              }}
            >
              Please rate this candidate on the following attributes using a
              scale 1 to 5
            </Typography>

            {[
              {
                key: "unsatisfactory",
                label: "Far Below Average/Unsatisfactory",
              },
              {
                key: "belowAverage",
                label: "Far Below Average/Doesn't Meet All Requirements",
              },
              { key: "meetsRequirements", label: "Meets/Meets Requirements" },
              {
                key: "exceedsRequirements",
                label: "Above Average/Exceeds Requirements",
              },
              {
                key: "farExceeds",
                label: "Exceptional/Far Exceeds Requirements",
              },
            ].map(({ key, label }) => (
              <Box key={key}>
                <Box display="flex" alignItems="center">
                  <Typography
                    sx={{
                      width: "38%",
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#707070",
                      fontFamily: "Work Sans, sans-serif",
                      marginTop: "14px !important",
                    }}

                  >
                    {label}
                  </Typography>
                  <Rating
                    name={key}
                    value={ratings1[key]}
                    edi
                    // onChange={(event, newValue) =>
                    //   handleRatingChange1(key, newValue)
                    // }
                    readOnly
                    sx={{
                      "& .MuiRating-icon": {
                        fontSize: "19px",
                        width: "16px",
                        height: "16px",
                        color: "#FFD029",
                      },
                    }}
                    // disabled={!!feedbackData} // Disable when viewing existing feedback
                  />
                </Box>
              </Box>
            ))}
          </Box>

          {/* Competency Ratings and Comments */}
          <Box sx={{ marginTop: "24px" }}>
            {Object.keys(ratings)
              .slice(0, 3)
              .map((comp, index) => (
                <Box key={comp} sx={{ marginTop: "27px" }}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#0E0E0E",
                      fontFamily: "Work Sans, sans-serif",
                    }}
                  >
                    Competency {index + 1}
                  </Typography>
                  <Rating
                    name={comp}
                    value={ratings[comp]}
                    onChange={(event, newValue) =>
                      handleRatingChange(comp, newValue)
                    }
                    sx={{
                      "& .MuiRating-icon": {
                        fontSize: "29px",
                        width: "29px",
                        height: "27px",
                        marginTop: "10px",
                        color: "#FFD029",
                      },
                    }}
                    // disabled={!!feedbackData} // Disable when viewing existing feedback
                  />
                  <Box display="flex" justifyContent="start" sx={{ mt: "5px" }}>
                    <TextField
                      sx={{
                        width: "70%",
                        display: "flex",
                        marginTop: "30px",
                        border: "1px solid #E9EAEC",
                        marginTop: "0px",
                        borderRadius: "10px",
                      }}
                      multiline
                      rows={4}
                      margin="normal"
                      label="Comment"
                      value={comments[comp]}
                      onChange={(event) =>
                        handleCommentChange(comp, event.target.value)
                      }
                      // disabled={!!feedbackData} // Disable when viewing existing feedback
                    />
                  </Box>
                </Box>
              ))}
          </Box>

          {/* Overall Rating and Comments */}
          <Box sx={{ marginTop: "27px" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#0E0E0E",
                fontFamily: "Work Sans, sans-serif",
              }}
            >
              Overall Rating
            </Typography>
            <Rating
              name="overall"
              value={ratings.overall}
              onChange={(event, newValue) =>
                handleRatingChange("overall", newValue)
              }
              sx={{
                "& .MuiRating-icon": {
                  fontSize: "29px",
                  width: "29px",
                  height: "27px",
                  marginTop: "10px",
                },
              }}
              // disabled={!!feedbackData} // Disable when viewing existing feedback
            />
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#0E0E0E",
                fontFamily: "Work Sans, sans-serif",
                marginTop: "27px",
                maxWidth: "70%",
              }}
            >
              Overall Impression and Recommendation, Please provide any final
              comments and your recommendations for proceeding with the
              candidate.
            </Typography>
            <TextField
              sx={{
                width: "70%",
                marginTop: "16px",
                border: "1px solid #E9EAEC",
                borderRadius: "10px",
              }}
              multiline
              rows={4}
              margin="normal"
              label="Overall Impression and Recommendation"
              value={comments.overall}
              onChange={(event) =>
                handleCommentChange("overall", event.target.value)
              }
              // disabled={!!feedbackData} // Disable when viewing existing feedback
            />
          </Box>

          {/* File Upload */}
          <Box sx={{ marginTop: "24px" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#0E0E0E",
                fontFamily: "Work Sans, sans-serif",
              }}
            >
              Upload Document
            </Typography>
            {feedbackData?.uploadedDocument && (
              <Box sx={{ marginTop: "10px" }}>
                <a
                  href={feedbackData.uploadedDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Uploaded Document
                </a>
              </Box>
            )}
            {
              <FileUpload
                onFileUpload={handleFileChange}
                sx={{ width: "70%", marginLeft: "4px", marginTop: "-20px" }}
              />
            }
          </Box>

          {/* Action Buttons */}
          {
            <Box
              display="flex"
              gap="12px"
              sx={{
                marginTop: "60px",
                maxWidth: "70%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <Button
                sx={{
                  borderRadius: "136px",
                  border: "1.37px solid rgba(131, 127, 57, 1)",
                  width: "107px",
                  color: "#837F39",
                  fontFamily: "Work Sans, sans-serif",
                  fontWeight: "500",
                  textTransform: "capitalize",
                }}
              >
                Cancel
              </Button>
              <Button
                sx={{
                  borderRadius: "136px",
                  background: "#837F39",
                  color: "white",
                  width: "161px",
                  textTransform: "capitalize",

                  color: "#FFFFFF",
                  fontFamily: "Work Sans, sans-serif",
                  fontWeight: "500",
                  "&:hover": {
                    background: "#99965E",
                    color: "#FFFFFF",
                    border: "1px solid #837F39",
                  },
                }}
                onClick={handleSubmit}
              >
                Save Details
              </Button>
            </Box>
          }
        </Box>
      </Box>
    </>
  );
};

export default FeedBackReport;