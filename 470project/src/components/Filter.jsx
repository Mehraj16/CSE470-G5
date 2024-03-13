import React, { useState } from 'react';
import { CiFilter } from "react-icons/ci";

export default function Filter({ onOptionSelect }) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('all');

  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onOptionSelect(option); // Pass selected option back to parent component
    setPopupVisible(false); // Close the popup after selecting an option
  };

  return (
    <div>
      <div className='filter-container'>
        <p>Showing: {selectedOption}</p>
        <CiFilter className='filterIcon' onClick={togglePopup}/>
      </div>
      <div className='popup-container'>
        {popupVisible && (
          <div className='popup'>
            <div onClick={() => handleOptionClick('sortDate')}>Sort by Date (nearest to furthest)</div>
            <div onClick={() => handleOptionClick('signedUpEvents')}>Signed Up Events</div>
            <div onClick={() => handleOptionClick('eventsNotSignedUp')}>Events Not Signed Up</div>
            <div onClick={() => handleOptionClick('all')}>All</div>
          </div>
        )}
      </div>
    </div>
  );
}
