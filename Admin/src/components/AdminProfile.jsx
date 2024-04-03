import React from 'react';
import profile from '../css/profile.module.css'
export default function AdminProfile(props) {
  const { formData } = props; // Destructure formData from props

  return (
    <div className={profile.prof}>
      <div className={profile.profileDisplay}>
        <img src={`/src/assets/${formData.profileImage}`} alt="Profile Picture" className={profile.bannerPic} />
        <h3 className={profile.profileName}>{formData.firstName} {formData.lastName}</h3>
        <p>Designation</p>
        <p className={profile.profileBio}>About Me</p>
        <p className={profile.bio}>{formData.biography}</p>
      </div>
    </div>
  );
}
