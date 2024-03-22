import React from 'react';

export default function AdminProfile(props) {
  const { formData } = props; // Destructure formData from props

  return (
    <div className='prof'>
      <div className="profile-display">
        <img src={`/src/assets/${formData.profileImage}`} alt="Profile Picture" className="profile-pic" />
        <h3 className='profile-name'>{formData.firstName} {formData.lastName}</h3>
        <p>Designation</p>
        <p className='profile-bio'>About Me</p>
        <p className='bio'>{formData.biography}</p>
      </div>
    </div>
  );
}
