import React, { useState } from 'react';
import { CiFilter } from "react-icons/ci";
import '../css/filter.css'

export default function Filter({ onOptionSelect, option }) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(option);
  
  const togglePopup = () => {
    setPopupVisible(!popupVisible);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onOptionSelect(option);
    setPopupVisible(false);
  };
  let textToShow;
  switch (selectedOption) {
    case 'sortDate':
      textToShow = 'Sorted by Date';
      break;
    case 'signedUpEvents':
      textToShow = 'Signed Up Events';
      break;
    case 'eventsNotSignedUp':
      textToShow = 'Events Not Signed Up';
      break;
    case 'all':
      textToShow = 'All';
      break;
    default:
      textToShow = 'All';
      break;
  }

  return (
    <div>
      <div className='filter-container'>
          <h3>Upcoming Events</h3>
        <div className='filter-details'>
          <CiFilter className='filterIcon' onClick={togglePopup}/>
          <p>Showing: {textToShow}</p>
        </div>
      </div>
      <div className='popup-container'>
        {popupVisible && (
          <div className='mypopup'>
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
