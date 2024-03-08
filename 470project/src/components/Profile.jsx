import React from 'react'

export default function Profile(props) {
  return (
    <div className='prof'>
      <div className="profile-display">
        <img src={props.profilepic} alt="Profile Picture" className="profile-pic" />
        <h3 className='profile-name'>{props.name}</h3>
        <div className='analytics'>
            <div className='a1'>
                <p>Events</p>
                <p className='propcontent'>{props.eventCount}</p>
            </div>
            <div className='a2'>
                <p>Score</p>
                <p className='propcontent'>{props.score}</p>
            </div>
            <div className='a3'>
                <p>Medals</p>
                <p className='propcontent'>{props.totalMedals}</p>
            </div>
        </div>
        <p className='profile-bio'>About Me</p>
        <p className='bio'>{props.bio}</p>
      </div>
    </div>
  )
}
Profile.defaultProps = {
    name: 'John Smith',
    eventCount: 20,
    score: 1020,
    totalMedals: 2,
    bio: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam facilis laboriosam praesentium fugiat placeat maxime natus, ipsum totam ea porro.'
}