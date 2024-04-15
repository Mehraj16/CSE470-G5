import React, { useState, useEffect } from 'react'
import header from '../css/header.module.css';
import Alert from './Alert';

export default function AdminHeader(props) {
  const jsonString = sessionStorage.getItem('profileData');
  const mydata = JSON.parse(jsonString);
  const myid = mydata.id;
  const [img, setImg] = useState();

  useEffect(() => {
    fetchImageData();
  }, []);
  const fetchImageData = async () => {
    let url = `http://127.0.0.1:8000/api/admin-images/${myid}`;
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
      <div className={header.alertdiv}>
      <Alert isVisible={props.isVisible} alertText={props.alert} alertColor={props.alertColor}/>
      </div>
        <div className={header.profile}>
            <img src={img} alt="Profile Picture" className={header.profilePic} />
        </div>
      </div>
  )
}
