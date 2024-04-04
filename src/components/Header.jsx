import React, { useState } from 'react';
import { BiNotification } from "react-icons/bi";
import Notifications from '../pages/Notifications';
import header from '../css/header.module.css';

export default function Header(props) {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className={header.navbar}>
      <div className={header.profile}>
        <BiNotification className={header.notif} onClick={togglePopup} />
        <img src={props.profilepic} alt="Profile Picture" className={header.profilePic} />
      </div>
          {showPopup && (
        <div className={header.popup}>
          <span className={header.close} onClick={togglePopup}>&times;</span>
          <Notifications />
        </div>
      )}
    </div>
  );
}
