import React, { useState, useEffect } from 'react'
import '../css/profile.css'
export default function DetailedView(props) {
    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', options);
      }  function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', options);
      }
  return (
      <div className='prof'>
      <div className="profile-display">
        <img src={`/src/assets/${props.image}`} alt="Profile Picture" className="banner-pic" />
        <h3 className='profile-name'>{props.author}</h3>
        <div className='analytics'>
            <div className='a1'>
                <p>Date</p>
                <p className='propcontent'>{formatDate(props.date)}</p>
            </div>
            <div className='a2'>
                <p>Time</p>
                <p className='propcontent'>{props.time}</p>
            </div>
            <div className='a3'>
                <p>Rewards</p>
                <p className='propcontent'>{props.rewards}</p>
            </div>
        </div>
        <p>Location</p>
        <p className='propcontent'>{props.location}</p>  
        <p className='profile-bio'>Event Details</p>
        <p className='bio'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis, ex asperiores recusandae totam quisquam voluptate!</p>
      </div>
    </div>
  )
}

DetailedView.defaultProps = {
 "id": 7, "author": "Chopper", "title": "Event 4", "date": "2024-04-04", "time": "14:00", "image": "mascot.png", "rewards": 100, "location": "location14"
}