import React from 'react';

export default function Profile(props) {
  const { formData } = props; // Destructure formData from props

  return (
    <div className='prof'>
      <div className="profile-display">
        <img src={`/src/assets/${formData.profileImage}`} alt="Profile Picture" className="profile-pic" />
        <h3 className='profile-name'>{formData.firstName} {formData.lastName}</h3>
        <div className='analytics'>
            <div className='a1'>
                <p>Events</p>
                <p className='propcontent'>{formData.eventCount}</p>
            </div>
            <div className='a2'>
                <p>Score</p>
                <p className='propcontent'>{formData.score}</p>
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
