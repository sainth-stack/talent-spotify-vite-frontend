import React, { useState } from "react";
import InfoCardHeader from "../components/header";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const Card4 = ({ onSelect }) => {
  const [selected, setSelected] = useState(false);

  const handleToggle = () => {
    setSelected((prev) => !prev);
    const cardData = {
      id: "ceo", // Unique ID for this card
      title: "CEO",
      subtitle: "Chief Exeuctive Officer",
    };
    onSelect(cardData, !selected);
    console.log(!selected ? "Selected" : "Removed", cardData);
  };

  return (
    <InfoCardHeader
      title="CEO"
      subtitle="Chief Exeuctive Officer"
      buttonText={selected ? "Remove" : "Select"}
      buttonIcon={selected ? <CloseIcon /> : <CheckIcon />}
      buttonColor={selected ? "#FFFFFF" : "#827b37"}
      buttonTextColor={selected ? "#827b37" : "#FFFFFF"}
      buttonBorder={selected ? "1px solid #827b37" : "none"}
      onButtonClick={handleToggle}
    />
  );
};

export default Card4;
