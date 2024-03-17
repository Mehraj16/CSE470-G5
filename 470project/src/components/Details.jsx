import React from 'react'

export default function Details({ isClicked, handleClick, status, ...props }) {
  function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', options);
  }
  
  
  return (
    <div>
      <div className='banner'>
        <img src={props.image} alt="eventBanner" />
        <p>Event Title</p>
        <p>{props.title}</p>
        <p>Event Time</p>
        <p>{formatDate(props.date)} {props.time}</p>
        <p>Event Location</p>
        <p></p>
        <p>Event Details</p>
        <p></p>
        <button className={`interestBtn ${isClicked ? 'active' : ''}`} 
            onClick={handleClick} disabled={status}>
            {status ? 'Interest Sent' : (isClicked ? 'Interest Sent' : 'Interested')}
          </button>
      </div>

    </div>
  )
}