import React, { useState } from "react";
import InfoCardHeader from "../components/header";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const Card5 = ({ onSelect }) => {
  const [selected, setSelected] = useState(false);

  const handleToggle = () => {
    setSelected((prev) => !prev);
    const cardData = {
      id: "finance_director", // Unique ID for this card
      title: "Finance Director",
      subtitle: "Manager Overseeing Specific Project",
    };
    onSelect(cardData, !selected);
    console.log(!selected ? "Selected" : "Removed", cardData);
  };

  return (
    <InfoCardHeader
      title="Finance Director"
      subtitle="Manager Overseeing Specific Project"
      buttonText={selected ? "Remove" : "Select"}
      buttonIcon={selected ? <CloseIcon /> : <CheckIcon />}
      buttonColor={selected ? "#FFFFFF" : "#827b37"}
      buttonTextColor={selected ? "#827b37" : "#FFFFFF"}
      buttonBorder={selected ? "1px solid #827b37" : "none"}
      onButtonClick={handleToggle}
    />
  );
};

export default Card5;
