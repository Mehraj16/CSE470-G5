import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowForwardCircle } from "react-icons/io5";
import '../css/info.css';

export default function AdminInfo(props) {
    const navigation = useNavigate();
    const showInvites = () => {
      navigation('../admininvites' ,{state: props});
    };
    const showMyEvents = () => {
      navigation('../adminevents',{state: props});
    };

  return (
    <div className="dashboard">
      <div className="welcomeText">
        <p>Welcome, {props.firstName}</p>
      </div>
      <div className="dashEvent">
        <div className="totalEvents">
          <p className='upcoming'>Upcoming Events</p>
          <p className='total'>{props.totalEvents}</p>
        </div>
        <div className='invitation' style={{paddingRight: '20px'}}>
          <div>
            <p className='upcoming'>Approval Pending</p><IoArrowForwardCircle className='showInvite' onClick={showInvites}/>
          </div>
          <p className='total'>{props.totalEvents}</p>
        </div>
        <div className="eventDetail">
          <div className="eventRoster">
            <p>Event Roster</p>
            <button className='detailbtn' onClick={showMyEvents}>Details</button>
          </div>
          <p>{props.nearestEvent.date} {props.nearestEvent.time}</p>
          <p>{props.nearestEvent.location}</p>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}
