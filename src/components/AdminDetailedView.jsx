import React, { useState, useEffect } from 'react'
import profile from '../css/profile.module.css'

export default function AdminDetailedView(props) {
  return (
      <div className={profile.prof}>
      <div className={profile.profileDisplay}>
        <img src={`/src/assets/${props.image}`} alt="Profile Picture" className={profile.bannerPic} />
        <h3 className={profile.profileName}>{props.firstName + ' ' + props.lastName}</h3>
        <div className={profile.analytics}>
            <div className={profile.a1}>
                <p>Total Events</p>
                <p className={profile.propcontent}>{props.total}</p>
            </div>
            <div className={profile.a2}>
                <p>Score</p>
                <p className={profile.propcontent}>{props.score}</p>
            </div>
            <div className={profile.a3}>
                <p>Medals</p>
                <p className={profile.propcontent}>{props.medals}</p>
            </div>
        </div>
        <p>Skills</p>
        <p className={profile.propcontent}>{props.skills}</p> 
        <p>Interests</p>
        <p className={profile.propcontent}>{props.interests}</p>  
      </div>
    </div>
  )
}

AdminDetailedView.defaultProps = {
 "firstName": "Volunteer", "lastName": "Name", "image": "mascot.png", "total": 10, "score": 430, "medals": 1,
 "skills":"Things I am good at...", "interests":"Things I like doing..."
}