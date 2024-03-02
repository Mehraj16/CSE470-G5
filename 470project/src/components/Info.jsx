import React, { useState } from 'react';
import BarChart from './BarChart';

export default function Info(props) {
    const [selectedOption, setSelectedOption] = useState('lastYear');

    const handleSelectChange = async (event) => {
      const selectedValue = event.target.value;
      setSelectedOption(selectedValue);
    };

  return (
    <div className="dashboard">
      <div className="welcomeText">
        <p>Welcome, {props.name}</p>
      </div>
      <div className="dashEvent">
        <div className="totalEvents">
          <p>Upcoming Events</p>
          <p>{props.totalEvents}</p>
        </div>
        <div className="eventDetail">
          <div className="eventRoster">
            <p>Event Roster</p>
            <button className='detailbtn'>Details</button>
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
