import React, { useState, useEffect } from 'react';
import profile from '../css/profile.module.css'
export default function AdminProfile(props) {
  const { formData } = props;
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
    <div className={profile.prof}>
      <div className={profile.profileDisplay}>
        <img src={img} alt="Profile Picture" className={profile.bannerPic} />
        <h3 className={profile.profileName}>{formData.firstName} {formData.lastName}</h3>
        <p>{formData.Designation}</p>
        <p className={profile.profileBio}>About Me</p>
        <p className={profile.bio}>{formData.biography}</p>
      </div>
    </div>
  );
}
