import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarChart from './BarChart';
import { IoArrowForwardCircle } from "react-icons/io5";

export default function Info(props) {
    const [selectedOption, setSelectedOption] = useState('lastYear');

    const handleSelectChange = async (event) => {
      const selectedValue = event.target.value;
      setSelectedOption(selectedValue);
    };
    const navigation = useNavigate();
    const showInvites = () => {
      navigation('../invites');
    };
    const showMyEvents = () => {
      navigation('../myevents');
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
            <p className='upcoming'>Invitation Pending</p><IoArrowForwardCircle className='showInvite' onClick={showInvites}/>
          </div>
          <p className='total'>{props.totalEvents}</p>
        </div>
        <div className="eventDetail">
          <div className="eventRoster">
            <p>Event Roster</p>
            <button className='detailbtn' onClick={showMyEvents}>Details</button>
          </div>
          <p>{props.nearestEvent.date} {props.nearestEvent.time}</p>{/* accesses the date, location and time regarding the earliest upcoming event*/}
          <p>{props.nearestEvent.location}</p>
        </div>
      </div>
      <div className='analytic'>
        <div className='history'>
          <p style={{ margin: 0 }}>History</p>
          <select value={selectedOption} onChange={handleSelectChange}>
            <option value="lastYear">Last Year</option>
            <option value="lastMonth">Last Month</option>
            <option value="allTime">All Time</option>
          </select>
        </div>
        <BarChart selectedMode={selectedOption} />
      </div>
    </div>
  );
}
