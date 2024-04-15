import React, { useState, useEffect } from 'react';
import { BiNotification } from "react-icons/bi";
import Notifications from '../pages/Notifications';
import header from '../css/header.module.css';
import Alert from './Alert';

export default function Header(props) {
  const jsonString = sessionStorage.getItem('profileData');
  const mydata = JSON.parse(jsonString);
  const myid = mydata.id;
  const [showPopup, setShowPopup] = useState(false);
  const [img, setImg] = useState();

  const togglePopup = () => {
    setShowPopup(!showPopup);
    localStorage.setItem('seenNotif', true);
  };

  useEffect(() => {
    fetchImageData();
  }, []);
  const fetchImageData = async () => {
    let url = `http://127.0.0.1:8000/api/images/${myid}`;
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });
          const imageBlob = await res.blob();
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setImg(imageObjectURL);
          } catch (error) {
              console.error('Error:', error);
          }  
  };
  return (
    <div className={header.navbar}>
      <div className='alert-div'>
      <Alert isVisible={props.isVisible} alertText={props.alert} alertColor={props.alertColor}/>
      </div>
      <div className={header.profile}>
        <BiNotification className={header.notif} onClick={togglePopup} />
        <img src={img} alt="Profile Picture" className={header.profilePic} />
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
