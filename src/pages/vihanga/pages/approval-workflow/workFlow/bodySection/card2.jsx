import React, { useState } from "react";
import InfoCardHeader from "../components/header";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const Card2 = ({ onSelect }) => {
  const [selected, setSelected] = useState(false);

  const handleToggle = () => {
    setSelected((prev) => !prev);
    const cardData = {
      id: "hr_manager", // Replace with unique ID for this card
      title: "HR Manager",
      subtitle: "Human Resources Department Head",
    };
    onSelect(cardData, !selected);
    console.log(!selected ? "Selected" : "Removed", cardData);
  };

  return (
    <InfoCardHeader
      title="HR Manager"
      subtitle="Human Resources Department Head"
      buttonText={selected ? "Remove" : "Select"}
      buttonIcon={selected ? <CloseIcon /> : <CheckIcon />}
      buttonColor={selected ? "#FFFFFF" : "#827b37"}
      buttonTextColor={selected ? "#827b37" : "#FFFFFF"}
      buttonBorder={selected ? "1px solid #827b37" : "none"}
      onButtonClick={handleToggle}
    />
  );
};

export default Card2;
