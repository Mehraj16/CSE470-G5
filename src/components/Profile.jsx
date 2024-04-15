import React, { useState, useEffect } from 'react';
import profile from '../css/profile.module.css'
export default function Profile(props) {
  const { formData } = props; // Destructure formData from props
  const jsonString = sessionStorage.getItem('profileData');
  const mydata = JSON.parse(jsonString);
  const myid = mydata.id;
  const [img, setImg] = useState();

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
    <div className='prof'>
      <div className="profile-display">
        <img src={img} alt="Profile Picture" className={profile.bannerPic} />
        <h3 className='profile-name'>{formData.firstName} {formData.lastName}</h3>
        <div className='analytics'>
            <div className='a1'>
                <p>Events</p>
                <p className='propcontent'>{formData.eventCount}</p>
            </div>
            <div className='a2'>
                <p>Score</p>
                <p className='propcontent'>{formData.lifetimeScore}</p>
            </div>
            <div className='a3'>
                <p>Medals</p>
                <p className='propcontent'>{formData.totalMedals}</p>
            </div>
        </div>
        <p className='profile-bio'>About Me</p>
        <p className='bio'>{formData.biography}</p>
      </div>
    </div>
  );
}
