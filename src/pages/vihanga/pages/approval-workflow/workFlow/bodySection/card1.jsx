import React, { useState } from 'react';
import InfoCardHeader from '../components/header';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const Card1 = ({ onSelect }) => {
  const [selected, setSelected] = useState(false);

  const handleToggle = () => {
    setSelected((prev) => !prev);
    const cardData = {
      id: 'line_manager', // Unique ID for the card
      title: 'Line Manager',
      subtitle: 'Direct Supervisor of the Employee',
    };
    onSelect(cardData, !selected); // Pass card data and selection state
    console.log(selected ? 'Removed' : 'Selected', cardData);
  };

  return (
    <InfoCardHeader
      title="Line Manager"
      subtitle="Direct Supervisor of the Employee"
      buttonText={selected ? 'Remove' : 'Select'}
      buttonIcon={selected ? <CloseIcon /> : <CheckIcon />}
      buttonColor={selected ? '#FFFFFF' : '#827b37'}
      buttonTextColor={selected ? '#827b37' : '#FFFFFF'}
      buttonBorder={selected ? '1px solid #827b37' : 'none'}
      onButtonClick={handleToggle}
    />
  );
};

export default Card1;