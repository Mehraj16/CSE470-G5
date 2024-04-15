import React from 'react'

export default function Details({ isClicked, handleClick, status, isDisabled, ...props }) {
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
        <p>{props.location}</p>
        <p>Event Details</p>
        <p>{props.description}</p>
        <button
          className={`interestBtn ${isClicked ? 'active' : ''}`}
          onClick={(e) => handleClick(props)}
          disabled={isDisabled || status}>
          {status ? 'Interest Sent' : (isClicked ? 'Interest Sent' : 'Interested')}
        </button>
      </div>

    </div>
  )
}
